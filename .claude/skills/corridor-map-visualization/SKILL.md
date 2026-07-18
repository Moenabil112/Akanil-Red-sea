---
name: corridor-map-visualization
description: Designs the conceptual Morocco–Red Sea corridor map and route interactions. Use for maps, nodes, route states, geographic storytelling, logistics scenarios or corridor diagrams.
---
# Corridor map visualization

The corridor is a scenario-based economic network, not one verified fixed route.

## Semantic layer model

Represent separately:

- geographic base;
- economic nodes;
- production and processing roles;
- transport and logistics legs;
- finance and insurance;
- route scenarios;
- verification and freshness;
- risk and alternatives.

## Route states

Support visible states such as:

- conceptual;
- under study;
- qualified for pilot;
- operationally verified;
- constrained;
- alternative.

Never render all routes with the same certainty.

## Interaction

- Allow stakeholders to focus by sector or value chain.
- Provide a textual summary of the selected route.
- Show node purpose, status and last verification where available.
- Use progressive detail rather than placing every label on the map.
- On mobile, present a node sequence or focused map steps instead of an unreadable miniature map.

## Technology

Prefer an accessible semantic SVG for the public conceptual map.

Canvas or WebGL may be used for atmosphere or large datasets, but essential labels, status and interaction must remain accessible outside the canvas.

## Visual rules

- Show the complete approved map framing for Morocco.
- Show Sudan through its eastern Red Sea connection.
- Do not make Egypt or Saudi Arabia appear as confirmed operating nodes without current evidence.
- Do not let animated routes imply live logistics or real-time tracking.
- Preserve geographic direction in RTL mode.

## Required fallback

Provide:

- static poster image;
- reduced-motion version;
- text-based route explanation;
- keyboard-selectable nodes;
- status legend.

Read `references/map-state-model.md` before implementation.
