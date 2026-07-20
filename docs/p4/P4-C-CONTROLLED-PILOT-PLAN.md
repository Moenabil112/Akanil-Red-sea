# P4-C — Controlled Pilot Plan

Proportionate, employee-only. **Synthetic or approved de-identified data only**
during repository QA and automated validation. This plan describes what the
software supports; the actual pilot is a manual, human-run activity performed by
authorized Akanil management after merge (see
`P4-C-MANUAL-PILOT-CHECKLIST.md`).

## Scope

- **3–6** authorized Akanil employees; **3–10** controlled cases in the first run.
- Manual case creation after institutional email intake; no direct public
  submission; no external accounts; no document storage or data room.
- One ACTIVE `OperationalPilotRun` initially.

## Roles (RBAC, §24)

- **OPERATIONS_MANAGER** — plans/manages/completes the run, approves procedures,
  reviews readiness, and (with separation of duties) approves the
  limited-operations decision.
- **SYSTEM_ADMIN** — technical/security administration and release-evidence
  preparation; **no unilateral go-live approval**.
- **CASE_MANAGER** — operates assigned pilot cases, records observations,
  resolves authorized data-quality findings.
- **SPECIALIST_REVIEWER / FORUM_COORDINATOR** — review/operate assigned cases and
  add observations; no go-live approval.
- **READ_ONLY_AUDITOR** — view readiness, release evidence and authorization; no
  mutation.

## Membership (§10)

Each member requires: an active account; valid time-limited PilotAccess;
complete acknowledgements of all effective procedures; independent approval (no
self-approval); and respects the run's employee limit. Removal/suspension may
revoke sessions. Historical membership is retained.

## Case coverage (§11)

Select 3–10 cases covering a **variety** of scenarios (not volume):
Moroccan-company request, Sudanese project/opportunity, Forum qualification,
value-chain request, specialist review, no-progression, and
meeting/decision/commitment. Each declares SYNTHETIC or approved DE_IDENTIFIED.
Removing a case from a run never deletes the case.

## Run lifecycle (§9)

`PLANNED → READY → ACTIVE → (PAUSED) → COMPLETED` (or `CANCELLED`). Activation
requires approved cohort access and no other ACTIVE run. Completion requires an
observations summary and a final outcome, recorded by an approver distinct from
the run owner. Outcomes: CONTINUE_PILOT, CONTINUE_WITH_CONDITIONS,
READY_FOR_LIMITED_INTERNAL_OPERATIONS, EXTEND_PILOT, SUSPEND, NOT_READY.

## Observations (§17)

Record process/system observations only (never employee performance). Critical
observations automatically open a corrective action tracked to independent
verification.

## Synthetic rehearsal (§30)

`npm run internal:p4c:rehearsal` exercises the controls end to end against a
synthetic database (onboarding, pilot access, procedures + acknowledgements,
four scenario cases, membership, case coverage, data-quality scan, audit-chain
verification, release evidence, authorization **rejected** while a critical gate
fails, a synthetic isolated authorization only after the gate clears, and run
completion). It never produces an operational GO and ends with:
`TECHNICAL REHEARSAL COMPLETED — HUMAN PILOT STILL REQUIRED`.
