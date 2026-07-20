import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/internal/db";
import { CASE_COUNTER_ID } from "@/lib/internal/reference";
import {
  createCase,
  transitionCase,
  assignOwner,
  ConcurrencyError,
} from "@/lib/internal/services/cases";
import { proposeDecision, resolveDecision } from "@/lib/internal/services/records";
import { createOrganization, archiveOrganization } from "@/lib/internal/services/organizations";
import type { CurrentEmployee } from "@/lib/internal/authz";
import type { EmployeeRole } from "@/lib/internal/roles";

/**
 * PostgreSQL integration tests (P4-A §27.8). Run against a dedicated test
 * database with `npm run test:integration`. Verify transactional case
 * creation, unique references, the lifecycle state machine, optimistic
 * concurrency, append-only decision history, single-owner assignment,
 * audit creation and archive-preserves-cases behaviour.
 */

async function truncateAll() {
  const tables = [
    "AuditEvent",
    "Commitment",
    "Decision",
    "MeetingRecord",
    "MeetingPreparation",
    "EvidenceReference",
    "InformationGap",
    "QualificationReview",
    "InternalNote",
    "CaseAssignment",
    "Case",
    "Contact",
    "Organization",
    "Session",
    "Employee",
    "Counter",
  ];
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tables.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE;`,
  );
}

async function makeEmployee(role: EmployeeRole): Promise<CurrentEmployee> {
  const e = await prisma.employee.create({
    data: {
      email: `${role.toLowerCase()}-${Math.random().toString(36).slice(2, 8)}@akanil.example`,
      displayName: `${role} synthetic`,
      passwordHash: "$argon2id$placeholder",
      role: role as never,
      mustChangePassword: false,
    },
  });
  return { id: e.id, email: e.email, displayName: e.displayName, role, mustChangePassword: false };
}

let manager: CurrentEmployee;
let caseManager: CurrentEmployee;

beforeAll(async () => {
  // Confirm the schema exists (migration from an empty database applied).
  await prisma.$queryRawUnsafe("SELECT 1");
});

beforeEach(async () => {
  await truncateAll();
  await prisma.counter.create({ data: { id: CASE_COUNTER_ID, value: 0 } });
  manager = await makeEmployee("OPERATIONS_MANAGER");
  caseManager = await makeEmployee("CASE_MANAGER");
});

const baseInput = {
  title: "Synthetic case",
  summary: "Synthetic internal summary for testing.",
  source: "DIRECT_EMAIL" as const,
};

describe("case creation", () => {
  it("creates a case transactionally with an owner assignment and audit event", async () => {
    const created = await createCase(caseManager, baseInput);
    expect(created.internalReference).toBe("AKN-" + new Date().getFullYear() + "-000001");
    expect(created.status).toBe("NEW");

    const owner = await prisma.caseAssignment.findFirst({
      where: { caseId: created.id, assignmentType: "OWNER", endedAt: null },
    });
    expect(owner?.employeeId).toBe(caseManager.id);

    const audit = await prisma.auditEvent.findFirst({
      where: { caseId: created.id, action: "CASE_CREATED" },
    });
    expect(audit).not.toBeNull();
  });

  it("generates unique sequential references", async () => {
    const a = await createCase(caseManager, baseInput);
    const b = await createCase(caseManager, baseInput);
    expect(a.internalReference).not.toBe(b.internalReference);
    expect(b.internalReference.endsWith("000002")).toBe(true);
  });

  it("rejects case creation for a role without the permission", async () => {
    const reviewer = await makeEmployee("SPECIALIST_REVIEWER");
    await expect(createCase(reviewer, baseInput)).rejects.toThrow("FORBIDDEN");
  });
});

describe("lifecycle transitions", () => {
  it("applies a valid transition and rejects an invalid one", async () => {
    const c = await createCase(caseManager, baseInput);
    const t = await transitionCase(caseManager, c.id, "TRIAGE", c.recordVersion);
    expect(t.status).toBe("TRIAGE");
    expect(t.recordVersion).toBe(c.recordVersion + 1);

    await expect(
      transitionCase(caseManager, c.id, "CLOSED", t.recordVersion),
    ).rejects.toThrow(/INVALID_TRANSITION|FORBIDDEN/);
  });

  it("requires a closure reason to close and restricts reopening", async () => {
    const c = await createCase(caseManager, baseInput);
    const t1 = await transitionCase(caseManager, c.id, "TRIAGE", c.recordVersion);
    // Manager may close with a reason.
    await expect(
      transitionCase(manager, c.id, "CLOSED", t1.recordVersion),
    ).rejects.toThrow("CLOSURE_REASON_REQUIRED");
    const closed = await transitionCase(manager, c.id, "CLOSED", t1.recordVersion, "DUPLICATE");
    expect(closed.status).toBe("CLOSED");
    expect(closed.closureReason).toBe("DUPLICATE");

    // A case manager cannot reopen; a manager can.
    await expect(
      transitionCase(caseManager, c.id, "TRIAGE", closed.recordVersion),
    ).rejects.toThrow("FORBIDDEN");
    const reopened = await transitionCase(manager, c.id, "TRIAGE", closed.recordVersion);
    expect(reopened.status).toBe("TRIAGE");

    const audits = await prisma.auditEvent.findMany({ where: { caseId: c.id, action: "CASE_REOPENED" } });
    expect(audits.length).toBe(1);
  });

  it("keeps the internal reference immutable across transitions", async () => {
    const c = await createCase(caseManager, baseInput);
    const t = await transitionCase(caseManager, c.id, "TRIAGE", c.recordVersion);
    expect(t.internalReference).toBe(c.internalReference);
  });

  it("detects an optimistic-concurrency conflict", async () => {
    const c = await createCase(caseManager, baseInput);
    await transitionCase(caseManager, c.id, "TRIAGE", c.recordVersion);
    // Reusing the stale version must conflict.
    await expect(
      transitionCase(caseManager, c.id, "QUALIFIED", c.recordVersion),
    ).rejects.toBeInstanceOf(ConcurrencyError);
  });
});

describe("record integrity", () => {
  it("preserves decision history and blocks silent edits of resolved decisions", async () => {
    const c = await createCase(caseManager, baseInput);
    await proposeDecision(caseManager, c.id, { title: "Progress", decisionType: "PROGRESS_TO_SPECIALIST_REVIEW" });
    const decision = await prisma.decision.findFirst({ where: { caseId: c.id } });
    await resolveDecision(manager, decision!.id, "APPROVED");
    // A second resolution of an already-resolved decision is rejected.
    await expect(resolveDecision(manager, decision!.id, "REJECTED")).rejects.toThrow("DECISION_NOT_PENDING");
    const after = await prisma.decision.findUnique({ where: { id: decision!.id } });
    expect(after?.status).toBe("APPROVED");
  });

  it("keeps a single active owner and preserves assignment history", async () => {
    const c = await createCase(caseManager, baseInput);
    const other = await makeEmployee("CASE_MANAGER");
    await assignOwner(manager, c.id, other.id);
    const active = await prisma.caseAssignment.findMany({
      where: { caseId: c.id, assignmentType: "OWNER", endedAt: null },
    });
    expect(active).toHaveLength(1);
    expect(active[0]!.employeeId).toBe(other.id);
    const all = await prisma.caseAssignment.findMany({ where: { caseId: c.id, assignmentType: "OWNER" } });
    expect(all.length).toBe(2); // history preserved
  });

  it("archives an organization while preserving its related cases", async () => {
    const orgId = await createOrganization(manager, { workingName: "Synthetic Org" });
    const c = await createCase(caseManager, { ...baseInput, organizationId: orgId });
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    await archiveOrganization(manager, orgId, org!.recordVersion);
    const archived = await prisma.organization.findUnique({ where: { id: orgId } });
    expect(archived?.verificationStatus).toBe("ARCHIVED");
    expect(archived?.archivedAt).not.toBeNull();
    // The related case still exists and still references the organization.
    const stillThere = await prisma.case.findUnique({ where: { id: c.id } });
    expect(stillThere?.organizationId).toBe(orgId);
  });
});
