# ADR-007 — Homepage clarity journey and content separation

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

The V1.0 homepage carried the full institutional narrative (~1,781 AR / 2,384 FR / 2,065 EN words across 12 sections). It explained the model better than it guided the visitor (Gateway UX specification, Phase 1).

## Decision

Rebuild the homepage around the clarity order: hero → current status → audience entry → value proposition → operating journey → priority chains/corridor → Forum → trust/about → institutional reception. Detailed content moves unchanged to dedicated routes (ADR-010); the homepage carries condensed summaries with one "learn more" link each, derived where possible from the same content records (pillar titles, chain names, operating steps) so nothing is edited twice.

A calm status layer (`GatewayStatus`) distinguishes approved/live/active/controlled/conceptual/future capabilities as a definition list — text labels with typed markers, no percentages, no dashboard styling.

Measured result: homepage narrative density fell to 888 AR / 1,105 FR / 961 EN words (−50 %, −54 %, −53 %). The reduction slightly exceeds the 35–45 % target; all removed detail is preserved verbatim on the dedicated routes, none was deleted.

## Consequences

First-viewport comprehension and the two following sections now answer what/who/status; legacy anchors (#why, #morocco, #corridor, #chains, #forum, #trust, #about, #contact) remain on the homepage as summary targets (ADR-011).

## Reversibility

High — the detailed sections still exist as components and content; recomposing the long page would be a page-file change.
