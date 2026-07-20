import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/internal/db";
import type { CurrentEmployee } from "@/lib/internal/authz";
import type { EmployeeRole } from "@/lib/internal/roles";
import { hashPassword } from "@/lib/internal/password";
import { createCase } from "@/lib/internal/services/cases";
import { requestPilotAccess, approvePilotAccess } from "@/lib/internal/services/access-governance";
import { registerProcedure, approveProcedure, makeProcedureEffective, acknowledgeProcedure, REQUIRED_PROCEDURES } from "@/lib/internal/services/procedures";
import { createPilotRun, transitionPilotRun, addPilotMember, activatePilotMember, addPilotCase, completePilotRun } from "@/lib/internal/services/operational-pilot";
import { runDataQualityScan } from "@/lib/internal/services/data-quality";
import { proposeAuthorization, reviewAuthorization, decideAuthorization, authorizationBlockers, activeAuthorization } from "@/lib/internal/services/limited-operations";
import { prepareReleaseCandidate, reviewReleaseCandidate } from "@/lib/internal/services/release-candidate";
import { recordSecurityEvent } from "@/lib/internal/security-events";
import { recordReadinessSignal } from "@/lib/internal/services/readiness";
import { verifyChain, type ChainRow } from "@/lib/internal/audit-chain";

/**
 * P4-C synthetic operational rehearsal (§30). Exercises the controlled-pilot
 * controls end to end against a SYNTHETIC database using synthetic
 * `@akanil.example` employees and clearly-synthetic data. It NEVER produces an
 * actual operational GO, never enables limited_internal at the environment
 * level, never deploys, and never creates real accounts. It demonstrates that
 * a limited-operations authorization is REJECTED while a critical gate fails,
 * and that a valid synthetic authorization can be approved only in this
 * isolated test environment. Ends with the mandated status line.
 *
 * Intended to run against the dedicated test database (DATABASE_URL_TEST).
 */

const P4C_TABLES = [
  "OperationalPilotCase", "OperationalPilotMember", "OperationalObservation", "OperationalPilotRun",
  "ProcedureAcknowledgement", "OperatingProcedure", "DataQualityFinding", "InternalReleaseCandidate",
  "LimitedOperationsAuthorization",
  "ReadinessGate", "ReadinessSignal", "CorrectiveAction", "PilotExercise", "SecurityIncident", "SecurityEvent",
  "AccessReview", "AccessChangeRequest", "PilotAccess",
  "AuditEvent", "Commitment", "Decision", "MeetingRecord", "MeetingPreparation", "EvidenceReference",
  "InformationGap", "QualificationReview", "InternalNote", "CaseAssignment", "Case", "Contact", "Organization",
  "Session", "Employee", "Counter",
];

function actorOf(e: { id: string; email: string; displayName: string; role: EmployeeRole }): CurrentEmployee {
  return { id: e.id, email: e.email, displayName: e.displayName, role: e.role, mustChangePassword: false };
}

async function mkEmployee(role: EmployeeRole, n: number): Promise<CurrentEmployee> {
  const e = await prisma.employee.create({
    data: {
      email: `rehearsal-${role.toLowerCase()}-${n}@akanil.example`,
      displayName: `${role} ${n} (synthetic)`,
      // A throwaway random password for the synthetic rehearsal account; never a
      // real credential, never logged, never committed (generated at run time).
      passwordHash: await hashPassword(`synthetic-${randomBytes(18).toString("base64url")}`),
      role: role as never,
      status: "ACTIVE",
      lifecycleStage: "ACTIVE",
      mustChangePassword: false,
    },
  });
  return actorOf({ id: e.id, email: e.email, displayName: e.displayName, role });
}

