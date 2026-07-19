# ADR-017 — Red Sea geographical node normalization

Date: 2026-07-19 · Status: accepted

## Context

P0 introduces a typed geographical node model spanning Morocco, Saudi Arabia,
Egypt, Sudan and the Horn of Africa, with strict naming rules.

## Decision

- Fourteen `EcosystemNodeId` nodes with `NodeKind` classification; schematic
  positions live in `lib/ecosystem.ts` (`nodeGeometry`, LTR-locked viewBox),
  wording in the locale records.
- Naming rules: Aswan is an inland economic/logistics node, never a seaport;
  "Port of Asmara" is never used — the corridor is the "Asmara–Massawa
  Economic and Logistics Corridor" until documentation says otherwise;
  Bosaso and Port Sudan are ports; Northern State, Kassala and Gedaref are
  production regions; Moroccan, Saudi and Egyptian nodes carry no partnership
  implication.
- `RedSeaNodeMap` renders a schematic architecture diagram: kind is conveyed
  by marker shape plus a textual legend, node details (role, summary,
  platforms, status, evidence) are HTML text, no route lines are drawn as
  verified, and no travel times, volumes, costs or capacities appear. The SVG
  is decorative (aria-hidden) with an accessible button list and live text
  summary, following the ADR-004 pattern; on small screens the schematic
  yields to the node list.

## Consequences

Node ids, kinds and order are locked by tests across locales and geometry;
naming rules are asserted in all three languages.
