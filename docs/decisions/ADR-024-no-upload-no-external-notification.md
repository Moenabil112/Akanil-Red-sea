# ADR-024 — No file upload, no data room, no external notification

Date: 2026-07-20 · Status: accepted

## Context

P4-A is an internal operations foundation, not a document platform or a
communications system. It must not upload or store documents, must not offer a
data room or external document access, and must not send any external
notification (email, SMS, WhatsApp, push, Slack, calendar, webhooks).

## Decision

- **No file upload / no data room.** There are no `<input type="file">`
  controls, no upload endpoints, no object-storage SDKs, no presigned URLs, no
  document previews or download links, and no data-room terminology in the
  active UI. Evidence is tracked only as an `EvidenceReference` metadata record
  whose `locationNote` is plain internal text — never a link or a download.
- **No external notification.** No email/SMS/WhatsApp/push/Slack/calendar/webhook
  integration and no provider SDK is installed. Awareness is delivered entirely
  through the in-app dashboard and the "My work" queue (assigned cases, open
  gaps, commitments due/overdue, decisions awaiting approval).
- **No AI provider.** No AI SDK, agent or external model call is present. The
  architecture reserves future *internal* interfaces (classification hints,
  completeness suggestions, summary drafts) but P4-A implements none, and no AI
  may accept/reject, approve, decide, assign, message externally or expose data.

## Consequences

- These absences are enforced by source scans and a package-dependency scan in
  `tests/p4a-boundary.test.ts`, so reintroducing any of them fails the build.
  Meeting scheduling, invitations, notifications, uploads, data rooms and AI
  decisioning are recorded as future work (a later phase), not implemented here.
