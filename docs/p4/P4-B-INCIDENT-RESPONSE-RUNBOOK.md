# P4-B — Incident Response Runbook (internal)

Internal use only. No external notification is sent and no legal-breach
determination is made. Synthetic incidents are used for QA.

## Security events → triage

1. Open `/{lang}/internal/security`. High/critical open events also surface on
   the readiness panel.
2. **Acknowledge** an event (records `SECURITY_EVENT_ACKNOWLEDGED`).
3. **Resolve** as RESOLVED or FALSE_POSITIVE; a CRITICAL resolution requires a
   rationale. Events are minimized and cannot be deleted.

## Opening an incident

1. `/{lang}/internal/security/incidents` → **Open incident** (requires
   `incident.manage`). A private reference `SEC-YYYY-NNNNNN` is assigned.
2. Categories: AUTHENTICATION, AUTHORIZATION, DATA_EXPOSURE, AUDIT_INTEGRITY,
   DATABASE, BACKUP_RESTORE, AVAILABILITY, SECRET_HANDLING, OPERATIONAL_ERROR,
   OTHER. Severity: INFORMATIONAL…CRITICAL.

## Lifecycle

`OPEN → TRIAGE → CONTAINMENT / INVESTIGATION → RECOVERY → CLOSED` (controlled
transitions; `transitionIncident`). Record containment actions, evidence notes
and recovery actions (optimistic-concurrency protected).

## Closing

- Closure requires **lessons learned** and records the approving closer.
- Closing a **critical** incident requires a recent **step-up**
  reauthentication.
- Incidents are never deleted.

## Standard responses

- **Audit-integrity failure** (`internal:audit:verify` non-zero): open an
  AUDIT_INTEGRITY incident, record the first broken sequence, do **not** attempt
  to "repair" history; investigate the source of the change and, if warranted,
  suspend the pilot (`P4_PILOT_SUSPENDED=true`).
- **Backup/restore failure**: open a BACKUP_RESTORE incident and create/track a
  corrective action; re-run `internal:restore:verify` after the fix.
- **Suspected credential compromise**: reset the password (step-up),
  `internal:sessions:cleanup`, and revoke the employee's sessions / pilot
  access; open an AUTHENTICATION incident.
- **Emergency stop**: set `P4_PILOT_SUSPENDED=true`. All internal mutations stop
  and sessions are rejected for non-security roles; the public Gateway and
  Digital Reception Lite keep operating. Record the decision and re-enable only
  after review.

## Follow-through

Every incident links to corrective actions (§17) where remediation is tracked
to independent verification. Overdue/critical items surface on the readiness
panel and block a pilot-ready gate.
