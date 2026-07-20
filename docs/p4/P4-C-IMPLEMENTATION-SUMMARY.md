# P4-C — Implementation Summary

Branch: `feature/p4c-controlled-internal-operations-go-live` · Base: `main`
(approved P4-B merge `84e868b`). Not merged, not deployed, no production
infrastructure configured. **P4-C consolidates P4-C and the previously proposed
P4-D into one final package; there is no separate P4-D.** P4-C does not
authorize production.

P4-C prepares a proportionate, **employee-only** limited-operations release and
the evidence for a **human** Limited Internal Operations Go/No-Go decision. It
does not redesign P4-A/P4-B — it extends them. Intended initial scope: **3–6
employees, 3–10 controlled cases, synthetic or approved de-identified data
only, manual case creation after institutional email intake.** The public
Digital Reception Lite is unchanged and stays disconnected from the internal
database.

## What P4-C adds

- **`limited_internal` operating mode (§6/§8):** server-enforced, fail-closed;
  the environment value alone never authorizes it — an ACTIVE
  LimitedOperationsAuthorization plus employee/case limits and allowed data
  categories are additionally required (`assertLimitedInternalAuthorized`).
  Visible "Limited Internal Operations" banner (scope, expiry, no external
  access).
- **LimitedOperationsAuthorization (§7):** human-only decision with
  proposer/reviewer/approver separation, no self-approval, step-up on decision,
  time-limited, and never ACTIVE while a critical gate fails; superseding, never
  silently edited, never deleted.
- **OperationalPilotRun / Member / Case (§9–§11):** 1–6 employees, 1–10 cases,
  one ACTIVE run; server-enforced transitions; completion needs observations and
  an approver distinct from the owner; membership needs pilot access + complete
  acknowledgements + independent approval; cases SYNTHETIC/DE_IDENTIFIED only.
- **OperatingProcedure + ProcedureAcknowledgement (§12/§13):** 13 SOP register
  with lifecycle; acknowledgements gate membership activation; history preserved.
- **DataQualityFinding (§14):** deterministic, explainable detection;
  suggestion-only duplicates (never auto-merged); human resolution; waiver
  rationale required.
- **Consolidated work queue (§15) + lightweight reporting (§16):** counts only,
  no external notifications, no scores, no charts, no export.
- **OperationalObservation (§17):** process/system observations (never employee
  scoring); critical observations create a corrective action.
- **InternalReleaseCandidate (§20):** validation evidence for a reviewed commit;
  no deployment; no secret/URL stored; immutable once reviewed.
- **Final readiness (§18):** 22 areas extending the P4-B ReadinessGate; no
  percentage; human-only gate.
- **Rollback & continuity baseline (§21) + manual pilot package (§22).**

## Architecture touch-points

- `prisma/schema.prisma` — 9 new models, P4-C enums; one additive,
  non-destructive migration (fresh install + P4-B → P4-C upgrade tested).
- `lib/internal/env.ts` (mode), `lib/internal/pilot.ts` (enforcement),
  `lib/internal/services/{limited-operations, operational-pilot, procedures,
  data-quality, observations, release-candidate, work-queue, operations-report,
  readiness}.ts`.
- `app/[lang]/internal/operations/*` routes + `operations-actions.ts`,
  environment banner, trilingual dictionary (`p4c`).
- `scripts/internal/p4c-rehearsal.ts` (synthetic rehearsal).

## Gates

typecheck 0 · lint 0 · **236** unit/component/boundary tests · **32** PostgreSQL
integration tests · build clean · fail-closed public build (no DB/secret) ·
synthetic rehearsal ends "TECHNICAL REHEARSAL COMPLETED — HUMAN PILOT STILL
REQUIRED" · axe WCAG A/AA 0 violations. See
`docs/qa/QA-REPORT-P4-C-CONTROLLED-OPERATIONS.md`.

## Boundary (unchanged)

Employee-only, administratively provisioned. No external accounts,
self-registration, portals, data room, file upload, external notification,
calendar, webhook, automatic matching, AI decision-making, direct public
database submission or public case tracking. No automatic Go/No-Go, no
automatic environment change, no deployment.
