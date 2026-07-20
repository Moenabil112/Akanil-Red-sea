import { prisma } from "../db";
import { audit } from "../audit";
import { recordSecurityEvent } from "../security-events";
import { revokeAllSessions } from "../session-store";
import { assertCan, type CurrentEmployee } from "../authz";
import { isEmployeeRole } from "../roles";
import { pilotConfig } from "../env";
import type { EmployeeRole } from "../roles";

/**
 * P4-B pilot-cohort control (§6), two-person privileged access-change process
 * (§7) and periodic access review (§10). Every function enforces default-deny
 * authorization plus explicit separation of duties: a requester can never
 * approve, a target can never approve their own change, and a reviewer can
 * never review their own access. Records are never deleted; every change
 * produces an audit event.
 *
 * Step-up reauthentication for sensitive approvals/applications is enforced at
 * the server-action layer (which holds the session); services assume the
 * caller has already satisfied it and additionally re-check authorization.
 */

export class AccessGovernanceError extends Error {}

const ACCESS_CHANGE_TTL_DAYS = 14;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 86_400_000);
}

// ---------------- Pilot access (§6) ----------------

export async function requestPilotAccess(
  actor: CurrentEmployee,
  input: { employeeId: string; approvedRole: string; justification: string },
): Promise<string> {
  assertCan(actor, "pilot.request");
  if (!isEmployeeRole(input.approvedRole)) {
    throw new AccessGovernanceError("Unknown role for pilot access.");
  }
  if (!input.justification?.trim()) {
    throw new AccessGovernanceError("A justification is required.");
  }
  const employee = await prisma.employee.findUnique({ where: { id: input.employeeId } });
  if (!employee) throw new AccessGovernanceError("Employee not found.");
  // The employee must already be ACTIVE — an account alone is not enough.
  if (employee.status !== "ACTIVE" || employee.lifecycleStage !== "ACTIVE") {
    throw new AccessGovernanceError("Employee must be ACTIVE to receive pilot access.");
  }
  const created = await prisma.pilotAccess.create({
    data: {
      employeeId: employee.id,
      approvedRole: input.approvedRole as EmployeeRole,
      justification: input.justification.trim(),
      requestedById: actor.id,
      status: "REQUESTED",
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_ACCESS_REQUESTED",
    entityType: "PilotAccess",
    entityId: created.id,
    summary: `Pilot access requested for ${employee.email} as ${input.approvedRole}`,
  });
  return created.id;
}

export async function approvePilotAccess(
  actor: CurrentEmployee,
  pilotAccessId: string,
  input: { days?: number } = {},
): Promise<void> {
  assertCan(actor, "pilot.approve");
  const record = await prisma.pilotAccess.findUnique({ where: { id: pilotAccessId } });
  if (!record) throw new AccessGovernanceError("Pilot-access request not found.");
  if (record.status !== "REQUESTED") {
    throw new AccessGovernanceError("Only a REQUESTED pilot access can be approved.");
  }
  // Separation of duties: the requester and the target can never approve.
  if (actor.id === record.requestedById) {
    throw new AccessGovernanceError("The requester cannot approve pilot access.");
  }
  if (actor.id === record.employeeId) {
    throw new AccessGovernanceError("An employee cannot approve their own pilot access.");
  }
  // A SYSTEM_ADMIN-role grant requires an approver who is SYSTEM_ADMIN or
  // OPERATIONS_MANAGER (both hold pilot.approve; enforce explicitly).
  if (
    record.approvedRole === "SYSTEM_ADMIN" &&
    actor.role !== "SYSTEM_ADMIN" &&
    actor.role !== "OPERATIONS_MANAGER"
  ) {
    throw new AccessGovernanceError(
      "SYSTEM_ADMIN pilot access must be approved by a SYSTEM_ADMIN or OPERATIONS_MANAGER.",
    );
  }
  const max = pilotConfig.accessMaxDays;
  const requested = input.days && input.days > 0 ? input.days : max;
  const days = Math.min(requested, max); // no indefinite access; capped duration
  const now = new Date();
  await prisma.pilotAccess.update({
    where: { id: record.id },
    data: {
      status: "ACTIVE",
      approvedById: actor.id,
      startsAt: now,
      expiresAt: new Date(now.getTime() + days * 86_400_000),
      recordVersion: { increment: 1 },
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_ACCESS_APPROVED",
    entityType: "PilotAccess",
    entityId: record.id,
    summary: `Pilot access approved for ${days} day(s)`,
  });
}

export async function suspendPilotAccess(
  actor: CurrentEmployee,
  pilotAccessId: string,
  reason: string,
): Promise<void> {
  assertCan(actor, "pilot.approve");
  const record = await prisma.pilotAccess.findUnique({ where: { id: pilotAccessId } });
  if (!record) throw new AccessGovernanceError("Pilot-access record not found.");
  await prisma.pilotAccess.update({
    where: { id: record.id },
    data: { status: "SUSPENDED", suspendedAt: new Date(), recordVersion: { increment: 1 } },
  });
  const revoked = await revokeAllSessions(record.employeeId);
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_ACCESS_SUSPENDED",
    entityType: "PilotAccess",
    entityId: record.id,
    summary: `Pilot access suspended (${revoked} session(s) revoked)`,
  });
  await recordSecurityEvent({
    category: "PILOT_ACCESS_SUSPENDED",
    severity: "MEDIUM",
    actorEmployeeId: actor.id,
    subjectType: "PilotAccess",
    subjectId: record.id,
    summary: reason?.trim() || "Pilot access suspended",
  });
}

