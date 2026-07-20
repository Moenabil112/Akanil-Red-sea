# P4-A — Security and Access Baseline

Implemented technical controls for the internal employee system. This records
what P4-A implements; unresolved legal/compliance review items are listed
separately at the end.

## Authentication

- Argon2id password hashing (`@node-rs/argon2`, memory-hard: 19 MiB, t=2, p=1).
- Minimum password length 14; obvious weak values rejected.
- Generic authentication errors; email existence is never disclosed (constant-
  time verify against a dummy hash on the no-such-user path).
- No self-registration, no external invitations, no social login, no public
  magic links, no password-reset email, no SSO, no anonymous access.
- Accounts are provisioned administratively (CLI or SYSTEM_ADMIN); no default
  admin credential exists; passwords are read from the environment, never argv,
  and never logged or printed.
- Forced password change on first login.

## Sessions

- Database-backed and revocable; the raw 32-byte token lives only in an
  HttpOnly cookie, and only its SHA-256 hash is stored.
- Cookie flags: HttpOnly, SameSite=Lax, Secure outside local development,
  Path=/.
- Absolute expiry (default 8h) and sliding idle timeout (default 60m), both
  configurable via `P4_SESSION_MAX_AGE_MINUTES` / `P4_SESSION_IDLE_TIMEOUT_MINUTES`.
- Sessions are revoked on password change, password reset and account
  disablement; expired/idle sessions are revoked on next use.
- No "remember me". Raw IP addresses are not stored.

## Lockout

- Failed-login counter; lock after `P4_LOGIN_MAX_FAILURES` (default 5) for
  `P4_LOGIN_LOCK_MINUTES` (default 15). Success clears the counter and
  auto-unlocks an expired lock. Disabled accounts can never authenticate.

## Authorization

- Single default-deny permission matrix (`lib/internal/rbac.ts`), enforced
  server-side in every page (`requireEmployee`) and every mutation (service
  `assertCan`), plus object-level case access (`canAccessCase`) for roles that
  see only assigned cases. UI visibility is never the security boundary.

## Route protection and headers

- `P4_INTERNAL_ENABLED` defaults to false; when disabled the system fails closed
  and the public build needs no database.
- `middleware.ts` sets on every internal route: `X-Robots-Tag: noindex,
  nofollow, noarchive, nosnippet`; `Cache-Control: no-store`;
  `X-Content-Type-Options: nosniff`; `Referrer-Policy: no-referrer`;
  `Permissions-Policy` (camera/microphone/geolocation/interest-cohort off); and a
  strict CSP (`default-src 'self'`, `frame-ancestors 'none'`, `form-action
  'self'`, `base-uri 'self'`, no third-party scripts). Internal pages are
  `force-dynamic`.
- `app/robots.ts` disallows `/[lang]/internal/`; internal routes are absent from
  the sitemap and from public navigation.

## Data minimization

- Only professional operational data is collected. Passport numbers, national
  identifiers, banking details, private residential addresses and sensitive
  personal categories are never collected (enforced by schema and privacy
  tests). Free-text fields carry warnings not to paste secrets or complete
  confidential documents.
- Classification labels INTERNAL / CONFIDENTIAL / RESTRICTED apply to cases,
  notes and evidence references. No case is public.

## Auditability and integrity

- Append-only audit trail with sensitive-field redaction; no delete path.
- Append-only notes; immutable approved decisions (superseding only); preserved
  assignment history; single active owner; optimistic concurrency on critical
  records.

## Unresolved legal / compliance review (not certified here)

- Formal data-protection/records-retention policy and legal basis review.
- Independent penetration test (P4-A claims no penetration-test certification).
- Production key management, backup encryption, and hosting security review
  (P4-A configures no production infrastructure).
- Regulatory review of cross-border personal-data handling.
