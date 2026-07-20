# P4-B — Readiness Gate

The readiness panel is decision support, not a certification and not a vanity
dashboard. There is **no overall percentage** and **no "production ready"
claim**. Each area reports an explicit status; the gate is a recorded human
decision.

## Area statuses

`NOT_TESTED · PASS · PASS_WITH_OBSERVATIONS · FAIL · BLOCKED · EXPIRED`.

## Areas

Computed live: pilot cohort, access approvals, overdue access reviews,
employee offboarding readiness, **audit-chain verification**, **unresolved
security events**, **open incidents**, **failed/blocked exercises**, **open
corrective actions**, database migration status. (Bold = critical.)

Evidence-based signals (recorded by controlled commands/exercises/QA,
`ReadinessSignal`): authentication control tests, authorization control tests,
backup recency, last restore-test result, public/internal boundary result,
secret-scan result, accessibility result, public regression result.

## Gate

`ReadinessGate` is append-only; the latest row is current. States:

- NOT_READY
- READY_FOR_LIMITED_INTERNAL_PILOT
- LIMITED_INTERNAL_PILOT_ACTIVE
- PILOT_SUSPENDED
- PILOT_COMPLETED_PENDING_REVIEW

There is no "production ready" state. Setting the gate requires
`readiness.approve` and a recent step-up. The gate **cannot advance to a
pilot-ready state while any critical area is FAIL** — the application never
auto-authorizes a pilot (`setReadinessGate`).

## Emergency suspension

`P4_PILOT_SUSPENDED=true` is the authoritative stop. An internal action may
record a suspension decision but environment-level suspension governs. The
public Gateway and Digital Reception Lite continue operating.

## Access

Readiness views require `readiness.view` (SYSTEM_ADMIN, OPERATIONS_MANAGER,
READ_ONLY_AUDITOR). Only OPERATIONS_MANAGER / SYSTEM_ADMIN hold
`readiness.approve` for gate decisions (per the RBAC matrix).
