# P4-C — Internal Operating Procedures (authoritative content)

These are the authoritative daily operating procedures for the controlled
internal pilot. The internal application tracks each procedure's key, version,
status, owner, approver, effective date and acknowledgement requirement
(`OperatingProcedure`); the content below is the source of record. No
confidential operational secrets are stored here. Procedure history is never
overwritten — a new effective version supersedes the previous one.

Statuses: DRAFT → APPROVED → EFFECTIVE → SUPERSEDED / WITHDRAWN.

## SOP-INTAKE-01 — Manual intake from authorized channel
A case is created **only** by an authorized employee from the Akanil
institutional inbox after the public review-before-email flow. There is no
public submission and no direct database write. Record the source channel;
never paste live confidential documents.

## SOP-ORG-01 — Organization and professional-contact creation
Create/verify the organization and professional contact with minimal
professional data. Check the data-quality duplicate suggestions before creating
a near-duplicate; duplicates are never auto-merged.

## SOP-CLASS-01 — Classification and data minimization
Set the case classification and declare the pilot data category (SYNTHETIC or
approved DE_IDENTIFIED). Enter only professional operational data. Never enter
personal identifiers, banking, government-ID, passport or secret data.

## SOP-ASSIGN-01 — Case ownership and specialist assignment
Assign a single current owner; add specialist reviewers as needed. Every open
case must have an owner (a data-quality check flags ownerless cases).

## SOP-QUAL-01 — Qualification and information-gap handling
Record a qualification review before marking a case qualified. Track
information gaps to resolution; stale open gaps are flagged.

## SOP-MEET-01 — Meeting preparation and recording
Prepare meetings with purpose and questions; record outcomes and proposed next
steps. A meeting record without next steps is flagged.

## SOP-DEC-01 — Decision proposal and approval
Propose decisions with a recommendation and rationale; an authorized manager
approves. Approved decisions are immutable (superseded, never edited). An
approved decision without a rationale is flagged.

## SOP-COMMIT-01 — Commitment and follow-up
Record commitments with an internal owner and due date; follow up to completion.
Commitments without an owner or due date, and closed cases with open
commitments, are flagged.

## SOP-CLOSE-01 — Closure, duplicate handling and reopening
Close with a closure reason. Reopening requires the appropriate role and a
recent step-up. Duplicate cases are handled manually — never auto-merged.

## SOP-ACCESS-01 — Employee access and offboarding
Grant time-limited PilotAccess with independent approval; conduct periodic
access reviews; offboard by revoking sessions, suspending pilot access,
reassigning open cases, and completing an auditable offboarding record.

## SOP-INCIDENT-01 — Security-event and incident handling
Triage security events; open, work and close incidents with lessons learned and
authorized approval. Critical closure requires a recent step-up.

## SOP-RECOVERY-01 — Backup, restore and recovery
Run `internal:backup:smoke` and `internal:restore:verify`; the latter
re-verifies the audit chain in the restored database. Record the restore result
as a readiness signal. Backups are never committed and never contain real data.

## SOP-SUSPEND-01 — Emergency pilot suspension
Set `P4_PILOT_SUSPENDED=true` to stop internal operations immediately; the
public Gateway and Digital Reception Lite are unaffected. Record the decision
and re-enable only after review.
