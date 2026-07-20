import { randomUUID } from "node:crypto";
import { prisma } from "./db";
import type { Prisma, PrismaClient } from "@/lib/generated/prisma";
import {
  AUDIT_HASH_VERSION,
  AUDIT_SEQUENCE_COUNTER,
  computeEventHash,
} from "./audit-chain";

/**
 * Append-only audit trail (P4-A §9.15) with P4-B tamper-evident hash chaining
 * (§12). Every mutation records an event. No user, including SYSTEM_ADMIN, can
 * delete or edit audit events through the application (there is no such path).
 * Sensitive values are never recorded: passwords, hashes, secrets, session
 * tokens and confidential note bodies are excluded from audit diffs — and
 * therefore from the hash payload.
 *
 * Each event is assigned a monotonic sequenceNumber and an eventHash chained
 * to the previous event. The counter row is updated inside the same client
 * transaction, serializing concurrent audit writers so the chain stays
 * contiguous and race-free.
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

/**
 * Write an audit event using the given client (usually a transaction), with a
 * transaction-safe sequence number and chained hash. The counter update takes
 * a row lock, serializing concurrent writers on the same client.
 */
export async function recordAudit(
  client: DbClient,
  input: AuditInput,
): Promise<void> {
  const counter = await client.counter.upsert({
    where: { id: AUDIT_SEQUENCE_COUNTER },
    create: { id: AUDIT_SEQUENCE_COUNTER, value: 1 },
    update: { value: { increment: 1 } },
  });
  const sequenceNumber = counter.value;

  const previous =
    sequenceNumber > 1
      ? await client.auditEvent.findUnique({
          where: { sequenceNumber: sequenceNumber - 1 },
          select: { eventHash: true },
        })
      : null;
  const previousEventHash = previous?.eventHash ?? null;

  const changedFields = redactFields(input.changedFields);
  const createdAt = new Date();
  const eventHash = computeEventHash({
    sequenceNumber,
    actorEmployeeId: input.actorEmployeeId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    caseId: input.caseId ?? null,
    summary: input.summary,
    changedFields,
    createdAt: createdAt.toISOString(),
    previousEventHash,
    hashVersion: AUDIT_HASH_VERSION,
  });

  await client.auditEvent.create({
    data: {
      actorEmployeeId: input.actorEmployeeId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      caseId: input.caseId ?? null,
      summary: input.summary,
      changedFields: (changedFields ?? undefined) as
        | Prisma.InputJsonValue
        | undefined,
      correlationId: input.correlationId ?? randomUUID(),
      createdAt,
      sequenceNumber,
      previousEventHash,
      eventHash,
      hashVersion: AUDIT_HASH_VERSION,
    },
  });
}

/** Convenience for events outside an explicit transaction. */
export function audit(input: AuditInput): Promise<void> {
  return prisma.$transaction((tx) => recordAudit(tx, input));
}