export async function revokePilotAccess(
  actor: CurrentEmployee,
  pilotAccessId: string,
  reason: string,
): Promise<void> {
  assertCan(actor, "pilot.approve");
  const record = await prisma.pilotAccess.findUnique({ where: { id: pilotAccessId } });
  if (!record) throw new AccessGovernanceError("Pilot-access record not found.");
  await prisma.pilotAccess.update({
    where: { id: record.id },
    data: { status: "REVOKED", revokedAt: new Date(), recordVersion: { increment: 1 } },
  });
  // Revocation invalidates all active sessions immediately.
  const revoked = await revokeAllSessions(record.employeeId);
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_ACCESS_REVOKED",
    entityType: "PilotAccess",
    entityId: record.id,
    summary: `Pilot access revoked (${revoked} session(s) revoked): ${reason?.trim() || "no reason given"}`,
  });
}

/** Mark expired pilot-access rows EXPIRED (housekeeping; live checks also enforce expiry). */
export async function markExpiredPilotAccess(now: Date = new Date()): Promise<number> {
  const result = await prisma.pilotAccess.updateMany({
    where: {
      status: { in: ["APPROVED", "ACTIVE"] },
      expiresAt: { lt: now },
      suspendedAt: null,
      revokedAt: null,
    },
    data: { status: "EXPIRED" },
  });
  return result.count;
}

// ---------------- Access-change requests (§7) ----------------

const ROLE_CHANGE_TYPES = new Set(["CHANGE_ROLE"]);

