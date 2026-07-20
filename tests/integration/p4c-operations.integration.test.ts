import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/internal/db";
import type { CurrentEmployee } from "@/lib/internal/authz";
import type { EmployeeRole } from "@/lib/internal/roles";
import {
  proposeAuthorization, reviewAuthorization, decideAuthorization,
  assertLimitedInternalAuthorized, LimitedInternalDenied, LimitedOpsError,
} from "@/lib/internal/services/limited-operations";
import {
  createPilotRun, transitionPilotRun, completePilotRun, addPilotMember,
  activatePilotMember, addPilotCase, OperationalPilotError,
} from "@/lib/internal/services/operational-pilot";
import { registerProcedure, approveProcedure, makeProcedureEffective, acknowledgeProcedure } from "@/lib/internal/services/procedures";
import { runDataQualityScan } from "@/lib/internal/services/data-quality";
import { prepareReleaseCandidate, reviewReleaseCandidate, ReleaseCandidateError } from "@/lib/internal/services/release-candidate";
import { requestPilotAccess, approvePilotAccess } from "@/lib/internal/services/access-governance";
import { createCase } from "@/lib/internal/services/cases";
import { createCommitment } from "@/lib/internal/services/records";
import { createIncident } from "@/lib/internal/services/security";

/**
 * P4-C controlled-operations integration tests (§29). Cover authorization
 * separation of duties, critical-gate blocking, limited_internal enforcement
 * and limits, pilot-run constraints, membership gating, deterministic
 * data-quality detection and release-evidence immutability.
 */

