"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentEmployee, destroyCurrentSession, createSession } from "@/lib/internal/session";
import { login as loginService, changeOwnPassword } from "@/lib/internal/auth";
import {
  createCase,
  transitionCase,
  assignOwner,
  addReviewer,
  addNote,
  canAccessCase,
  ConcurrencyError,
} from "@/lib/internal/services/cases";
import {
  createGap,
  resolveGap,
  createEvidenceReference,
  submitQualificationRecommendation,
  approveQualificationOutcome,
  createMeetingPreparation,
  createMeetingRecord,
  proposeDecision,
  resolveDecision,
  createCommitment,
  updateCommitmentStatus,
} from "@/lib/internal/services/records";
import {
  createOrganization,
  createContact,
  updateOrganizationVerification,
  archiveOrganization,
} from "@/lib/internal/services/organizations";
import {
  createEmployeeAccount,
  disableEmployeeAccount,
  resetEmployeePassword,
  UserServiceError,
} from "@/lib/internal/services/users";
import { assertCan } from "@/lib/internal/authz";
import { assertPilotOperational, PilotAccessError } from "@/lib/internal/pilot";

/** Read the authenticated actor or reject (server-side enforcement). */
async function actor() {
  const employee = await getCurrentEmployee();
  if (!employee) throw new Error("UNAUTHENTICATED");
  return employee;
}

/**
 * Read the authenticated actor for an OPERATIONAL mutation. Beyond
 * authentication, this enforces the P4-B operating mode, the pilot emergency
 * suspension and the pilot-cohort gate: an ACTIVE account alone is not enough —
 * the employee must hold active pilot access. Governance actions use a
 * different gate and do not require pilot access.
 */
async function operationalActor(locale: string) {
  const employee = await actor();
  try {
    await assertPilotOperational(employee.id);
  } catch (error) {
    if (error instanceof PilotAccessError) redirect(`/${locale}/internal/denied?reason=pilot`);
    throw error;
  }
  return employee;
}

/** Reject a mutation when the actor may not access the case (object-level). */
async function requireCaseAccess(locale: string, caseId: string) {
  const employee = await operationalActor(locale);
  if (!(await canAccessCase(employee, caseId))) throw new Error("FORBIDDEN");
  return employee;
}

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/* ---------------- Authentication ---------------- */

export interface LoginState {
  error?: string;
}

export async function loginAction(
  locale: string,
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = await loginService(s(formData, "email"), String(formData.get("password") ?? ""));
  if (!result.ok) return { error: "invalid" };
  if (result.mustChangePassword) redirect(`/${locale}/internal/change-password`);
  redirect(`/${locale}/internal`);
}

export async function logoutAction(locale: string) {
  await destroyCurrentSession();
  redirect(`/${locale}/internal/login`);
}

export interface ChangePwState {
  error?: "mismatch" | "weak" | "invalid";
}

export async function changePasswordAction(
  locale: string,
  _prev: ChangePwState,
  formData: FormData,
): Promise<ChangePwState> {
  const employee = await actor();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next !== confirm) return { error: "mismatch" };
  const result = await changeOwnPassword(employee.id, current, next);
  if (!result.ok) return { error: result.reason === "weak" ? "weak" : "invalid" };
  await createSession(employee.id); // fresh session after revoke
  redirect(`/${locale}/internal`);
}

/* ---------------- Cases ---------------- */

export async function createCaseAction(locale: string, formData: FormData) {
  const employee = await operationalActor(locale);
  const created = await createCase(employee, {
    title: s(formData, "title"),
    summary: s(formData, "summary"),
    source: s(formData, "source") as never,
    organizationId: s(formData, "organizationId") || null,
    requestType: s(formData, "requestType") || null,
    primaryPlatformId: s(formData, "platform") || null,
    primaryValueChainId: s(formData, "chain") || null,
    forumParticipationPathId: s(formData, "participant") || null,
    forumSectorTrackId: s(formData, "track") || null,
    priority: (s(formData, "priority") || "NORMAL") as never,
    classification: (s(formData, "classification") || "INTERNAL") as never,
    pilotDataCategory: s(formData, "pilotDataCategory") || "SYNTHETIC",
  });
  redirect(`/${locale}/internal/cases/${created.id}`);
}

export async function transitionAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  try {
    await transitionCase(
      employee,
      caseId,
      s(formData, "to"),
      Number(formData.get("version")),
      s(formData, "closureReason") || null,
    );
  } catch (error) {
    if (error instanceof ConcurrencyError) {
      redirect(`/${locale}/internal/cases/${caseId}?conflict=1`);
    }
    throw error;
  }
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function assignOwnerAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await assignOwner(employee, caseId, s(formData, "ownerId"));
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function addReviewerAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await addReviewer(employee, caseId, s(formData, "reviewerId"));
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function addNoteAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await addNote(employee, caseId, {
    noteType: s(formData, "noteType") || "GENERAL",
    classification: s(formData, "classification") || "INTERNAL",
    body: s(formData, "body"),
  });
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

/* ---------------- Records ---------------- */

