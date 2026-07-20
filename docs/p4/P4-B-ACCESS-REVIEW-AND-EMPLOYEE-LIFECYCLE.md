# P4-B — Access Review and Employee Lifecycle

## Two-person access changes (§7)

`AccessChangeRequest` change types: CREATE_EMPLOYEE_ACCESS, CHANGE_ROLE,
ENABLE_ACCOUNT, DISABLE_ACCOUNT, GRANT/SUSPEND/REVOKE_PILOT_ACCESS,
RESET_PASSWORD, REVOKE_SESSIONS. Status: DRAFT, PENDING_APPROVAL, APPROVED,
REJECTED, APPLIED, EXPIRED, CANCELLED.

- A requester can never approve or apply; a target can never approve or apply
  their own change (`assertChangeSeparation`).
- Role and account-state changes are applied only from an APPROVED request —
  never silently. `CHANGE_ROLE`, `ENABLE_/DISABLE_ACCOUNT` and `REVOKE_SESSIONS`
  are applied here; pilot and password changes flow through their dedicated,
  step-up-gated services.
- Requests expire (`expireStaleAccessChanges`); history is never deleted.
- Approve/apply require a recent step-up reauthentication.

## Periodic access review (§10)

`AccessReview` snapshots the employee's role, pilot-access status, active
session count, open case count and open commitment count. Outcomes: RETAIN,
MODIFY, SUSPEND, REVOKE, FURTHER_REVIEW_REQUIRED.

- A reviewer can never review their own access.
- An outcome never silently changes access: MODIFY/SUSPEND/REVOKE creates an
  `AccessChangeRequest` for independent approval.
- `P4_ACCESS_REVIEW_DAYS` (default 30) sets the next-review cadence; overdue
  reviews surface in the readiness panel. No external notification.

## Employee lifecycle & offboarding (§9)

Lifecycle stages: PROVISIONING, ACTIVE, SUSPENDED, OFFBOARDING, DISABLED.
SUSPENDED/OFFBOARDING/DISABLED stages block login and invalidate sessions
(`auth.login`, `session.getCurrentEmployee`).

Offboarding (`services/lifecycle.ts`):

1. `beginOffboarding` sets stage OFFBOARDING, revokes all sessions, suspends
   pilot access, and prevents new login. An employee cannot offboard themselves.
2. The offboarding checklist (`offboardingReadiness`) lists open owned cases,
   open commitments and active sessions.
3. `completeOffboarding` refuses to complete while any open case is still owned
   by the employee (reassign first). On completion the account is DISABLED,
   pilot access REVOKED, and completion is recorded with
   sessionsRevokedConfirmedAt / casesReassignedConfirmedAt.
4. The employee record is **never deleted** and historical authorship / audit
   attribution is **never reassigned**.
