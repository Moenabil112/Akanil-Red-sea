# ADR-027 — Step-up authentication for sensitive actions

Date: 2026-07-20 · Status: accepted

## Context

Sensitive actions (approving/applying role changes, disabling/enabling
accounts, resetting passwords, revoking all sessions, granting/revoking pilot
access, reopening a closed case, approving a final qualification outcome,
approving/superseding a decision, closing a restricted case, acknowledging a
critical incident, changing security-sensitive configuration) must require a
recent password reauthentication. No email/SMS/external MFA in this package.

## Decision

- **Session-bound recent-auth timestamp.** `Session.stepUpVerifiedAt` records
  the most recent successful reauthentication on the current session.
  Reauthentication verifies the password server-side (`auth.reauthenticate`),
  never stores it, and only stamps the timestamp — it does **not** create a
  second long-lived login.
- **Window** is `P4_STEPUP_WINDOW_MINUTES` (default 15). `isRecentStepUp` /
  `assertRecentStepUp` (`lib/internal/step-up.ts`) are framework-free so
  services and tests can use them.
- **Server enforcement.** Sensitive server actions call `ensureStepUp`, which
  redirects to `/internal/step-up?next=…` when the window has lapsed. UI hiding
  is never the boundary.
- **Monitoring.** A failed reauthentication records a `REAUTHENTICATION_FAILURE`
  security event; a success records an audit event with no sensitive data.

## Consequences

- Sensitive actions cannot proceed without a fresh password check.
- Stronger MFA (WebAuthn / TOTP) is recorded as future work; no external MFA
  provider is introduced now.