export async function createGapAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await createGap(employee, caseId, {
    category: s(formData, "category"),
    title: s(formData, "title"),
    description: s(formData, "description"),
  });
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function resolveGapAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await resolveGap(employee, s(formData, "gapId"), s(formData, "status") as never, s(formData, "resolutionNote"));
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function createEvidenceAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await createEvidenceReference(employee, caseId, {
    title: s(formData, "title"),
    evidenceType: s(formData, "evidenceType"),
    sourceOrganization: s(formData, "sourceOrganization"),
    locationNote: s(formData, "locationNote"),
    classification: s(formData, "classification") || "INTERNAL",
  });
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function qualRecommendAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  const criteria: Record<string, string> = {};
  for (const key of [
    "organizationIdentity",
    "representativeAuthority",
    "statedPurpose",
    "informationCompleteness",
    "evidenceAvailability",
    "regulatoryOrRiskConcern",
  ]) {
    const value = s(formData, key);
    if (value) criteria[key] = value;
  }
  await submitQualificationRecommendation(employee, caseId, {
    criteria,
    recommendation: s(formData, "recommendation"),
  });
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function qualApproveAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await approveQualificationOutcome(employee, s(formData, "reviewId"), s(formData, "outcome"));
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function meetingPrepAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await createMeetingPreparation(employee, caseId, {
    title: s(formData, "title"),
    meetingType: s(formData, "meetingType") || "INTERNAL_REVIEW",
    purpose: s(formData, "purpose"),
    participantCategories: s(formData, "participantCategories"),
    keyQuestions: s(formData, "keyQuestions"),
    decisionsSought: s(formData, "decisionsSought"),
    expectedOutcome: s(formData, "expectedOutcome"),
  });
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function meetingRecordAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await createMeetingRecord(employee, caseId, {
    summary: s(formData, "summary"),
    internalAttendees: s(formData, "internalAttendees"),
    externalParticipantCategories: s(formData, "externalParticipantCategories"),
    proposedNextSteps: s(formData, "proposedNextSteps"),
  });
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function decisionProposeAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await proposeDecision(employee, caseId, {
    title: s(formData, "title"),
    decisionType: s(formData, "decisionType"),
    recommendation: s(formData, "recommendation"),
    rationale: s(formData, "rationale"),
  });
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function decisionResolveAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await resolveDecision(employee, s(formData, "decisionId"), s(formData, "outcome") as never);
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function commitmentCreateAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  await createCommitment(employee, caseId, {
    title: s(formData, "title"),
    description: s(formData, "description"),
    internalOwnerId: s(formData, "internalOwnerId") || null,
  });
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

export async function commitmentUpdateAction(locale: string, formData: FormData) {
  const caseId = s(formData, "caseId");
  const employee = await requireCaseAccess(locale, caseId);
  try {
    await updateCommitmentStatus(
      employee,
      s(formData, "commitmentId"),
      s(formData, "status"),
      Number(formData.get("version")),
      s(formData, "completionNote"),
    );
  } catch (error) {
    if (error instanceof ConcurrencyError) {
      redirect(`/${locale}/internal/cases/${caseId}?conflict=1`);
    }
    throw error;
  }
  revalidatePath(`/${locale}/internal/cases/${caseId}`);
}

/* ---------------- Organizations ---------------- */

export async function createOrgAction(locale: string, formData: FormData) {
  const employee = await operationalActor(locale);
  const id = await createOrganization(employee, {
    workingName: s(formData, "workingName"),
    legalName: s(formData, "legalName"),
    organizationType: s(formData, "organizationType"),
    country: s(formData, "country"),
    officialEmail: s(formData, "officialEmail"),
    officialWebsite: s(formData, "officialWebsite"),
    operationalNotes: s(formData, "operationalNotes"),
  });
  redirect(`/${locale}/internal/organizations/${id}`);
}

export async function createContactAction(locale: string, formData: FormData) {
  const employee = await operationalActor(locale);
  const organizationId = s(formData, "organizationId");
  await createContact(employee, organizationId, {
    fullName: s(formData, "fullName"),
    professionalRole: s(formData, "professionalRole"),
    professionalEmail: s(formData, "professionalEmail"),
    preferredLanguage: s(formData, "preferredLanguage"),
  });
  revalidatePath(`/${locale}/internal/organizations/${organizationId}`);
}

export async function orgVerifyAction(locale: string, formData: FormData) {
  const employee = await operationalActor(locale);
  const id = s(formData, "organizationId");
  await updateOrganizationVerification(employee, id, s(formData, "verificationStatus"), Number(formData.get("version")));
  revalidatePath(`/${locale}/internal/organizations/${id}`);
}

export async function orgArchiveAction(locale: string, formData: FormData) {
  const employee = await operationalActor(locale);
  const id = s(formData, "organizationId");
  await archiveOrganization(employee, id, Number(formData.get("version")));
  revalidatePath(`/${locale}/internal/organizations/${id}`);
}

/* ---------------- User administration ---------------- */

export interface AdminUserState {
  error?: string;
  ok?: string;
}

export async function adminCreateUserAction(
  locale: string,
  _prev: AdminUserState,
  formData: FormData,
): Promise<AdminUserState> {
  const employee = await actor();
  assertCan(employee, "user.manage");
  try {
    await createEmployeeAccount(
      {
        email: s(formData, "email"),
        displayName: s(formData, "name"),
        role: s(formData, "role"),
        password: String(formData.get("password") ?? ""),
      },
      employee.id,
    );
  } catch (error) {
    if (error instanceof UserServiceError) return { error: error.message };
    throw error;
  }
  revalidatePath(`/${locale}/internal/admin/users`);
  return { ok: "created" };
}

export async function adminDisableUserAction(locale: string, formData: FormData) {
  const employee = await actor();
  assertCan(employee, "user.manage");
  await disableEmployeeAccount(s(formData, "userId"), employee.id);
  revalidatePath(`/${locale}/internal/admin/users`);
}

export async function adminResetPwAction(
  locale: string,
  _prev: AdminUserState,
  formData: FormData,
): Promise<AdminUserState> {
  const employee = await actor();
  assertCan(employee, "user.manage");
  try {
    await resetEmployeePassword(s(formData, "userId"), String(formData.get("password") ?? ""), employee.id);
  } catch (error) {
    if (error instanceof UserServiceError) return { error: error.message };
    throw error;
  }
  revalidatePath(`/${locale}/internal/admin/users`);
  return { ok: "reset" };
}
