"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getCurrentEmployee,
  recordStepUp,
  currentSessionId,
} from "@/lib/internal/session";
import { assertCan, type CurrentEmployee } from "@/lib/internal/authz";
import { reauthenticate } from "@/lib/internal/auth";
import { internalMutationsAllowed } from "@/lib/internal/env";
import { isRecentStepUp } from "@/lib/internal/step-up";
import {
  requestPilotAccess,
  approvePilotAccess,
  suspendPilotAccess,
  revokePilotAccess,
  createAccessChangeRequest,
  approveAccessChangeRequest,
  rejectAccessChangeRequest,
  applyAccessChangeRequest,
  createAccessReview,
  conductAccessReview,
  AccessGovernanceError,
} from "@/lib/internal/services/access-governance";
import {
  beginOffboarding,
  completeOffboarding,
  updateEmployeeGovernance,
  LifecycleError,
} from "@/lib/internal/services/lifecycle";
import {
  adminRevokeSession,
  adminRevokeAllSessions,
  signOutOtherSessions,
} from "@/lib/internal/services/sessions";
import {
  acknowledgeSecurityEvent,
  resolveSecurityEvent,
  createIncident,
  updateIncidentFields,
  transitionIncident,
  closeIncident,
  SecurityServiceError,
} from "@/lib/internal/services/security";
import {
  createExercise,
  startExercise,
  recordExerciseResult,
  approveExercise,
  updateCorrectiveActionStatus,
  verifyCorrectiveAction,
  acceptCorrectiveActionRisk,
  ExerciseError,
} from "@/lib/internal/services/exercises";
import { setReadinessGate, ReadinessError } from "@/lib/internal/services/readiness";

/**
 * P4-B governance server actions (§6/§7/§8/§9/§10/§11/§13/§14/§16/§17/§18).
 * Every action re-checks authentication and authorization on the server, and
 * blocks all mutations when operations are disabled or the pilot is suspended.
 * Sensitive actions require a recent step-up reauthentication — enforced here,
 * not in the UI — and redirect to the step-up page when it is missing.
 */

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/** Authenticated governance actor: mutations must be allowed + permission held. */
async function gov(permission: Parameters<typeof assertCan>[1]): Promise<CurrentEmployee> {
  const employee = await getCurrentEmployee();
  if (!employee) throw new Error("UNAUTHENTICATED");
  if (!internalMutationsAllowed()) throw new Error("OPERATIONS_UNAVAILABLE");
  assertCan(employee, permission);
  return employee;
}

/** Redirect to the step-up page unless the session was recently reauthenticated. */
function ensureStepUp(locale: string, employee: CurrentEmployee, nextPath: string): void {
  if (!isRecentStepUp(employee.stepUpVerifiedAt)) {
    redirect(`/${locale}/internal/step-up?next=${encodeURIComponent(nextPath)}`);
  }
}

export interface GovState {
  error?: string;
  ok?: string;
}

function govError(error: unknown): GovState {
  if (
    error instanceof AccessGovernanceError ||
    error instanceof LifecycleError ||
    error instanceof SecurityServiceError ||
    error instanceof ExerciseError ||
    error instanceof ReadinessError
  ) {
    return { error: error.message };
  }
  throw error;
}

/* ---------------- Step-up ---------------- */

export interface StepUpState {
  error?: string;
}

export async function stepUpAction(
  locale: string,
  _prev: StepUpState,
  formData: FormData,
): Promise<StepUpState> {
  const employee = await getCurrentEmployee();
  if (!employee) redirect(`/${locale}/internal/login`);
  const ok = await reauthenticate(employee.id, String(formData.get("password") ?? ""));
  if (!ok) return { error: "invalid" };
  await recordStepUp();
  const next = s(formData, "next") || `/${locale}/internal`;
  // Only allow internal same-origin paths.
  redirect(next.startsWith(`/${locale}/internal`) ? next : `/${locale}/internal`);
}

/* ---------------- Pilot access ---------------- */

export async function requestPilotAccessAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("pilot.request");
  try {
    await requestPilotAccess(employee, {
      employeeId: s(fd, "employeeId"),
      approvedRole: s(fd, "approvedRole"),
      justification: s(fd, "justification"),
    });
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness/access`);
  return { ok: "requested" };
}

export async function approvePilotAccessAction(locale: string, fd: FormData) {
  const employee = await gov("pilot.approve");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/access`);
  await approvePilotAccess(employee, s(fd, "pilotAccessId"), { days: Number(fd.get("days")) || undefined });
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function suspendPilotAccessAction(locale: string, fd: FormData) {
  const employee = await gov("pilot.approve");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/access`);
  await suspendPilotAccess(employee, s(fd, "pilotAccessId"), s(fd, "reason"));
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function revokePilotAccessAction(locale: string, fd: FormData) {
  const employee = await gov("pilot.approve");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/access`);
  await revokePilotAccess(employee, s(fd, "pilotAccessId"), s(fd, "reason"));
  revalidatePath(`/${locale}/internal/readiness/access`);
}