export async function createAccessChangeRequest(
  actor: CurrentEmployee,
  input: {
    targetEmployeeId: string;
    changeType: string;
    proposedRole?: string | null;
    justification: string;
  },
): Promise<string> {
  assertCan(actor, "access.change.request");
  if (!input.justification?.trim()) {
    throw new AccessGovernanceError("A justification is required.");
  }
  const target = await prisma.employee.findUnique({ where: { id: input.targetEmployeeId } });
  if (!target) throw new AccessGovernanceError("Target employee not found.");
  if (ROLE_CHANGE_TYPES.has(input.changeType)) {
    if (!input.proposedRole || !isEmployeeRole(input.proposedRole)) {
      throw new AccessGovernanceError("A valid proposed role is required for a role change.");
    }
  }
  const created = await prisma.accessChangeRequest.create({
    data: {
      targetEmployeeId: target.id,
      changeType: input.changeType as never,
      currentRole: target.role,
      proposedRole: (input.proposedRole as EmployeeRole | null) ?? null,
      requestedById: actor.id,
      justification: input.justification.trim(),
      status: "PENDING_APPROVAL",
      expiresAt: daysFromNow(ACCESS_CHANGE_TTL_DAYS),
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "ACCESS_CHANGE_REQUESTED",
    entityType: "AccessChangeRequest",
    entityId: created.id,
    summary: `Access change requested (${input.changeType}) for ${target.email}`,
  });
  return created.id;
}

function assertChangeSeparation(actor: CurrentEmployee, record: {
  requestedById: string;
  targetEmployeeId: string;
}): void {
  if (actor.id === record.requestedById) {
    throw new AccessGovernanceError("The requester cannot approve or apply their own request.");
  }
  if (actor.id === record.targetEmployeeId) {
    throw new AccessGovernanceError("The target employee cannot approve or apply their own change.");
  }
}

export async function approveAccessChangeRequest(
  actor: CurrentEmployee,
  requestId: string,
): Promise<void> {
  assertCan(actor, "access.change.approve");
  const record = await prisma.accessChangeRequest.findUnique({ where: { id: requestId } });
  if (!record) throw new AccessGovernanceError("Access-change request not found.");
  if (record.status !== "PENDING_APPROVAL") {
    throw new AccessGovernanceError("Only a pending request can be approved.");
  }
  if (record.expiresAt && record.expiresAt < new Date()) {
    throw new AccessGovernanceError("This request has expired.");
  }
  assertChangeSeparation(actor, record);
  await prisma.accessChangeRequest.update({
    where: { id: record.id },
    data: { status: "APPROVED", approvedById: actor.id, decidedAt: new Date(), recordVersion: { increment: 1 } },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "ACCESS_CHANGE_APPROVED",
    entityType: "AccessChangeRequest",
    entityId: record.id,
    summary: `Access change approved (${record.changeType})`,
  });
}

export async function rejectAccessChangeRequest(
  actor: CurrentEmployee,
  requestId: string,
): Promise<void> {
  assertCan(actor, "access.change.approve");
  const record = await prisma.accessChangeRequest.findUnique({ where: { id: requestId } });
  if (!record) throw new AccessGovernanceError("Access-change request not found.");
  if (record.status !== "PENDING_APPROVAL") {
    throw new AccessGovernanceError("Only a pending request can be rejected.");
  }
  assertChangeSeparation(actor, record);
  await prisma.accessChangeRequest.update({
    where: { id: record.id },
    data: { status: "REJECTED", approvedById: actor.id, decidedAt: new Date(), recordVersion: { increment: 1 } },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "ACCESS_CHANGE_REJECTED",
    entityType: "AccessChangeRequest",
    entityId: record.id,
    summary: `Access change rejected (${record.changeType})`,
  });
}

/**
 * Apply an APPROVED access change. Role changes and account state changes are
 * never applied until approved (§7). Requester/target can never apply. Step-up
 * is enforced at the action layer. Password/pilot-specific changes are handled
 * by their dedicated flows; here we apply role and account-state changes.
 */
export async function applyAccessChangeRequest(
  actor: CurrentEmployee,
  requestId: string,
): Promise<void> {
  assertCan(actor, "access.change.approve");
  const record = await prisma.accessChangeRequest.findUnique({ where: { id: requestId } });
  if (!record) throw new AccessGovernanceError("Access-change request not found.");
  if (record.status !== "APPROVED") {
    throw new AccessGovernanceError("Only an approved request can be applied.");
  }
  if (record.expiresAt && record.expiresAt < new Date()) {
    throw new AccessGovernanceError("This request has expired.");
  }
  assertChangeSeparation(actor, record);

  switch (record.changeType) {
    case "CHANGE_ROLE": {
      if (!record.proposedRole) throw new AccessGovernanceError("No proposed role recorded.");
      await prisma.employee.update({
        where: { id: record.targetEmployeeId },
        data: { role: record.proposedRole },
      });
      break;
    }
    case "ENABLE_ACCOUNT": {
      await prisma.employee.update({
        where: { id: record.targetEmployeeId },
        data: { status: "ACTIVE", lifecycleStage: "ACTIVE", disabledAt: null },
      });
      break;
    }
    case "DISABLE_ACCOUNT": {
      await prisma.employee.update({
        where: { id: record.targetEmployeeId },
        data: { status: "DISABLED", lifecycleStage: "DISABLED", disabledAt: new Date() },
      });
      await revokeAllSessions(record.targetEmployeeId);
      break;
    }
    case "REVOKE_SESSIONS": {
      await revokeAllSessions(record.targetEmployeeId);
      break;
    }
    default:
      // GRANT/SUSPEND/REVOKE_PILOT_ACCESS, RESET_PASSWORD and
      // CREATE_EMPLOYEE_ACCESS record the approval; their dedicated flows
      // perform the concrete action with the required inputs.
      break;
  }

  await prisma.accessChangeRequest.update({
    where: { id: record.id },
    data: { status: "APPLIED", appliedAt: new Date(), recordVersion: { increment: 1 } },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "ACCESS_CHANGE_APPLIED",
    entityType: "AccessChangeRequest",
    entityId: record.id,
    summary: `Access change applied (${record.changeType})`,
    changedFields: { changeType: record.changeType, proposedRole: record.proposedRole },
  });
}

/** Expire stale pending access-change requests (housekeeping). */
export async function expireStaleAccessChanges(now: Date = new Date()): Promise<number> {
  const result = await prisma.accessChangeRequest.updateMany({
    where: { status: "PENDING_APPROVAL", expiresAt: { lt: now } },
    data: { status: "EXPIRED" },
  });
  return result.count;
}

// ---------------- Access reviews (§10) ----------------

async function accessSnapshot(employeeId: string) {
  const now = new Date();
  const [activeSessionCount, openCaseCount, openCommitmentCount, pilot] = await Promise.all([
    prisma.session.count({
      where: { employeeId, revokedAt: null, absoluteExpiry: { gt: now }, idleExpiry: { gt: now } },
    }),
    prisma.case.count({ where: { currentOwnerId: employeeId, status: { not: "CLOSED" } } }),
    prisma.commitment.count({
      where: { internalOwnerId: employeeId, status: { notIn: ["COMPLETED", "CANCELLED"] } },
    }),
    prisma.pilotAccess.findFirst({ where: { employeeId }, orderBy: { createdAt: "desc" } }),
  ]);
  return { activeSessionCount, openCaseCount, openCommitmentCount, pilotStatus: pilot?.status ?? null };
}

export async function createAccessReview(
  actor: CurrentEmployee,
  input: { employeeId: string; reviewPeriodStart: Date; reviewPeriodEnd: Date },
): Promise<string> {
  assertCan(actor, "access.review.conduct");
  const employee = await prisma.employee.findUnique({ where: { id: input.employeeId } });
  if (!employee) throw new AccessGovernanceError("Employee not found.");
  const snap = await accessSnapshot(employee.id);
  const created = await prisma.accessReview.create({
    data: {
      employeeId: employee.id,
      currentRole: employee.role,
      reviewPeriodStart: input.reviewPeriodStart,
      reviewPeriodEnd: input.reviewPeriodEnd,
      pilotAccessStatus: snap.pilotStatus as never,
      activeSessionCount: snap.activeSessionCount,
      openCaseCount: snap.openCaseCount,
      openCommitmentCount: snap.openCommitmentCount,
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "ACCESS_REVIEW_OPENED",
    entityType: "AccessReview",
    entityId: created.id,
    summary: `Access review opened for ${employee.email}`,
  });
  return created.id;
}

export async function conductAccessReview(
  actor: CurrentEmployee,
  reviewId: string,
  input: { outcome: string; rationale: string },
): Promise<void> {
  assertCan(actor, "access.review.conduct");
  const review = await prisma.accessReview.findUnique({ where: { id: reviewId } });
  if (!review) throw new AccessGovernanceError("Access review not found.");
  if (review.reviewedAt) throw new AccessGovernanceError("This review is already completed.");
  // A reviewer can never review their own access.
  if (actor.id === review.employeeId) {
    throw new AccessGovernanceError("An employee cannot review their own access.");
  }
  const validOutcomes = new Set(["RETAIN", "MODIFY", "SUSPEND", "REVOKE", "FURTHER_REVIEW_REQUIRED"]);
  if (!validOutcomes.has(input.outcome)) {
    throw new AccessGovernanceError("Unknown review outcome.");
  }
  if (!input.rationale?.trim()) {
    throw new AccessGovernanceError("A rationale is required.");
  }
  const now = new Date();
  const nextDue = new Date(now.getTime() + pilotConfig.accessReviewDays * 86_400_000);
  await prisma.accessReview.update({
    where: { id: review.id },
    data: {
      outcome: input.outcome as never,
      rationale: input.rationale.trim(),
      reviewerId: actor.id,
      reviewedAt: now,
      nextReviewDueAt: nextDue,
    },
  });
  await prisma.employee.update({
    where: { id: review.employeeId },
    data: { lastAccessReviewAt: now, accessReviewDueAt: nextDue },
  });

  // An outcome never silently changes access: MODIFY/SUSPEND/REVOKE produces an
  // AccessChangeRequest for independent approval.
  if (input.outcome === "MODIFY" || input.outcome === "SUSPEND" || input.outcome === "REVOKE") {
    const changeType =
      input.outcome === "MODIFY"
        ? "CHANGE_ROLE"
        : input.outcome === "SUSPEND"
          ? "REVOKE_SESSIONS"
          : "DISABLE_ACCOUNT";
    await createAccessChangeRequest(actor, {
      targetEmployeeId: review.employeeId,
      changeType,
      // For a MODIFY, seed the proposed role with the current role; the
      // approver adjusts it. Never a silent change — approval is still required.
      proposedRole: changeType === "CHANGE_ROLE" ? review.currentRole : null,
      justification: `Access review outcome ${input.outcome}: ${input.rationale.trim()}`,
    });
  }

  await audit({
    actorEmployeeId: actor.id,
    action: "ACCESS_REVIEW_COMPLETED",
    entityType: "AccessReview",
    entityId: review.id,
    summary: `Access review completed (${input.outcome})`,
  });
}
