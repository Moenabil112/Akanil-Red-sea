# QA Report — P4-A Internal Secure Operations Foundation and Case-Management MVP

Date: 2026-07-20 · Branch: `feature/p4a-internal-secure-case-management`
Base: `main` (approved P3 merge commit `a2a22935fe0d84773e39ca015250486e0b987de0`).
Not merged; not deployed; no production service connected.

This release is an **internal, limited Akanil-employee system**. Accounts are
created administratively only. There is no self-registration, no external
account, no client/participant portal, no data room, no file upload, no
external notification, no calendar integration, no automatic matching and no
AI decision-making. The public Digital Reception Lite remains disconnected
from the internal database.

## Quality gates

| Gate | Result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | **0 errors** |
| `npm run lint` (`next lint`) | **0 warnings, 0 errors** |
| `npm test` (jsdom: unit + component + boundary) | **14 files, 189/189 passing** — adds `tests/p4a-rbac-lifecycle.test.ts` (14) and `tests/p4a-boundary.test.ts` (12) |
| `npm run test:integration` (node + PostgreSQL 16) | **1 file, 10/10 passing** — `tests/integration/p4a-cases.integration.test.ts` |
| `npm run build` (with internal enabled) | ✓ compiled |
| **Fail-closed build** (`P4_INTERNAL_ENABLED=false`, **no** `DATABASE_URL`, **no** `AUTH_SECRET`) | ✓ compiled — **107 static public pages**, exit 0; internal routes remain `ƒ` dynamic and reveal nothing |

CI (`.github/workflows/quality.yml`) provisions a `postgres:16-alpine` service
with synthetic local credentials, runs `db:generate` → `db:migrate:test` →
`typecheck` → `test` → `test:integration` → `build` → `lint`. No deployment
step, no cloud database, no analytics, no production credentials.

## Fail-closed and public/internal separation

- With `P4_INTERNAL_ENABLED` absent or not exactly `"true"`, `internalEnabled()`
  returns `false`; internal pages short-circuit before any database access and
  the Prisma client (lazy singleton) is never constructed. The **public build
  succeeds with no database and no auth secret** (verified above).
- The public Digital Reception Lite has **no** submission API, **no** write to
  the P4 database, **no** public case reference and **no** internal-status
  exposure. Enforced by `tests/p4a-boundary.test.ts`.
- `app/robots.ts` disallows `/ar|fr|en/internal/`; `middleware.ts` sets
  `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` and
  `Cache-Control: no-store` on every internal response. Route hiding is **not**
  the security boundary — every internal page and server action re-checks
  authentication and authorization server-side.

## Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA)

**13 internal page/state/viewport combinations** rendered in real Chromium
against the running production server — **0 violations total**. axe is injected
through the DevTools protocol (`page.evaluate`), so the internal
`Content-Security-Policy` (`script-src 'self' 'unsafe-inline'`, `connect-src
'self'`, no third-party origins) governs normal use while the scan still runs.

| Screen | Locale / viewport | Violations |
| --- | --- | --- |
| Login | EN desktop | 0 |
| Login | AR phone (RTL) | 0 |
| Unauthorized `/en/internal/cases` → redirect to login | EN desktop | 0 (redirect verified) |
| Dashboard | EN desktop | 0 |
| Cases list | FR desktop | 0 |
| Case detail | EN desktop | 0 |
| Organizations | EN desktop | 0 |
| My work | EN desktop | 0 |
| Audit trail | EN desktop | 0 |
| Dashboard | AR desktop (RTL) | 0 |
| New case | AR desktop (RTL) | 0 |
| User administration | EN desktop | 0 |
| Access denied (admin → `cases/new`) | EN desktop | 0 (denied redirect verified) |

Verified in-browser: exactly **one H1 per internal page**; every form control
has an accessible name (labels or `aria-label`, including all reassign /
qualification / gap / decision / commitment / user-admin selects); status is
conveyed by text (status pills and `[STATE]` prefixes), never colour alone;
native Arabic RTL; reduced-motion contexts used for capture. Screenshots
contain **no real credentials** — only synthetic `@akanil.example` accounts and
clearly-marked synthetic organizations and cases.

