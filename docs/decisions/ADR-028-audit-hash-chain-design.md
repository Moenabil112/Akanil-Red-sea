# ADR-028 — Audit hash-chain design

Date: 2026-07-20 · Status: accepted

## Context

The append-only audit trail must become tamper-evident: a later edit or
deletion of a historical event must be detectable. No secrets or confidential
note bodies may enter the hashed material. This is an application-level control,
not an external notarization or blockchain.

## Decision

- **Sequence + hash chain.** Each `AuditEvent` carries a monotonic
  `sequenceNumber` and an `eventHash` computed over canonical, non-secret
  immutable metadata plus the `previousEventHash`
  (`lib/internal/audit-chain.ts`). `hashVersion` allows future evolution.
- **Transaction-safe assignment.** `recordAudit` increments the
  `audit-sequence` counter inside the caller's transaction; the row lock
  serializes concurrent writers so the chain stays contiguous and race-free.
- **No secrets in the payload.** Changed-field metadata is redacted
  (`redactFields`) before hashing; the note `body` key is always redacted.
- **Verification, never repair.** `verifyChain` (and
  `npm run internal:audit:verify [-- --from=N]`) report the first broken
  sequence and exit non-zero; nothing is auto-repaired and no baseline can be
  reset through the UI.
- **Deterministic backfill.** `internal:audit:backfill` assigns sequence
  numbers and hashes to legacy P4-A events in canonical `(createdAt, id)` order
  and sets the counter — run once after the migration.

## Consequences

- Any post-hoc alteration or deletion of audit history is detectable.
- The chain survives logical backup/restore (`internal:restore:verify`
  re-verifies it in the restored database).
- This provides tamper-evidence, not tamper-proofing; it makes no external
  notarization claim.
