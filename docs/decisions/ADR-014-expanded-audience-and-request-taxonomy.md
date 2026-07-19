# ADR-014 — Expanded audience and request taxonomy

Date: 2026-07-19 · Status: accepted · Supersedes ADR-008's five-path model.

## Context

P0 replaces five broad audience paths and seven generic request types with
seven audience paths and nine controlled request types, each with intake
schemas.

## Decision

- `AudienceId` (7) and `RequestTypeId` (9) unions live in
  `content/ecosystem-types.ts`; the audience→request matrix and per-request
  intake schemas live in `lib/ecosystem.ts` so structure cannot drift between
  locales.
- Reception renders schema-driven dynamic fields (`DynamicRequestFields`):
  only fields declared by the selected request type appear, minimizing data
  collection. Evidence availability is a checklist; no uploads.
- Deep links (`?type=&audience=`) validate against the matrix; disallowed
  combinations fall back to the audience default request type.
- Mandatory disclaimers attach to project-investment-review,
  forum-qualification and submit-project-asset.

## Consequences

The old `experience.audiences` block was removed; audience content moved into
the ecosystem records. Legacy homepage anchors are preserved via hidden
anchors (ADR-011).
