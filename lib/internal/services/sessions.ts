import { prisma } from "../db";
import { audit } from "../audit";
import { revokeAllSessions, revokeSessionById } from "../session-store";
import { assertCan, type CurrentEmployee } from "../authz";

/**
 * P4-B session administration (§11). Authorized users can view active sessions
 * for a selected employee and revoke one or all of them. Only privacy-minimized
 * attributes are ever returned — never a raw token, token hash, IP address, or
 * full user-agent string. Every revocation is audited.
 */

export class SessionAdminError extends Error {}

/** Active (non-revoked, non-expired) sessions for an employee — minimized. */
export async function listActiveSessions(actor: CurrentEmployee, employeeId: string) {
  assertCan(actor, "session.admin");
  const now = new Date();
  const rows = await prisma.session.findMany({
    where: { employeeId, revokedAt: null, absoluteExpiry: { gt: now }, idleExpiry: { gt: now } },
    select: {
      id: true,
      createdAt: true,
      lastActivityAt: true,
      absoluteExpiry: true,
      idleExpiry: true,
      deviceLabel: true,
      stepUpVerifiedAt: true,
    },
    orderBy: { lastActivityAt: "desc" },
  });
  return rows;
}

/** Revoke a single session (session administration). */
export async function adminRevokeSession(
  actor: CurrentEmployee,
  sessionId: string,
): Promise<void> {
  assertCan(actor, "session.admin");
  const revoked = await revokeSessionById(sessionId);
  await audit({
    actorEmployeeId: actor.id,
    action: "SESSION_REVOKED",
    entityType: "Session",
    entityId: sessionId,
    summary: revoked ? "Session revoked by administrator" : "Session already inactive",
  });
}

/** Revoke every active session for an employee (step-up enforced at action layer). */
export async function adminRevokeAllSessions(
  actor: CurrentEmployee,
  employeeId: string,
): Promise<number> {
  assertCan(actor, "session.admin");
  const count = await revokeAllSessions(employeeId);
  await audit({
    actorEmployeeId: actor.id,
    action: "SESSION_REVOKED_ALL",
    entityType: "Employee",
    entityId: employeeId,
    summary: `All sessions revoked by administrator (${count})`,
  });
  return count;
}

/**
 * Employee-facing "sign out all my other sessions" (§11). Revokes every active
 * session for the current employee except the one identified by keepSessionId.
 */
export async function signOutOtherSessions(
  employee: CurrentEmployee,
  keepSessionId: string,
): Promise<number> {
  const result = await prisma.session.updateMany({
    where: { employeeId: employee.id, revokedAt: null, id: { not: keepSessionId } },
    data: { revokedAt: new Date() },
  });
  await audit({
    actorEmployeeId: employee.id,
    action: "SESSION_SELF_REVOKE_OTHERS",
    entityType: "Employee",
    entityId: employee.id,
    summary: `Employee signed out other sessions (${result.count})`,
  });
  return result.count;
}
