# ADR-032 — limited_internal mode and authorization boundary

Date: 2026-07-20 · Status: accepted

## Context

P4-C introduces a `limited_internal` operating mode for a controlled,
employee-only limited-operations release. The environment value alone must never
be sufficient to authorize operational use, and the mode must not weaken any
P4-B control.

## Decision

- **`P4_OPERATION_MODE` gains `limited_internal`** (`lib/internal/env.ts`),
  read only on the server and fail-closed to `disabled`. No "production" mode.
- **The environment value alone never authorizes it.** Operational access in
  `limited_internal` additionally requires — enforced by
  `assertPilotOperational` → `assertLimitedInternalAuthorized` — an **ACTIVE,
  in-window LimitedOperationsAuthorization**, plus its employee limit (≤ the
  configured maximum, 1–6) and case limit (1–10), plus the allowed data
  categories (SYNTHETIC / DE_IDENTIFIED only). All twelve §8 preconditions
  (feature flag, not suspended, active account, valid session, RBAC,
  object-level authz, pilot access, active authorization, validity window,
  employee limit, case limit, data category) must hold; any failure fails
  closed. There is **no silent fallback** from `limited_internal` to `pilot`.
- **The authorization is a superseding, human-approved record.** Decisions are
  human-only, separation of duties is enforced (proposer ≠ reviewer ≠ approver;
  no self-approval), final approval requires step-up, and an authorization can
  never become ACTIVE while a critical gate is failing (open critical incident
  or corrective action, a broken audit chain, a failed restore test, or an
  active pilot suspension). SYSTEM_ADMIN cannot unilaterally approve go-live.
- A visible **Limited Internal Operations** banner states employee-only scope,
  the authorization expiry, and that there is no external access.

## Consequences

- Turning on the mode without an approved authorization yields no operational
  access — the system stays fail-closed.
- Every P4-B control (RBAC, object-level authz, pilot access, step-up, audit
  chain, incident handling, emergency suspension) continues to apply unchanged.
