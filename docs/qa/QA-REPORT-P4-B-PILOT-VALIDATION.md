# QA Report — P4-B Internal Pilot, Security Hardening and Operational Validation

Date: 2026-07-20 · Branch: `feature/p4b-internal-pilot-security-validation`
Base: `main` (approved P4-A merge `eb3f02c`). Not merged; not deployed; no
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

## Known limitations

Carried residual risks are recorded in
`docs/p4/P4-B-RESIDUAL-RISK-REGISTER.md` (single-factor auth, `'unsafe-inline'`
CSP, application-level tamper-evidence, local unencrypted backups, no external
monitoring). No ISO/SOC/pen-test/legal/production certification is claimed.

## Out of scope (not activated)

External accounts, self-registration, client/participant portal, data room,
file upload, external notification, calendar integration, webhooks, automatic
matching, AI decision-making, direct public database submission, public case
tracking, and any production deployment. The branch is not merged and has not
been deployed.
