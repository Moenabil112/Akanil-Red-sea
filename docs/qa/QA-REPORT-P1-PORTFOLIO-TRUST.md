# QA Report — P1 Portfolio and Institutional Trust

Date: 2026-07-19 · Branch: `feature/p1-portfolio-institutional-trust`
Base: `main` (merged P0 `3b2b4c6`). Merged into `main` via PR #4 (merge
commit `101ed96`); not deployed.

## Quality gates

| Gate | Result |
| --- | --- |
| `npm ci` | 445 packages installed clean (2 moderate advisories in the dev-dependency chain, pre-existing) |
| `npm run typecheck` | 0 errors |
| `npm test` | 10 files, **119/119 tests passing** |
| `npm run build` | ✓ compiled — **49 static pages** (adds 12 platform-profile pages + sitemap) |
| `npm run lint` | 0 warnings, 0 errors |

CI: `.github/workflows/quality.yml` runs the same five gates on pull requests
to `main` and on non-main branch pushes (no deployment, secrets or analytics).

## Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA)

**19 P1 page/state/viewport combinations** in real Chromium — **0 violations**:
Why Akanil EN + AR (desktop) + AR phone; portfolio EN/FR/AR; all four profiles
across EN/FR/AR (valura, rwafid, trade-chain-africa, ibriz-gaas); and the
platform-context reception for each platform including the Arabic VALURA
screen. Verified in-browser:

- exactly **one H1 per platform profile** (the PageHero heading);
- invalid platform slug `/en/portfolio/not-a-platform` returns **404**;
- language switch on `/fr/portfolio/valura` links to `/en/portfolio/valura`
  (**platform slug preserved**);
- status conveyed by text, never colour alone; semantic headings and lists;
  keyboard-operable; native Arabic RTL.

## Reception platform context (§12)

`/[lang]/reception?type=<type>&platform=<id>` renders a platform-context panel
(project name, file status, current stage, project-specific preparation),
preselects the approved request type, lists the platform in the review summary,
and includes it in the prepared email subject and body — confirmed by test and
in-browser. No backend, storage, cookies, uploads, accounts, case numbers or
automatic submission.

## Screenshots (`docs/qa/screenshots-p1/`)

why-akanil-en · why-akanil-ar-phone (mobile) · portfolio-en · portfolio-ar ·
valura-en · rwafid-ar · trade-chain-fr · ibriz-en · reception-valura-en ·
reception-valura-ar. The profiles show the 16-section template (hero,
snapshot with distinct source/last-reviewed dates, core value, problem,
components, scope, stage, labelled preliminary figures, partners sought,
what-is-public-now, may-be-available-after-review, claims and limitations, the
specialist-review pathway, and the Request Project Review CTA).

## Claims control

Enforced by `tests/p1-portfolio-trust.test.ts` and
`tests/ecosystem-architecture.test.ts`: proposed partners never rendered as
confirmed; VALURA figures preliminary and free of IRR/payback/return; RWAFID
Q1 2026 pilot / cooperative / ministry / funding claims withheld; Trade-Chain
legacy partner / NILLY / blockchain / Series A / return / "leading" claims
absent; IBRIZ never a licensed or operating bank and no consumer banking CTA;
ecosystem nodes never described as Akanil-owned assets. See
`docs/p1/P1-CLAIMS-AND-CONTENT-REGISTER.md`.

## Known limitations

- Unresolved evidence/publication inputs carried from
  `docs/p0/P0-MISSING-INPUTS-REGISTER.md` (platform legal relationships;
  VALURA site/feasibility/ESIA; RWAFID pilot/partnership/financing status;
  Trade-Chain verified partners and NILLY disposition; IBRIZ/GAAS legal entity
  and licensing roadmap; founder membership evidence; official domain/email;
  portfolio image rights).
- `NEXT_PUBLIC_SITE_URL` unset ⇒ metadataBase omitted and the sitemap emits
  root-relative paths until the production domain is configured.
- `next lint` deprecation notice (Next 16) — informational.

## Out of scope (not started)

P2 (value-chain deepening), P3 (Forum operations) and P4 (case management), and
all deferred capabilities (data rooms, accounts, databases, uploads, payment/
banking integrations, NDA workflow, partner logos, multilingual PDFs) — none
were implemented; recorded as future-phase items.
