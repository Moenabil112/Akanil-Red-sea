import { beforeAll, beforeEach, describe, expect, it } from "vitest";

// Pilot mode active for the operational-gate checks (read live by env helpers).
process.env.P4_INTERNAL_ENABLED = "true";
process.env.P4_OPERATION_MODE = "pilot";
delete process.env.P4_PILOT_SUSPENDED;

import { prisma } from "@/lib/internal/db";
import type { CurrentEmployee } from "@/lib/internal/authz";
import type { EmployeeRole } from "@/lib/internal/roles";
import { audit } from "@/lib/internal/audit";
import { verifyChain, type ChainRow, computeEventHash } from "@/lib/internal/audit-chain";
import { assertPilotOperational, PilotAccessError } from "@/lib/internal/pilot";
import {
  requestPilotAccess,
  approvePilotAccess,
  suspendPilotAccess,
  revokePilotAccess,
  createAccessChangeRequest,
  approveAccessChangeRequest,
  applyAccessChangeRequest,
  createAccessReview,
  conductAccessReview,
  AccessGovernanceError,
} from "@/lib/internal/services/access-governance";
import { beginOffboarding, completeOffboarding, LifecycleError } from "@/lib/internal/services/lifecycle";
import { recordSecurityEvent } from "@/lib/internal/security-events";
import { createIncident, closeIncident, SecurityServiceError } from "@/lib/internal/services/security";
import {
  createExercise,
  startExercise,
  recordExerciseResult,
  approveExercise,
  verifyCorrectiveAction,
  ExerciseError,
} from "@/lib/internal/services/exercises";
import { setReadinessGate, ReadinessError } from "@/lib/internal/services/readiness";
import { createCase } from "@/lib/internal/services/cases";

/**
 * P4-B governance integration tests (§30) against PostgreSQL. Verify the
 * security-critical separation-of-duties, pilot-cohort enforcement, employee
 * offboarding, audit hash-chain integrity and tamper detection, security-event
 * minimization, incident closure controls, exercise/corrective controls and
 * the readiness-gate guard.
 */

const P4B_TABLES = [
  "ReadinessGate", "ReadinessSignal", "CorrectiveAction", "PilotExercise",
  "SecurityIncident", "SecurityEvent", "AccessReview", "AccessChangeRequest", "PilotAccess",
  "AuditEvent", "Commitment", "Decision", "MeetingRecord", "MeetingPreparation",
  "EvidenceReference", "InformationGap", "QualificationReview", "InternalNote",
  "CaseAssignment", "Case", "Contact", "Organization", "Session", "Employee", "Counter",
];

