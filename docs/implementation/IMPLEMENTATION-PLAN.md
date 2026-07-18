# AKANIL Institutional Window — Implementation Plan

Status: Active — V1.0
Branch: `claude/build-akanil-interface-uv6qnd`
Date: 2026-07-18

## 1. Repository diagnosis

- The repository was empty at build start (README.md only).
- All governing inputs were inspected from the uploaded split packages:
  - `AKANIL-Claude-Code-Master-Build-Prompt-V1.1` (mission, sequence, acceptance criteria);
  - `AKANIL-Claude-Code-Skills-V1.1` (CLAUDE.md, 12 project skills, baseline and quality gates) — now seeded into this repository;
  - `AKANIL-Claude-Code-Core-Inputs-V1.1` (Phase 1 + Phase 2 approved archives, V0.2 prototype, brand tokens, 23 optimized WebP assets, asset catalog, motion manifest, page architecture);
  - Optional visual source packs Part 1 and Part 2 (source PNG — kept outside the repository; not required for this build).
- Missing input: the approved **Phase 3** archive (P3-00 … P3-13). See `MISSING-INPUTS.md`.
- No prior tooling existed; the framework baseline is initialized by this build.

## 2. Strongest reusable ideas from the V0.2 prototype

1. Trilingual content dictionaries with genuinely edited AR/FR/EN institutional copy aligned with the approved baselines (reused as the editorial starting point, restructured into per-locale content records).
2. Clear three-layer architecture narrative (Akanil → Gateway → Forum) with status framing.
3. Conceptual-status discipline: corridor disclaimer, forum poster label, non-promissory contact modal.
4. Governed operating-layer steps (receive → verify → qualify → connect → decide/follow-up).
5. Correct base RTL behavior (logical properties, dir switching, non-mirrored geography).

## 3. Five most important redesign problems

1. **Monolithic static file** — no components, no locale routes, no content model; all copy trapped in one HTML file and JS dictionaries.
2. **Corridor map is a raster image only** — no semantic nodes, no route states, no keyboard interaction, no text equivalent; risks implying a verified route.
3. **Template-like composition risk** — identical rounded cards, float-cards with numbers, glass panels; needs authored editorial layouts per section (especially Morocco value proposition, which is missing entirely as a major section).
4. **Missing sections** — Why the Gateway, Morocco value proposition, Sudan shared-value proposition and Trust/AI depth are absent or underweighted relative to the approved page architecture.
5. **Accessibility gaps** — modal without focus trap, tabs without keyboard arrow-key semantics/ARIA, hover-only nav states, language switching resets scroll context.

## 4. Technical baseline (decisions in `docs/decisions/`)

- Next.js App Router + TypeScript strict; React Server Components by default.
- Static generation of `/{ar|fr|en}` locale routes via `generateStaticParams`; root redirects to `/ar`.
- Single-page narrative per locale (12 sections, anchor navigation) per the approved page architecture.
- Content architecture: independently edited AR/FR/EN TypeScript records in `content/{ar,fr,en}/`, typed by a shared `SiteContent` interface so missing keys fail type checking (ADR-003).
- Styling: centralized design tokens as CSS custom properties + CSS Modules; logical properties for native RTL (ADR-001).
- Motion: CSS transitions/keyframes + a small IntersectionObserver reveal primitive + SVG route drawing; no animation library (ADR-002). `prefers-reduced-motion` honored globally.
- Corridor map: semantic SVG diagram with status-aware routes, HTML node selector buttons (keyboard/touch/pointer), text summary outside the SVG, legend, and conceptual disclaimer (ADR-004).
- Fonts: Alexandria (Arabic) and Inter (Latin) via Google Fonts stylesheet links with system fallbacks; no font binaries committed (ADR-005).
- Images: pre-optimized WebP derivatives from the curated catalog copied to `public/images/`; explicit dimensions; lazy loading except the active hero media (ADR-006).
- Tests: Vitest — content parity/terminology tests + component tests (tabs, dialog, map states).
- Lint: ESLint (eslint-config-next) + `tsc --noEmit`.

## 5. Section plan (approved narrative order)

01 Hero — Gateway proposition, Akanil ownership, one primary + one secondary action, controlled gateway-reveal motion, no fake counters.
02 Why the Gateway — operational problem vs. operating memory answer (editorial split, not cards).
03 Three-layer architecture — hierarchy communicated by indentation/scale, not three equal cards.
04 Morocco value proposition — major authored section: six capability pillars with stakeholder-specific framing.
05 Sudan shared-value proposition — partnership framing + shared-value equation.
06 Corridor intelligence — interactive conceptual SVG network with route states + mobile node sequence.
07 Priority value chains — accessible tabs, six-stage chain flow per chain.
08 Forum — first activation programme, private/invitation framing, concept-art labeling.
09 Digital operating layer — governed progression steps, "operating vision" status.
10 Trust, data and AI — principles + human-authority statement.
11 About Akanil — approved institutional definition + founder role.
12 Institutional contact — local accessible modal, non-promissory actions, no data transmission.

## 6. Work sequence and commits

1. `docs: seed governance, skills and implementation plan` (this commit)
2. `feat: initialize Next.js trilingual foundation` — app shell, tokens, layout, header/footer, content architecture.
3. `feat: first vertical slice` — hero, why, architecture, Morocco (AR/FR/EN + responsive + RTL validated).
4. `feat: economic story` — Sudan, corridor map, value chains.
5. `feat: activation and trust` — forum, operating layer, trust, about, contact.
6. `feat: asset and motion pass` — optimized assets, motion, reduced-motion fallbacks, asset register.
7. `test/docs: quality pass` — QA report, anti-generic review, fixes.

## 7. Hard stops

No deployment, no external contact service, no analytics, no push to remote without explicit user authorization.

## V1.1 — Gateway experience and Digital Reception Lite (2026-07-18)

Executed the four-phase UX specification on `feature/gateway-ux-and-reception-lite`:
clarity homepage (ADR-007), audience entry paths (ADR-008), Digital Reception
Lite with mailto transport and zero storage (ADR-009), and the nine-route
trilingual content architecture with locale-preserving navigation (ADR-010)
and legacy-anchor compatibility (ADR-011). See `ROUTES.md` and
`../qa/QA-REPORT-GATEWAY-EXPERIENCE.md`.
