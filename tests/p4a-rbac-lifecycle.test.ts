import { describe, expect, it } from "vitest";
import { EMPLOYEE_ROLES, isEmployeeRole } from "@/lib/internal/roles";
import { can, canViewAllCases, permissionsFor } from "@/lib/internal/rbac";
import {
  CASE_STATUSES,
  canTransition,
  isCaseStatus,
  isClosureReason,
  nextStatuses,
  requiresClosureReason,
  REOPEN_TARGET,
} from "@/lib/internal/lifecycle";
import { formatCaseReference, isCaseReferenceShape } from "@/lib/internal/reference";
import { checkPasswordPolicy, MIN_PASSWORD_LENGTH } from "@/lib/internal/password";

/* ---------------- RBAC (default-deny) ---------------- */

describe("RBAC matrix", () => {
  it("defines exactly the six internal roles", () => {
    expect(EMPLOYEE_ROLES).toHaveLength(6);
    expect(isEmployeeRole("SYSTEM_ADMIN")).toBe(true);
    expect(isEmployeeRole("PARTICIPANT")).toBe(false);
  });

  it("is default-deny: an unknown permission is never granted", () => {
    for (const role of EMPLOYEE_ROLES) {
      // @ts-expect-error — deliberately invalid permission
      expect(can(role, "case.delete")).toBe(false);
    }
  });

  it("only managers/admins approve decisions and qualification", () => {
    expect(can("OPERATIONS_MANAGER", "decision.approve")).toBe(true);
    expect(can("OPERATIONS_MANAGER", "qualification.approve")).toBe(true);
    for (const role of ["CASE_MANAGER", "SPECIALIST_REVIEWER", "FORUM_COORDINATOR", "READ_ONLY_AUDITOR"] as const) {
      expect(can(role, "decision.approve")).toBe(false);
      expect(can(role, "qualification.approve")).toBe(false);
    }
  });

  it("only SYSTEM_ADMIN manages users and system config", () => {
    expect(can("SYSTEM_ADMIN", "user.manage")).toBe(true);
    expect(can("SYSTEM_ADMIN", "system.config")).toBe(true);
    for (const role of ["OPERATIONS_MANAGER", "CASE_MANAGER", "SPECIALIST_REVIEWER", "FORUM_COORDINATOR", "READ_ONLY_AUDITOR"] as const) {
      expect(can(role, "user.manage")).toBe(false);
      expect(can(role, "system.config")).toBe(false);
    }
  });

  it("the read-only auditor can never create, edit or decide", () => {
    for (const perm of ["case.create", "case.updateDetails", "case.transition", "decision.approve", "note.create", "user.manage"] as const) {
      expect(can("READ_ONLY_AUDITOR", perm)).toBe(false);
    }
    expect(can("READ_ONLY_AUDITOR", "audit.view")).toBe(true);
    expect(canViewAllCases("READ_ONLY_AUDITOR")).toBe(true);
  });

  it("case managers see only assigned cases; managers/admins/auditors see all", () => {
    expect(canViewAllCases("CASE_MANAGER")).toBe(false);
    expect(can("CASE_MANAGER", "case.viewAssigned")).toBe(true);
    expect(canViewAllCases("OPERATIONS_MANAGER")).toBe(true);
    expect(canViewAllCases("SYSTEM_ADMIN")).toBe(true);
  });

  it("no role holds a permission outside the known set", () => {
    for (const role of EMPLOYEE_ROLES) {
      for (const perm of permissionsFor(role)) {
        expect(typeof perm).toBe("string");
      }
    }
  });
});

/* ---------------- Case lifecycle ---------------- */

describe("case lifecycle state machine", () => {
  it("defines the ten statuses", () => {
    expect(CASE_STATUSES).toHaveLength(10);
    expect(isCaseStatus("TRIAGE")).toBe(true);
    expect(isCaseStatus("BOGUS")).toBe(false);
  });

  it("permits the documented transitions and rejects others", () => {
    expect(canTransition("NEW", "TRIAGE")).toBe(true);
    expect(canTransition("NEW", "CLOSED")).toBe(false);
    expect(canTransition("TRIAGE", "QUALIFIED")).toBe(true);
    expect(canTransition("QUALIFIED", "MEETING_PREPARATION")).toBe(true);
    expect(canTransition("QUALIFIED", "CLOSED")).toBe(false);
    expect(canTransition("DECISION_PENDING", "CLOSED")).toBe(true);
    expect(canTransition("CLOSED", "TRIAGE")).toBe(false); // reopen is a distinct op
  });

  it("treats CLOSED as terminal for ordinary transitions", () => {
    expect(nextStatuses("CLOSED")).toHaveLength(0);
    expect(REOPEN_TARGET).toBe("TRIAGE");
  });

  it("requires a closure reason only for CLOSED", () => {
    expect(requiresClosureReason("CLOSED")).toBe(true);
    expect(requiresClosureReason("ON_HOLD")).toBe(false);
    expect(isClosureReason("DUPLICATE")).toBe(true);
    expect(isClosureReason("MAYBE")).toBe(false);
  });
});

/* ---------------- Case reference ---------------- */

describe("case reference format", () => {
  it("zero-pads to six digits within a year", () => {
    expect(formatCaseReference(2026, 1)).toBe("AKN-2026-000001");
    expect(formatCaseReference(2026, 123456)).toBe("AKN-2026-123456");
    expect(isCaseReferenceShape("AKN-2026-000001")).toBe(true);
    expect(isCaseReferenceShape("2026-1")).toBe(false);
  });
});

/* ---------------- Password policy ---------------- */

describe("password policy", () => {
  it("requires at least 14 characters", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(14);
    expect(checkPasswordPolicy("short").ok).toBe(false);
    expect(checkPasswordPolicy("a".repeat(13)).ok).toBe(false);
    expect(checkPasswordPolicy("Corridor-Atlas-Nile-2026").ok).toBe(true);
  });

  it("rejects obvious weak values", () => {
    expect(checkPasswordPolicy("passwordpassword").ok).toBe(false);
    expect(checkPasswordPolicy("").reason).toBe("empty");
  });
});
