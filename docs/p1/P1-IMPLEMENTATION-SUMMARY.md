# P1 — Implementation Summary

Branch: `feature/p1-portfolio-institutional-trust` · Base: `main` (merged P0
`3b2b4c6`). Merged into `main` via PR #4 (merge commit `101ed96`); not
deployed. P1 extends P0 with a clearer portfolio and institutional-trust
experience; it does not redesign the P0 ecosystem architecture. P2
(value-chain deepening) builds on this merged baseline.

## What P1 adds to P0

1. **Why Akanil?** — the `/[lang]/about-akanil` page now carries the four
   trust foundations: legal presence (Morocco 2014 / RIC Casablanca / CR 10015;
   Sudan branch 2017 / CR 121), regional reach (nine agents/representatives, not
   legal branches), the economic bridge (both sides: Morocco / Sudan / Red Sea),
   and specialist review (reusable panel + discipline categories). Founder
   attribution uses **Mohamed Abderrahim / محمد عبدالرحيم**; association
   memberships remain withheld.
2. **Portfolio overview** — each card gains source date, last-reviewed date and
   a link to the dedicated profile, and adds the reusable specialist-review
   panel. Four platforms in the public order VALURA · RWAFID · Trade-Chain
   Africa · IBRIZ/GAAS, with the four simplified statuses only.
3. **Four dedicated platform profiles** — new static routes and a shared
   16-section template.
4. **Specialist review process** — one reusable `SpecialistReviewPanel`
   (six visitor steps + eight non-guarantee statements) used on About, the
   portfolio overview and every profile.
5. **Request Project Review** — every card and profile routes into the existing
   no-backend reception with a platform context.

## Routes added

- `/[lang]/portfolio/valura`
- `/[lang]/portfolio/rwafid`
- `/[lang]/portfolio/trade-chain-africa`
- `/[lang]/portfolio/ibriz-gaas`

Statically generated for ar/fr/en (12 pages) via `generateStaticParams` over
`platformIds`; unknown slugs 404 (`dynamicParams = false`). Each has localized
title/description, canonical path, hreflang alternates and Open Graph metadata.
`app/sitemap.ts` lists all routes including the four profiles. Non-localized
`/portfolio/<slug>` redirects to the Arabic default. Language switching
preserves the platform slug (`switchLocalePath`). The four profiles are **not**
added to the main header; the portfolio overview remains the nav entry.

## Typed model

The existing `PortfolioPlatformContent` (single authoritative source in
`content/{en,fr,ar}/ecosystem.ts`) was extended with `sourceDate?`,
`publicInformation`, `reviewInformation`, `limitations` and
`preparationRequirements`; overview cards and detail profiles both derive from
it — no duplicated facts, no per-platform JSX. A reusable `reviewPanel` block
(six steps, eight statements) and an `institution.bridge*` block were added.
All three locales implement the same typed structure with independently
authored copy.

## Reception integration (§12)

`/[lang]/reception?type=<request-type>&platform=<platform-id>`. The desk
recognizes a valid `platform`, shows a platform-context panel (name, project
status, current stage, project-specific preparation), lists the platform in the
review summary, and includes it in the prepared email subject and body. No
backend, storage, cookies, uploads, accounts, case numbers or automatic
submission were introduced. Approved request types: VALURA
project-investment-review · RWAFID technology-data-partnership · Trade-Chain
Africa port-logistics-cooperation · IBRIZ/GAAS technology-data-partnership.

## Housekeeping

- `docs/qa/QA-REPORT-P0-ECOSYSTEM.md` updated: PR #3 merged (`3b2b4c6`), P0
  accepted as the P1 baseline, one consistent accessibility count (24 checks).
- `.github/workflows/quality.yml` runs `npm ci / typecheck / test / build /
  lint` on pull requests to `main` and on non-main branch pushes. No
  deployment, secrets or analytics.

## Claims withheld

See `P1-CLAIMS-AND-CONTENT-REGISTER.md`. In brief: RWAFID Q1 2026 pilot,
cooperative, ministry-letter and funding claims; Trade-Chain legacy partner,
NILLY, blockchain, Series A and return claims; IBRIZ bank/account/payment
claims; VALURA IRR/payback/revenue and any fixed site; founder association
memberships.

## Future-phase items (recorded, not implemented)

Data rooms, login/accounts, CRM, databases, form-submission APIs, file uploads,
payment/banking integrations, investment subscriptions, automated due
diligence, automatic partner matching, confidential-document publication,
partner logos, multilingual PDFs, NDA workflow, forum-registration expansion,
and the P2 (value-chain deepening), P3 (Forum operations) and P4 (case
management) phases. None were started.
