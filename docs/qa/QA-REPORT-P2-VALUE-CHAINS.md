# QA Report — P2 Value Chains and Economic Pathways

Date: 2026-07-19 · Branch: `feature/p2-value-chains-project-deepening`
Base: `main` (merged P0 `3b2b4c6` + P1 `101ed96`). Merged into `main` via
PR #5 (merge commit `de94df5`); not deployed.

## Quality gates

| Gate | Result |
| --- | --- |
| `npm run typecheck` | 0 errors |
| `npm test` | 11 files, **139/139 tests passing** (adds `tests/p2-value-chains.test.ts`, 17 tests, plus 3 chain-context reception tests) |
| `npm run build` | ✓ compiled — **55 static pages** (adds 18 value-chain profile pages) |
| `npm run lint` | 0 warnings, 0 errors |

CI (`.github/workflows/quality.yml`) runs the same gates on pull requests to
`main` and on non-main branch pushes; no deployment, secrets or analytics.

## Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA)

**18 P2 page/state/viewport combinations** in real Chromium — **0 violations**:
the `/value-chains` overview EN/FR/AR (desktop) + AR phone; all six chain
profiles across EN/FR/AR (oilseeds, food, feed, water, mining, ports); the
VALURA and IBRIZ platform profiles carrying the new related-chains block; and
the chain-context reception for oilseeds (EN), mining (AR) and ports (EN).
Verified in-browser:

- exactly **one H1 per chain profile** (the PageHero heading);
- invalid chain slug `/en/value-chains/not-a-chain` returns **404**;
- language switch on `/fr/value-chains/mining-mineral-value` links to
  `/en/value-chains/mining-mineral-value` (**chain slug preserved**);
- platform profile `/en/portfolio/valura` cross-links to
  `/en/value-chains/oilseeds-agro-processing` (**Level-3 mapping present**);
- status conveyed by text, never colour alone; semantic ordered flow;
  keyboard-operable; native Arabic RTL.

## Chain-aware reception (chain context)

`/[lang]/reception?type=<type>&chain=<id>` renders a chain-context panel (name,
scenario status, chain-specific preparation), preselects the approved request
type, lists the chain in the review summary, and includes it in the prepared
email subject and body — confirmed by test and in-browser. Invalid chain ids
fail safe. No backend, storage, cookies, uploads, accounts, case numbers or
automatic submission.

## Screenshots (`docs/qa/screenshots-p2/`)

value-chains-en · value-chains-ar · value-chains-ar-phone (mobile) · oilseeds-en
· food-fr · mining-en · ports-en · portfolio-valura-en · reception-oilseeds-en ·
reception-mining-ar. The profiles show the scenario snapshot (category, scenario
status, source basis, last reviewed), the shared-value flow, geographic value
contribution, chain-specific enabling layers, related platforms, public vs
verification scope, scenario boundaries with the mining regulatory note, the
specialist-review pathway and the chain-aware CTA.

## Claims control

Enforced by `tests/p2-value-chains.test.ts`: pathways framed as scenarios; no
market volumes, tariffs, transit times or fixed prices in the copy; mining
marked regulated/sensitive with a regulatory note and free of reserve/grade
figures; ports corridors labelled conceptual; the platform↔chain mapping and its
IBRIZ never-financing caveat verified in all locales. See
`docs/p2/P2-CLAIMS-AND-SCENARIO-BOUNDARIES.md`.

## Known limitations

- Unresolved evidence/publication inputs carried from
  `docs/p0/P0-MISSING-INPUTS-REGISTER.md`, unchanged by P2. No pathway status is
  upgraded and no withheld claim is published until controlled evidence exists.
- `NEXT_PUBLIC_SITE_URL` unset ⇒ metadataBase omitted and the sitemap emits
  root-relative paths until the production domain is configured.
- `next lint` deprecation notice (Next 16) — informational.

## Out of scope (not started)

Marketplace, transaction/settlement system, logistics optimization or port APIs,
banking or financing service, data rooms, CRM, databases, accounts, uploads,
automated qualification, and the P3 (Forum operations) and P4 (case management)
phases — none were implemented; recorded as future-phase items.
