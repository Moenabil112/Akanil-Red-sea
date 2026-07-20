# ADR-025 — Pilot operating modes and emergency suspension

Date: 2026-07-20 · Status: accepted

## Context

P4-B prepares the internal system for a controlled, employee-only pilot. The
system must distinguish "no operational data", "synthetic validation" and
"limited internal pilot", and must support an immediate, authoritative stop
that does not affect the public Gateway. P4-A's `P4_INTERNAL_ENABLED` flag is
preserved.

## Decision

- **`P4_OPERATION_MODE` ∈ {disabled, validation, pilot}**, read only on the
  server (`lib/internal/env.ts`). It fails closed to `disabled` when
  `P4_INTERNAL_ENABLED` is off or the value is absent/invalid. There is **no
  "production" mode** in P4-B.
- **`P4_PILOT_SUSPENDED`** is a separate emergency kill switch. When exactly
  `"true"`, `internalMutationsAllowed()` returns false, `requireEmployee`
  redirects non-security roles to a suspension notice, and operational actions
  are blocked. Environment-level suspension is authoritative; an internal
  action may record a suspension decision but cannot override the env.
- **Public independence.** The middleware matcher and every public route are
  independent of these variables; the public build never reads the database and
  is unaffected by mode or suspension.
- A **server-rendered environment banner** shows validation / pilot /
  suspended state; it never shows secrets or infrastructure details.

## Consequences

- The most restrictive interpretation always wins; a missing or malformed value
  degrades to `disabled`, never to a more permissive state.
- Browser code cannot change the mode; all enforcement is server-side.
- No "production" path exists in this package — production remains a separate,
  future authorization.
