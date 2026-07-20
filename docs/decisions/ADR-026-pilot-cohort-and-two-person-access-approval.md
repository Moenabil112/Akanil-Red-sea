# ADR-026 — Pilot cohort and two-person access approval

Date: 2026-07-20 · Status: accepted

## Context

An active employee account alone must not grant pilot operational access, and
privileged access changes (role changes, account enable/disable, pilot
grant/suspend/revoke, session revocation, password reset) must not be possible
by one person acting alone.

## Decision

- **`PilotAccess`** is a distinct, time-limited record. Operational case work
  requires an `APPROVED`/`ACTIVE`, in-window, non-suspended, non-revoked record
  (`lib/internal/pilot.ts`, `assertPilotOperational`). Governance roles
  administer the cohort by RBAC permission and do not need a pilot record.
  Durations are capped by `P4_PILOT_ACCESS_MAX_DAYS` (no indefinite access).
- **`AccessChangeRequest`** implements a two-person process. Requests are
  proposed, independently approved, then applied. Separation of duties is
  enforced in the service layer (`access-governance.ts`): a requester can never
  approve or apply, and a target can never approve or apply their own change. A
  `SYSTEM_ADMIN`-role pilot grant additionally requires a SYSTEM_ADMIN or
  OPERATIONS_MANAGER approver.
- **Role changes are never silent**: `CHANGE_ROLE` is applied only from an
  `APPROVED` request, and every step is audited.
- Revoking or suspending pilot access **immediately revokes the employee's
  active sessions**.

## Consequences

- The cohort is auditable end to end; no account is "automatically" in the
  pilot.
- One compromised or mistaken actor cannot elevate privileges alone.
- CLI provisioning is retained for bootstrapping but privileged changes are
  expected to flow through (or be recorded by) the approval process.
