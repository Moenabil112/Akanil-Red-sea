import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { operationMode, limitedInternalRequested } from "@/lib/internal/env";
import { isAuthorizationActive, parseDataCategories, ALLOWED_DATA_VALUES } from "@/lib/internal/services/limited-operations";
import { can } from "@/lib/internal/rbac";

/**
 * P4-C operating-mode and authorization-logic unit tests (§6/§7/§24/§29). No
 * database required.
 */

const KEYS = ["P4_INTERNAL_ENABLED", "P4_OPERATION_MODE"] as const;
let saved: Record<string, string | undefined>;
beforeEach(() => { saved = {}; for (const k of KEYS) saved[k] = process.env[k]; });
afterEach(() => { for (const k of KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; } });

describe("limited_internal operating mode (fail-closed)", () => {
  it("recognizes limited_internal only when internal is enabled", () => {
    process.env.P4_INTERNAL_ENABLED = "true";
    process.env.P4_OPERATION_MODE = "limited_internal";
    expect(operationMode()).toBe("limited_internal");
    expect(limitedInternalRequested()).toBe(true);
  });
  it("fails closed to disabled when internal is off or the value is invalid", () => {
    process.env.P4_INTERNAL_ENABLED = "false";
    process.env.P4_OPERATION_MODE = "limited_internal";
    expect(operationMode()).toBe("disabled");
    process.env.P4_INTERNAL_ENABLED = "true";
    process.env.P4_OPERATION_MODE = "production";
    expect(operationMode()).toBe("disabled");
  });
});

describe("authorization active-window logic", () => {
  const now = new Date("2026-06-01T00:00:00Z");
  const base = { status: "ACTIVE", validFrom: new Date("2026-05-01T00:00:00Z"), validUntil: new Date("2026-07-01T00:00:00Z"), suspendedAt: null as Date | null };
  it("accepts an active in-window authorization", () => {
    expect(isAuthorizationActive(base, now)).toBe(true);
  });
  it("rejects suspended/expired/not-started/non-active or missing", () => {
    expect(isAuthorizationActive({ ...base, suspendedAt: now }, now)).toBe(false);
    expect(isAuthorizationActive({ ...base, validUntil: new Date("2026-05-15T00:00:00Z") }, now)).toBe(false);
    expect(isAuthorizationActive({ ...base, validFrom: new Date("2026-06-15T00:00:00Z") }, now)).toBe(false);
    expect(isAuthorizationActive({ ...base, status: "PENDING_REVIEW" }, now)).toBe(false);
    expect(isAuthorizationActive(null, now)).toBe(false);
  });
  it("only allows synthetic / de-identified data categories", () => {
    expect(parseDataCategories("SYNTHETIC, DE_IDENTIFIED")).toEqual(["SYNTHETIC", "DE_IDENTIFIED"]);
    expect([...ALLOWED_DATA_VALUES]).toEqual(["SYNTHETIC", "DE_IDENTIFIED"]);
  });
});

describe("default-deny RBAC for controlled operations (§24)", () => {
  it("withholds unilateral go-live approval from SYSTEM_ADMIN", () => {
    expect(can("SYSTEM_ADMIN", "operations.authorization.approve")).toBe(false);
    expect(can("SYSTEM_ADMIN", "operations.authorization.review")).toBe(true);
    expect(can("SYSTEM_ADMIN", "operations.release.prepare")).toBe(true);
  });
  it("grants the operational-pilot and go-live decision to OPERATIONS_MANAGER", () => {
    expect(can("OPERATIONS_MANAGER", "operations.pilot.create")).toBe(true);
    expect(can("OPERATIONS_MANAGER", "operations.authorization.approve")).toBe(true);
    expect(can("OPERATIONS_MANAGER", "operations.procedure.manage")).toBe(true);
  });
  it("keeps operational-only and read-only roles away from go-live approval", () => {
    for (const role of ["CASE_MANAGER", "SPECIALIST_REVIEWER", "FORUM_COORDINATOR", "READ_ONLY_AUDITOR"] as const) {
      expect(can(role, "operations.authorization.approve")).toBe(false);
      expect(can(role, "operations.pilot.create")).toBe(false);
    }
    expect(can("READ_ONLY_AUDITOR", "operations.pilot.view")).toBe(true);
    expect(can("READ_ONLY_AUDITOR", "operations.data_quality.manage")).toBe(false);
    expect(can("CASE_MANAGER", "operations.data_quality.manage")).toBe(true);
  });
});