/* ---------------- Access-change requests ---------------- */

export async function createAccessChangeAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("access.change.request");
  try {
    await createAccessChangeRequest(employee, {
      targetEmployeeId: s(fd, "targetEmployeeId"),
      changeType: s(fd, "changeType"),
      proposedRole: s(fd, "proposedRole") || null,
      justification: s(fd, "justification"),
    });
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness/access`);
  return { ok: "requested" };
}

export async function approveAccessChangeAction(locale: string, fd: FormData) {
  const employee = await gov("access.change.approve");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/access`);
  await approveAccessChangeRequest(employee, s(fd, "requestId"));
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function rejectAccessChangeAction(locale: string, fd: FormData) {
  const employee = await gov("access.change.approve");
  await rejectAccessChangeRequest(employee, s(fd, "requestId"));
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function applyAccessChangeAction(locale: string, fd: FormData) {
  const employee = await gov("access.change.approve");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/access`);
  await applyAccessChangeRequest(employee, s(fd, "requestId"));
  revalidatePath(`/${locale}/internal/readiness/access`);
}

/* ---------------- Access reviews ---------------- */

export async function createAccessReviewAction(locale: string, fd: FormData) {
  const employee = await gov("access.review.conduct");
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  await createAccessReview(employee, {
    employeeId: s(fd, "employeeId"),
    reviewPeriodStart: start,
    reviewPeriodEnd: now,
  });
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function conductAccessReviewAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("access.review.conduct");
  try {
    await conductAccessReview(employee, s(fd, "reviewId"), {
      outcome: s(fd, "outcome"),
      rationale: s(fd, "rationale"),
    });
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness/access`);
  return { ok: "reviewed" };
}

/* ---------------- Employee lifecycle ---------------- */

export async function updateGovernanceAction(locale: string, fd: FormData) {
  const employee = await gov("employee.lifecycle");
  await updateEmployeeGovernance(employee, s(fd, "employeeId"), {
    accessPurpose: s(fd, "accessPurpose") || null,
    roleJustification: s(fd, "roleJustification") || null,
  });
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function beginOffboardingAction(locale: string, fd: FormData) {
  const employee = await gov("employee.lifecycle");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/access`);
  await beginOffboarding(employee, s(fd, "employeeId"), s(fd, "reason"));
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function completeOffboardingAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("employee.lifecycle");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/access`);
  try {
    await completeOffboarding(employee, s(fd, "employeeId"));
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness/access`);
  return { ok: "offboarded" };
}

/* ---------------- Session administration ---------------- */

export async function adminRevokeSessionAction(locale: string, fd: FormData) {
  const employee = await gov("session.admin");
  await adminRevokeSession(employee, s(fd, "sessionId"));
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function adminRevokeAllAction(locale: string, fd: FormData) {
  const employee = await gov("session.admin");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/access`);
  await adminRevokeAllSessions(employee, s(fd, "employeeId"));
  revalidatePath(`/${locale}/internal/readiness/access`);
}

export async function signOutOthersAction(locale: string) {
  const employee = await getCurrentEmployee();
  if (!employee) redirect(`/${locale}/internal/login`);
  const keep = await currentSessionId();
  if (keep) await signOutOtherSessions(employee, keep);
  redirect(`/${locale}/internal`);
}

/* ---------------- Security events ---------------- */

export async function ackEventAction(locale: string, fd: FormData) {
  const employee = await gov("security.event.manage");
  await acknowledgeSecurityEvent(employee, s(fd, "eventId"));
  revalidatePath(`/${locale}/internal/security`);
}

