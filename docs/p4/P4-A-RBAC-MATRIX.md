# P4-A — RBAC Matrix

Single default-deny matrix in `lib/internal/rbac.ts`. A role holds a permission
only if it is listed; everything else is denied. Enforced server-side on every
page and mutation, plus object-level case access for assigned-only roles.
Verified by `tests/p4a-rbac-lifecycle.test.ts`.

Roles: **SA** = SYSTEM_ADMIN · **OM** = OPERATIONS_MANAGER · **CM** =
CASE_MANAGER · **SR** = SPECIALIST_REVIEWER · **FC** = FORUM_COORDINATOR ·
**RA** = READ_ONLY_AUDITOR.

| Permission | SA | OM | CM | SR | FC | RA |
| --- | --- | --- | --- | --- | --- | --- |
| view.dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| case.viewAll | ✓ | ✓ | — | — | — | ✓ |
| case.viewAssigned | — | — | ✓ | ✓ | ✓ | — |
| case.create | — | — | ✓ | — | — | — |
| case.updateDetails | — | ✓ | ✓ | — | — | — |
| case.assign | — | ✓ | — | — | — | — |
| case.transition | — | ✓ | ✓ | — | — | — |
| case.close | — | ✓ | — | — | — | — |
| case.reopen | ✓ | ✓ | — | — | — | — |
| note.create | — | — | ✓ | ✓ | ✓ | — |
| qualification.recommend | — | — | ✓ | ✓ | — | — |
| qualification.approve | — | ✓ | — | — | — | — |
| gap.manage | — | — | ✓ | ✓ | — | — |
| evidence.manage | — | — | ✓ | — | — | — |
| meeting.prepare | — | — | ✓ | — | ✓ | — |
| meeting.record | — | — | ✓ | — | ✓ | — |
| decision.propose | — | — | ✓ | — | ✓ | — |
| decision.approve | — | ✓ | — | — | — | — |
| commitment.manage | — | ✓ | ✓ | — | ✓ | — |
| organization.viewAll | ✓ | ✓ | ✓ | — | — | ✓ |
| organization.manage | — | ✓ | ✓ | — | — | — |
| contact.manage | — | ✓ | ✓ | — | — | — |
| audit.view | ✓ | ✓ | — | — | — | ✓ |
| user.manage | ✓ | — | — | — | — | — |
| system.config | ✓ | — | — | — | — | — |

## Object-level access

Roles with `case.viewAll` (SA, OM, RA) may open any case. Roles with only
`case.viewAssigned` (CM, SR, FC) may open a case only if they are its current
owner or hold an active assignment (`canAccessCase`). Every case mutation
re-checks object-level access before the permission service runs.

## Separation of duties

- A reviewer/case-manager may *recommend* a qualification outcome; only an
  OPERATIONS_MANAGER may *approve* it.
- A case-manager/forum-coordinator may *propose* a decision; only an
  OPERATIONS_MANAGER may *approve/reject* it, and an approved decision cannot be
  silently edited (superseding only).
- Only SYSTEM_ADMIN manages accounts and system configuration; SYSTEM_ADMIN
  cannot erase audit history or edit approved decisions.
- READ_ONLY_AUDITOR can view authorized records and the audit trail but can
  never create, edit, assign, decide, delete or download (no export in the
  first release).