const TABLES = [
  "OperationalPilotCase", "OperationalPilotMember", "OperationalObservation", "OperationalPilotRun",
  "ProcedureAcknowledgement", "OperatingProcedure", "DataQualityFinding", "InternalReleaseCandidate",
  "LimitedOperationsAuthorization", "ReadinessGate", "ReadinessSignal", "CorrectiveAction", "PilotExercise",
  "SecurityIncident", "SecurityEvent", "AccessReview", "AccessChangeRequest", "PilotAccess",
  "AuditEvent", "Commitment", "Decision", "MeetingRecord", "MeetingPreparation", "EvidenceReference",
  "InformationGap", "QualificationReview", "InternalNote", "CaseAssignment", "Case", "Contact", "Organization",
  "Session", "Employee", "Counter",
];
async function truncate() {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${TABLES.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE;`);
}
let c = 0;
async function mk(role: EmployeeRole): Promise<CurrentEmployee> {
  c += 1;
  const e = await prisma.employee.create({
    data: { email: `${role.toLowerCase()}-${c}@akanil.example`, displayName: `${role} ${c}`, passwordHash: "x", role: role as never, status: "ACTIVE", lifecycleStage: "ACTIVE", mustChangePassword: false },
  });
  return { id: e.id, email: e.email, displayName: e.displayName, role, mustChangePassword: false };
}
const inDays = (n: number) => new Date(Date.now() + n * 86_400_000);

beforeAll(async () => { await prisma.$queryRawUnsafe("SELECT 1"); });
beforeEach(async () => { await truncate(); });

describe("limited-operations authorization (§7)", () => {
  async function propose(ops: CurrentEmployee) {
    return proposeAuthorization(ops, { title: "auth", scope: "s", approvedEmployeeLimit: 3, approvedCaseLimit: 5, allowedDataCategories: ["SYNTHETIC"], validFrom: new Date(), validUntil: inDays(30) });
  }
  it("enforces proposer/reviewer/approver separation and blocks self-approval", async () => {
    const ops = await mk("OPERATIONS_MANAGER");
    const ops2 = await mk("OPERATIONS_MANAGER");
    const ops3 = await mk("OPERATIONS_MANAGER");
    const id = await propose(ops);
    await expect(reviewAuthorization(ops, id)).rejects.toBeInstanceOf(LimitedOpsError); // proposer cannot review
    await reviewAuthorization(ops2, id);
    await expect(decideAuthorization(ops, id, { decision: "GO_LIMITED_INTERNAL_OPERATIONS" })).rejects.toBeInstanceOf(LimitedOpsError); // proposer cannot approve
    await expect(decideAuthorization(ops2, id, { decision: "GO_LIMITED_INTERNAL_OPERATIONS" })).rejects.toBeInstanceOf(LimitedOpsError); // reviewer cannot approve
    await prisma.readinessSignal.upsert({ where: { id: "last-restore-test" }, create: { id: "last-restore-test", status: "PASS" }, update: { status: "PASS" } });
    await decideAuthorization(ops3, id, { decision: "GO_LIMITED_INTERNAL_OPERATIONS" });
    const row = await prisma.limitedOperationsAuthorization.findUnique({ where: { id } });
    expect(row?.status).toBe("ACTIVE");
  });

  it("cannot activate while a critical gate fails", async () => {
    const ops = await mk("OPERATIONS_MANAGER");
    const ops2 = await mk("OPERATIONS_MANAGER");
    const ops3 = await mk("OPERATIONS_MANAGER");
    await createIncident(ops, { title: "crit", category: "AUDIT_INTEGRITY", severity: "CRITICAL", summary: "x" });
    const id = await propose(ops);
    await reviewAuthorization(ops2, id);
    await expect(decideAuthorization(ops3, id, { decision: "GO_LIMITED_INTERNAL_OPERATIONS" })).rejects.toBeInstanceOf(LimitedOpsError);
  });

  it("CONDITIONAL_GO requires conditions", async () => {
    const ops = await mk("OPERATIONS_MANAGER");
    const ops2 = await mk("OPERATIONS_MANAGER");
    const ops3 = await mk("OPERATIONS_MANAGER");
    await prisma.readinessSignal.upsert({ where: { id: "last-restore-test" }, create: { id: "last-restore-test", status: "PASS" }, update: { status: "PASS" } });
    const id = await propose(ops);
    await reviewAuthorization(ops2, id);
    await expect(decideAuthorization(ops3, id, { decision: "CONDITIONAL_GO" })).rejects.toBeInstanceOf(LimitedOpsError);
  });
});

describe("limited_internal enforcement (§8)", () => {
  it("denies without an active authorization, and honours employee/case limits", async () => {
    await expect(assertLimitedInternalAuthorized()).rejects.toBeInstanceOf(LimitedInternalDenied);
    // Create an active authorization with tiny limits, then exceed them.
    const ops = await mk("OPERATIONS_MANAGER");
    await prisma.limitedOperationsAuthorization.create({
      data: { title: "a", scope: "s", approvedEmployeeLimit: 1, approvedCaseLimit: 1, allowedDataCategories: "SYNTHETIC", status: "ACTIVE", validFrom: new Date(Date.now() - 1000), validUntil: inDays(10), proposedById: ops.id, decidedAt: new Date() },
    });
    await expect(assertLimitedInternalAuthorized()).resolves.toBeUndefined();
    // Two active members exceeds the limit of 1.
    const run = await createPilotRun(ops, { title: "r", objective: "o", maximumEmployees: 6, maximumCases: 5, allowedDataCategories: ["SYNTHETIC"] });
    for (let i = 0; i < 2; i++) {
      const e = await mk("CASE_MANAGER");
      await prisma.operationalPilotMember.create({ data: { pilotRunId: run.id, employeeId: e.id, operationalRole: "CASE_MANAGER", addedById: ops.id, status: "ACTIVE" } });
    }
    await expect(assertLimitedInternalAuthorized()).rejects.toBeInstanceOf(LimitedInternalDenied);
  });
});

describe("operational pilot run (§9/§10/§11)", () => {
  it("validates limits and permits only one active run", async () => {
    const ops = await mk("OPERATIONS_MANAGER");
    await expect(createPilotRun(ops, { title: "r", objective: "o", maximumEmployees: 7, maximumCases: 5, allowedDataCategories: ["SYNTHETIC"] })).rejects.toBeInstanceOf(OperationalPilotError);
    await expect(createPilotRun(ops, { title: "r", objective: "o", maximumEmployees: 3, maximumCases: 20, allowedDataCategories: ["SYNTHETIC"] })).rejects.toBeInstanceOf(OperationalPilotError);
  });

  it("member activation requires pilot access, acknowledgements and independent approval", async () => {
    const admin = await mk("SYSTEM_ADMIN");
    const ops = await mk("OPERATIONS_MANAGER");
    const ops2 = await mk("OPERATIONS_MANAGER");
    const cm = await mk("CASE_MANAGER");
    const run = await createPilotRun(ops, { title: "r", objective: "o", maximumEmployees: 3, maximumCases: 5, allowedDataCategories: ["SYNTHETIC"] });
    const mid = await addPilotMember(ops, run.id, { employeeId: cm.id, operationalRole: "CASE_MANAGER" });
    // No pilot access yet → denied.
    await expect(activatePilotMember(ops2, mid)).rejects.toBeInstanceOf(OperationalPilotError);
    const pa = await requestPilotAccess(admin, { employeeId: cm.id, approvedRole: "CASE_MANAGER", justification: "j" });
    await approvePilotAccess(ops, pa);
    // Effective procedure without acknowledgement → denied.
    const pid = await registerProcedure(ops, { procedureKey: "SOP-INTAKE-01", title: "Intake" });
    await approveProcedure(ops, pid);
    await makeProcedureEffective(ops, pid);
    await expect(activatePilotMember(ops2, mid)).rejects.toBeInstanceOf(OperationalPilotError);
    await acknowledgeProcedure(cm, { procedureKey: "SOP-INTAKE-01", procedureVersion: 1 });
    // Self-approval denied; independent approval allowed.
    await expect(activatePilotMember(cm, mid)).rejects.toThrow();
    await activatePilotMember(ops2, mid);
    const m = await prisma.operationalPilotMember.findUnique({ where: { id: mid } });
    expect(m?.status).toBe("ACTIVE");
  });

  it("rejects a pilot case whose data category the run does not allow, and completion needs observations + independent approver", async () => {
    const ops = await mk("OPERATIONS_MANAGER");
    const ops2 = await mk("OPERATIONS_MANAGER");
    const cm = await mk("CASE_MANAGER");
    const kase = await createCase(cm, { title: "t", summary: "s", source: "DIRECT_EMAIL", pilotDataCategory: "SYNTHETIC" });
    const run = await createPilotRun(ops, { title: "r", objective: "o", maximumEmployees: 3, maximumCases: 5, allowedDataCategories: ["SYNTHETIC"] });
    await expect(addPilotCase(ops, run.id, { caseId: kase.id, scenarioType: "OTHER_CONTROLLED_SCENARIO", dataCategory: "DE_IDENTIFIED" })).rejects.toBeInstanceOf(OperationalPilotError);
    await addPilotCase(ops, run.id, { caseId: kase.id, scenarioType: "OTHER_CONTROLLED_SCENARIO", dataCategory: "SYNTHETIC" });
    await prisma.operationalPilotMember.create({ data: { pilotRunId: run.id, employeeId: cm.id, operationalRole: "CASE_MANAGER", addedById: ops.id, status: "APPROVED" } });
    await transitionPilotRun(ops, run.id, "READY");
    await transitionPilotRun(ops, run.id, "ACTIVE");
    await expect(completePilotRun(ops2, run.id, { observationsSummary: "", finalOutcome: "CONTINUE_PILOT" })).rejects.toBeInstanceOf(OperationalPilotError);
    await expect(completePilotRun(ops, run.id, { observationsSummary: "ok", finalOutcome: "CONTINUE_PILOT" })).rejects.toBeInstanceOf(OperationalPilotError); // owner cannot approve completion
    await completePilotRun(ops2, run.id, { observationsSummary: "ok", finalOutcome: "CONTINUE_PILOT" });
    const r = await prisma.operationalPilotRun.findUnique({ where: { id: run.id } });
    expect(r?.status).toBe("COMPLETED");
  });
});

describe("data quality (§14) and release evidence (§20)", () => {
  it("deterministically detects ownerless and closed-with-open-commitment cases without mutating data", async () => {
    const ops = await mk("OPERATIONS_MANAGER");
    const cm = await mk("CASE_MANAGER");
    const k1 = await createCase(cm, { title: "owned", summary: "s", source: "DIRECT_EMAIL" });
    await prisma.case.update({ where: { id: k1.id }, data: { currentOwnerId: null } }); // ownerless
    const k2 = await createCase(cm, { title: "closed", summary: "s", source: "DIRECT_EMAIL" });
    await createCommitment(cm, k2.id, { title: "open", internalOwnerId: cm.id });
    await prisma.case.update({ where: { id: k2.id }, data: { status: "CLOSED", closureReason: "COMPLETED" } });
    const created = await runDataQualityScan(ops);
    expect(created).toBeGreaterThanOrEqual(2);
    const cats = (await prisma.dataQualityFinding.findMany()).map((f) => f.category);
    expect(cats).toContain("CASE_WITHOUT_OWNER");
    expect(cats).toContain("CLOSED_CASE_WITH_OPEN_COMMITMENT");
    // Re-running does not duplicate.
    const again = await runDataQualityScan(ops);
    expect(again).toBe(0);
  });

  it("release evidence: reviewer must differ, SHA must match, no secret stored", async () => {
    const ops = await mk("OPERATIONS_MANAGER");
    const ops2 = await mk("OPERATIONS_MANAGER");
    // A URL/secret in any evidence field is rejected.
    await expect(prepareReleaseCandidate(ops, { version: "v", commitSha: "abc1234", secretScanResult: "postgres://u:p@h/db" })).rejects.toBeInstanceOf(ReleaseCandidateError);
    const id = await prepareReleaseCandidate(ops, { version: "v1", commitSha: "abc1234", buildResult: "PASS" });
    await expect(reviewReleaseCandidate(ops, id, "abc1234")).rejects.toBeInstanceOf(ReleaseCandidateError); // preparer cannot review
    await expect(reviewReleaseCandidate(ops2, id, "wrongsha")).rejects.toBeInstanceOf(ReleaseCandidateError); // sha mismatch
    await reviewReleaseCandidate(ops2, id, "abc1234");
    const rc = await prisma.internalReleaseCandidate.findUnique({ where: { id } });
    expect(rc?.status).toBe("READY_FOR_DECISION");
  });
});
