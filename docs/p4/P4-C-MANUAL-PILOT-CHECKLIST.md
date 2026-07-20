# P4-C — Manual Controlled-Pilot Checklist

> **This checklist must be performed by authorized humans after merge, under
> authorized Akanil management. Automated tests and the synthetic rehearsal do
> NOT replace the operational pilot.** No item below has been performed by this
> branch; the synthetic rehearsal exercised the software controls only.

## Preparation
- [ ] Nominate 3–6 employees for the pilot cohort.
- [ ] Approve each employee's role (RBAC).
- [ ] Grant time-limited PilotAccess with independent approval.
- [ ] Complete procedure briefings for all 13 SOPs.
- [ ] Confirm procedure acknowledgements for the cohort.

## Execution
- [ ] Select 3–10 synthetic or approved de-identified cases.
- [ ] Exercise each selected scenario (Moroccan company, Sudanese project, Forum
      qualification, value chain, specialist review, no-progression,
      meeting/decision/commitment).
- [ ] Record observations for each session.
- [ ] Open corrective actions where required.
- [ ] Review data-quality findings and resolve or waive with rationale.
- [ ] Verify the consolidated work queue reflects reality.

## Controls
- [ ] Perform a session revocation.
- [ ] Perform an employee offboarding rehearsal (reassign open cases).
- [ ] Verify the audit chain (`internal:audit:verify`).
- [ ] Verify backup and restore (`internal:restore:verify`).
- [ ] Verify emergency suspension (`P4_PILOT_SUSPENDED=true`) and confirm the
      public Gateway continues to operate.

## Decision preparation
- [ ] Review residual risks (`P4-C-FINAL-RESIDUAL-RISK-REGISTER.md`).
- [ ] Prepare and review a release candidate (independent reviewer + step-up).
- [ ] Review the 22 final readiness areas; confirm no critical FAIL/BLOCKED.
- [ ] Propose, independently review, and (separately) decide the
      LimitedOperationsAuthorization — a human GO/CONDITIONAL GO/EXTEND/SUSPEND/
      NO-GO decision with step-up.

The final Go/No-Go decision is a human decision and remains **PENDING
AUTHORIZED HUMAN DECISION** until completed by authorized Akanil management.