export async function resolveEventAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("security.event.manage");
  try {
    await resolveSecurityEvent(employee, s(fd, "eventId"), {
      status: (s(fd, "status") as "RESOLVED" | "FALSE_POSITIVE") || "RESOLVED",
      resolution: s(fd, "resolution"),
    });
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/security`);
  return { ok: "resolved" };
}

/* ---------------- Incidents ---------------- */

export async function createIncidentAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("incident.manage");
  try {
    const { id } = await createIncident(employee, {
      title: s(fd, "title"),
      category: s(fd, "category"),
      severity: s(fd, "severity") || "MEDIUM",
      summary: s(fd, "summary"),
      affectedAreas: s(fd, "affectedAreas") || null,
    });
    redirect(`/${locale}/internal/security/incidents/${id}`);
  } catch (e) {
    return govError(e);
  }
}

export async function updateIncidentAction(locale: string, fd: FormData) {
  const employee = await gov("incident.manage");
  const id = s(fd, "incidentId");
  try {
    await updateIncidentFields(employee, id, {
      version: Number(fd.get("version")),
      affectedAreas: s(fd, "affectedAreas") || null,
      containmentActions: s(fd, "containmentActions") || null,
      evidenceNotes: s(fd, "evidenceNotes") || null,
      recoveryActions: s(fd, "recoveryActions") || null,
    });
  } catch (e) {
    if (e instanceof SecurityServiceError && e.message === "CONFLICT") {
      redirect(`/${locale}/internal/security/incidents/${id}?conflict=1`);
    }
    throw e;
  }
  revalidatePath(`/${locale}/internal/security/incidents/${id}`);
}

export async function transitionIncidentAction(locale: string, fd: FormData) {
  const employee = await gov("incident.manage");
  const id = s(fd, "incidentId");
  await transitionIncident(employee, id, s(fd, "toStatus"));
  revalidatePath(`/${locale}/internal/security/incidents/${id}`);
}

export async function closeIncidentAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("incident.manage");
  const id = s(fd, "incidentId");
  // Critical incident closure requires a recent step-up reauthentication.
  ensureStepUp(locale, employee, `/${locale}/internal/security/incidents/${id}`);
  try {
    await closeIncident(employee, id, {
      lessonsLearned: s(fd, "lessonsLearned"),
      recoveryActions: s(fd, "recoveryActions") || null,
    });
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/security/incidents/${id}`);
  return { ok: "closed" };
}

/* ---------------- Pilot exercises ---------------- */

export async function createExerciseAction(locale: string, fd: FormData) {
  const employee = await gov("exercise.manage");
  await createExercise(employee, {
    type: s(fd, "type"),
    title: s(fd, "title"),
    expectedResult: s(fd, "expectedResult"),
  });
  revalidatePath(`/${locale}/internal/readiness/exercises`);
}

export async function startExerciseAction(locale: string, fd: FormData) {
  const employee = await gov("exercise.manage");
  await startExercise(employee, s(fd, "exerciseId"));
  revalidatePath(`/${locale}/internal/readiness/exercises`);
}

export async function recordExerciseResultAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("exercise.manage");
  try {
    await recordExerciseResult(employee, s(fd, "exerciseId"), {
      status: s(fd, "status") as never,
      actualResult: s(fd, "actualResult"),
      evidenceSummary: s(fd, "evidenceSummary") || null,
      deviation: s(fd, "deviation") || null,
    });
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness/exercises`);
  return { ok: "recorded" };
}

export async function approveExerciseAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("exercise.approve");
  try {
    await approveExercise(employee, s(fd, "exerciseId"));
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness/exercises`);
  return { ok: "approved" };
}

/* ---------------- Corrective actions ---------------- */

export async function updateCorrectiveAction2(locale: string, fd: FormData) {
  const employee = await gov("corrective.manage");
  await updateCorrectiveActionStatus(employee, s(fd, "id"), {
    status: s(fd, "status") as "IN_PROGRESS" | "READY_FOR_VERIFICATION",
    resolutionEvidence: s(fd, "resolutionEvidence") || null,
  });
  revalidatePath(`/${locale}/internal/readiness/exercises`);
}

export async function verifyCorrectiveAction2(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("corrective.verify");
  try {
    await verifyCorrectiveAction(employee, s(fd, "id"));
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness/exercises`);
  return { ok: "verified" };
}

export async function acceptRiskAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("corrective.manage");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness/exercises`);
  try {
    await acceptCorrectiveActionRisk(employee, s(fd, "id"), s(fd, "rationale"));
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness/exercises`);
  return { ok: "accepted" };
}

/* ---------------- Readiness gate ---------------- */

export async function setReadinessGateAction(locale: string, _p: GovState, fd: FormData): Promise<GovState> {
  const employee = await gov("readiness.approve");
  ensureStepUp(locale, employee, `/${locale}/internal/readiness`);
  try {
    await setReadinessGate(employee, { state: s(fd, "state"), rationale: s(fd, "rationale") });
  } catch (e) {
    return govError(e);
  }
  revalidatePath(`/${locale}/internal/readiness`);
  return { ok: "set" };
}
