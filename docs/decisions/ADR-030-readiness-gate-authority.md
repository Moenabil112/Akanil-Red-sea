# ADR-030 — Readiness-gate authority

Date: 2026-07-20 · Status: accepted

## Context

Whether to start (or stop) a limited internal pilot must be a human decision
supported by controlled evidence. The application must never automatically
authorize a pilot, must not present a vanity score, and must not claim
production readiness.

## Decision

- **Explicit per-area statuses**, no percentage. `getReadinessAreas`
  (`services/readiness.ts`) reports each area as
  NOT_TESTED / PASS / PASS_WITH_OBSERVATIONS / FAIL / BLOCKED / EXPIRED. Some
  areas are computed live (audit chain, security events, incidents, exercises,
  corrective actions, access reviews, cohort); others are evidence-based signals
  recorded by controlled commands/exercises (`ReadinessSignal`).
- **Gate is a recorded human decision.** `ReadinessGate` is append-only; the
  latest row is current. `setReadinessGate` requires `readiness.approve` and a
  recent step-up, and **refuses to advance to a pilot-ready state while any
  critical area is FAIL** (audit chain, unresolved high/critical security
  events, high/critical open incidents, unresolved failed/blocked exercises,
  critical open corrective actions).
- **Gate states** are limited to NOT_READY, READY_FOR_LIMITED_INTERNAL_PILOT,
  LIMITED_INTERNAL_PILOT_ACTIVE, PILOT_SUSPENDED, PILOT_COMPLETED_PENDING_REVIEW.
  There is no "production ready" state.

## Consequences

- A pilot can only be authorized by an authorized human, and only when critical
  evidence is not failing.
- The readiness view is decision support, not certification; it makes no ISO /
  SOC / pen-test / legal / production claim.
