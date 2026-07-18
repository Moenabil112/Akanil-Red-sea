# ADR-001 — Next.js App Router with CSS Modules and centralized tokens

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

The Master Build Prompt (§5) sets Next.js App Router + strict TypeScript as the implementation baseline for an empty repository. A styling approach was needed that keeps the Akanil identity centralized, supports native RTL, and avoids importing a component-library visual identity.

## Options

1. Next.js App Router + CSS Modules + global token layer (chosen).
2. Next.js + Tailwind utility layer.
3. Vite SPA + client i18n (rejected: no static locale routes, weaker SEO/metadata model).

## Decision

Use Next.js (App Router, React Server Components by default) with:

- `styles/tokens.css` — all color, type, spacing, radius, shadow, z-index, breakpoint, motion-duration and easing tokens as CSS custom properties, sourced from the approved brand tokens;
- `styles/globals.css` — reset, typography, focus, reduced-motion foundations;
- CSS Modules per component with **logical properties only** (`margin-inline-start`, `inset-inline-end`, …) so Arabic RTL is native rather than mirrored;
- no UI component library (avoids a foreign visual identity per §5).

Tailwind was rejected because the interface is a single authored narrative page with strong editorial art direction; a utility layer adds a dependency and pushes toward template-like composition without materially helping three-locale authored layouts.

## Consequences

- All visual constants live in one file; Phase 3 reconciliation is a token edit.
- RTL correctness is structural, not an afterthought.

## Reversibility

High — tokens and modules are framework-agnostic CSS.

## Source requirements

Master Build Prompt §5–§7; brand `design-tokens.json/css`; P2-17 approved palette and typography.
