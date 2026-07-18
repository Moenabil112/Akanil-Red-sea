# ADR-010 — Trilingual multi-page routing

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

Phase 4 separates detailed knowledge from the homepage into nine focused routes, each fully trilingual.

## Decision

- Canonical routes `/{ar|fr|en}/{gateway, morocco, sudan, corridor, value-chains, forum, trust, about-akanil, reception}`, statically generated (30 pages). Non-localized entries (`/gateway`, …) 307-redirect to the Arabic default; `/` continues to redirect to `/ar`. No redirect chains or loops.
- Pages reuse the preserved V1.0 section components (corridor map, value-chain tabs, forum artwork, trust principles, motion utilities) with contextual section numbering; each page adds its own H1 (`PageHero`) and a reception band with a page-appropriate request-type preselection.
- Per-route localized metadata comes from typed `pages` records via one factory (`lib/page-meta.ts`): title, description, canonical, `ar/fr/en` alternates, Open Graph. `metadataBase` is read from `NEXT_PUBLIC_SITE_URL` and **omitted when unset** — the production domain is not configured in the repository and must not be guessed (see the spec's stop condition; recorded as a known limitation until the domain is provided).
- Language switching preserves route and hash (`switchLocalePath`): `/fr/forum` → `/en/forum`; header/footer navigation is route-based with active states. Desktop keeps six primary items; the remaining routes appear in the mobile menu and footer.

## Consequences

Content maintenance is per-topic; the homepage no longer duplicates detail. Adding a route = one content record + one page file.

## Reversibility

High — routes compose existing components; removing one deletes a directory and a record.
