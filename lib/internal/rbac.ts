import type { EmployeeRole } from "./roles";

/**
 * Default-deny permission matrix (P4-A §8). A single matrix drives every
 * authorization decision — no scattered role-name checks. UI visibility is
 * never the security boundary: `can()` is enforced server-side on every
 * protected operation, in addition to object-level ownership checks.
 */

export const PERMISSIONS = [
  "view.dashboard",
  "case.viewAll",
  "case.viewAssigned",
  "case.create",
  "case.updateDetails",
  "case.assign",
  "case.transition",
  "case.close",
  "case.reopen",
  "note.create",
  "qualification.recommend",
  "qualification.approve",
  "gap.manage",
  "evidence.manage",
  "meeting.prepare",
  "meeting.record",
  "decision.propose",
  "decision.approve",
  "commitment.manage",
  "organization.viewAll",
  "organization.manage",
  "contact.manage",
  "audit.view",
  "user.manage",
  "system.config",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const MATRIX: Record<EmployeeRole, Permission[]> = {
  SYSTEM_ADMIN: [
    "view.dashboard",
    "case.viewAll",
    "case.reopen",
    "organization.viewAll",
    "audit.view",
    "user.manage",
    "system.config",
  ],
  OPERATIONS_MANAGER: [
    "view.dashboard",
    "case.viewAll",
    "case.updateDetails",
    "case.assign",
    "case.transition",
    "case.close",
    "case.reopen",
    "qualification.approve",
    "decision.approve",
    "commitment.manage",
    "organization.viewAll",
    "organization.manage",
    "contact.manage",
    "audit.view",
  ],
  CASE_MANAGER: [
    "view.dashboard",
    "case.viewAssigned",
    "case.create",
    "case.updateDetails",
    "case.transition",
    "note.create",
    "qualification.recommend",
    "gap.manage",
    "evidence.manage",
    "meeting.prepare",
    "meeting.record",
    "decision.propose",
    "commitment.manage",
    "organization.viewAll",
    "organization.manage",
    "contact.manage",
  ],
  SPECIALIST_REVIEWER: [
    "view.dashboard",
    "case.viewAssigned",
    "note.create",
    "qualification.recommend",
    "gap.manage",
  ],
  FORUM_COORDINATOR: [
    "view.dashboard",
    "case.viewAssigned",
    "note.create",
    "meeting.prepare",
    "meeting.record",
    "decision.propose",
    "commitment.manage",
  ],
  READ_ONLY_AUDITOR: ["view.dashboard", "case.viewAll", "organization.viewAll", "audit.view"],
};

const MATRIX_SETS: Record<EmployeeRole, Set<Permission>> = Object.fromEntries(
  Object.entries(MATRIX).map(([role, perms]) => [role, new Set(perms)]),
) as Record<EmployeeRole, Set<Permission>>;

/** Default-deny: returns true only when the role explicitly holds the permission. */
export function can(role: EmployeeRole, permission: Permission): boolean {
  return MATRIX_SETS[role]?.has(permission) ?? false;
}

/** All permissions held by a role (for UI gating; never the security boundary). */
export function permissionsFor(role: EmployeeRole): Permission[] {
  return [...(MATRIX_SETS[role] ?? [])];
}

/** True when the role may see every case; otherwise it sees only assigned cases. */
export function canViewAllCases(role: EmployeeRole): boolean {
  return can(role, "case.viewAll");
}
