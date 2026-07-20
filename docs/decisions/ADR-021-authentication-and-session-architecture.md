# ADR-021 — Authentication and session architecture

Date: 2026-07-20 · Status: accepted

## Context

P4-A requires employee-only authentication with password credentials and
**database-backed, revocable sessions**, an absolute session lifetime, an idle
timeout, forced first-login password change, account lockout, and session
invalidation on password reset or account disablement. No self-registration,
no external invitations, no social login, no password-reset email.

## Decision

- **Custom database-backed sessions rather than Auth.js.** Auth.js v5's
  Credentials provider does not support the database session strategy (it forces
  stateless JWTs), which conflicts with the mandatory revocable, server-stored,
  absolute+idle session model. A purpose-built session (`lib/internal/session.ts`
  + `session-store.ts`) satisfies every required control directly: a random
  32-byte token is set in an HttpOnly, SameSite=Lax, Secure-in-production cookie;
  only its SHA-256 hash is stored; sessions carry `absoluteExpiry` and a sliding
  `idleExpiry`, are revocable per-session and per-employee, and are invalidated
  on reset/disable. CSRF is mitigated by SameSite cookies plus same-origin
  server actions (`form-action 'self'`, no cross-origin form posts).
- **Argon2id** password hashing via `@node-rs/argon2` (maintained, prebuilt
  N-API binaries, Node 22 compatible), memory-hard parameters (19 MiB, t=2,
  p=1). Minimum password length 14. Generic authentication errors that never
  disclose whether an email exists; a constant-time verify against a dummy hash
  on the no-such-user path.
- **Lockout**: failed attempts increment a counter; at the configured threshold
  the account is LOCKED for a configurable window. Success clears the counter
  and auto-unlocks an expired lock. Disabled accounts can never authenticate.
- **Administrative provisioning only**: accounts are created via CLI scripts or
  a SYSTEM_ADMIN action; passwords are read from an environment variable, never
  argv; no default admin credential exists; new accounts must change their
  password on first login.

## Consequences

- No dependency on an authentication framework whose session model conflicts
  with the requirements; the security controls are explicit and unit/integration
  tested. The trade-off is that we own the session code — kept small, reviewed,
  and covered by tests. If a compliant framework session model becomes
  available it can replace this behind the same `requireEmployee`/`assertCan`
  surface.
