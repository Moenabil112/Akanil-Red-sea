
/**
 * P4-A environment and feature control. The internal system is OFF unless
 * P4_INTERNAL_ENABLED is exactly "true". When disabled it fails closed:
 * internal routes reveal nothing and no database connection is attempted.
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
