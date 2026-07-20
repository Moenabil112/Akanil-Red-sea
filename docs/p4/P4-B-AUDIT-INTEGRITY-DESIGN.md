# P4-B — Audit Integrity Design

## Goal

Make the append-only audit trail tamper-evident: any later edit or deletion of
a historical event is detectable. This is an application-level control — **not**
a blockchain and **not** external notarization.

## Schema

`AuditEvent` gains: `sequenceNumber` (unique, monotonic), `previousEventHash`,
`eventHash`, `hashVersion` (default 1). Legacy rows are null until backfilled.

## Hash payload (non-secret, immutable)

`sequenceNumber, actorEmployeeId, action, entityType, entityId, caseId,
summary, changedFields (redacted), createdAt (ISO), previousEventHash,
hashVersion` — serialized canonically (recursively sorted keys) and hashed with
SHA-256 (`lib/internal/audit-chain.ts`). Secrets and confidential note bodies
are excluded upstream by `redactFields`, so they never enter the hash.

## Write path (transaction-safe)

`recordAudit` increments the `audit-sequence` counter inside the caller's
transaction; the counter row lock serializes concurrent audit writers, so the
chain is contiguous and race-free. The previous hash is read by
`sequenceNumber = n − 1` within the same transaction.

## Verification (never repair)

- `verifyChain` recomputes each event's hash and checks the sequence and
  previous-hash links, returning the **first broken sequence** and reason.
- `npm run internal:audit:verify [-- --from=N]` verifies from genesis or a
  given sequence (anchoring on the prior event's hash) and exits non-zero on
  failure. It never repairs history; no baseline can be reset through the UI.
- The readiness panel surfaces an `audit-chain-verification` area (PASS / FAIL /
  BLOCKED). Access to the verifier/status is limited to SYSTEM_ADMIN,
  READ_ONLY_AUDITOR and authorized OPERATIONS_MANAGER (`audit.verify`).

## Backfill (deterministic)

`npm run internal:audit:backfill` assigns sequence numbers and chained hashes to
legacy P4-A events in canonical `(createdAt, id)` order and sets the counter.
Run once after applying the P4-B migration and before resuming operations. The
migration adds the columns as nullable, so it is non-destructive and cannot
corrupt existing rows.

## Restore integrity

`internal:restore:verify` re-runs the verifier against the restored database, so
a logical backup/restore preserves and re-proves chain integrity.

## Tests

`tests/p4b-audit-integrity.test.ts` (deterministic serialization/hashing, valid
chain, tamper/gap/link detection, secret exclusion) and
`tests/integration/p4b-governance.integration.test.ts` (sequential numbers,
DB-round-trip hash recomputation, tamper detection on a detached copy).
