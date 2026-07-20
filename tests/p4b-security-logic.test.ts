import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  operationMode,
  internalMutationsAllowed,
  internalOperationsAvailable,
  pilotSuspended,
} from "@/lib/internal/env";
import { isPilotAccessActive } from "@/lib/internal/pilot";
import { isRecentStepUp, assertRecentStepUp, StepUpRequiredError } from "@/lib/internal/step-up";
import { can } from "@/lib/internal/rbac";
import { redactLog } from "@/lib/internal/logger";

/**
 * P4-B security-logic unit tests (§30). Operating-mode fail-closed behaviour,
 * pilot-access evaluation, step-up window, default-deny RBAC for the new
 * governance permissions, and logger redaction. No database required.
 */

const ENV_KEYS = ["P4_INTERNAL_ENABLED", "P4_OPERATION_MODE", "P4_PILOT_SUSPENDED"] as const;
let saved: Record<string, string | undefined>;
beforeEach(() => {
  saved = {};
  for (const k of ENV_KEYS) saved[k] = process.env[k];
});
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("operating mode (fail-closed)", () => {
  it("is disabled when the internal flag is off", () => {
    process.env.P4_INTERNAL_ENABLED = "false";
    process.env.P4_OPERATION_MODE = "pilot";
    expect(operationMode()).toBe("disabled");
    expect(internalOperationsAvailable()).toBe(false);
  });
  it("is disabled when the mode is absent or invalid", () => {
    process.env.P4_INTERNAL_ENABLED = "true";
    delete process.env.P4_OPERATION_MODE;
    expect(operationMode()).toBe("disabled");
    process.env.P4_OPERATION_MODE = "production";
    expect(operationMode()).toBe("disabled");
  });
  it("honours validation and pilot when enabled", () => {
    process.env.P4_INTERNAL_ENABLED = "true";
    process.env.P4_OPERATION_MODE = "validation";
    expect(operationMode()).toBe("validation");
    process.env.P4_OPERATION_MODE = "pilot";
    expect(operationMode()).toBe("pilot");
  });
  it("blocks mutations while the pilot is suspended", () => {
    process.env.P4_INTERNAL_ENABLED = "true";
    process.env.P4_OPERATION_MODE = "pilot";
    process.env.P4_PILOT_SUSPENDED = "true";
    expect(pilotSuspended()).toBe(true);
    expect(internalMutationsAllowed()).toBe(false);
    // Operations data can still be viewed by authorized admins; mutations cannot.
    expect(internalOperationsAvailable()).toBe(true);
  });
});

describe("pilot-access evaluation", () => {
  const now = new Date("2026-06-01T00:00:00Z");
  const base = {
    status: "ACTIVE",
    startsAt: new Date("2026-05-01T00:00:00Z"),
    expiresAt: new Date("2026-07-01T00:00:00Z"),
    suspendedAt: null as Date | null,
    revokedAt: null as Date | null,
  };
  it("accepts an active, in-window record", () => {
    expect(isPilotAccessActive(base, now)).toBe(true);
  });
  it("rejects suspended, revoked, expired or not-yet-started access", () => {
    expect(isPilotAccessActive({ ...base, suspendedAt: now }, now)).toBe(false);
    expect(isPilotAccessActive({ ...base, revokedAt: now }, now)).toBe(false);
    expect(isPilotAccessActive({ ...base, expiresAt: new Date("2026-05-15T00:00:00Z") }, now)).toBe(false);
    expect(isPilotAccessActive({ ...base, startsAt: new Date("2026-06-15T00:00:00Z") }, now)).toBe(false);
    expect(isPilotAccessActive({ ...base, status: "REQUESTED" }, now)).toBe(false);
    expect(isPilotAccessActive(null, now)).toBe(false);
  });
});

describe("step-up window", () => {
  it("accepts a recent reauthentication and rejects a stale one", () => {
    const now = new Date("2026-06-01T12:00:00Z");
    expect(isRecentStepUp(new Date("2026-06-01T11:50:00Z"), now)).toBe(true); // 10 min
    expect(isRecentStepUp(new Date("2026-06-01T11:40:00Z"), now)).toBe(false); // 20 min
    expect(isRecentStepUp(null, now)).toBe(false);
  });
  it("assertRecentStepUp throws when missing", () => {
    expect(() => assertRecentStepUp(null)).toThrow(StepUpRequiredError);
  });
});

describe("default-deny RBAC for governance permissions", () => {
  it("keeps governance approvals away from operational-only roles", () => {
    expect(can("CASE_MANAGER", "pilot.approve")).toBe(false);
    expect(can("CASE_MANAGER", "access.change.approve")).toBe(false);
    expect(can("SPECIALIST_REVIEWER", "readiness.approve")).toBe(false);
    expect(can("FORUM_COORDINATOR", "incident.manage")).toBe(false);
  });
  it("grants governance to the right roles", () => {
    expect(can("OPERATIONS_MANAGER", "pilot.approve")).toBe(true);
    expect(can("OPERATIONS_MANAGER", "readiness.approve")).toBe(true);
    expect(can("SYSTEM_ADMIN", "access.change.approve")).toBe(true);
    expect(can("SYSTEM_ADMIN", "session.admin")).toBe(true);
  });
  it("keeps the read-only auditor read-only", () => {
    expect(can("READ_ONLY_AUDITOR", "audit.verify")).toBe(true);
    expect(can("READ_ONLY_AUDITOR", "security.event.view")).toBe(true);
    expect(can("READ_ONLY_AUDITOR", "security.event.manage")).toBe(false);
    expect(can("READ_ONLY_AUDITOR", "incident.manage")).toBe(false);
    expect(can("READ_ONLY_AUDITOR", "readiness.approve")).toBe(false);
  });
});

describe("logger redaction", () => {
  it("redacts protected keys case-insensitively and recursively", () => {
    const out = redactLog({
      password: "x",
      Token: "y",
      AUTH_SECRET: "z",
      cookie: "c",
      nested: { databaseUrl: "postgres://u:p@h/db", note: { body: "confidential" } },
      safe: "keep",
    }) as Record<string, unknown>;
    expect(out.password).toBe("[redacted]");
    expect(out.Token).toBe("[redacted]");
    expect(out.AUTH_SECRET).toBe("[redacted]");
    expect(out.cookie).toBe("[redacted]");
    const nested = out.nested as Record<string, unknown>;
    expect(nested.databaseUrl).toBe("[redacted]");
    expect((nested.note as Record<string, unknown>).body).toBe("[redacted]");
    expect(out.safe).toBe("keep");
  });
});
