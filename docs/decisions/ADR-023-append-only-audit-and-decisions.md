# ADR-023 — Append-only audit trail and decision records

Date: 2026-07-20 · Status: accepted

## Context

P4-A must preserve an accountable operational history: every mutation audited,
notes never deleted, approved decisions never silently edited, and no user —
including SYSTEM_ADMIN — able to delete audit events through the application.

## Decision

- **Append-only audit trail** (`AuditEvent`). Every service mutation writes an
  event inside the same transaction via `recordAudit(tx, …)`. The application
  exposes no update or delete path for audit events. Sensitive values are
  redacted from audit diffs (`redactFields`): passwords, hashes, tokens,
  secrets and confidential note bodies are never recorded.
- **Append-only notes.** `InternalNote` has no update/delete path; a correction
  is a new note referencing the earlier one (`supersedesNoteId`).
- **Immutable approved decisions.** `resolveDecision` only acts on a `PROPOSED`
  decision; once `APPROVED`/`REJECTED`/`DEFERRED` it cannot be re-resolved. A
  change is expressed as a new decision that supersedes the prior one
  (`supersedesDecisionId`), and the superseded decision is marked `SUPERSEDED`
  — history is preserved.
- **Meeting records** are likewise append-only after creation; a correction is a
  superseding record.
- **Assignment history** is preserved: reassigning an owner ends the previous
  OWNER assignment (`endedAt`) and creates a new one, keeping exactly one active
  owner while retaining the full chain.

## Consequences

- The operational record is tamper-evident and reconstructable. There is
  deliberately no "edit history" affordance; corrections are additive. This is
  verified by the integration tests (decision re-resolution rejected, assignment
  history preserved) and the redaction unit test.
