# QA Report — P0 Red Sea Ecosystem Architecture

Date: 2026-07-19 · Branch: `feature/p0-red-sea-ecosystem-architecture`
Status: draft PR only — not merged, not deployed.

> **Reconciliation pass (2026-07-19).** After the initial P0 build, the four
> platform definitions and Akanil's institutional identity were reconciled
> with `AKANIL_P1_Portfolio_and_Institutional_Trust_Context_V1.0.md`. Gates
> re-run: typecheck 0 errors · **100/100 tests** · build **36 static pages** ·
> lint clean · axe WCAG 2.2 AA **0 violations across 24 checks** (now including
> the Arabic About institution block and the Arabic portfolio page). Language
> switching still preserves `/portfolio`.

## Quality gates (directive §41)

| Gate | Result |
| --- | --- |
| `npm ci` | dependency tree installs clean (Next 15.5, React 19.1) |
| `npm run typecheck` | 0 errors |
| `npm test` | 9 files, **100/100 tests passing** |
| `npm run build` | ✓ compiled; **36 static pages** (12 routes × 3 locales, all SSG) |
| `npm run lint` | 0 warnings, 0 errors |

Bundle: shared first-load JS 102 kB; heaviest route `/[lang]/reception`
7.47 kB + 118 kB first load; `/[lang]/portfolio` 2.97 kB + 114 kB.

## Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA)

23 page/state/viewport combinations in real Chromium (three homepage locales,
Arabic phone viewport, portfolio ×3, morocco, sudan, corridor ×2, forum,
gateway, value-chains, trust, about, reception general ×3 + three preselected
request states + the completed Arabic review-before-email screen):
**0 violations.**

Also verified in-browser: language switcher on `/fr/portfolio` links to
`/en/portfolio` (route preserved); reception review step reached with the
Sudanese asset-submission schema; copy/download actions present with a
polite live region; no file inputs anywhere.

## Privacy verification

- Source-scan test (`tests/ecosystem-architecture.test.ts`) proves the app
  code contains no fetch/XHR/sendBeacon submission, no localStorage or
  sessionStorage, no cookie writes, no analytics, no server actions and no
  file inputs.
- Component test proves browser storage is untouched through the full form
  flow and `document.cookie` stays empty.
- Transport remains `mailto:` only (ADR-009); copy/download actions operate
  purely client-side on in-memory state.

## Screenshots (`docs/qa/screenshots-p0/`)

home-en · home-fr · home-ar · home-ar-phone (mobile) · portfolio-en (all four
reconciled platform cards, simplified statuses, last-reviewed dates and
Request Project Review CTAs) · portfolio-ar (Arabic portfolio) · morocco-en ·
sudan-en · corridor-en · forum-en (activation phases) · about-en / about-ar
(institution facts + regional representatives + founder bridge) ·
reception-en (general) · reception-industry-en (Moroccan industry
market-expansion) · reception-asset-ar (Sudanese asset submission) ·
reception-finance-en (financial project review with disclaimer) ·
reception-review-ar (Arabic review-before-email).

The homepage screenshots cover Why the Red Sea, the ecosystem value flow,
the seven audience entry paths, the node map section, the technology layer
and the specialized review process in sequence. The portfolio screenshots
show VALURA (Public Profile Available — Preliminary Blueprint), RWAFID and
Trade-Chain Africa (Update Required Before Publication) and IBRIZ/GAAS
(Regulated or Sensitive Project) with the platform/node distinction note and
the review-request disclaimer.

## Claims intentionally omitted

See `docs/p0/P0-MISSING-INPUTS-REGISTER.md` (19 items): no partner claims, no
membership claims, no licensing/zone-approval claims, no investment-readiness
or due-diligence labels (no evidence manifest present), no route presented as
operationally verified, IBRIZ/GAAS never presented as a licensed bank.

## Known limitations

- `NEXT_PUBLIC_SITE_URL` unset ⇒ metadataBase omitted (production domain not
  configured; missing-inputs #17).
- Due-diligence status labels exist in the state vocabulary but are not
  activated anywhere (no controlled evidence manifest).
- `next lint` deprecation notice (Next 16 migration) — informational only.