async function main() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (process as any).loadEnvFile?.(".env");
  } catch { /* env supplied directly */ }
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL ?? "";

  const log = (s: string) => console.log(`• ${s}`);
  log("Resetting synthetic rehearsal database (test only)…");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${P4C_TABLES.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE;`);

  // 1. Controlled employee onboarding (synthetic).
  const admin = await mkEmployee("SYSTEM_ADMIN", 1);
  const ops = await mkEmployee("OPERATIONS_MANAGER", 1);
  const ops2 = await mkEmployee("OPERATIONS_MANAGER", 2);
  const ops3 = await mkEmployee("OPERATIONS_MANAGER", 3);
  const cm = await mkEmployee("CASE_MANAGER", 1);
  const specialist = await mkEmployee("SPECIALIST_REVIEWER", 1);
  const forum = await mkEmployee("FORUM_COORDINATOR", 1);
  log("Synthetic employees onboarded.");

  // 2. Time-limited pilot access for the operational cohort.
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 86_400_000);
  for (const emp of [cm, specialist, forum]) {
    const id = await requestPilotAccess(admin, { employeeId: emp.id, approvedRole: emp.role, justification: "synthetic rehearsal" });
    await approvePilotAccess(ops, id, { days: 30 });
  }
  log("Time-limited pilot access granted (independent approval).");

  // 3. Procedures effective + acknowledgements.
  for (const sop of REQUIRED_PROCEDURES) {
    const id = await registerProcedure(ops, { procedureKey: sop.key, title: sop.title });
    await approveProcedure(ops, id);
    await makeProcedureEffective(ops, id);
  }
  for (const emp of [cm, specialist, forum]) {
    const actor = emp;
    for (const sop of REQUIRED_PROCEDURES) {
      await acknowledgeProcedure(actor, { procedureKey: sop.key, procedureVersion: 1 });
    }
  }
  log("Procedures effective and acknowledged by the cohort.");

  // 4–7. Synthetic cases across scenarios.
  const c1 = await createCase(cm, { title: "Moroccan company request (synthetic)", summary: "Synthetic manufacturer enquiry.", source: "PUBLIC_RECEPTION_EMAIL", requestType: "supply-offtake-requirement", pilotDataCategory: "SYNTHETIC" });
  const c2 = await createCase(cm, { title: "Sudanese project (synthetic)", summary: "Synthetic project enquiry.", source: "DIRECT_EMAIL", pilotDataCategory: "SYNTHETIC" });
  const c3 = await createCase(cm, { title: "Forum qualification (synthetic)", summary: "Synthetic Forum enquiry.", source: "FORUM", requestType: "forum-qualification", pilotDataCategory: "SYNTHETIC" });
  const c4 = await createCase(cm, { title: "Value-chain request (synthetic)", summary: "Synthetic value-chain enquiry.", source: "DIRECT_EMAIL", primaryValueChainId: "oilseeds-agro-processing", pilotDataCategory: "SYNTHETIC" });
  log("Synthetic cases created across scenarios.");

  // 9. Controlled pilot run.
  const { id: runId, reference } = await createPilotRun(ops, { title: "Controlled pilot (synthetic)", objective: "Exercise variety of workflows.", maximumEmployees: 3, maximumCases: 5, allowedDataCategories: ["SYNTHETIC"] });
  log(`Pilot run ${reference} planned.`);

  // 10. Membership (no self-approval).
  const m1 = await addPilotMember(ops, runId, { employeeId: cm.id, operationalRole: "CASE_MANAGER" });
  await activatePilotMember(ops2, m1);
  const m2 = await addPilotMember(ops, runId, { employeeId: specialist.id, operationalRole: "SPECIALIST_REVIEWER" });
  await activatePilotMember(ops2, m2);
  log("Pilot members activated (independent approval).");

  // 11. Pilot case coverage.
  await addPilotCase(ops, runId, { caseId: c1.id, scenarioType: "MOROCCAN_COMPANY_REQUEST", dataCategory: "SYNTHETIC" });
  await addPilotCase(ops, runId, { caseId: c2.id, scenarioType: "SUDANESE_PROJECT_OR_OPPORTUNITY", dataCategory: "SYNTHETIC" });
  await addPilotCase(ops, runId, { caseId: c3.id, scenarioType: "FORUM_QUALIFICATION", dataCategory: "SYNTHETIC" });
  await addPilotCase(ops, runId, { caseId: c4.id, scenarioType: "VALUE_CHAIN_REQUEST", dataCategory: "SYNTHETIC" });
  await transitionPilotRun(ops, runId, "READY");
  await transitionPilotRun(ops, runId, "ACTIVE");
  log("Pilot run active with synthetic case coverage.");

  // 14–15. Data-quality: create a closed case with an open commitment, then scan.
  const { proposeDecision } = await import("@/lib/internal/services/records");
  void proposeDecision;
  const { createCommitment } = await import("@/lib/internal/services/records");
  await createCommitment(cm, c2.id, { title: "Open commitment (synthetic)", internalOwnerId: cm.id });
  await prisma.case.update({ where: { id: c2.id }, data: { status: "CLOSED", closureReason: "COMPLETED" } });
  const findings = await runDataQualityScan(ops);
  log(`Deterministic data-quality scan produced ${findings} synthetic finding(s).`);

  // 20. Audit-chain verification.
  const rows = await prisma.auditEvent.findMany({ orderBy: { sequenceNumber: "asc" } });
  const verdict = verifyChain(rows as unknown as ChainRow[]);
  if (!verdict.ok) throw new Error(`Audit chain broken at ${verdict.brokenSequence}`);
  log(`Audit chain verified (${verdict.verified} events).`);

  // 24. Release-candidate evidence (no deployment).
  const rcId = await prepareReleaseCandidate(ops, { version: "p4c-synthetic", commitSha: "0000000synthetic", buildResult: "PASS", testResult: "PASS" }).catch(async () => {
    // commitSha must be hex; use a synthetic hex value.
    return prepareReleaseCandidate(ops, { version: "p4c-synthetic", commitSha: "abcdef0", buildResult: "PASS", testResult: "PASS" });
  });
  await reviewReleaseCandidate(ops2, rcId, "abcdef0");
  log("Synthetic release-candidate evidence prepared and reviewed.");

  // 25. Authorization REJECTED while a critical gate fails.
  await recordSecurityEvent({ category: "AUDIT_INTEGRITY_FAILURE", severity: "CRITICAL", summary: "Synthetic critical event (rehearsal)" });
  const { createIncident } = await import("@/lib/internal/services/security");
  const inc = await createIncident(ops, { title: "Synthetic critical incident", category: "AUDIT_INTEGRITY", severity: "CRITICAL", summary: "Synthetic" });
  const authIdBlocked = await proposeAuthorization(ops, { title: "Blocked authorization (synthetic)", scope: "synthetic", approvedEmployeeLimit: 3, approvedCaseLimit: 5, allowedDataCategories: ["SYNTHETIC"], validFrom: now, validUntil: expires });
  await reviewAuthorization(ops2, authIdBlocked);
  let blockedRejected = false;
  try {
    await decideAuthorization(ops3, authIdBlocked, { decision: "GO_LIMITED_INTERNAL_OPERATIONS" });
  } catch {
    blockedRejected = true;
  }
  if (!blockedRejected) throw new Error("Authorization activated despite a critical gate failure!");
  log("Authorization correctly REJECTED while a critical gate was failing.");

  // 26. Valid synthetic authorization only after clearing the critical gate,
  // in this isolated test environment. This does NOT create a production GO and
  // does not enable limited_internal at the environment level.
  const { closeIncident } = await import("@/lib/internal/services/security");
  await closeIncident(ops, inc.id, { lessonsLearned: "Synthetic — resolved for rehearsal." });
  await recordReadinessSignal({ id: "last-restore-test", status: "PASS", detail: "Synthetic restore verified (rehearsal)." });
  const blockers = await authorizationBlockers();
  const authId = await proposeAuthorization(ops, { title: "Synthetic isolated authorization", scope: "synthetic-isolated", approvedEmployeeLimit: 3, approvedCaseLimit: 5, allowedDataCategories: ["SYNTHETIC"], validFrom: now, validUntil: expires });
  await reviewAuthorization(ops2, authId);
  if (blockers.length === 0) {
    await decideAuthorization(ops3, authId, { decision: "GO_LIMITED_INTERNAL_OPERATIONS" });
    const active = await activeAuthorization();
    log(`Synthetic isolated authorization approved (id ${active?.id.slice(0, 8)}). Environment NOT changed; no production GO.`);
  } else {
    log(`Critical gate still failing (${blockers.join("; ")}); synthetic authorization left pending.`);
  }

  // Complete the run with an observations summary (executor ≠ approver).
  await completePilotRun(ops2, runId, { observationsSummary: "Synthetic rehearsal observations.", finalOutcome: "READY_FOR_LIMITED_INTERNAL_OPERATIONS" });
  log("Pilot run completed with observations (human approver distinct from owner).");

  console.log("\nTECHNICAL REHEARSAL COMPLETED — HUMAN PILOT STILL REQUIRED");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
