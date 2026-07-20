"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentEmployee } from "@/lib/internal/session";
import { assertCan, type CurrentEmployee } from "@/lib/internal/authz";
import { internalMutationsAllowed } from "@/lib/internal/env";
import { isRecentStepUp } from "@/lib/internal/step-up";
import {
  proposeAuthorization, reviewAuthorization, decideAuthorization, suspendAuthorization, LimitedOpsError,
} from "@/lib/internal/services/limited-operations";
import {
  createPilotRun, transitionPilotRun, completePilotRun, addPilotMember, activatePilotMember,
  removePilotMember, addPilotCase, removePilotCase, OperationalPilotError,
} from "@/lib/internal/services/operational-pilot";
import {
  registerProcedure, approveProcedure, makeProcedureEffective, acknowledgeProcedure, ProcedureError,
} from "@/lib/internal/services/procedures";
import { runDataQualityScan, resolveDataQualityFinding, DataQualityError } from "@/lib/internal/services/data-quality";
import { createObservation, resolveObservation, ObservationError } from "@/lib/internal/services/observations";
import { prepareReleaseCandidate, reviewReleaseCandidate, ReleaseCandidateError } from "@/lib/internal/services/release-candidate";

/**
 * P4-C controlled-operations server actions (§7/§9/§10/§11/§12/§14/§17/§20).
 * Every action re-checks authentication and authorization on the server and
 * blocks all mutations while operations are unavailable or the pilot is
 * suspended. Sensitive decisions (the limited-operations decision, release
 * review) require a recent step-up reauthentication. The application never
 * selects or auto-approves a Go/No-Go decision and never changes the
 * environment or deploys.
 */

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const dt = (fd: FormData, k: string): Date | null => {
  const v = s(fd, k);
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

async function ops(permission: Parameters<typeof assertCan>[1]): Promise<CurrentEmployee> {
  const employee = await getCurrentEmployee();
  if (!employee) throw new Error("UNAUTHENTICATED");
  if (!internalMutationsAllowed()) throw new Error("OPERATIONS_UNAVAILABLE");
  assertCan(employee, permission);
  return employee;
}

function ensureStepUp(locale: string, employee: CurrentEmployee, next: string): void {
  if (!isRecentStepUp(employee.stepUpVerifiedAt)) {
    redirect(`/${locale}/internal/step-up?next=${encodeURIComponent(next)}`);
  }
}

export interface OpsState {
  error?: string;
  ok?: string;
}

function opsError(error: unknown): OpsState {
  if (
    error instanceof LimitedOpsError || error instanceof OperationalPilotError ||
    error instanceof ProcedureError || error instanceof DataQualityError ||
    error instanceof ObservationError || error instanceof ReleaseCandidateError
  ) {
    return { error: error.message };
  }
  throw error;
}

/* ---------------- Limited-operations authorization ---------------- */

export async function proposeAuthorizationAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.authorization.propose");
  try {
    await proposeAuthorization(e, {
      title: s(fd, "title"),
      scope: s(fd, "scope"),
      evidenceSummary: s(fd, "evidenceSummary") || undefined,
      conditions: s(fd, "conditions") || undefined,
      approvedEmployeeLimit: Number(fd.get("approvedEmployeeLimit")) || 0,
      approvedCaseLimit: Number(fd.get("approvedCaseLimit")) || 0,
      allowedDataCategories: fd.getAll("allowedDataCategories").map(String),
      validFrom: dt(fd, "validFrom") ?? new Date(),
      validUntil: dt(fd, "validUntil") ?? new Date(Date.now() + 30 * 86_400_000),
    });
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/authorization`);
  return { ok: "proposed" };
}

export async function reviewAuthorizationAction(locale: string, fd: FormData) {
  const e = await ops("operations.authorization.review");
  await reviewAuthorization(e, s(fd, "id"));
  revalidatePath(`/${locale}/internal/operations/authorization`);
}

export async function decideAuthorizationAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.authorization.approve");
  ensureStepUp(locale, e, `/${locale}/internal/operations/authorization`);
  try {
    await decideAuthorization(e, s(fd, "id"), { decision: s(fd, "decision"), conditions: s(fd, "conditions") || undefined });
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/authorization`);
  return { ok: "decided" };
}

