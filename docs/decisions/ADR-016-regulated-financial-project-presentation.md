# ADR-016 — Regulated financial-project presentation (IBRIZ/GAAS)

Date: 2026-07-19 · Status: accepted

## Context

IBRIZ (digital gold and banking infrastructure) and GAAS (Gold as a Service)
touch regulated banking activity and cannot be presented as operating or
licensed services.

## Decision

- Present IBRIZ/GAAS as financial-technology and banking-infrastructure
  projects with `publicStatus: regulated-development` and
  `evidenceState: evidence-restricted`.
- Publish only the intended product architecture; never account-opening CTAs,
  deposit-taking, payments, investment solicitation, convertibility promises,
  asset-backing guarantees or return figures.
- Carry the mandatory regulatory note, independently authored in Arabic,
  French and English, on every surface where the platform card renders.
- Route the CTA to the technology-data-partnership request type
  (technology and regulated-infrastructure discussion), never a consumer CTA.

## Consequences

Tests enforce the note's presence and the absence of consumer-banking or
guarantee language in all locales. Licensing claims remain blocked until a
licence record exists (missing-inputs register #13).
