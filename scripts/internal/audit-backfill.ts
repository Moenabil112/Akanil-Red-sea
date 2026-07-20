import { prisma } from "@/lib/internal/db";
import {
  AUDIT_HASH_VERSION,
  AUDIT_SEQUENCE_COUNTER,
  computeEventHash,
} from "@/lib/internal/audit-chain";

/**
 * P4-B audit hash-chain backfill (§12). Deterministically assigns sequence
 * numbers and chained hashes to audit events that predate the hash chain
 * (legacy synthetic data), ordered by (createdAt, id). Recomputes the full
 * chain in canonical order so the state is consistent whether the table was
 * fully legacy or partially sequenced, and sets the audit-sequence counter to
 * the final value. It NEVER edits the meaningful content of an event and never
 * deletes anything. Run once after applying the P4-B migration and before
 * resuming operations.
 */
async function main() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (process as any).loadEnvFile?.(".env");
  } catch {
    /* env supplied directly */
  }

  const events = await prisma.auditEvent.findMany({
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  if (events.length === 0) {
    console.log("No audit events to backfill.");
    await prisma.$disconnect();
    return;
  }

  let previousEventHash: string | null = null;
  let updated = 0;
  for (let i = 0; i < events.length; i++) {
    const e = events[i]!;
    const sequenceNumber = i + 1;
    const eventHash = computeEventHash({
      sequenceNumber,
      actorEmployeeId: e.actorEmployeeId ?? null,
      action: e.action,
      entityType: e.entityType,
      entityId: e.entityId ?? null,
      caseId: e.caseId ?? null,
      summary: e.summary,
      changedFields: (e.changedFields as Record<string, unknown> | null) ?? null,
      createdAt: e.createdAt.toISOString(),
      previousEventHash,
      hashVersion: AUDIT_HASH_VERSION,
    });
    await prisma.auditEvent.update({
      where: { id: e.id },
      data: { sequenceNumber, previousEventHash, eventHash, hashVersion: AUDIT_HASH_VERSION },
    });
    previousEventHash = eventHash;
    updated++;
  }

  await prisma.counter.upsert({
    where: { id: AUDIT_SEQUENCE_COUNTER },
    create: { id: AUDIT_SEQUENCE_COUNTER, value: events.length },
    update: { value: events.length },
  });

  console.log(`Backfilled ${updated} audit event(s); audit-sequence counter set to ${events.length}.`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
