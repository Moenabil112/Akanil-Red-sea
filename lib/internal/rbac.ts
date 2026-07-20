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
  // P4-B governance permissions (§6/§7/§10/§11/§13/§14/§16/§17/§18).
  "pilot.view",
  "pilot.request",
  "pilot.approve",
  "access.change.request",
  "access.change.approve",
  "access.review.conduct",
  "employee.lifecycle",
  "session.admin",
  "security.event.view",
  "security.event.manage",
  "incident.view",
  "incident.manage",
  "exercise.view",
  "exercise.manage",
  "exercise.approve",
  "corrective.view",
  "corrective.manage",
  "corrective.verify",
  "readiness.view",
  "readiness.approve",
  "audit.verify",
  // P4-C controlled-operations permissions (§24).
  "operations.pilot.view",
  "operations.pilot.create",
  "operations.pilot.manage",
  "operations.pilot.complete",
  "operations.procedure.view",
  "operations.procedure.manage",
  "operations.procedure.acknowledge",
  "operations.data_quality.view",
  "operations.data_quality.manage",
  "operations.release.view",
  "operations.release.prepare",
  "operations.authorization.view",
  "operations.authorization.propose",
  "operations.authorization.review",
  "operations.authorization.approve",
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
    "pilot.view",
    "pilot.request",
    "pilot.approve",
    "access.change.request",
    "access.change.approve",
    "access.review.conduct",
    "employee.lifecycle",
    "session.admin",
    "security.event.view",
    "incident.view",
    "exercise.view",
    "corrective.view",
    "readiness.view",
    "audit.verify",
    // P4-C: technical/security administration and release evidence; NO
    // unilateral go-live approval (authorization.approve withheld).
    "operations.pilot.view",
    "operations.procedure.view",
    "operations.data_quality.view",
    "operations.release.view",
    "operations.release.prepare",
    "operations.authorization.view",
    "operations.authorization.review",
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
    "pilot.view",
    "pilot.request",
    "pilot.approve",
    "access.change.request",
    "access.change.approve",
    "access.review.conduct",
    "employee.lifecycle",
    "session.admin",
    "security.event.view",
    "security.event.manage",
    "incident.view",
    "incident.manage",
    "exercise.view",
    "exercise.manage",
    "exercise.approve",
    "corrective.view",
    "corrective.manage",
    "corrective.verify",
    "readiness.view",
    "readiness.approve",
    "audit.verify",
    // P4-C: manages the operational pilot, procedures, readiness and the
    // limited-operations decision (subject to separation-of-duties checks).
    "operations.pilot.view",
    "operations.pilot.create",
    "operations.pilot.manage",
    "operations.pilot.complete",
    "operations.procedure.view",
    "operations.procedure.manage",
    "operations.procedure.acknowledge",
    "operations.data_quality.view",
    "operations.data_quality.manage",
    "operations.release.view",
    "operations.release.prepare",
    "operations.authorization.view",
    "operations.authorization.propose",
    "operations.authorization.review",
    "operations.authorization.approve",
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
    // P4-C: operates assigned pilot cases; resolves authorized data-quality
    // findings; acknowledges procedures. No go-live approval.
    "operations.pilot.view",
    "operations.procedure.view",
    "operations.procedure.acknowledge",
    "operations.data_quality.view",
    "operations.data_quality.manage",
  ],
  SPECIALIST_REVIEWER: [
    "view.dashboard",
    "case.viewAssigned",
    "note.create",
    "qualification.recommend",
    "gap.manage",
    // P4-C: reviews assigned pilot cases; specialist observations. No go-live.
    "operations.pilot.view",
    "operations.procedure.view",
    "operations.procedure.acknowledge",
    "operations.data_quality.view",
  ],
  FORUM_COORDINATOR: [
    "view.dashboard",
    "case.viewAssigned",
    "note.create",
    "meeting.prepare",
    "meeting.record",
    "decision.propose",
    "commitment.manage",
    // P4-C: operates Forum-related pilot cases. No go-live.
    "operations.pilot.view",
    "operations.procedure.view",
    "operations.procedure.acknowledge",
    "operations.data_quality.view",
  ],
  READ_ONLY_AUDITOR: [
    "view.dashboard",
    "case.viewAll",
    "organization.viewAll",
    "audit.view",
    "pilot.view",
    "security.event.view",
    "incident.view",
    "exercise.view",
    "corrective.view",
    "readiness.view",
    "audit.verify",
    // P4-C: view-only across operations, release evidence and authorization.
    "operations.pilot.view",
    "operations.procedure.view",
    "operations.data_quality.view",
    "operations.release.view",
    "operations.authorization.view",
  ],
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
