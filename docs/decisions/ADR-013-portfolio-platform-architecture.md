# ADR-013 — Portfolio platform architecture

Date: 2026-07-19 · Status: accepted

## Context

P0 introduces four portfolio platforms (Trade-Chain Africa, Valura, RWAFID,
IBRIZ/GAAS) that must be presented publicly without unverified claims.

## Decision

- Model platforms as typed `PortfolioPlatformContent` records with a fixed
  `PlatformId` union; wording is independently authored per locale, structure
  (ids, status/evidence enums, CTA request types) is shared.
- Every card shows the §26 mandated fields, textual public status and
  evidence state (`PublicStatusControl`), and a controlled CTA that routes to
  reception with the platform's request type. No investment values, returns,
  sponsors, ownership claims, logos, or readiness labels.
- Dedicated statically generated route `/[lang]/portfolio` plus a homepage
  portfolio section reusing the same grid, so the presentation cannot drift.

## Consequences

Tests assert four platforms, resolvable states, the IBRIZ/GAAS regulatory
note, and the absence of banned investment-readiness language in all locales.
