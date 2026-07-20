
/**
 * P4-A/P4-B environment and feature control. The internal system is OFF
 * unless P4_INTERNAL_ENABLED is exactly "true". When disabled it fails
 * closed: internal routes reveal nothing and no database connection is
 * attempted.
 *
 * P4-B adds a server-enforced operating mode (disabled | validation | pilot),
 * a pilot emergency-suspension kill switch, and pilot/access/step-up
 * durations. Every control fails closed: an absent or invalid value behaves
 * as the most restrictive setting. None of these may be changed from the
 * browser — they are read only on the server.
 */

export function internalEnabled(): boolean {
  return process.env.P4_INTERNAL_ENABLED === "true";
}

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

// ---------------- P4-B/P4-C operating mode ----------------

export type OperationMode = "disabled" | "validation" | "pilot" | "limited_internal";

/**
 * Effective operating mode. Fails closed to "disabled" when the internal
 * feature flag is off or P4_OPERATION_MODE is absent/invalid/unsupported.
 * There is NO "production" mode. P4-C adds "limited_internal", which the
 * environment value ALONE never authorizes: it additionally requires an active
 * human-approved LimitedOperationsAuthorization, checked in the service layer
 * (see lib/internal/limited-operations.ts). The pilot emergency suspension is a
 * separate, authoritative override enforced by callers.
 */
export function operationMode(): OperationMode {
  if (!internalEnabled()) return "disabled";
  const raw = process.env.P4_OPERATION_MODE;
  if (raw === "validation" || raw === "pilot" || raw === "limited_internal") return raw;
  return "disabled";
}

/** True only when the environment requests limited_internal mode. */
export function limitedInternalRequested(): boolean {
  return operationMode() === "limited_internal";
}

/** The pilot emergency stop (§19). Only the exact string "true" suspends. */
export function pilotSuspended(): boolean {
  return process.env.P4_PILOT_SUSPENDED === "true";
}

/**
 * Whether internal operational data is available at all. False when disabled
 * mode is in effect. Public pages never depend on this.
 */
export function internalOperationsAvailable(): boolean {
  return operationMode() !== "disabled";
}

/**
 * Whether internal write operations (mutations) are permitted right now.
 * Blocked in disabled mode and while the pilot is suspended. This is the
 * server-side gate every mutation must honour, in addition to authz.
 */
export function internalMutationsAllowed(): boolean {
  return internalOperationsAvailable() && !pilotSuspended();
}

// ---------------- Session / login ----------------

export const sessionConfig = {
  /** Absolute session lifetime (default 8 hours). */
  get maxAgeMinutes() {
    return intEnv("P4_SESSION_MAX_AGE_MINUTES", 480);
  },
  /** Idle timeout (default 60 minutes). */
  get idleTimeoutMinutes() {
    return intEnv("P4_SESSION_IDLE_TIMEOUT_MINUTES", 60);
  },
};

export const loginConfig = {
  /** Failed attempts before a temporary lock (default 5). */
  get maxFailures() {
    return intEnv("P4_LOGIN_MAX_FAILURES", 5);
  },
  /** Temporary lock duration in minutes (default 15). */
  get lockMinutes() {
    return intEnv("P4_LOGIN_LOCK_MINUTES", 15);
  },
};

// ---------------- P4-B pilot / access / step-up ----------------

export const pilotConfig = {
  /** Conservative maximum pilot-access duration (default 30 days). */
  get accessMaxDays() {
    return intEnv("P4_PILOT_ACCESS_MAX_DAYS", 30);
  },
  /** Access-review cadence (default 30 days). */
  get accessReviewDays() {
    return intEnv("P4_ACCESS_REVIEW_DAYS", 30);
  },
};

export const stepUpConfig = {
  /** Recent-reauthentication window for sensitive actions (default 15 min). */
  get windowMinutes() {
    return intEnv("P4_STEPUP_WINDOW_MINUTES", 15);
  },
};

/** The internal session cookie name. */
export const SESSION_COOKIE = "akn_internal_session";

/** True outside local development (drives the Secure cookie flag). */
export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Local-only development-user provisioning gate (never seeds a password). */
export function devUserAllowed(): boolean {
  return process.env.P4_ALLOW_DEV_USER === "true";
}
