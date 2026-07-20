import "server-only";
import { prisma } from "./db";
import { verifyPassword, hashPassword, checkPasswordPolicy } from "./password";
import { loginConfig } from "./env";
import { audit } from "./audit";
import { createSession, revokeAllSessions } from "./session";
import { recordSecurityEvent } from "./security-events";

/**
 * Employee-only authentication (P4-A §6/§7). No self-registration, no
 * external invitations, no social login, no password-reset email. Errors
 * are generic and never reveal whether an email exists. Failed attempts
 * count toward a temporary lock; success resets the counter.
 */

// A valid Argon2id hash of a throwaway string (not a secret). Verifying
// against it on the no-such-user path keeps timing uniform so the response
// does not reveal whether an email exists.
const TIMING_DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$H5aD9VG2c7xmwSWJdQcQLw$eghSG7vXld0zAmxq3f6w61bxnO4aMa6IhBlsTzQkVkc";

export type LoginResult =
  | { ok: true; mustChangePassword: boolean }
  | { ok: false };

/** Attempt an employee login. Always returns a generic failure on error. */
export async function login(
  emailRaw: string,
  password: string,
): Promise<LoginResult> {
  const email = emailRaw.trim().toLowerCase();
  const employee = await prisma.employee.findUnique({ where: { email } });

  if (!employee) {
    // Burn comparable time; never disclose non-existence.
    await verifyPassword(TIMING_DUMMY_HASH, password);
    return { ok: false };
  }

  const now = new Date();

  // Disabled accounts can never log in (generic failure).
  if (employee.status === "DISABLED") {
    await verifyPassword(TIMING_DUMMY_HASH, password);
    return { ok: false };
  }

  // Suspended / offboarding / disabled lifecycle stages block login (§9).
  if (
    employee.lifecycleStage === "SUSPENDED" ||
    employee.lifecycleStage === "OFFBOARDING" ||
    employee.lifecycleStage === "DISABLED"
  ) {
    await verifyPassword(TIMING_DUMMY_HASH, password);
    return { ok: false };
  }

  // Locked and still within the lock window.
  if (
    employee.status === "LOCKED" &&
    employee.lockedUntil &&
    employee.lockedUntil > now
  ) {
    await verifyPassword(TIMING_DUMMY_HASH, password);
    return { ok: false };
  }

  const valid = await verifyPassword(employee.passwordHash, password);

  if (!valid) {
    const failures = employee.failedLoginCount + 1;
    const shouldLock = failures >= loginConfig.maxFailures;
    await prisma.employee.update({
      where: { id: employee.id },
      data: {
        failedLoginCount: shouldLock ? 0 : failures,
        ...(shouldLock
          ? {
              status: "LOCKED",
              lockedUntil: new Date(now.getTime() + loginConfig.lockMinutes * 60_000),
            }
          : {}),
      },
    });
    await audit({
      actorEmployeeId: employee.id,
      action: shouldLock ? "AUTH_ACCOUNT_LOCKED" : "AUTH_LOGIN_FAILURE",
      entityType: "Employee",
      entityId: employee.id,
      summary: shouldLock
        ? "Account locked after repeated failed logins"
        : "Failed login attempt",
    });
    return { ok: false };
  }

  // Success: clear failure state, auto-unlock an expired lock, stamp login.
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      failedLoginCount: 0,
      lockedUntil: null,
      status: "ACTIVE",
      lastLoginAt: now,
    },
  });
  await createSession(employee.id);
  await audit({
    actorEmployeeId: employee.id,
    action: "AUTH_LOGIN_SUCCESS",
    entityType: "Employee",
    entityId: employee.id,
    summary: "Successful login",
  });
  return { ok: true, mustChangePassword: employee.mustChangePassword };
}

/**
 * Step-up reauthentication (P4-B §8). Verifies the employee's password
 * server-side for a sensitive action. The password is never stored. A failure
 * is generic and is recorded as a REAUTHENTICATION_FAILURE security event for
 * monitoring. The caller stamps the current session on success.
 */
export async function reauthenticate(
  employeeId: string,
  password: string,
): Promise<boolean> {
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee || employee.status !== "ACTIVE") {
    await verifyPassword(TIMING_DUMMY_HASH, password);
    return false;
  }
  const valid = await verifyPassword(employee.passwordHash, password);
  if (!valid) {
    await recordSecurityEvent({
      category: "REAUTHENTICATION_FAILURE",
      severity: "MEDIUM",
      actorEmployeeId: employee.id,
      subjectType: "Employee",
      subjectId: employee.id,
      summary: "Step-up reauthentication failed",
    });
    return false;
  }
  await audit({
    actorEmployeeId: employee.id,
    action: "AUTH_STEP_UP_SUCCESS",
    entityType: "Employee",
    entityId: employee.id,
    summary: "Step-up reauthentication succeeded",
  });
  return true;
}

export type ChangePasswordResult =
  | { ok: true }
  | { ok: false; reason: "invalid-current" | "weak" };

/**
 * Change the current employee's password (used for the forced first-login
 * change). Verifies the current password, enforces the strength policy,
 * hashes with Argon2id, clears mustChangePassword, and revokes all other
 * sessions. The caller re-establishes a fresh session.
 */
export async function changeOwnPassword(
  employeeId: string,
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResult> {
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) return { ok: false, reason: "invalid-current" };

  const valid = await verifyPassword(employee.passwordHash, currentPassword);
  if (!valid) return { ok: false, reason: "invalid-current" };

  const policy = checkPasswordPolicy(newPassword);
  if (!policy.ok) return { ok: false, reason: "weak" };

  const passwordHash = await hashPassword(newPassword);
  await prisma.employee.update({
    where: { id: employee.id },
    data: { passwordHash, mustChangePassword: false },
  });
  await revokeAllSessions(employee.id);
  await audit({
    actorEmployeeId: employee.id,
    action: "AUTH_PASSWORD_CHANGED",
    entityType: "Employee",
    entityId: employee.id,
    summary: "Employee changed their own password",
  });
  return { ok: true };
}
