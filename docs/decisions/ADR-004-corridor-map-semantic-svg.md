# ADR-004 — Corridor map as semantic SVG + HTML node controls

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

The corridor section must show Morocco, Sudan, the Red Sea and scenario nodes with route states (conceptual, under study, pilot-qualified, verified, constrained, alternative), keyboard-selectable nodes, a text summary outside the SVG, reduced-motion behavior, a mobile node-sequence fallback and a visible conceptual disclaimer — without implying live tracking (Master Build Prompt §8.06; `/corridor-map-visualization`).

## Decision

- One schematic SVG diagram (not a raster map) with geographically ordered nodes (Morocco west, Egypt and Saudi Arabia between, Sudan south-east on the Red Sea). The SVG is presentation (`aria-hidden`), forced `dir="ltr"` so geography never mirrors in RTL.
- Node selection happens through real HTML buttons (works with keyboard, pointer, touch; visible focus), which drive route highlighting in the SVG **and** a text summary panel outside the SVG.
- Route state is encoded by stroke pattern **and** a text legend + per-route status label (never color alone). All routes in this release are labelled `conceptual` or `under study` — no verified claims exist in the approved inputs.
- Route drawing animation uses dashoffset transitions; under reduced motion, routes render fully drawn.
- On narrow viewports the SVG is replaced by an ordered node-sequence list with the same data.

## Consequences

The map is data-driven from `content/*` corridor records, so states and copy are editable per locale without touching the SVG geometry.

## Reversibility

High — the state model (`lib/corridor.ts`) is independent of the rendering; a richer map can replace the schematic later.

## Source requirements

`/corridor-map-visualization` + map-state-model.md; P1-04 corridor definition and route-type register; P2-17 map decisions (full Morocco framing, no verified-operating-node claims for Egypt/Saudi Arabia).
