import { createHash } from "node:crypto";

/**
 * P4-B tamper-evident audit hash chain (§12). Application-level tamper
 * evidence — NOT a blockchain and NOT external notarization. Each audit
 * event carries a monotonic sequence number and a SHA-256 hash computed over
 * canonical, security-relevant immutable metadata plus the previous event's
 * hash. Any later edit or deletion breaks the chain and is detectable by the
 * verifier, which reports the first broken sequence and never repairs history.
 *
 * The hash payload NEVER contains secrets, tokens or confidential note
 * bodies: callers pass already-redacted changed-field metadata, and the note
 * `body` key is redacted upstream (see audit.ts REDACTED_FIELDS).
 */

export const AUDIT_HASH_VERSION = 1;
export const AUDIT_SEQUENCE_COUNTER = "audit-sequence";

/** Canonical, deterministic serialization (recursively sorted object keys). */
export function canonicalize(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = sortValue((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

/** The immutable, non-secret fields the event hash commits to. */
export interface HashPayload {
  sequenceNumber: number;
  actorEmployeeId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  caseId: string | null;
  summary: string;
  // Already redacted — never contains secrets or note bodies.
  changedFields: Record<string, unknown> | null;
  createdAt: string; // ISO
  previousEventHash: string | null;
  hashVersion: number;
}

/** Compute the SHA-256 event hash over the canonical payload. */
export function computeEventHash(payload: HashPayload): string {
  return createHash("sha256").update(canonicalize(payload)).digest("hex");
}

export interface ChainRow {
  id: string;
  sequenceNumber: number | null;
  actorEmployeeId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  caseId: string | null;
  summary: string;
  changedFields: unknown;
  createdAt: Date;
  previousEventHash: string | null;
  eventHash: string | null;
  hashVersion: number;
}

export type ChainVerdict =
  | { ok: true; verified: number; from: number; to: number | null }
  | {
      ok: false;
      verified: number;
      brokenSequence: number | null;
      reason: string;
    };

/**
 * Verify an ordered slice of the chain (ascending by sequenceNumber). Rows
 * must be contiguous starting at `from`. Reports the first broken sequence;
 * never mutates or "repairs" anything.
 */
export function verifyChain(
  rows: ChainRow[],
  from = 1,
  expectedPrevHash: string | null = null,
): ChainVerdict {
  let verified = 0;
  let prevHash = expectedPrevHash;
  let expectedSeq = from;
  let lastSeq: number | null = null;

  for (const row of rows) {
    if (row.sequenceNumber == null || row.eventHash == null) {
      return {
        ok: false,
        verified,
        brokenSequence: row.sequenceNumber,
        reason: "unsequenced or unhashed audit event (backfill required)",
      };
    }
    if (row.sequenceNumber !== expectedSeq) {
      return {
        ok: false,
        verified,
        brokenSequence: row.sequenceNumber,
        reason: `sequence gap: expected ${expectedSeq}, found ${row.sequenceNumber}`,
      };
    }
    if ((row.previousEventHash ?? null) !== (prevHash ?? null)) {
      return {
        ok: false,
        verified,
        brokenSequence: row.sequenceNumber,
        reason: "previous-hash mismatch (out-of-order or altered history)",
      };
    }
    const recomputed = computeEventHash({
      sequenceNumber: row.sequenceNumber,
      actorEmployeeId: row.actorEmployeeId,
      action: row.action,
      entityType: row.entityType,
      entityId: row.entityId,
      caseId: row.caseId,
      summary: row.summary,
      changedFields: (row.changedFields as Record<string, unknown> | null) ?? null,
      createdAt: row.createdAt.toISOString(),
      previousEventHash: row.previousEventHash ?? null,
      hashVersion: row.hashVersion,
    });
    if (recomputed !== row.eventHash) {
      return {
        ok: false,
        verified,
        brokenSequence: row.sequenceNumber,
        reason: "event-hash mismatch (record content was altered)",
      };
    }
    prevHash = row.eventHash;
    lastSeq = row.sequenceNumber;
    expectedSeq += 1;
    verified += 1;
  }

  return { ok: true, verified, from, to: lastSeq };
}
