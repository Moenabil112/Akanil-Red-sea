# QA Report — P0 Red Sea Ecosystem Architecture

Date: 2026-07-19 · Branch: `feature/p0-red-sea-ecosystem-architecture`
Status: draft PR only — not merged, not deployed.

## Quality gates (directive §41)

| Gate | Result |
| --- | --- |
| `npm ci` | dependency tree installs clean (Next 15.5, React 19.1) |
| `npm run typecheck` | 0 errors |
| `npm test` | 9 files, **89/89 tests passing** |
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
platform cards incl. IBRIZ/GAAS regulatory note) · morocco-en · sudan-en ·
corridor-en · forum-en (activation phases) · reception-en (general) ·
reception-industry-en (Moroccan industry market-expansion) ·
reception-asset-ar (Sudanese asset submission) · reception-finance-en
(financial project review with disclaimer) · reception-review-ar (Arabic
review-before-email).

The homepage screenshots cover Why the Red Sea, the ecosystem value flow,
the seven audience entry paths, the node map section, the technology layer
and the specialized review process in sequence.

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
