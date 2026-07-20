# P4-C — Limited Go-Live Gate and Rollback

## Final readiness areas (§18)

The final readiness view extends the P4-B `ReadinessGate` with 22 areas (no
percentage; a system is not ready merely because most items pass):

1. PILOT_COHORT · 2. ACCESS_APPROVALS · 3. PROCEDURES_APPROVED ·
4. PROCEDURES_ACKNOWLEDGED · 5. CASE_SCENARIO_COVERAGE · 6. QUALIFICATION_WORKFLOW ·
7. MEETING_AND_DECISION_WORKFLOW · 8. COMMITMENT_AND_CLOSURE_WORKFLOW ·
9. DATA_QUALITY · 10. SECURITY_INCIDENTS · 11. CORRECTIVE_ACTIONS ·
12. ACCESS_REVIEWS · 13. AUDIT_CHAIN · 14. BACKUP_AND_RESTORE ·
15. MIGRATION_STATUS · 16. ROLLBACK_READINESS · 17. EMERGENCY_SUSPENSION ·
18. PUBLIC_INTERNAL_BOUNDARY · 19. PUBLIC_REGRESSION · 20. ACCESSIBILITY ·
21. SECRET_SCAN · 22. RESIDUAL_RISK_REVIEW.

Statuses: NOT_TESTED · PASS · PASS_WITH_OBSERVATIONS · FAIL · BLOCKED · EXPIRED.

## Human go-live decision (§19)

A human may recommend a decision only when: no critical area is FAIL/BLOCKED; no
critical security incident is open; no critical corrective action is open; the
audit chain passes; backup and restore pass; emergency suspension is verified;
public Gateway continuity is verified; access reviews are current; procedure
acknowledgements are complete for the proposed cohort; migrations are current;
the rollback procedure is documented and synthetically tested; public reception
remains disconnected; and prohibited external capabilities remain absent.

Decisions: **GO**, **CONDITIONAL GO** (requires conditions, owner, due date,
residual-risk rationale, expiry/review date), **EXTEND CONTROLLED PILOT**,
**SUSPEND PILOT**, **NO-GO**. The application never selects, approves or
activates a decision, never changes environment variables and never deploys.
`LimitedOperationsAuthorization` records the human decision; a GO/CONDITIONAL_GO
cannot activate while a critical gate fails, and final approval requires
step-up with proposer/reviewer/approver separation.

## Rollback and continuity baseline (§21) — environment-neutral

**Before a limited release:** confirm commit SHA; migrations; backup; restore
test; authorization; employee access; emergency suspension; public-site
continuity.

**During activation (by an authorized human, not the application):** apply
reviewed migrations explicitly (`prisma migrate deploy`); enable the internal
feature only through the approved environment control; login and RBAC smoke
tests; create one synthetic internal verification case; confirm audit event
creation; confirm no public behaviour changed.

**Rollback criteria:** authentication or authorization bypass; audit-chain
failure; migration failure; database corruption; public-site regression;
inability to suspend the internal system; unresolved critical security event.

**Rollback procedure:** set `P4_PILOT_SUSPENDED=true`; set `P4_OPERATION_MODE`
to `disabled` where necessary; revoke operational sessions
(`internal:sessions:cleanup` + session administration); restore the previously
approved application version; follow the reviewed migration-recovery procedure;
verify public Gateway continuity; record the incident and rollback decision.

No automatic production rollback is implemented. No hosting provider, DNS or
production infrastructure is selected or configured.
