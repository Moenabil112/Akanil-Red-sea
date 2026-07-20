import { prisma } from "../db";
import { audit } from "../audit";
import { revokeAllSessions } from "../session-store";
import { assertCan, type CurrentEmployee } from "../authz";

/**
 * P4-B controlled employee lifecycle and offboarding (§9). Offboarding blocks
 * new login, revokes sessions, suspends pilot access, prevents new
 * assignments, and requires open case ownership to be reassigned before it can
 * complete. Authored records and audit attribution are ALWAYS preserved — an
 * employee record is never deleted and historical authorship is never
 * reassigned.
 */

export class LifecycleError extends Error {}

/** Open-work snapshot used by the offboarding checklist. */
export async function offboardingReadiness(employeeId: string) {
  const now = new Date();
  const [openCases, openCommitments, activeSessions, pilot] = await Promise.all([
    prisma.case.findMany({
      where: { currentOwnerId: employeeId, status: { not: "CLOSED" } },
      select: { id: true, internalReference: true, title: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.commitment.findMany({
      where: { internalOwnerId: employeeId, status: { notIn: ["COMPLETED", "CANCELLED"] } },
      select: { id: true, title: true, status: true, caseId: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.session.count({
      where: { employeeId, revokedAt: null, absoluteExpiry: { gt: now }, idleExpiry: { gt: now } },
    }),
    prisma.pilotAccess.findFirst({ where: { employeeId }, orderBy: { createdAt: "desc" } }),
  ]);
  return { openCases, openCommitments, activeSessions, pilotStatus: pilot?.status ?? null };
}

/** Record governance metadata for an employee (purpose, justification, dates). */
export async function updateEmployeeGovernance(
  actor: CurrentEmployee,
  employeeId: string,
  input: {
    accessPurpose?: string | null;
    roleJustification?: string | null;
    approvingManagerId?: string | null;
    accessStartsAt?: Date | null;
    accessReviewDueAt?: Date | null;
  },
): Promise<void> {
  assertCan(actor, "employee.lifecycle");
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) throw new LifecycleError("Employee not found.");
  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      accessPurpose: input.accessPurpose ?? employee.accessPurpose,
      roleJustification: input.roleJustification ?? employee.roleJustification,
      approvingManagerId: input.approvingManagerId ?? employee.approvingManagerId,
      accessStartsAt: input.accessStartsAt ?? employee.accessStartsAt,
      accessReviewDueAt: input.accessReviewDueAt ?? employee.accessReviewDueAt,
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "EMPLOYEE_GOVERNANCE_UPDATED",
    entityType: "Employee",
    entityId: employeeId,
    summary: "Employee access-governance metadata updated",
  });
}

/**
 * Begin offboarding: block new login (lifecycle OFFBOARDING), revoke sessions,
 * suspend pilot access. Open cases remain until reassigned; completion is
 * gated separately.
 */
export async function beginOffboarding(
  actor: CurrentEmployee,
  employeeId: string,
  reason: string,
): Promise<void> {
  assertCan(actor, "employee.lifecycle");
  if (actor.id === employeeId) {
    throw new LifecycleError("An employee cannot offboard themselves.");
  }
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) throw new LifecycleError("Employee not found.");
  if (!reason?.trim()) throw new LifecycleError("An offboarding reason is required.");

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      lifecycleStage: "OFFBOARDING",
      offboardingReason: reason.trim(),
      offboardingStartedAt: new Date(),
    },
  });
  const revoked = await revokeAllSessions(employeeId);
  // Suspend any active pilot access.
  await prisma.pilotAccess.updateMany({
    where: { employeeId, status: { in: ["APPROVED", "ACTIVE"] }, revokedAt: null },
    data: { status: "SUSPENDED", suspendedAt: new Date() },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "EMPLOYEE_OFFBOARDING_STARTED",
    entityType: "Employee",
    entityId: employeeId,
    summary: `Offboarding started (${revoked} session(s) revoked; pilot access suspended)`,
  });
}

/**
 * Complete offboarding. Requires all open case ownership to have been
 * reassigned first (no open case may still be owned by the employee). Sets the
 * account DISABLED and records the auditable completion. Never deletes the
 * employee record or reassigns historical authorship.
 */
export async function completeOffboarding(
  actor: CurrentEmployee,
  employeeId: string,
): Promise<void> {
  assertCan(actor, "employee.lifecycle");
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) throw new LifecycleError("Employee not found.");
  if (employee.lifecycleStage !== "OFFBOARDING") {
    throw new LifecycleError("Offboarding has not been started for this employee.");
  }
  const openOwned = await prisma.case.count({
    where: { currentOwnerId: employeeId, status: { not: "CLOSED" } },
  });
  if (openOwned > 0) {
    throw new LifecycleError(
      `Reassign ${openOwned} open case(s) before completing offboarding.`,
    );
  }
  const now = new Date();
  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      status: "DISABLED",
      lifecycleStage: "DISABLED",
      disabledAt: now,
      offboardingCompletedAt: now,
      sessionsRevokedConfirmedAt: now,
      casesReassignedConfirmedAt: now,
    },
  });
  await revokeAllSessions(employeeId);
  await prisma.pilotAccess.updateMany({
    where: { employeeId, status: { notIn: ["REVOKED", "EXPIRED"] } },
    data: { status: "REVOKED", revokedAt: now },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "EMPLOYEE_OFFBOARDING_COMPLETED",
    entityType: "Employee",
    entityId: employeeId,
    summary: "Offboarding completed; account disabled; authorship preserved",
  });
}
