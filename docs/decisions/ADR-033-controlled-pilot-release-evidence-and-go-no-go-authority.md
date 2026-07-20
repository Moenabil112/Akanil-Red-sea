# ADR-033 — Controlled pilot, release evidence and human Go/No-Go authority

Date: 2026-07-20 · Status: accepted

## Context

P4-C must exercise complete case workflows in a proportionate controlled pilot,
capture release evidence and rollback controls, and support — but never make —
a Limited Internal Operations Go/No-Go decision.

## Decision

- **Controlled pilot run.** `OperationalPilotRun` (with `OperationalPilotMember`
  and `OperationalPilotCase`) is proportionate: 1–6 employees, 1–10 cases, only
  one ACTIVE run initially, server-enforced transitions, completion requires an
  observations summary, and the executor (owner) may not be the completion
  approver. Membership requires an active account, valid PilotAccess, complete
  procedure acknowledgements, and independent approval; cases must be SYNTHETIC
  or approved DE_IDENTIFIED and removing a case never deletes it.
- **Release evidence.** `InternalReleaseCandidate` records validation results for
  a reviewed commit SHA. It takes **no deployment action**, stores **no
  production URL or secret** (rejected on input), requires an independent
  reviewer and a step-up, and is immutable once reviewed (new evidence
  supersedes).
- **Human Go/No-Go.** The final readiness view (extending the P4-B
  `ReadinessGate` with the 22 §18 areas, no percentage) and the
  `LimitedOperationsAuthorization` decision are the decision support. The
  application never selects a decision, never auto-activates the mode, never
  changes environment variables and never deploys. The Phase Closure and
  Decision Pack keeps the final decision **PENDING AUTHORIZED HUMAN DECISION**.
- **Deterministic data quality.** `DataQualityFinding` detection is
  deterministic and explainable (no AI, no fuzzy matching); duplicates are
  suggestions only — never auto-merged — and nothing is deleted; waivers require
  a rationale.

## Consequences

- The pilot tests a variety of workflows, not volume, and produces auditable
  readiness evidence.
- No automated step can cross the human authorization boundary or reach
  production; a real employee pilot remains a manual, human-run activity after
  merge.