export async function suspendAuthorizationAction(locale: string, fd: FormData) {
  const e = await ops("operations.authorization.approve");
  ensureStepUp(locale, e, `/${locale}/internal/operations/authorization`);
  await suspendAuthorization(e, s(fd, "id"), s(fd, "reason"));
  revalidatePath(`/${locale}/internal/operations/authorization`);
}

/* ---------------- Pilot run / members / cases ---------------- */

export async function createPilotRunAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.pilot.create");
  try {
    const { id } = await createPilotRun(e, {
      title: s(fd, "title"),
      objective: s(fd, "objective"),
      maximumEmployees: Number(fd.get("maximumEmployees")) || 0,
      maximumCases: Number(fd.get("maximumCases")) || 0,
      allowedDataCategories: fd.getAll("allowedDataCategories").map(String),
    });
    redirect(`/${locale}/internal/operations/pilot/${id}`);
  } catch (err) { return opsError(err); }
}

export async function transitionPilotRunAction(locale: string, fd: FormData) {
  const e = await ops("operations.pilot.manage");
  const id = s(fd, "pilotRunId");
  await transitionPilotRun(e, id, s(fd, "toStatus"));
  revalidatePath(`/${locale}/internal/operations/pilot/${id}`);
}

export async function completePilotRunAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.pilot.complete");
  const id = s(fd, "pilotRunId");
  try {
    await completePilotRun(e, id, {
      observationsSummary: s(fd, "observationsSummary"),
      finalOutcome: s(fd, "finalOutcome"),
    });
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/pilot/${id}`);
  return { ok: "completed" };
}

export async function addPilotMemberAction(locale: string, fd: FormData) {
  const e = await ops("operations.pilot.manage");
  const id = s(fd, "pilotRunId");
  await addPilotMember(e, id, { employeeId: s(fd, "employeeId"), operationalRole: s(fd, "operationalRole") });
  revalidatePath(`/${locale}/internal/operations/pilot/${id}`);
}

export async function activatePilotMemberAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.pilot.manage");
  const runId = s(fd, "pilotRunId");
  try {
    await activatePilotMember(e, s(fd, "memberId"));
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/pilot/${runId}`);
  return { ok: "activated" };
}

export async function removePilotMemberAction(locale: string, fd: FormData) {
  const e = await ops("operations.pilot.manage");
  const runId = s(fd, "pilotRunId");
  await removePilotMember(e, s(fd, "memberId"), s(fd, "revoke") === "1");
  revalidatePath(`/${locale}/internal/operations/pilot/${runId}`);
}

export async function addPilotCaseAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.pilot.manage");
  const runId = s(fd, "pilotRunId");
  try {
    await addPilotCase(e, runId, {
      caseId: s(fd, "caseId"),
      scenarioType: s(fd, "scenarioType"),
      dataCategory: s(fd, "dataCategory") || "SYNTHETIC",
      expectedPath: s(fd, "expectedPath") || undefined,
    });
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/pilot/${runId}`);
  return { ok: "added" };
}

export async function removePilotCaseAction(locale: string, fd: FormData) {
  const e = await ops("operations.pilot.manage");
  const runId = s(fd, "pilotRunId");
  await removePilotCase(e, s(fd, "pilotCaseId"));
  revalidatePath(`/${locale}/internal/operations/pilot/${runId}`);
}

/* ---------------- Procedures ---------------- */

export async function approveProcedureAction(locale: string, fd: FormData) {
  const e = await ops("operations.procedure.manage");
  await approveProcedure(e, s(fd, "id"));
  revalidatePath(`/${locale}/internal/operations/procedures`);
}

export async function makeProcedureEffectiveAction(locale: string, fd: FormData) {
  const e = await ops("operations.procedure.manage");
  await makeProcedureEffective(e, s(fd, "id"));
  revalidatePath(`/${locale}/internal/operations/procedures`);
}

export async function registerProcedureAction(locale: string, fd: FormData) {
  const e = await ops("operations.procedure.manage");
  await registerProcedure(e, { procedureKey: s(fd, "procedureKey"), title: s(fd, "title") });
  revalidatePath(`/${locale}/internal/operations/procedures`);
}

export async function acknowledgeProcedureAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.procedure.acknowledge");
  try {
    await acknowledgeProcedure(e, {
      procedureKey: s(fd, "procedureKey"),
      procedureVersion: Number(fd.get("procedureVersion")) || 1,
      acknowledgementType: s(fd, "acknowledgementType") || "READ_AND_UNDERSTOOD",
    });
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/procedures`);
  return { ok: "acknowledged" };
}

