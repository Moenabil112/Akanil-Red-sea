# ADR-003 — Typed per-locale TypeScript content records

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

AR, FR and EN must be independently edited records with equal meaning and authority (P2-16), stored outside visual components, supporting eyebrow/title/lead/body/CTA/status/disclaimer/alt/evidence fields.

## Options

1. Typed TS modules per locale (`content/ar/site.ts`, …) sharing one `SiteContent` interface (chosen).
2. JSON files + runtime schema validation.
3. Markdown/MDX per section.

## Decision

Option 1. A single `content/types.ts` interface makes a missing or extra key in any locale a **compile-time error**, which directly enforces the `/final-interface-qa` "missing keys / accidental fallback" check. Content stays serializable data (no JSX), imported by server components via a `getContent(lang)` helper.

Canonical names (P2-16 §3) are centralized in `content/terminology.ts` and referenced by tests so restricted terms ("official partner", "accredited", "guarantee", …) cannot silently enter public copy.

## Consequences

- Editors work per-locale in one file per language; no runtime translation machinery ships to the client.
- Adding a locale = adding one typed module + registering it.

## Reversibility

High — records are plain data and can be exported to JSON/CMS later.

## Source requirements

Master Build Prompt §9; P2-16 approved names and restricted terminology; CLAUDE.md language rules.
