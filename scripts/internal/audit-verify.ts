import { prisma } from "@/lib/internal/db";
import { verifyChain, type ChainRow } from "@/lib/internal/audit-chain";
import { parseArgs } from "./cli-utils";

/**
 * P4-B audit hash-chain verifier (§12). Reads audit events in sequence order
 * and verifies the tamper-evident chain from genesis (or --from=<sequence>).
 * Reports the first broken sequence and exits non-zero on failure. It NEVER
 * repairs history and never mutates anything.
 *
 * Usage:
 *   npm run internal:audit:verify
 *   npm run internal:audit:verify -- --from=1000
 */
async function main() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (process as any).loadEnvFile?.(".env");
  } catch {
    /* env supplied directly */
  }

  const args = parseArgs(process.argv.slice(2));
  const from = args.from ? Number(args.from) : 1;
  if (!Number.isFinite(from) || from < 1) {
    console.error("Invalid --from value.");
    process.exit(2);
  }

  // When starting mid-chain, seed the expected previous hash from the row
  // immediately before `from`.
  let expectedPrev: string | null = null;
  if (from > 1) {
    const prior = await prisma.auditEvent.findUnique({
      where: { sequenceNumber: from - 1 },
      select: { eventHash: true },
    });
    if (!prior) {
      console.error(`No event at sequence ${from - 1}; cannot anchor verification.`);
      process.exit(2);
    }
    expectedPrev = prior.eventHash;
  }

  const rows = await prisma.auditEvent.findMany({
    where: { sequenceNumber: { gte: from } },
    orderBy: { sequenceNumber: "asc" },
    select: {
      id: true,
      sequenceNumber: true,
      actorEmployeeId: true,
      action: true,
      entityType: true,
      entityId: true,
      caseId: true,
      summary: true,
      changedFields: true,
      createdAt: true,
      previousEventHash: true,
      eventHash: true,
      hashVersion: true,
    },
  });

  const verdict = verifyChain(rows as ChainRow[], from, expectedPrev);
  await prisma.$disconnect();

  if (verdict.ok) {
    console.log(`Audit chain OK: verified ${verdict.verified} event(s) from sequence ${verdict.from} to ${verdict.to ?? verdict.from}.`);
    process.exit(0);
  }
  console.error(`Audit chain BROKEN at sequence ${verdict.brokenSequence}: ${verdict.reason} (verified ${verdict.verified} before the break).`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
