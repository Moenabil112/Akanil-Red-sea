# ADR-008 — Audience-entry architecture

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

Visitors had to read the whole narrative to find their entry point. The specification (Phase 2) defines five institutional audiences with distinct purposes and accepted request types.

## Decision

- Five authored entry paths (`AudienceEntry`, editorial rows — deliberately not a SaaS pricing grid or icon grid): Moroccan institution, Moroccan company, Sudanese organization or decision-maker, financial/investment partner, and industrial/logistics/technology/knowledge partner.
- Each path is a typed content record (`AudiencePathContent`) with audience name, who it serves, purposes, accepted request types, a default request type and an optional status note (the financial path explicitly states that no investment opportunity is automatically active or approved).
- Each card's single action deep-links to Digital Reception Lite with `?type=<default>&audience=<id>`; the desk validates both against typed allow-lists (`parsePreselection`) and ignores unknown values.
- No accounts, no automatic qualification or approval, no matchmaking, no opportunity publication — the paths only route into the human-reviewed reception flow.

## Consequences

Audience → request-type wiring is data, testable per locale (parity tests assert identical ids/order/request-types across AR/FR/EN).

## Reversibility

High — paths are content records; adding or renaming one does not touch components.
