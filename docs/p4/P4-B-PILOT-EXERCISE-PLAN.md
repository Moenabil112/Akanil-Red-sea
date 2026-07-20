# P4-B — Pilot Exercise Plan

Exercises use **synthetic or de-identified data only**; no real credentials are
recorded. A failed or blocked exercise requires a deviation and creates a
corrective action. No employee approves an exercise they executed alone
(approver independence). Records are never deleted. Human observation is
required — test automation supports but does not replace it.

## Exercise types (§16)

EMPLOYEE_ONBOARDING, EMPLOYEE_OFFBOARDING, ROLE_CHANGE, MANUAL_CASE_CREATION,
CASE_ASSIGNMENT, QUALIFICATION_REVIEW, INFORMATION_GAP, MEETING_PREPARATION,
DECISION_APPROVAL, COMMITMENT_FOLLOW_UP, CASE_CLOSURE_AND_REOPEN,
SESSION_REVOCATION, ACCOUNT_LOCKOUT, OBJECT_ACCESS_DENIAL, CONCURRENCY_CONFLICT,
AUDIT_CHAIN_VERIFICATION, BACKUP_AND_RESTORE, INCIDENT_RESPONSE,
PUBLIC_INTERNAL_BOUNDARY, INTERNAL_FEATURE_SHUTDOWN.

## Workflow

1. **Plan** (`exercise.manage`): type, title, expected result.
2. **Start**: records the executor and start time.
3. **Record result**: PASSED / PASSED_WITH_OBSERVATIONS / FAILED / BLOCKED with
   the actual result; FAILED/BLOCKED require a deviation and auto-create a
   corrective action.
4. **Approve** (`exercise.approve`): a different person than the executor.

## Minimum demonstrated evidence (§29)

Employee provisioning + independent approval; role change with
requester/approver separation; pilot-access expiry; forced password change;
account lockout & recovery; single-session and all-session revocation;
offboarding with open-case reassignment; case creation & assignment; specialist
recommendation → manager approval; invalid decision approval blocked; closed-case
reopen with step-up; unauthorized object-access denial; optimistic-concurrency
conflict; audit-chain verification; **simulated broken-chain detection in an
isolated test database**; backup & restore; incident creation & closure;
emergency pilot suspension; public-site continuity while suspended.

## Where this is exercised

Much of the above is exercised automatically in
`tests/integration/p4b-governance.integration.test.ts` and
`tests/p4b-*.test.ts` (against dedicated/synthetic databases), and manually via
the readiness → exercises view. Tamper simulation is performed only on isolated
test databases or detached in-memory copies — never on the development or any
real database.

## Corrective actions (§17)

Source-linked (pilot exercise, incident, access review, audit-integrity, backup
test, security review, operational observation). Completion requires
independent verification (verifier ≠ owner). Accepting residual risk requires an
OPERATIONS_MANAGER and a rationale; critical items cannot be silently accepted.
Overdue actions surface on the readiness panel.
