# ADR-015 — Public claims and evidence-state control

Date: 2026-07-19 · Status: accepted

## Context

P0 requires controlled public states for projects, platforms, nodes and
technology capabilities, plus a reusable claims-control surface.

## Decision

- Three enums (`PublicStatus`, `EvidenceState`, `CapabilityState`) with
  localized explanatory wording in each ecosystem record
  (`states.publicStatus` / `evidenceState` / `capabilityState`).
- States are rendered as text (`PublicStatusControl`) with subtle tone
  accents — never color alone, never percentages.
- One reusable `ClaimsBoundaryNotice` renders the detailed scope block on the
  homepage status section, portfolio page and corridor page instead of
  repeating disclaimers per paragraph.
- Due-diligence wording (`controlled-review-available`,
  `due-diligence-summary-available`) stays inactive until a controlled
  evidence manifest exists in the repository; the gap is recorded in the
  missing-inputs register.

## Consequences

Claims discipline is testable: source-scan and content tests verify banned
phrases are absent and states resolve in every locale.
