import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { prisma } from "./db";
import {
  SESSION_COOKIE,
  sessionConfig,
  isProductionRuntime,
  internalEnabled,
} from "./env";
import type { EmployeeRole } from "./roles";
import { can, type Permission } from "./rbac";
import { hashSessionToken } from "./session-store";
import type { CurrentEmployee } from "./authz";

export type { CurrentEmployee } from "./authz";
export { assertCan } from "./authz";
export { revokeAllSessions } from "./session-store";

/**
 * Database-backed, revocable sessions (P4-A §7). The raw token lives only
 * in the employee's HttpOnly cookie; the database stores its SHA-256 hash.
 * Sessions have an absolute expiry and an idle timeout (sliding), and are
 * invalidated on password reset or account disablement. Route hiding is
 * not security — validation happens here on the server for every request.
 */

/** Create a session for an employee and set the secure cookie. */
export async function createSession(employeeId: string): Promise<void> {
  const raw = randomBytes(32).toString("base64url");
  const now = Date.now();
  const absolute = new Date(now + sessionConfig.maxAgeMinutes * 60_000);
  const idle = new Date(now + sessionConfig.idleTimeoutMinutes * 60_000);

  await prisma.session.create({
    data: {
      tokenHash: hashSessionToken(raw),
      employeeId,
      absoluteExpiry: absolute,
      idleExpiry: idle,
    },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProductionRuntime(),
    path: "/",
    expires: absolute,
  });
}

/** Revoke the current session (if any) and clear the cookie. */
export async function destroyCurrentSession(): Promise<void> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) {
    await prisma.session.updateMany({
      where: { tokenHash: hashSessionToken(raw), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  store.delete(SESSION_COOKIE);
}

/**
 * Resolve the current employee from the session cookie, enforcing absolute
 * expiry, idle timeout, revocation and account status. Slides the idle
 * window on success. Returns null when there is no valid session.
 */
export async function getCurrentEmployee(): Promise<CurrentEmployee | null> {
  if (!internalEnabled()) return null;
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(raw) },
    include: { employee: true },
  });
  if (!session || session.revokedAt) return null;

  const now = new Date();
  if (session.absoluteExpiry < now || session.idleExpiry < now) {
    await prisma.session.updateMany({
      where: { id: session.id, revokedAt: null },
      data: { revokedAt: now },
    });
    return null;
  }

  const employee = session.employee;
  if (!employee || employee.status !== "ACTIVE") {
    await prisma.session.updateMany({
      where: { id: session.id, revokedAt: null },
      data: { revokedAt: now },
    });
    return null;
  }

  // Slide the idle window (never beyond the absolute expiry).
  const nextIdle = new Date(
    Math.min(
      now.getTime() + sessionConfig.idleTimeoutMinutes * 60_000,
      session.absoluteExpiry.getTime(),
    ),
  );
  await prisma.session.update({
    where: { id: session.id },
    data: { idleExpiry: nextIdle },
  });

  return {
    id: employee.id,
    email: employee.email,
    displayName: employee.displayName,
    role: employee.role as EmployeeRole,
    mustChangePassword: employee.mustChangePassword,
  };
}

/**
 * Require an authenticated employee for an internal page. Redirects to the
 * login page when unauthenticated, and to the change-password page when a
 * first-login password change is pending. When a permission is supplied,
 * enforces it (default-deny) and redirects to a denied page otherwise.
 */
export async function requireEmployee(
  locale: string,
  permission?: Permission,
): Promise<CurrentEmployee> {
  const employee = await getCurrentEmployee();
  if (!employee) redirect(`/${locale}/internal/login`);
  if (employee.mustChangePassword) {
    redirect(`/${locale}/internal/change-password`);
  }
  if (permission && !can(employee.role, permission)) {
    redirect(`/${locale}/internal/denied`);
  }
  return employee;
}

