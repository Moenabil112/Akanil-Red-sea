# Component and Section Map

## Application shell

| Path | Kind | Responsibility |
|---|---|---|
| `app/[lang]/layout.tsx` | Server (root layout) | `<html lang dir>`, fonts, per-locale metadata/OG, theme color |
| `app/[lang]/page.tsx` | Server | Composes the 12-section narrative from `getContent(locale)` |
| `next.config.ts` | Config | `/` → `/ar` redirect, unoptimized curated images (ADR-006) |
| `lib/i18n.ts` | Lib | Locale list, guards, direction |
| `lib/content.ts` | Lib | Locale → `SiteContent` record |
| `lib/corridor.ts` | Lib | Corridor viewbox, node positions, route paths, state strokes |
| `content/types.ts` | Types | `SiteContent` contract (compile-time locale parity) |
| `content/{ar,fr,en}/site.ts` | Content | Independently edited locale records |
| `content/terminology.ts` | Content | Canonical names + restricted terms (tested) |

## Layout components

| Component | Kind | Notes |
|---|---|---|
| `layout/Header` | Client | Scroll condensation, anchor nav, accessible mobile menu (Escape, aria-expanded), section-preserving language switcher |
| `layout/Footer` | Server | Brand hierarchy (three layers) + global evidence note |

## Section components (narrative order)

| # | Component | Kind | Interaction |
|---|---|---|---|
| 01 | `sections/Hero` | Server | Gateway reveal (CSS), contact-note trigger, scope strip |
| 02 | `sections/WhyGateway` | Server | Problem register vs sticky answer panel |
| 03 | `sections/Architecture` | Server | Descending three-layer hierarchy + chamber status note |
| 04 | `sections/MoroccoValue` | Server | Statement, six pillars, audiences, labelled concept board |
| 05 | `sections/SudanValue` | Server | Partnership roles, shared-value equation, labelled panorama |
| 06 | `sections/Corridor` → `maps/CorridorMap` | Client (map) | Node buttons (keyboard/pointer/touch), SVG route emphasis, text summary + legend outside SVG, mobile node sequence |
| 07 | `sections/ValueChains` | Client | ARIA tabs, direction-aware arrow keys, staged flow |
| 08 | `sections/Forum` | Server | Labelled identity poster, facts, follow-up link |
| 09 | `sections/OperatingLayer` | Server | Nine governed steps + operating-vision note |
| 10 | `sections/Trust` | Server | Eight principles + human-authority quote |
| 11 | `sections/About` | Server | Approved definition, roles, founder note |
| 12 | `sections/Contact` | Server + `ui/ContactNote` (client) | Non-promissory actions; native-dialog local note |

## UI / motion primitives

| Component | Kind | Notes |
|---|---|---|
| `ui/SectionIntro` | Server | Numbered eyebrow + heading + lead (dark/light tones) |
| `ui/ContactNote` | Client | Native `<dialog>`: platform focus trap, Escape, backdrop close; transmits nothing |
| `ui/OpenContactLink` | Client | Dispatches open event; degrades to `#contact` anchor without JS |
| `motion/Reveal` | Client | IntersectionObserver entrance; reduced-motion renders instantly |

## Tests

`tests/content-parity.test.ts` (structure, terminology, claim discipline), `tests/corridor.test.ts` (geometry/state model), `tests/value-chains.test.tsx` and `tests/corridor-map.test.tsx` (ARIA + keyboard behavior).