async function truncateAll() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${P4B_TABLES.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE;`,
  );
}

let counter = 0;
async function makeEmployee(role: EmployeeRole): Promise<CurrentEmployee> {
  counter += 1;
  const e = await prisma.employee.create({
    data: {
      email: `${role.toLowerCase()}-${counter}-${Math.random().toString(36).slice(2, 7)}@akanil.example`,
      displayName: `${role} ${counter}`,
      passwordHash: "$argon2id$placeholder",
      role: role as never,
      mustChangePassword: false,
      status: "ACTIVE",
      lifecycleStage: "ACTIVE",
    },
  });
  return { id: e.id, email: e.email, displayName: e.displayName, role, mustChangePassword: false };
}

beforeAll(async () => {
  await prisma.$queryRawUnsafe("SELECT 1");
});
beforeEach(async () => {
  await truncateAll();
});

describe("pilot-cohort control (§6)", () => {
  it("requires independent approval and blocks self/requester approval", async () => {
    const admin = await makeEmployee("SYSTEM_ADMIN");
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const cm = await makeEmployee("CASE_MANAGER");
    const id = await requestPilotAccess(admin, { employeeId: cm.id, approvedRole: "CASE_MANAGER", justification: "pilot" });
    // Requester cannot approve.
    await expect(approvePilotAccess(admin, id)).rejects.toBeInstanceOf(AccessGovernanceError);
    // Target cannot approve (cm lacks pilot.approve anyway, but assert separation via ops path).
    const id2 = await requestPilotAccess(admin, { employeeId: ops.id, approvedRole: "OPERATIONS_MANAGER", justification: "pilot" });
    await expect(approvePilotAccess(ops, id2)).rejects.toBeInstanceOf(AccessGovernanceError);
    // A different approver succeeds.
    await approvePilotAccess(ops, id);
    const row = await prisma.pilotAccess.findUnique({ where: { id } });
    expect(row?.status).toBe("ACTIVE");
    expect(row?.expiresAt).not.toBeNull();
  });

  it("gate: an active account without pilot access cannot operate; suspension/expiry deny", async () => {
    const admin = await makeEmployee("SYSTEM_ADMIN");
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const cm = await makeEmployee("CASE_MANAGER");
    // No pilot access yet → denied.
    await expect(assertPilotOperational(cm.id)).rejects.toBeInstanceOf(PilotAccessError);
    const id = await requestPilotAccess(admin, { employeeId: cm.id, approvedRole: "CASE_MANAGER", justification: "pilot" });
    await approvePilotAccess(ops, id);
    // Now active → allowed.
    await expect(assertPilotOperational(cm.id)).resolves.toBeUndefined();
    // Suspend → denied + sessions revoked.
    await prisma.session.create({ data: { tokenHash: `t-${cm.id}`, employeeId: cm.id, absoluteExpiry: new Date(Date.now() + 3.6e6), idleExpiry: new Date(Date.now() + 3.6e6) } });
    await suspendPilotAccess(ops, id, "test");
    await expect(assertPilotOperational(cm.id)).rejects.toBeInstanceOf(PilotAccessError);
    const revokedCount = await prisma.session.count({ where: { employeeId: cm.id, revokedAt: { not: null } } });
    expect(revokedCount).toBe(1);
  });

  it("revocation invalidates active sessions", async () => {
    const admin = await makeEmployee("SYSTEM_ADMIN");
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const cm = await makeEmployee("CASE_MANAGER");
    const id = await requestPilotAccess(admin, { employeeId: cm.id, approvedRole: "CASE_MANAGER", justification: "pilot" });
    await approvePilotAccess(ops, id);
    await prisma.session.create({ data: { tokenHash: `r-${cm.id}`, employeeId: cm.id, absoluteExpiry: new Date(Date.now() + 3.6e6), idleExpiry: new Date(Date.now() + 3.6e6) } });
    await revokePilotAccess(ops, id, "test");
    const active = await prisma.session.count({ where: { employeeId: cm.id, revokedAt: null } });
    expect(active).toBe(0);
  });
});

describe("two-person access change (§7)", () => {
  it("role change is not applied until approved; requester/target cannot approve or apply", async () => {
    const admin = await makeEmployee("SYSTEM_ADMIN");
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const cm = await makeEmployee("CASE_MANAGER");
    const reqId = await createAccessChangeRequest(admin, { targetEmployeeId: cm.id, changeType: "CHANGE_ROLE", proposedRole: "FORUM_COORDINATOR", justification: "role change" });
    // Cannot apply before approval.
    await expect(applyAccessChangeRequest(ops, reqId)).rejects.toBeInstanceOf(AccessGovernanceError);
    // Requester cannot approve.
    await expect(approveAccessChangeRequest(admin, reqId)).rejects.toBeInstanceOf(AccessGovernanceError);
    // A different approver approves; role not yet changed.
    await approveAccessChangeRequest(ops, reqId);
    let target = await prisma.employee.findUnique({ where: { id: cm.id } });
    expect(target?.role).toBe("CASE_MANAGER");
    // Apply changes the role.
    await applyAccessChangeRequest(ops, reqId);
    target = await prisma.employee.findUnique({ where: { id: cm.id } });
    expect(target?.role).toBe("FORUM_COORDINATOR");
  });
});

describe("access review (§10)", () => {
  it("cannot self-review; MODIFY creates a change request", async () => {
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const cm = await makeEmployee("CASE_MANAGER");
    const selfReview = await createAccessReview(ops, { employeeId: ops.id, reviewPeriodStart: new Date(), reviewPeriodEnd: new Date() });
    await expect(conductAccessReview(ops, selfReview, { outcome: "RETAIN", rationale: "x" })).rejects.toBeInstanceOf(AccessGovernanceError);
    const review = await createAccessReview(ops, { employeeId: cm.id, reviewPeriodStart: new Date(), reviewPeriodEnd: new Date() });
    await conductAccessReview(ops, review, { outcome: "MODIFY", rationale: "adjust role" });
    const changes = await prisma.accessChangeRequest.count({ where: { targetEmployeeId: cm.id } });
    expect(changes).toBe(1);
  });
});

describe("employee offboarding (§9)", () => {
  it("revokes sessions, blocks completion until reassignment, preserves authorship", async () => {
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const cm = await makeEmployee("CASE_MANAGER");
    const c = await createCase(cm, { title: "t", summary: "s", source: "DIRECT_EMAIL" });
    await prisma.session.create({ data: { tokenHash: `o-${cm.id}`, employeeId: cm.id, absoluteExpiry: new Date(Date.now() + 3.6e6), idleExpiry: new Date(Date.now() + 3.6e6) } });
    await beginOffboarding(ops, cm.id, "leaving");
    expect(await prisma.session.count({ where: { employeeId: cm.id, revokedAt: null } })).toBe(0);
    // Cannot complete with an open owned case.
    await expect(completeOffboarding(ops, cm.id)).rejects.toBeInstanceOf(LifecycleError);
    // Reassign the case, then complete.
    await prisma.case.update({ where: { id: c.id }, data: { currentOwnerId: ops.id } });
    await completeOffboarding(ops, cm.id);
    const after = await prisma.employee.findUnique({ where: { id: cm.id } });
    expect(after?.status).toBe("DISABLED");
    // Authorship preserved: the case's createdById still points at the offboarded employee.
    const stillAuthored = await prisma.case.findUnique({ where: { id: c.id } });
    expect(stillAuthored?.createdById).toBe(cm.id);
  });
});

describe("audit hash chain (§12)", () => {
  it("assigns sequential numbers and a verifiable chain, and detects tampering", async () => {
    const actor = await makeEmployee("OPERATIONS_MANAGER");
    for (let i = 0; i < 5; i++) {
      await audit({ actorEmployeeId: actor.id, action: "TEST", entityType: "Case", entityId: `c${i}`, summary: `event ${i}` });
    }
    const rows = await prisma.auditEvent.findMany({ orderBy: { sequenceNumber: "asc" } });
    expect(rows.map((r) => r.sequenceNumber)).toEqual([1, 2, 3, 4, 5]);
    const verdict = verifyChain(rows as unknown as ChainRow[]);
    expect(verdict.ok).toBe(true);

    // Simulate tampering on a detached copy and confirm detection (never mutate the real DB chain destructively in a way that hides it).
    const copy = rows.map((r) => ({ ...r })) as unknown as ChainRow[];
    copy[2]!.summary = "tampered";
    const broken = verifyChain(copy);
    expect(broken.ok).toBe(false);
    if (!broken.ok) expect(broken.brokenSequence).toBe(3);
  });

  it("recomputes each stored hash exactly (no secret material in payload)", async () => {
    const actor = await makeEmployee("OPERATIONS_MANAGER");
    await audit({
      actorEmployeeId: actor.id,
      action: "PWD",
      entityType: "Employee",
      entityId: actor.id,
      summary: "changed password",
      changedFields: { password: "should-not-appear", role: "CASE_MANAGER" },
    });
    const row = await prisma.auditEvent.findFirst({ where: { action: "PWD" } });
    expect(row).not.toBeNull();
    // The stored diff is redacted.
    expect(JSON.stringify(row!.changedFields)).not.toContain("should-not-appear");
    // The stored hash matches a recomputation over the stored (redacted) fields.
    const recomputed = computeEventHash({
      sequenceNumber: row!.sequenceNumber!,
      actorEmployeeId: row!.actorEmployeeId,
      action: row!.action,
      entityType: row!.entityType,
      entityId: row!.entityId,
      caseId: row!.caseId,
      summary: row!.summary,
      changedFields: row!.changedFields as Record<string, unknown> | null,
      createdAt: row!.createdAt.toISOString(),
      previousEventHash: row!.previousEventHash,
      hashVersion: row!.hashVersion,
    });
    expect(recomputed).toBe(row!.eventHash);
  });
});

describe("security events and incidents (§13/§14)", () => {
  it("minimizes event detail (no secrets)", async () => {
    const id = await recordSecurityEvent({
      category: "REAUTHENTICATION_FAILURE",
      severity: "MEDIUM",
      summary: "failed",
      detail: { password: "hunter2", note: { body: "confidential" }, ok: "keep" },
    });
    const row = await prisma.securityEvent.findUnique({ where: { id } });
    const detail = JSON.stringify(row!.detail);
    expect(detail).not.toContain("hunter2");
    expect(detail).not.toContain("confidential");
    expect(detail).toContain("keep");
  });

  it("requires lessons learned to close an incident", async () => {
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const { id, reference } = await createIncident(ops, { title: "t", category: "OPERATIONAL_ERROR", severity: "LOW", summary: "s" });
    expect(reference).toMatch(/^SEC-\d{4}-\d{6}$/);
    await expect(closeIncident(ops, id, { lessonsLearned: "" })).rejects.toBeInstanceOf(SecurityServiceError);
    await closeIncident(ops, id, { lessonsLearned: "root cause and fix" });
    const row = await prisma.securityIncident.findUnique({ where: { id } });
    expect(row?.status).toBe("CLOSED");
    expect(row?.approvedClosureById).toBe(ops.id);
  });
});

describe("exercises and corrective actions (§16/§17)", () => {
  it("failed exercise requires deviation and creates a corrective action; approver independence enforced", async () => {
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const ops2 = await makeEmployee("OPERATIONS_MANAGER");
    const id = await createExercise(ops, { type: "BACKUP_AND_RESTORE", title: "restore", expectedResult: "restores" });
    await startExercise(ops, id);
    await expect(recordExerciseResult(ops, id, { status: "FAILED", actualResult: "did not restore" })).rejects.toBeInstanceOf(ExerciseError);
    await recordExerciseResult(ops, id, { status: "FAILED", actualResult: "did not restore", deviation: "restore failed" });
    expect(await prisma.correctiveAction.count()).toBe(1);
    // The executor cannot approve their own exercise.
    await expect(approveExercise(ops, id)).rejects.toBeInstanceOf(ExerciseError);
    await approveExercise(ops2, id);
    const ex = await prisma.pilotExercise.findUnique({ where: { id } });
    expect(ex?.approvedById).toBe(ops2.id);
  });

  it("corrective verification must be independent of the owner", async () => {
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    const ca = await prisma.correctiveAction.create({
      data: { sourceType: "SECURITY_REVIEW", title: "t", description: "d", ownerId: ops.id, status: "READY_FOR_VERIFICATION" },
    });
    await expect(verifyCorrectiveAction(ops, ca.id)).rejects.toBeInstanceOf(ExerciseError);
  });
});

describe("readiness gate (§18)", () => {
  it("cannot advance to a pilot-ready state while a critical area FAILs", async () => {
    const ops = await makeEmployee("OPERATIONS_MANAGER");
    // Create an OPEN high-severity security event → unresolved-security-events FAIL.
    await recordSecurityEvent({ category: "OTHER_SECURITY_EVENT", severity: "HIGH", summary: "open high" });
    await expect(
      setReadinessGate(ops, { state: "READY_FOR_LIMITED_INTERNAL_PILOT", rationale: "go" }),
    ).rejects.toBeInstanceOf(ReadinessError);
    // NOT_READY is always allowed.
    await setReadinessGate(ops, { state: "NOT_READY", rationale: "hold" });
    const latest = await prisma.readinessGate.findFirst({ orderBy: { createdAt: "desc" } });
    expect(latest?.state).toBe("NOT_READY");
  });
});
