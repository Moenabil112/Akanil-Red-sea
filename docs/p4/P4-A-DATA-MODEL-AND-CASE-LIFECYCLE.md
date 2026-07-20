# P4-A — Data Model and Case Lifecycle

Prisma schema: `prisma/schema.prisma`. Migration baseline:
`prisma/migrations/20260720115012_p4a_internal_case_management`.

## Entities (15 + counter)

| Entity | Purpose / notes |
| --- | --- |
| Employee | Account: email, displayName, passwordHash, role, status (ACTIVE/DISABLED/LOCKED), mustChangePassword, failedLoginCount, lockedUntil, lastLoginAt. |
| Session | DB-backed, revocable; stores tokenHash (not the raw token), absolute + idle expiry, revokedAt. |
| Organization | workingName, legalName?, type?, country?, verificationStatus, operationalNotes, recordVersion; archived not deleted. |
| Contact | Professional contact under an organization; authorityStatus; no sensitive personal identifiers. |
| Case | internalReference (immutable), title, summary, source, validated public taxonomy ids, org/contact, status, qualificationStatus, priority, classification, currentOwner, recordVersion. |
| CaseAssignment | OWNER / REVIEWER / FORUM_COORDINATOR with assignedBy/at and endedAt (history preserved; one active owner). |
| InternalNote | Append-only; noteType, classification, body, supersedesNoteId. |
| QualificationReview | Six criterion states, recommendation, finalOutcome, reviewer + decisionOwner. |
| InformationGap | category, title, status (OPEN/UNDER_REVIEW/RESOLVED/WAIVED), owner, dueDate, resolutionNote. |
| EvidenceReference | Metadata only — no upload; locationNote is plain internal text; verificationStatus. |
| MeetingPreparation | Internal only; type, purpose, participant categories, key questions, decisions sought, status. |
| MeetingRecord | Concise internal record; append-only (superseding only). |
| Decision | decisionType, status (PROPOSED/APPROVED/REJECTED/DEFERRED/SUPERSEDED), proposedBy/approvedBy, supersedesDecisionId. |
| Commitment | Internal follow-up; status, owner, dueDate, recordVersion; not a legal contract. |
| AuditEvent | Append-only; actor, action, entityType/Id, caseId, summary, redacted changedFields, correlationId. |
| Counter | Transaction-safe monotonic counter for case references. |

Public controlled taxonomies (request types, platform / value-chain / Forum
participation-path and sector-track ids) are stored as validated strings and
validated against the existing P1/P2/P3 guards (`lib/internal/taxonomy.ts`).
They are never redefined here.

## Internal case reference

`AKN-YYYY-000001`. Generated inside the case-creation transaction by
incrementing the `Counter` row (upsert with atomic increment — row-locked and
transaction-safe), never by counting rows on the client, never supplied by the
browser, immutable after creation, and never shown on the public site.

## Case lifecycle (server-enforced)

States: NEW · TRIAGE · INFORMATION_REQUIRED · QUALIFIED · UNDER_REVIEW ·
MEETING_PREPARATION · DECISION_PENDING · FOLLOW_UP · ON_HOLD · CLOSED.

Permitted transitions (`lib/internal/lifecycle.ts`):

- NEW → TRIAGE
- TRIAGE → INFORMATION_REQUIRED · QUALIFIED · ON_HOLD · CLOSED
- INFORMATION_REQUIRED → TRIAGE · QUALIFIED · ON_HOLD · CLOSED
- QUALIFIED → UNDER_REVIEW · MEETING_PREPARATION · DECISION_PENDING
- UNDER_REVIEW → INFORMATION_REQUIRED · MEETING_PREPARATION · DECISION_PENDING · ON_HOLD
- MEETING_PREPARATION → DECISION_PENDING · FOLLOW_UP · ON_HOLD
- DECISION_PENDING → FOLLOW_UP · INFORMATION_REQUIRED · ON_HOLD · CLOSED
- FOLLOW_UP → DECISION_PENDING · ON_HOLD · CLOSED
- ON_HOLD → TRIAGE · UNDER_REVIEW · CLOSED
- CLOSED → (reopen to TRIAGE only, by OPERATIONS_MANAGER or SYSTEM_ADMIN, with a
  mandatory reason and an audit event)

Every transition is server-authorized, validates the transition, applies
optimistic concurrency (`recordVersion`), records actor and time, and writes an
audit event. Closing requires a closure reason (PROGRESSED_OUTSIDE_MVP,
NOT_PROGRESSED, WITHDRAWN, DUPLICATE, COMPLETED, OTHER). No client can set an
arbitrary status.

## Concurrency and transactions

Optimistic concurrency (`recordVersion`) protects cases, organizations,
contacts, commitments and meeting preparations; a stale write raises
`ConcurrencyError` and the UI asks the employee to reload. Transactions wrap
case creation + reference generation, assignment changes, qualification
approval, decision resolution, case closure, and the audit write tied to each
mutation.
