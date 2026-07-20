/**
 * Internal employee roles (P4-A §8). Defined here as plain constants so
 * RBAC and unit tests never need to import the generated Prisma client.
 * The database stores the identical string values (Prisma enum EmployeeRole).
 */

export const EMPLOYEE_ROLES = [
  "SYSTEM_ADMIN",
  "OPERATIONS_MANAGER",
  "CASE_MANAGER",
  "SPECIALIST_REVIEWER",
  "FORUM_COORDINATOR",
  "READ_ONLY_AUDITOR",
] as const;

export type EmployeeRole = (typeof EMPLOYEE_ROLES)[number];

export function isEmployeeRole(value: string): value is EmployeeRole {
  return (EMPLOYEE_ROLES as readonly string[]).includes(value);
}

export const ROLE_LABELS: Record<EmployeeRole, string> = {
  SYSTEM_ADMIN: "System administrator",
  OPERATIONS_MANAGER: "Operations manager",
  CASE_MANAGER: "Case manager",
  SPECIALIST_REVIEWER: "Specialist reviewer",
  FORUM_COORDINATOR: "Forum coordinator",
  READ_ONLY_AUDITOR: "Read-only auditor",
};
