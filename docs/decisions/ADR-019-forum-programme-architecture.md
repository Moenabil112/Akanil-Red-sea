# ADR-019 — Forum programme, qualification and stakeholder-engagement architecture

Date: 2026-07-20 · Status: accepted

## Context

P3 turns the Morocco–Sudan Economic Forum from a descriptive homepage section
into a public qualification and engagement programme: stakeholder orientation,
participation paths, sector tracks, a proposed five-day programme, a meeting-
preparation model, an expected-outcome model, a preparation guide and a Forum-
aware qualification flow. The Forum must read as a *proposed* programme —
participation subject to review and invitation — with no confirmed date, venue,
speaker, participant, sponsor, ministry or visit, and it must not become a
registration site, matchmaking platform, scheduler, directory, CRM or backend.

## Decision

- **One typed model, derived views.** `content/forum-types.ts` defines the
  `ForumParticipationPathId` (6), `ForumSectorTrackId` (5), `ForumProgrammeDayId`
  (5) and `ForumOutcomeId` (9) enums and the content shapes. Each locale record
  (`content/{ar,fr,en}/forum.ts`) implements the same interface, so a missing key
  fails type checking (ADR-003). The Forum Hub, Programme, Participation and
  Prepare pages all derive from this single authoritative record — no duplicated
  facts.
- **Structure in lib, wording in content.** `lib/forum.ts` owns the path/track
  order, the `trackPlatformMap` and `trackChainMap` (Level-3 links to P1
  platforms and P2 chains), the `pathTrackMap`, and every derived view
  (`tracksForPath`, `platformsForPath`, `chainsForPath`, `pathsForTrack`,
  `tracksForPlatform`, `tracksForChain`, `pathsForChain`). Derivation means the
  cross-links can never disagree with their inverse. IBRIZ/GAAS is mapped to the
  mining and ports tracks only, and the mining track carries a "never active
  project finance" note (test-enforced).
- **Four routes, contextual nav.** `/[lang]/forum{,/programme,/participation,
  /prepare}` are statically generated per locale (12 pages) with localized
  metadata, canonical paths, hreflang alternates, Open Graph, sitemap entries
  and non-localized → Arabic redirects. They are **not** added to the primary
  header; a `ForumNav` contextual secondary nav (with `aria-current`) links them.
  Language switching preserves the Forum subroute (`switchLocalePath`).
- **Semantic programme.** `ProgrammeTimeline` renders the five days as an ordered
  list, readable and keyboard-navigable without motion; day order is conveyed by
  markup and explicit day labels, not colour. Verified to render all five days
  with JavaScript disabled.
- **Forum-aware reception.** `ReceptionRequest` gains optional `participant` and
  `track`; `parsePreselection` validates them and ignores invalid ids. The
  transport's context names collapse into a single `ReceptionContextNames`
  object (`platformName`, `chainName`, `participantName`, `trackName`), so
  platform (P1), chain (P2) and Forum (P3) contexts compose. The desk shows a
  Forum context panel and includes every valid context in the review summary,
  the prepared email subject/body and the local `.txt` draft. No backend,
  storage, cookies, uploads, accounts, application numbers, tickets, scheduling,
  automatic acceptance or matching are introduced (ADR-009 transport preserved).
- **Cross-linking.** A reusable `ForumEngagement` cross-link appears on each
  platform profile (relevant sector tracks + qualification CTA) and each value-
  chain profile (relevant track + stakeholder categories + qualification CTA).
  The homepage Forum section stays concise and unchanged.

## Consequences

- Adding or reordering a path, track or day is a single edit in `lib/forum.ts`
  plus the three locale records; routes, nav, sitemap, redirects, cross-links and
  reception follow automatically and are guarded by parity tests
  (`tests/p3-forum-engagement.test.ts`).
- Claims control (ADR-015) extends to the programme: a proposed-status pill,
  scenario framing, no open-registration/confirmed-participant/confirmed-visit/
  guaranteed-meeting/guaranteed-finance/automatic-matchmaking claims, and a
  public no-directory privacy boundary — all test-enforced.
- Out of scope and not built: participant accounts, login, database, backend
  form API, file upload, participant directory, invitations/tickets, payments,
  calendar/scheduler, matching, CRM, meeting records/minutes, decisions database,
  commitment tracking, deadlines, notifications, data rooms, NDA workflow, live
  dashboard, sponsor/venue management and P4 case management. Recorded as future
  operational needs.
