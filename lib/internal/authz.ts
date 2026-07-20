import { can, type Permission } from "./rbac";
import type { EmployeeRole } from "./roles";

/**
 * Framework-free authorization primitives (no next/* imports) so services
 * and integration tests can use them without a request context. UI
 * visibility is never the security boundary — every protected service
 * calls `assertCan` (default-deny) plus object-level ownership checks.
 */

export interface CurrentEmployee {
  id: string;
  email: string;
  displayName: string;
  role: EmployeeRole;
  mustChangePassword: boolean;
}

/** Throws "FORBIDDEN" when the employee's role lacks the permission. */
export function assertCan(
  employee: Pick<CurrentEmployee, "role">,
  permission: Permission,
): void {
  if (!can(employee.role, permission)) {
    throw new Error("FORBIDDEN");
  }
}
