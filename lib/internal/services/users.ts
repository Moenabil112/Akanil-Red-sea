import { prisma } from "../db";
import { hashPassword, checkPasswordPolicy } from "../password";
import { audit } from "../audit";
import { revokeAllSessions } from "../session-store";
import { isEmployeeRole } from "../roles";

/**
 * Employee account provisioning (P4-A §6). Accounts are created only
 * administratively — through the CLI scripts or a SYSTEM_ADMIN action, never
 * a public page. There is no self-registration and no external invitation.
 * Passwords are hashed with Argon2id; raw passwords and hashes are never
 * logged or returned. New accounts must change their password on first login.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export class UserServiceError extends Error {}

/** Create an employee account. Returns the id only — never the hash. */
export async function createEmployeeAccount(
  input: { email: string; displayName: string; role: string; password: string },
  actorEmployeeId: string | null,
): Promise<string> {
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new UserServiceError("Invalid email format.");
  if (!isEmployeeRole(input.role)) throw new UserServiceError("Unknown role.");
  const policy = checkPasswordPolicy(input.password);
  if (!policy.ok) {
    throw new UserServiceError(
      "Password does not meet the policy (minimum 14 characters).",
    );
  }
  const existing = await prisma.employee.findUnique({ where: { email } });
  if (existing) throw new UserServiceError("An account with that email already exists.");

  const passwordHash = await hashPassword(input.password);
  const employee = await prisma.employee.create({
    data: {
      email,
      displayName: input.displayName.trim(),
      role: input.role as never,
      passwordHash,
      mustChangePassword: true,
      status: "ACTIVE",
    },
  });
  await audit({
    actorEmployeeId,
    action: "EMPLOYEE_CREATED",
    entityType: "Employee",
    entityId: employee.id,
    summary: `Employee account created (${input.role})`,
  });
  return employee.id;
}

/** Disable an employee account and revoke all its sessions. */
export async function disableEmployeeAccount(
  emailOrId: string,
  actorEmployeeId: string | null,
): Promise<void> {
  const employee = await findEmployee(emailOrId);
  if (!employee) throw new UserServiceError("Employee not found.");
  await prisma.employee.update({
    where: { id: employee.id },
    data: { status: "DISABLED", disabledAt: new Date() },
  });
  await revokeAllSessions(employee.id);
  await audit({
    actorEmployeeId,
    action: "EMPLOYEE_DISABLED",
    entityType: "Employee",
    entityId: employee.id,
    summary: "Employee account disabled",
  });
}

/** Reset an employee's password; forces change on next login and revokes sessions. */
export async function resetEmployeePassword(
  emailOrId: string,
  newPassword: string,
  actorEmployeeId: string | null,
): Promise<void> {
  const employee = await findEmployee(emailOrId);
  if (!employee) throw new UserServiceError("Employee not found.");
  const policy = checkPasswordPolicy(newPassword);
  if (!policy.ok) {
    throw new UserServiceError("Password does not meet the policy (minimum 14 characters).");
  }
  const passwordHash = await hashPassword(newPassword);
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      passwordHash,
      mustChangePassword: true,
      status: employee.status === "LOCKED" ? "ACTIVE" : employee.status,
      failedLoginCount: 0,
      lockedUntil: null,
    },
  });
  await revokeAllSessions(employee.id);
  await audit({
    actorEmployeeId,
    action: "EMPLOYEE_PASSWORD_RESET",
    entityType: "Employee",
    entityId: employee.id,
    summary: "Employee password reset (must change on next login)",
  });
}

async function findEmployee(emailOrId: string) {
  const byEmail = emailOrId.includes("@")
    ? await prisma.employee.findUnique({ where: { email: emailOrId.trim().toLowerCase() } })
    : null;
  if (byEmail) return byEmail;
  return prisma.employee.findUnique({ where: { id: emailOrId } });
}

/** List employees for the administration view (no hashes). */
export async function listEmployees() {
  return prisma.employee.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      status: true,
      mustChangePassword: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}
