# ADR-029 — Internal security-event and incident model

Date: 2026-07-20 · Status: accepted

## Context

The pilot needs to detect and follow up on security-relevant events
(authentication/authorization failures, invalid transitions, concurrency
conflicts, pilot suspension, audit-integrity and backup failures) and to record
and work internal incidents — all without any external alerting, SIEM or
third-party monitoring vendor, and without making legal-breach determinations.

## Decision

- **`SecurityEvent`** records minimized, redacted events
  (`recordSecurityEvent`, `security-events.ts`); the `detail` payload is passed
  through `redactLog`, so passwords, tokens, secrets and confidential content
  never persist. High/critical open events surface in the readiness view. Events
  are acknowledged and resolved (critical resolutions require a rationale) and
  cannot be deleted through the application.
- **`SecurityIncident`** is an internal, controlled-lifecycle module
  (OPEN→TRIAGE→CONTAINMENT/INVESTIGATION→RECOVERY→CLOSED) with a private
  `SEC-YYYY-NNNNNN` reference (transaction-safe counter). Closure requires
  lessons learned and records the approving closer; critical closure requires a
  recent step-up. No external notification is sent and no deletion path exists.
- **No external integration.** No email/SMS/webhook/SIEM/logging vendor is
  added; output is the process console only, redacted.

## Consequences

- Security posture is observable and actionable inside the pilot.
- Minimization and no-delete guarantees keep the trail privacy-safe and
  trustworthy.
- Richer detection/alerting is future work, explicitly out of scope here.
