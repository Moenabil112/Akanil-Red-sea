# QA Report — P4-C Controlled Internal Operations and Limited Go-Live

Date: 2026-07-20 · Branch: `feature/p4c-controlled-internal-operations-go-live`
Base: `main` (approved P4-B merge `84e868b`). Not merged; not deployed; no
production service configured. **P4-C consolidates P4-C and the previously
proposed P4-D; there is no separate P4-D. P4-C does not authorize production.**

This release prepares a proportionate, **employee-only** limited-operations
release (3–6 employees, 3–10 cases, synthetic or approved de-identified data
only) and the evidence for a **human** Go/No-Go decision. It extends P4-A/P4-B
without redesigning them. The public Digital Reception Lite is unchanged and
stays disconnected from the internal database.

## Implementation vs. required manual pilot

- **Completed on this branch (A):** the P4-C controls, the synthetic operational
  rehearsal, deterministic data-quality checks, the release-evidence package,
  rollback controls and the human Go/No-Go decision framework.
- **Required after merge (B):** the actual controlled pilot, performed by
  authorized Akanil management (`P4-C-MANUAL-PILOT-CHECKLIST.md`). **No real
  employee pilot, training, or operating case has been performed or is claimed.**

## Quality gates

| Gate | Result |
| --- | --- |
| `npm run typecheck` | **0 errors** |
| `npm run lint` | **0 warnings** |
| `npm test` (jsdom) | **19 files, 236/236** — adds `p4c-modes-logic` (11) and `p4c-boundary` (14) |
| `npm run test:integration` (PostgreSQL) | **3 files, 32/32** — adds `p4c-operations.integration` (9) |
| `npm run internal:audit:test` | 10/10 |
| `npm run build` | ✓ compiled — **149 pages** |
| **Fail-closed build** (`P4_INTERNAL_ENABLED=false`, no `DATABASE_URL`, no `AUTH_SECRET`, generated client removed) | ✓ — 149 public pages; client generated via build-safe placeholder |
| `npm run internal:backup:smoke` / `internal:restore:verify` | OK (restore re-verifies the audit chain) |
| `npm run internal:audit:verify` | Chain OK |
| `npm run internal:p4c:rehearsal` | **TECHNICAL REHEARSAL COMPLETED — HUMAN PILOT STILL REQUIRED** |
| Migration | fresh install + **P4-B → P4-C upgrade** applied cleanly (non-destructive) |

CI (`.github/workflows/quality.yml`) runs the full sequence incl.
`internal:p4c:rehearsal`, plus committed-secret scan, prohibited-integration
scan (tests), dependency audit, migration status, boundary and release-evidence
checks, using synthetic credentials and `PGTOOLS_DATABASE_URL` for pg tools. No
deployment; no cloud secrets.

## Synthetic operational rehearsal (§30)

`internal:p4c:rehearsal` exercises the controls end to end against a synthetic
database: onboarding; time-limited pilot access (independent approval); 13
procedures effective + acknowledged; four scenario cases; a pilot run with
membership (independent approval) and case coverage; a deterministic
data-quality scan; audit-chain verification (101 events); release-candidate
evidence (independent review); a limited-operations authorization **rejected**
while a critical gate fails; a synthetic isolated authorization approved **only
after** the gate clears (environment unchanged, no production GO); and run
completion by an approver distinct from the owner. It never produces an
operational GO.

## Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA)

**All P4-C screens — 0 violations**, in real Chromium across pilot,
limited_internal and suspended modes and EN/FR/AR (incl. Arabic mobile RTL):

| Screen | Locale / mode | Violations |
| --- | --- | --- |
| Controlled operations overview (work queue, report, final readiness) | EN pilot | 0 |
| Pilot-run plan (list) | EN pilot | 0 |
| Pilot member & case coverage (detail) | EN pilot | 0 |
| Procedure register | EN pilot | 0 |
| Data-quality findings | EN pilot | 0 |
| Release candidate | EN pilot | 0 |
| Authorization proposal & critical-gate status | EN pilot | 0 |
| Operations overview (RTL, phone) | AR pilot | 0 |
| Authorization | FR pilot | 0 |
| Limited Internal Operations banner state | EN limited_internal | 0 |
| Emergency suspension notice | EN suspended | 0 |

One H1 per page; every control named; status conveyed by text; native Arabic
RTL. Screenshots contain only synthetic `@akanil.example` accounts and clearly
synthetic data — no passwords, tokens, secrets, real names, real organizations,
real cases or database URLs. `docs/qa/screenshots-p4c/`.

## Security & boundary validation

- **limited_internal fail-closed (§8):** the environment mode alone never
  authorizes; an ACTIVE authorization plus employee/case limits and allowed data
  category are additionally required; denied without/expired/over-limit;
  verified by unit + integration tests and the rehearsal.
- **Authorization (§7):** proposer/reviewer/approver separation; no
  self-approval; SYSTEM_ADMIN cannot approve go-live; step-up on decision; cannot
  activate with a critical failure; CONDITIONAL_GO requires conditions;
  superseding, immutable, never deleted.
- **Pilot (§9–§11):** limits 1–6 / 1–10 enforced; one ACTIVE run; membership
  needs pilot access + acknowledgements + independent approval; disallowed data
  category rejected; completion needs observations + independent approver.
- **Data quality (§14):** deterministic detection; duplicates suggestion-only,
  never auto-merged; nothing deleted; waiver requires rationale; re-scan does not
  duplicate.
- **Release (§20):** commit SHA validated; URLs/secrets rejected in any evidence
  field; independent reviewer; immutable once reviewed; no deployment.
- **Boundary (§26/§35):** no external accounts/portals/uploads/notifications/
  webhooks/AI/matching; no automatic Go/No-Go; no automatic env change; no
  deployment action; app never mutates the operating-mode env vars; public
  reception stays mailto-based; operations routes excluded from the sitemap and
  noindexed; fail-closed public build; emergency suspension leaves the public
  Gateway operating.

## Known limitations

Carried and P4-C residual risks in `docs/p4/P4-C-FINAL-RESIDUAL-RISK-REGISTER.md`.
No ISO/SOC/pen-test/legal/production certification is claimed.

## Out of scope (not activated)

Production deployment; `limited_internal` outside an isolated synthetic test; a
real employee pilot; external accounts, portals, data room, file upload,
external notification, calendar, webhook, automatic matching, AI decision-making,
direct public database submission, public case tracking. The final Go/No-Go
decision remains **PENDING AUTHORIZED HUMAN DECISION**. The branch is not merged
and has not been deployed.
