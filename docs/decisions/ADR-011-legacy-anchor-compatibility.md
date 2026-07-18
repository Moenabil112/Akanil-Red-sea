# ADR-011 — Backward compatibility for old anchors and routes

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

The V1.0 site was a single page addressed by anchors (`/en#morocco`, `/ar#chains`, …). Restructuring must not break published links (Phase 4 compatibility requirement).

## Decision

Every legacy anchor keeps a target on the rebuilt homepage, attached to the summary block that replaced the detailed section: `#why`, `#morocco`, `#sudan` (value summary), `#operating` (journey), `#chains`, `#corridor` (chains/corridor summary), `#forum`, `#trust`, `#about` (trust/about summary), `#contact` (reception call). Offset anchors compensate for the fixed header. From each summary, one link leads to the full content on its dedicated route. A structure test enforces the presence of all legacy ids.

Old URLs therefore land on the correct topic summary rather than 404-ing or jumping to the top; no server-side anchor rewriting is required (fragments never reach the server).

## Consequences

Published links keep working through the transition; the anchors can be retired deliberately in a future release once inbound links migrate.

## Reversibility

Trivial — the ids are attributes on the summary sections.
