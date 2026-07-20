# QA Report — P4-B Internal Pilot, Security Hardening and Operational Validation

Date: 2026-07-20 · Branch: `feature/p4b-internal-pilot-security-validation`
Base: `main` (approved P4-A merge `eb3f02c`). Merged into `main` via PR #8
(merge commit `84e868b`) and accepted as the P4-C baseline; not deployed; no
production service configured. **P4-B does not authorize production.**

This release hardens and validates the internal, **employee-only** system for a
controlled pilot with separately approved, time-limited pilot access. The
public Gateway and Digital Reception Lite are unchanged and remain disconnected
from the internal database.

## Quality gates

| Gate | Result |
| --- | --- |
| `npm run typecheck` | **0 errors** |
| `npm run lint` | **0 warnings** |
| `npm test` (jsdom: unit + component + boundary) | **17 files, 221/221** — adds `p4b-audit-integrity` (10), `p4b-security-logic` (12), `p4b-boundary` (10) |
| `npm run test:integration` (node + PostgreSQL 16) | **2 files, 23/23** — adds `p4b-governance.integration` (13) |
| `npm run internal:audit:test` | audit hash-chain suite passes |
| `npm run build` (internal enabled) | ✓ compiled |
| **Fail-closed build** (`P4_INTERNAL_ENABLED=false`, no `DATABASE_URL`, no `AUTH_SECRET`) | ✓ compiled — public static pages; internal routes remain dynamic and reveal nothing |
| `npm run internal:audit:verify` (dev DB, chained) | Chain OK |
| Backup + restore verification | checksum + manifest + restore + audit-chain re-verify + cleanup |

CI (`.github/workflows/quality.yml`) runs the P4-B sequence with a
`postgres:16-alpine` service and synthetic credentials: `npm ci` → `db:generate`
→ `db:migrate:test` → `typecheck` → `test` → `test:integration` → `build` →
`lint` → `internal:audit:test` → `internal:backup:smoke` →
`internal:audit:verify` → migration status → committed-secret scan →
dependency audit. No deployment, no cloud secrets, no analytics.

## Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA)

**All P4-B screens — 0 violations**, in real Chromium against the running
production server, across pilot, validation and suspended modes and three
locales (axe injected via CDP so the internal CSP still governs normal use):

| Screen | Locale / mode | Violations |
| --- | --- | --- |
| Dashboard with pilot-mode banner | EN pilot | 0 |
| Readiness (gate + areas + audit-integrity) | EN pilot | 0 |
| Pilot access / cohort / changes / reviews / lifecycle / sessions | EN pilot | 0 |
| Pilot exercises + corrective actions | EN pilot | 0 |
| Backup & recovery | EN pilot | 0 |
| Security-event queue | EN pilot | 0 |
| Incidents list | EN pilot | 0 |
| Security incident detail | EN pilot | 0 |
| Step-up authentication prompt | EN pilot | 0 |
| Readiness (RTL, phone) | AR pilot | 0 |
| Incident view | FR pilot | 0 |
| Dashboard with validation-mode banner | EN validation | 0 |
| Emergency-suspension notice | EN suspended | 0 |

Verified in-browser: exactly one H1 per page; every control has an accessible
name; status is conveyed by text; native Arabic RTL; the non-security role is
redirected to the suspension notice while the pilot is suspended.

## Security-control validation (integration + unit)

- **Pilot cohort (§6):** requester/target cannot approve; independent approval
  required; SYSTEM_ADMIN grants need an admin/ops approver; active account alone
  cannot operate; suspend/expire/revoke deny operation and revoke sessions.
- **Two-person access change (§7):** role change applied only from an APPROVED
  request; requester/target cannot approve or apply; no silent change.
- **Step-up (§8):** recent-reauth window enforced; expired step-up rejected;
  failed reauth recorded as a security event.
- **Access review (§10):** self-review rejected; MODIFY creates a change
  request.
- **Offboarding (§9):** sessions revoked, pilot access suspended, completion
  blocked until open cases are reassigned, authorship preserved, account
  DISABLED.
- **Audit integrity (§12):** sequential numbers, correct previous hash,
  deterministic hash, DB-round-trip recomputation matches, tamper/gap/link
  detection, secret material excluded from the payload.
- **Security events / incidents (§13/§14):** event detail minimized (no
  secrets); incident closure requires lessons learned + approver; no deletion.
- **Exercises / corrective (§16/§17):** failed exercise requires a deviation and
  creates a corrective action; executor cannot approve; verifier ≠ owner.
- **Readiness gate (§18):** refuses a pilot-ready state while a critical area
  FAILs; NOT_READY always allowed.
- **Boundary (§25/§26):** no external accounts/portals/uploads/notifications/
  webhooks/AI/matching; public reception stays mailto-based; internal routes
  excluded from the sitemap and noindexed; fail-closed public build.

## Pilot exercise evidence (§29)

The controlled exercise suite is exercised automatically against dedicated /
synthetic databases (`tests/integration/p4b-governance.integration.test.ts` and
`tests/p4b-*.test.ts`), including a **simulated broken audit chain detected in
an isolated database** and a **detached-copy tamper detection**. The
development database was never manipulated to simulate tampering. The readiness
→ exercises view supports human-observed exercises with approver independence.

