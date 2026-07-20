import { prisma } from "./db";
import type { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { redactLog, logger } from "./logger";

/**
 * P4-B security-event monitoring (§13). Records minimized security-relevant
 * events for the internal security work queue. Events NEVER contain passwords,
 * tokens, secrets or confidential content — the `detail` object is redacted
 * before it is persisted or logged. No external alert is ever sent. Events
 * cannot be deleted through the application (there is no delete path).
 */

type DbClient = PrismaClient | Prisma.TransactionClient;

export type SecurityEventCategory =
  | "LOGIN_FAILURE_THRESHOLD"
  | "ACCOUNT_LOCKED"
  | "REAUTHENTICATION_FAILURE"
  | "UNAUTHORIZED_ROUTE_ATTEMPT"
  | "OBJECT_ACCESS_DENIED"
  | "INVALID_STATE_TRANSITION"
  | "CONCURRENCY_CONFLICT"
  | "SESSION_REVOKED"
  | "PILOT_ACCESS_SUSPENDED"
  | "AUDIT_INTEGRITY_FAILURE"
  | "BACKUP_VALIDATION_FAILURE"
  | "SECRET_SCAN_FAILURE"
  | "OTHER_SECURITY_EVENT";

export type SecuritySeverity =
  | "INFORMATIONAL"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface SecurityEventInput {
  category: SecurityEventCategory;
  severity: SecuritySeverity;
  actorEmployeeId?: string | null;
  subjectType?: string | null;
  subjectId?: string | null;
  summary: string;
  detail?: Record<string, unknown> | null;
  correlationId?: string | null;
}

/** Record a security event on the given client (defaults to base prisma). */
export async function recordSecurityEvent(
  input: SecurityEventInput,
  client: DbClient = prisma,
): Promise<string> {
  const detail = input.detail
    ? (redactLog(input.detail) as Prisma.InputJsonValue)
    : undefined;
  const created = await client.securityEvent.create({
    data: {
      category: input.category,
      severity: input.severity,
      actorEmployeeId: input.actorEmployeeId ?? null,
      subjectType: input.subjectType ?? null,
      subjectId: input.subjectId ?? null,
      summary: input.summary,
      detail,
      correlationId: input.correlationId ?? null,
    },
    select: { id: true },
  });
  logger.warn({
    event: "security_event",
    securityEventId: created.id,
    category: input.category,
    severity: input.severity,
    correlationId: input.correlationId ?? undefined,
  });
  return created.id;
}