## Authentication, session and authorization

Exercised by `tests/p4a-rbac-lifecycle.test.ts` and the integration suite:

- **Argon2id** password hashing (`@node-rs/argon2`, memoryCost 19456, timeCost
  2, parallelism 1); minimum length 14; generic failure messages; temporary
  lockout after 5 failed attempts for 15 minutes; a constant timing-dummy hash
  on the no-such-user path.
- **Database-backed sessions**: only a SHA-256 hash of the opaque token is
  stored; cookie is HttpOnly, `SameSite=Lax`, `Secure` outside development;
  absolute (8 h) and idle (60 min) expiry enforced server-side; sessions are
  revocable and are revoked on password reset.
- **Default-deny RBAC** (`lib/internal/rbac.ts`, single source of truth) across
  six roles, plus object-level case access checks (`canAccessCase`) on every
  case page and mutation. Unauthorized navigation redirects to `/internal/denied`.
- Administratively provisioned accounts only; `mustChangePassword` forces a
  first-login rotation. **No** "Sign up", "Register", "Create account" or
  external-invitation action exists anywhere in the interface.

## Case model, lifecycle and audit

- Transaction-safe case reference `AKN-YYYY-000001` via a `Counter` upsert +
  increment inside the create transaction (integration test asserts strictly
  increasing, gap-free references under concurrent creation).
- Server-enforced **10-state lifecycle machine** with optimistic concurrency
  (`recordVersion`); invalid transitions rejected; closure reasons required for
  closure states; reopen returns to triage.
- **Append-only** audit trail with field redaction (passwords, hashes, tokens,
  secrets, bodies never persisted in audit payloads); append-only internal
  notes; approved decisions are immutable (superseded, never edited). Verified
  by `redactFields` unit tests and the decision-immutability integration test.

## Prohibited-feature and privacy scan

`tests/p4a-boundary.test.ts` asserts the absence of: public account creation /
self-registration / invitation, external portals, data rooms, file upload,
email/SMS/WhatsApp/calendar/webhook notification, automatic partner matching,
AI decision-making, public case tracking and public write-back from the
reception form. The pre-existing ecosystem privacy scan
(`tests/ecosystem-architecture.test.ts`) is scoped to exclude the internal app
and generated Prisma client, which legitimately use cookies and `"use server"`.

## Screenshots (`docs/qa/screenshots-p4a/`)

login-en · login-ar-mobile · unauthorized-access · dashboard-en · cases-fr ·
case-detail-en · organizations-en · work-en · audit-en · dashboard-ar ·
new-case-ar · user-administration-en · access-denied-en. All show synthetic
data only.

## Backup / restore

`scripts/internal/backup-restore-smoke.sh` performs a `pg_dump` → drop → restore
into a scratch database and confirms all 17 tables return, exercising the
documented local recovery path. No dumps are committed.

## Known limitations

- **CSP** currently uses `script-src 'self' 'unsafe-inline'` because the Next.js
  App Router ships an inline hydration bootstrap. No third-party script origin
  is permitted. A nonce-based CSP is recorded as future work (see
  `docs/decisions/ADR-021`).
- `NEXT_PUBLIC_SITE_URL` unset ⇒ `metadataBase` omitted; unchanged from prior
  phases and irrelevant to the noindexed internal surface.
- `next lint` deprecation notice (Next 16) — informational.

## Out of scope (not implemented, recorded as future-phase work)

External / participant / investor / supplier accounts, self-registration,
client or participant portal, data room, file upload, external notification
(email / SMS / WhatsApp), calendar integration, webhooks, automatic partner
matching, AI decision-making, public case tracking, payment or contracting,
live logistics intelligence, and any production deployment. None were
activated; the branch is not merged and has not been deployed.