/* ---------------- Data quality ---------------- */

export async function runDataQualityScanAction(locale: string, _p: OpsState, _fd: FormData): Promise<OpsState> {
  void _p; void _fd;
  const e = await ops("operations.data_quality.manage");
  const n = await runDataQualityScan(e);
  revalidatePath(`/${locale}/internal/operations/data-quality`);
  return { ok: `scan created ${n}` };
}

export async function resolveDataQualityAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.data_quality.manage");
  try {
    await resolveDataQualityFinding(e, s(fd, "id"), {
      status: s(fd, "status") as "RESOLVED" | "FALSE_POSITIVE" | "WAIVED",
      resolution: s(fd, "resolution") || undefined,
      waiverRationale: s(fd, "waiverRationale") || undefined,
    });
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/data-quality`);
  return { ok: "resolved" };
}

/* ---------------- Observations ---------------- */

export async function createObservationAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.pilot.view");
  const runId = s(fd, "pilotRunId");
  try {
    await createObservation(e, {
      pilotRunId: runId || null,
      caseId: s(fd, "caseId") || null,
      category: s(fd, "category"),
      severity: s(fd, "severity") || "LOW",
      title: s(fd, "title"),
      description: s(fd, "description"),
    });
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/pilot/${runId}`);
  return { ok: "recorded" };
}

export async function resolveObservationAction(locale: string, fd: FormData) {
  const e = await ops("operations.pilot.manage");
  const runId = s(fd, "pilotRunId");
  await resolveObservation(e, s(fd, "id"), {
    status: s(fd, "status") as "RESOLVED" | "ACCEPTED_OBSERVATION" | "UNDER_REVIEW",
    resolutionSummary: s(fd, "resolutionSummary") || undefined,
  });
  revalidatePath(`/${locale}/internal/operations/pilot/${runId}`);
}

/* ---------------- Release candidate ---------------- */

export async function prepareReleaseAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.release.prepare");
  try {
    await prepareReleaseCandidate(e, {
      version: s(fd, "version"),
      commitSha: s(fd, "commitSha"),
      migrationBaseline: s(fd, "migrationBaseline") || undefined,
      buildResult: s(fd, "buildResult") || undefined,
      testResult: s(fd, "testResult") || undefined,
      accessibilityResult: s(fd, "accessibilityResult") || undefined,
      auditVerificationResult: s(fd, "auditVerificationResult") || undefined,
      backupRestoreResult: s(fd, "backupRestoreResult") || undefined,
      secretScanResult: s(fd, "secretScanResult") || undefined,
      prohibitedFeatureScanResult: s(fd, "prohibitedFeatureScanResult") || undefined,
      publicRegressionResult: s(fd, "publicRegressionResult") || undefined,
      rollbackPlanVersion: s(fd, "rollbackPlanVersion") || undefined,
    });
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/release`);
  return { ok: "prepared" };
}

export async function reviewReleaseAction(locale: string, _p: OpsState, fd: FormData): Promise<OpsState> {
  const e = await ops("operations.release.prepare");
  ensureStepUp(locale, e, `/${locale}/internal/operations/release`);
  try {
    await reviewReleaseCandidate(e, s(fd, "id"), s(fd, "confirmCommitSha"));
  } catch (err) { return opsError(err); }
  revalidatePath(`/${locale}/internal/operations/release`);
  return { ok: "reviewed" };
}
