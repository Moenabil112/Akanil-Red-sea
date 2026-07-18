# ADR-006 — Curated WebP derivatives with explicit dimensions

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

The Core Inputs package ships 23 curated, already-optimized WebP derivatives (150–300 KB each at 1672×941 / 1254×1254 / 1055×1491 / 1536×1024). Source PNGs live in the optional visual-source packs and must stay out of the public bundle.

## Decision

- Copy only the assets actually referenced by the interface into `public/images/<section>/`, keeping catalog IDs traceable in `docs/design/ASSET-USE-REGISTER.md`.
- Render with explicit `width`/`height` (aspect-ratio reservation, CLS ≤ 0.1), `loading="lazy"` + `decoding="async"` for everything below the fold; only the hero visual loads eagerly with priority hints.
- Skip Next.js runtime image optimization for this release: sources are single-breakpoint curated derivatives already inside the hero media budgets (450 KB mobile / 1200 KB desktop), and avoiding the sharp pipeline keeps the restricted-environment build deterministic. `images.unoptimized` is set in `next.config.ts` and revisited when responsive recrops arrive from the source packs.
- No source-resolution PNG enters `public/` (enforced by the QA checklist).

## Consequences

Per-breakpoint recropping is deferred until the optional source packs are genuinely needed (per the split-package model, they are not required for this build).

## Reversibility

High — enabling the optimizer later requires no markup changes beyond removing the flag.

## Source requirements

Master Build Prompt §10, §19; ASSET-CATALOG.md; ASSET-USE-RULES.md; performance-budgets.json.
