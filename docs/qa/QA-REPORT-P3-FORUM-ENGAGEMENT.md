# QA Report — P3 Forum Programme, Qualification and Stakeholder Engagement

Date: 2026-07-20 · Branch: `feature/p3-forum-qualification-stakeholder-engagement`
Base: `main` (merged P0 `3b2b4c6` + P1 `101ed96` + P2 `de94df5`). Draft PR only —
not merged, not deployed.

## Quality gates

| Gate | Result |
| --- | --- |
| `npm run typecheck` | 0 errors |
| `npm test` | 13 files, **163/163 tests passing** (adds `tests/p3-forum-engagement.test.ts`, 24 tests, plus 3 Forum-context reception tests) |
| `npm run build` | ✓ compiled — **76 static pages** (adds 9 Forum subroute pages) |
| `npm run lint` | 0 warnings, 0 errors |

CI (`.github/workflows/quality.yml`) runs the same gates on pull requests to
`main` and on non-main branch pushes; no deployment, secrets or analytics.

## Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA)

**19 P3 page/state/viewport combinations** in real Chromium — **0 violations**:
the Forum Hub EN/AR (desktop) + AR phone; Programme EN/FR + AR phone;
Participation EN/AR/FR; Prepare FR/EN + AR phone; Forum qualification from a
Moroccan-company path, a Sudanese-sponsor path, a track+chain combination, a
platform+chain combination and a mining participant+track (Arabic); and the
VALURA platform and oilseeds chain profiles carrying the Forum-engagement
cross-link. Verified in-browser:

- exactly **one H1 per Forum page** (the PageHero heading);
- invalid Forum subroute `/en/forum/not-a-subroute` returns **404**;
- language switch on `/fr/forum/programme` links to `/en/forum/programme`
  (**subroute preserved**);
- platform profile `/en/portfolio/valura` cross-links to
  `/en/forum/participation` (**Forum engagement present**);
- with **JavaScript disabled**, the programme renders all **five days** as a
  semantic ordered list;
- status conveyed by text, never colour alone; contextual `ForumNav` with
  `aria-current`; keyboard-operable; native Arabic RTL.

## Forum-aware reception (qualification context)

`/[lang]/reception?type=forum-qualification&participant=<id>&track=<id>` (with
optional `platform`/`chain`) renders a Forum context panel (participation path
name and summary, sector track, path-specific preparation), preselects
`forum-qualification`, lists every valid context in the review summary, and
includes them in the prepared email subject and body — confirmed by test and
in-browser. Invalid participant/track/platform/chain ids fail safe. No backend,
storage, cookies, uploads, accounts, application numbers, tickets, scheduling,
automatic acceptance or matching.

## Screenshots (`docs/qa/screenshots-p3/`)

forum-hub-en · forum-hub-ar-phone (mobile) · programme-en · programme-ar-phone ·
participation-en · participation-ar · prepare-fr · prepare-ar-phone (mobile) ·
qual-company-en · qual-track-chain-en · qual-mining-ar. The pages show the
proposed-status pill, the before/during/after model, the participation-path and
sector-track cards with platform/chain links, the five-day ordered programme,
the meeting-preparation checklist, the outcome categories and the qualification
context panel.

## Claims and privacy control

Enforced by `tests/p3-forum-engagement.test.ts`: the Forum framed as a proposed
programme; no open-registration, confirmed-participant, confirmed-sponsor,
confirmed-visit, guaranteed-meeting, guaranteed-finance, participant-directory or
automatic-matchmaking claims; IBRIZ/GAAS never active project finance; Day 4 free
of confirmed-visit claims; Day 5 uses outcome categories with no workflow; the
prepare page states no public participant directory and no public request
exposure. See `docs/p3/P3-CLAIMS-PRIVACY-AND-PUBLICATION-BOUNDARIES.md`.

## Baseline preservation

Tests confirm exactly four portfolio platforms and six value-chain profiles
remain; P3 adds no new platforms or value chains; platform-aware and chain-aware
reception continue to work; all prior P0/P1/P2 tests remain green.

## Known limitations

- Unresolved evidence/publication inputs carried from
  `docs/p0/P0-MISSING-INPUTS-REGISTER.md`, unchanged by P3. No Forum date, venue,
  participant, sponsor, ministry or visit is confirmed until controlled evidence
  and authorization exist.
- `NEXT_PUBLIC_SITE_URL` unset ⇒ metadataBase omitted and the sitemap emits
  root-relative paths until the production domain is configured.
- `next lint` deprecation notice (Next 16) — informational.

## Out of scope (not started)

Participant accounts, login, database, backend form API, file upload, participant
directory, invitations/tickets, payments, calendar/scheduler, matching, CRM,
meeting records/minutes, decisions database, commitment tracking, deadlines,
notifications, data rooms, NDA workflow, live dashboard, sponsor/venue
management, and P4 (case management) — none were implemented; recorded as
future-phase items.
