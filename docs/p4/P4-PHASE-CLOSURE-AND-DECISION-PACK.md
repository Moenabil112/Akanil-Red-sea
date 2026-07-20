# P4 — Phase Closure and Decision Pack

This pack closes the internal-system programme (P4-A → P4-B → P4-C) and prepares
the material for an authorized human Limited Internal Operations Go/No-Go
decision. **P4-C consolidates P4-C and the previously proposed P4-D; there is no
separate P4-D.**

## A. Implementation evidence (completed on this branch)

- **P4-A** (merged, `eb3f02c`): employee-only case-management foundation —
  PostgreSQL/Prisma, DB-backed sessions, six-role default-deny RBAC, object-level
  authorization, case lifecycle, append-only audit.
- **P4-B** (merged, `84e868b`): security hardening & operational validation —
  operating modes, pilot cohort (PilotAccess), two-person AccessChangeRequest,
  step-up auth, employee lifecycle/offboarding, access reviews, session admin,
  tamper-evident audit hash chain, security events & incidents, exercises,
  corrective actions, ReadinessGate, emergency suspension, backup/restore
  verification.
- **P4-C** (this branch): `limited_internal` mode (fail-closed),
  LimitedOperationsAuthorization (human, separation of duties, step-up, critical-
  gate-blocked), OperationalPilotRun/Member/Case (proportionate limits),
  operating procedures + acknowledgements, deterministic data quality,
  consolidated work queue, lightweight reporting, operational observations,
  release-candidate evidence, final readiness (22 areas), rollback/continuity
  baseline, manual pilot package.

## B. Synthetic validation (completed on this branch)

- Gates: typecheck 0, lint 0, 236 unit + 32 PostgreSQL integration tests, build,
  fail-closed public build, migration fresh-install and P4-B → P4-C upgrade,
  secret scan, prohibited-feature scan, audit hash-chain verification,
  backup/restore verification, axe WCAG A/AA 0 violations.
- Synthetic operational rehearsal (`internal:p4c:rehearsal`) exercised the
  controls end to end and ended: **TECHNICAL REHEARSAL COMPLETED — HUMAN PILOT
  STILL REQUIRED**. It demonstrated that a limited-operations authorization is
  **rejected** while a critical gate fails, and that a synthetic isolated
  authorization can be approved only after the gate clears — without changing the
  environment or producing a production GO.

## C. Required manual pilot evidence (NOT yet performed)

Per `P4-C-MANUAL-PILOT-CHECKLIST.md`, authorized Akanil management must, after
merge: nominate 3–6 employees; approve roles and time-limited access; complete
procedure briefings and acknowledgements; run 3–10 synthetic/de-identified
scenario cases; record observations and corrective actions; verify session
revocation, offboarding, audit chain, backup/restore and emergency suspension;
and confirm public Gateway continuity. **No real employee pilot, training, or
operating case has been performed or is claimed.**

## D. Unresolved / residual risks

See `P4-C-FINAL-RESIDUAL-RISK-REGISTER.md` (and the carried P4-B register). No
ISO/SOC/pen-test/legal/production certification is claimed.

## E. Final human decision

The Limited Internal Operations Go/No-Go decision is a human decision. It has not
been made, seeded or fabricated by this branch. Recorded via a
`LimitedOperationsAuthorization` (human proposer/reviewer/approver with step-up),
it may be GO, CONDITIONAL GO, EXTEND CONTROLLED PILOT, SUSPEND PILOT or NO-GO.

**FINAL DECISION: PENDING AUTHORIZED HUMAN DECISION.**

Production was not authorized or deployed. The branch is not merged and has not
been deployed.
