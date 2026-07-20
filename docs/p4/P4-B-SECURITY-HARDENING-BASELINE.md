# P4-B — Security Hardening Baseline

## Authentication & step-up (§8)

- Argon2id password hashing (unchanged from P4-A); minimum length 14; generic
  errors; 5/15 lockout; timing-dummy hash on the no-user path.
- Step-up reauthentication (`lib/internal/step-up.ts`) required for sensitive
  actions, within `P4_STEPUP_WINDOW_MINUTES` (default 15). The password is
  verified server-side and never stored; success only stamps
  `Session.stepUpVerifiedAt`. Failures record a `REAUTHENTICATION_FAILURE`
  security event.

## Session control (§11)

- Database-backed, revocable sessions with absolute + idle expiry (P4-A),
  invalidated on password reset, account disablement, an offboarding/suspended
  lifecycle stage, or pilot suspension.
- Session administration exposes only privacy-minimized attributes (id, created,
  last activity, expiry, coarse `deviceLabel`) — never raw tokens, token hashes,
  IP addresses or full user-agent strings.
- Employee-facing "sign out my other sessions"; explicit
  `internal:sessions:cleanup` maintenance (never automatic on public startup).

## Authorization (RBAC, §24)

Default-deny matrix (`lib/internal/rbac.ts`) extended with governance
permissions (pilot.*, access.change.*, access.review.conduct,
employee.lifecycle, session.admin, security.event.*, incident.*, exercise.*,
corrective.*, readiness.*, audit.verify). Object-level checks (case access,
separation of duties) remain. Governance permissions are kept away from
operational-only roles; the read-only auditor stays read-only.

## Security headers & cache (§22)

Middleware sets, on every internal response: `X-Robots-Tag: noindex, nofollow,
noarchive, nosnippet`; `Cache-Control: no-store`; `X-Content-Type-Options:
nosniff`; `Referrer-Policy: no-referrer`; a restrictive `Permissions-Policy`;
and a CSP that permits **no third-party script origin** (`frame-ancestors
'none'`, `form-action 'self'`, `base-uri 'self'`). No analytics, no external
fonts on authenticated pages, no internal identifiers in public metadata.

## Logging hygiene (§23)

`lib/internal/logger.ts` redacts password, passwordHash, tokens, secrets,
AUTH_SECRET, DATABASE_URL, cookies, authorization headers, confidential note
bodies and unnecessary contact details — recursively and case-insensitively —
before anything is emitted. Output is the process console only; no external
logging vendor. Redaction is covered by unit tests. Security events reuse the
same redaction for their `detail` payload.

## Audit integrity (§12)

Tamper-evident hash chain (see ADR-028 / P4-B-AUDIT-INTEGRITY-DESIGN.md).

## Operating mode & emergency stop (§5/§19)

Server-enforced modes (fail-closed) and the `P4_PILOT_SUSPENDED` kill switch
(see ADR-025). The public Gateway is unaffected by either.
