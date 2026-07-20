import { randomUUID } from "node:crypto";
import { prisma } from "./db";
import type { Prisma, PrismaClient } from "@/lib/generated/prisma";

/**
 * Append-only audit trail (P4-A §9.15). Every mutation records an event.
 * No user, including SYSTEM_ADMIN, can delete audit events through the
 * application (there is no delete path). Sensitive values are never
 * recorded: passwords, hashes, secrets, session tokens and confidential
 * note bodies are excluded from audit diffs.
 */

type DbClient = PrismaClient | Prisma.TransactionClient;

const REDACTED_FIELDS = new Set([
  "password",
  "passwordHash",
  "newPassword",
  "currentPassword",
  "token",
  "tokenHash",
  "secret",
  "authSecret",
  "body", // confidential note bodies are never diffed
]);

export interface AuditInput {
  actorEmployeeId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  caseId?: string | null;
  summary: string;
  changedFields?: Record<string, unknown> | null;
  correlationId?: string | null;
}

/** Redact sensitive keys from a changed-fields object before persisting. */
export function redactFields(
  fields: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!fields) return null;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = REDACTED_FIELDS.has(key) ? "[redacted]" : value;
  }
  return out;
}

/** Write an audit event using the given client (usually a transaction). */
export async function recordAudit(
  client: DbClient,
  input: AuditInput,
): Promise<void> {
  await client.auditEvent.create({
    data: {
      actorEmployeeId: input.actorEmployeeId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      caseId: input.caseId ?? null,
      summary: input.summary,
      changedFields: (redactFields(input.changedFields) ??
        undefined) as Prisma.InputJsonValue | undefined,
      correlationId: input.correlationId ?? randomUUID(),
    },
  });
}

/** Convenience for events outside an explicit transaction. */
export function audit(input: AuditInput): Promise<void> {
  return recordAudit(prisma, input);
}
