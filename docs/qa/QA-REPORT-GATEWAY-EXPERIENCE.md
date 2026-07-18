# QA Report — Gateway Experience and Digital Reception Lite (V1.1)

- **Date:** 2026-07-18
- **Branch:** `feature/gateway-ux-and-reception-lite`
- **Environment:** Linux container, Node 22.22.2, Next.js 15.5.20, Chromium via Playwright
- **Baseline:** main after PR #1 (V1.0 single-page window)

## 1. Build integrity

| Check | Result |
|---|---|
| `npm run build` | Pass — 31 static pages (10 routes × 3 locales + not-found), first-load JS 111–115 kB |
| `npm run typecheck` | Pass (strict) |
| `npm run lint` | Pass, 0 warnings |
| `npm test` | Pass — 50/50 tests across 8 files (18 pre-existing + 32 new) |
| Secrets / generated files in diff | None (screenshots under `docs/qa/screenshots/` are intentional documentation) |

## 2. Phase acceptance

**Phase 1 — clarity.** Homepage word counts: AR 1,781 → 888 (−50 %), FR 2,384 → 1,105 (−54 %), EN 2,065 → 961 (−53 %). Slightly beyond the 35–45 % target; all detail preserved on dedicated routes, none deleted. First viewport: name, permanent-infrastructure definition, scope, founder pillar, primary + secondary CTA, motto; status layer directly below with seven textual states and no fabricated metrics. Gateway/Forum distinction and Akanil ownership kept (footer hierarchy + architecture section on /gateway).

**Phase 2 — entry paths.** Five authored paths render in all locales; each links to `/{lang}/reception?type=<default>&audience=<id>` (structure-tested); financial path carries the no-automatic-approval note; keyboard/touch verified; Arabic rows read naturally in RTL; editorial rows, not an icon grid.

**Phase 3 — reception.** All seven request types selectable and localized; preselection verified in-browser (`type=qualification&audience=moroccan-company` → correct select value + audience chip). Validation blocks review without required fields or consent; review state shows the structured summary and the three "what happens next" steps; the mailto href is a correctly encoded `mailto:akanil.consulting@proton.me?subject=…&body=…` (no raw spaces/newlines; Arabic bodies isolate LTR runs); after opening, the interface states that nothing was submitted through the site. `tel:+212663177864` present. localStorage, sessionStorage and cookies verified empty after a full flow. Direct channels and privacy points are server-rendered (no-JS fallback) with a `<noscript>` note.

**Phase 4 — routes.** All nine content routes live in AR/FR/EN (30 pages); non-localized paths 307-redirect to `/ar/...` with no loops; language switch verified in-browser (`/fr/forum` → `/en/forum`); localized titles/descriptions/canonicals/alternates per page; `metadataBase` driven by `NEXT_PUBLIC_SITE_URL` (unset → omitted, see limitations); legacy anchors all present (test-enforced).

## 3. Accessibility

axe-core WCAG 2.0/2.1/2.2 A+AA on 13 page/viewport combinations (all three homepage locales, phone homepage, eight content pages, reception ×3): **0 violations** after fixing copper-button, journey-link and corridor-scope contrast. One H1 per page (PageHero/Hero); labels associated via `htmlFor`/`aria-describedby`; validation errors announced (`role="alert"`, focus moved); dialog-free reception flow; reduced-motion verified; status conveyed by text, never color alone.

## 4. Responsive

Reviewed at 390×844 (AR home, FR reception, mobile nav) and 1440×900 (all routes). No horizontal overflow, no clipped Arabic headings; audience rows stack; reception actions full-width on phones; mobile menu lists all nine routes + language switch.

## 5. Trust review

No dates, venues, sponsors, participant numbers, partner logos or endorsements introduced; Forum remains private/invitation-based; corridor stays conceptual with visible states; status layer distinguishes live vs conceptual vs future; reception never claims acceptance; AI presented only under human authority.

## 6. Known limitations

1. **Production domain not configured** — `metadataBase` stays unset until `NEXT_PUBLIC_SITE_URL` is provided; absolute OG URLs are not emitted (spec stop condition honoured rather than guessing a domain).
2. mailto transport depends on the visitor having a configured email application; the UI says so and offers direct email/telephone as fallback.
3. Imagery remains labelled concept art (documentary photography still recommended before wide publication).
4. Phase 3 governance archive reconciliation (MI-01) remains open from V1.0.

## Verdict

**Pass** — all four phase acceptance gates met; no blocking issues open. Not merged, not deployed.
