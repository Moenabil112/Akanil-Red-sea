# P4-B — Pilot Boundary and Cohort Control

## Release boundary (unchanged, enforced)

The pilot is restricted to authorized Akanil employees. No external account,
organization, Forum participant, investor, supplier, sponsor, consultant or
counterpart may log in. No self-registration, no external invitation, no client
or participant portal. The following remain absent: data room, file upload,
object storage, external document links/preview, external notifications, email
automation, SMS, WhatsApp, push, calendar/scheduling integrations, public case
tracking, public case numbers, external webhooks, automatic matchmaking, AI
provider/decision-making, direct public-form DB submission, and
payment/contracting/banking. Boundary tests (`tests/p4b-boundary.test.ts`) fail
the build if any of these is reintroduced.

## Operating modes (§5)

`P4_OPERATION_MODE` is read only on the server and fails closed to `disabled`:

| Mode | Behaviour |
| --- | --- |
| disabled | No operational data or mutations; public site normal; public static build needs no DB. |
| validation | Synthetic / de-identified data only; pilot-cohort enforced; no real-use claim. |
| pilot | Limited approved employee cohort; internal operational use; still no external accounts/integrations; not production. |

The banner in the internal layout shows Validation / Internal pilot / Suspended.

## Cohort control (§6)

`PilotAccess` fields: employee, status (REQUESTED→APPROVED/ACTIVE→
SUSPENDED/REVOKED/EXPIRED), approvedRole, requestedBy, approvedBy,
justification, startsAt, expiresAt, suspendedAt, revokedAt, recordVersion.

Rules (enforced in `services/access-governance.ts` + `lib/internal/pilot.ts`):

- The employee must already be ACTIVE; an account alone grants nothing.
- Requester ≠ approver; an employee cannot approve their own access.
- SYSTEM_ADMIN-role access requires a SYSTEM_ADMIN or OPERATIONS_MANAGER
  approver.
- Access has a start and expiry; duration is capped by
  `P4_PILOT_ACCESS_MAX_DAYS` (default 30) — no indefinite access.
- Expired / suspended / revoked access immediately blocks operational use
  (`assertPilotOperational`); suspension and revocation revoke all sessions.
- Records are never deleted; all changes are audited.

## Pilot data boundary (§15)

Every case declares `pilotDataCategory ∈ {SYNTHETIC, DE_IDENTIFIED}`. Live
personal, confidential, banking, government-identity, password or secret data is
impossible by type and rejected by the service. The new-case form shows the
data-minimization warning. Evidence references remain metadata only — no upload.