## Screenshots (`docs/qa/screenshots-p4b/`)

validation-mode-banner · pilot-mode-banner · pilot-access-and-cohort ·
readiness-gate · security-event-queue · security-incident-detail ·
pilot-exercise-and-corrective · backup-recovery · step-up-authentication ·
emergency-suspension · public-during-suspension · readiness-ar-mobile ·
incident-view-fr. All show synthetic `@akanil.example` accounts and clearly
synthetic data — no passwords, tokens, secrets, real names, real organizations
or full database URLs.

## CI and Vercel Preview remediation

After the branch was pushed, PR #8 showed a failing GitHub **Quality** check and
a failed **Vercel Preview**. Both were diagnosed and fixed without introducing
any production database or secret.

### GitHub Actions — backup step

- **Root cause:** the `Backup-and-restore smoke` step passed the workflow
  `DATABASE_URL` (which carries the Prisma-only `?schema=public` query
  parameter) directly to `pg_dump`. PostgreSQL CLI tools reject that parameter
  (`invalid URI query parameter: "schema"`), so the step failed.
- **Fix:** a dedicated **`PGTOOLS_DATABASE_URL`** is used for all `pg_dump`/`psql`
  operations, derived as
  `PGTOOLS_DATABASE_URL="${PGTOOLS_DATABASE_URL:-${DATABASE_URL%%\?*}}"`.
  `DATABASE_URL` is unchanged for Prisma. `scripts/internal/backup-restore-smoke.sh`
  and `scripts/internal/backup-verify.sh` add explicit prerequisite checks
  (`pg_dump`, `psql`, `gzip`, `gunzip`, and `sha256sum` where used) and a
  `cleanup` **trap** that drops the temporary restore database and removes
  temporary dump/checksum/manifest files on success or failure. Passwords and
  full connection strings are never logged. The CI workflow sets
  `PGTOOLS_DATABASE_URL` (a URL without `?schema`), keeps the backup step **not**
  `continue-on-error`, runs `internal:backup:smoke` **and** `internal:restore:verify`,
  and runs the security checks only after the backup steps succeed.

### Vercel Preview — build

- **Deployment inspected:** `7k2hcsEY824Nu5VWYvHZbvPtK22z`.
- **Exact first failing command/error:** `npm run build` → `Failed to compile.`
  → `./lib/internal/db.ts  Module not found: Can't resolve
  '@/lib/generated/prisma'` → `Build failed because of webpack errors` →
  `Error: Command "npm run build" exited with 1`.
- **Root cause:** the generated Prisma client is git-ignored (correctly), and
  Vercel Preview runs only `npm install && npm run build` — it never runs
  `prisma generate` (CI runs it explicitly), so the import could not resolve.
- **Fix:** a build-safe generation script
  (`scripts/prisma-generate-build.mjs`) runs `prisma generate` before Next.js
  compilation via a `prebuild` npm hook. When `DATABASE_URL` is absent it
  supplies a **syntactically valid, unreachable placeholder for code generation
  only** — it never connects, never runs migrations, never seeds, never enables
  P4, and is never exposed to the browser. In addition, `lib/internal/db.ts` now
  constructs `PrismaClient` **lazily** (a bound proxy), so a disabled public
  build never constructs the client or validates operational secrets, while
  internal runtime operations still fail closed. The generated client is **not**
  committed.

### Validation of the fixes

- **Scenario A (public build, no operational vars):**
  `env -u DATABASE_URL -u AUTH_SECRET P4_INTERNAL_ENABLED=false
  P4_OPERATION_MODE=disabled npm run build` — **succeeds** (client generated via
  placeholder; 131 pages prerendered).
- **Vercel-equivalent clean build** (generated client deleted, no DB/secret) —
  **succeeds**.
- **Backup scripts** with a `?schema=public` `DATABASE_URL` and with an explicit
  `PGTOOLS_DATABASE_URL` — both **succeed**; the temporary restore database and
  dump files are removed by the trap; `backups/` remains empty and git-ignored.
- **Restore verification** re-verifies the audit hash chain in the restored
  database (27/27 events).
- Gates re-run green: typecheck 0, lint 0, 221 unit tests, 23 integration tests,
  audit hash-chain suite, build, migration status up to date, committed-secret
  scan clean.
- **No production database or secret was introduced**; no cloud database was
  added to Vercel; no real `AUTH_SECRET` was added to make Preview pass.

## Known limitations

Carried residual risks are recorded in
`docs/p4/P4-B-RESIDUAL-RISK-REGISTER.md` (single-factor auth, `'unsafe-inline'`
CSP, application-level tamper-evidence, local unencrypted backups, no external
monitoring). No ISO/SOC/pen-test/legal/production certification is claimed.

## Out of scope (not activated)

External accounts, self-registration, client/participant portal, data room,
file upload, external notification, calendar integration, webhooks, automatic
matching, AI decision-making, direct public database submission, public case
tracking, and any production deployment. P4-B was subsequently merged into
`main` via PR #8 (merge commit `84e868b`) and accepted as the P4-C baseline; it
has not been deployed.
