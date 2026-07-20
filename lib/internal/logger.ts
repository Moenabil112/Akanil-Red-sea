/**
 * P4-B centralized internal logging hygiene (§23). A small structured logger
 * that redacts protected values before anything is emitted. There is NO
 * external logging service and NO analytics — output goes to the process
 * console only, and only at a level appropriate to the environment.
 *
 * Redaction is defence-in-depth: services already avoid passing secrets, but
 * any accidental password, hash, token, cookie, authorization header,
 * AUTH_SECRET, DATABASE_URL or confidential note body is stripped here too.
 */

const REDACT_KEYS = new Set([
  "password",
  "newpassword",
  "currentpassword",
  "passwordhash",
  "token",
  "tokenhash",
  "sessiontoken",
  "secret",
  "authsecret",
  "auth_secret",
  "databaseurl",
  "database_url",
  "cookie",
  "cookies",
  "authorization",
  "authheader",
  "body", // confidential note bodies
  "professionalemail",
  "professionalphone",
  "officialemail",
  "officialphone",
]);

const REDACTED = "[redacted]";

/** Recursively redact protected keys (case-insensitive) from a value. */
export function redactLog(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[depth-limited]";
  if (Array.isArray(value)) return value.map((v) => redactLog(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      out[key] = REDACT_KEYS.has(key.toLowerCase())
        ? REDACTED
        : redactLog(v, depth + 1);
    }
    return out;
  }
  return value;
}

type Level = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function activeLevel(): Level {
  const raw = (process.env.P4_LOG_LEVEL ?? "").toLowerCase();
  if (raw === "debug" || raw === "info" || raw === "warn" || raw === "error") {
    return raw;
  }
  return process.env.NODE_ENV === "production" ? "warn" : "info";
}

export interface LogFields {
  event: string;
  correlationId?: string;
  securityEventId?: string;
  [key: string]: unknown;
}

function emit(level: Level, fields: LogFields): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[activeLevel()]) return;
  const record = {
    level,
    ts: new Date().toISOString(),
    ...(redactLog(fields) as Record<string, unknown>),
  };
  const line = JSON.stringify(record);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (fields: LogFields) => emit("debug", fields),
  info: (fields: LogFields) => emit("info", fields),
  warn: (fields: LogFields) => emit("warn", fields),
  error: (fields: LogFields) => emit("error", fields),
};
