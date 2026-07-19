# ADR-018 — Value-chain and economic-pathway architecture

Date: 2026-07-19 · Status: accepted

## Context

P2 deepens the value-chain layer from the homepage's concise four-theme teaser
into six dedicated economic pathways with their own routes, a shared-value
flow, geographic value contribution, cross-cutting enabling layers, a
platform↔chain mapping and a chain-aware reception. The pathways must read as
*scenarios* — potential, indicative, subject to current commercial, regulatory
and logistics review — never as confirmed routes, volumes, tariffs, transit
times, costs, approvals or partnerships.

## Decision

- **One typed model, one template.** `content/value-chains-types.ts` defines
  `ValueChainId` (six ids), `ScenarioStatusId` (four statuses), `ValueFlowStage`
  and the `ValueChainProfileContent` / `ValueChainsContent` shapes. Every
  locale record (`content/{ar,fr,en}/value-chains.ts`) implements the same
  interface, so a missing key fails type checking (ADR-003). One shared
  `ValueChainProfile` template renders all six profiles; no per-chain JSX.
- **Structure in lib, wording in content.** `lib/value-chains.ts` owns the
  chain order, the `platformChainMap` (Level-3 platform → chains), the derived
  reverse view (`platformsForChain`/`chainsForPlatform`) and the approved
  `chainRequestType` routing. The reverse mapping is *derived*, never hand-kept,
  so the two directions cannot disagree. Locale copy carries only wording.
  Parity and the approved mapping are test-enforced (`tests/p2-value-chains`).
- **Semantic flow first.** `ValueFlowPath` is an ordered list readable and
  keyboard-navigable without motion; the connector is decoration only and is
  direction-aware for native Arabic RTL.
- **Dedicated static routes.** `/[lang]/value-chains/[chain]` is generated for
  the six chains per locale via `generateStaticParams`; unknown slugs 404
  (`dynamicParams = false` at the layout plus an `isValueChainId` guard).
  Each has localized title/description, canonical path, hreflang alternates and
  Open Graph metadata; the sitemap lists all eighteen and non-localized
  `/value-chains/<slug>` redirects to the Arabic default. Language switching
  preserves the chain slug (`switchLocalePath`).
- **Level-3 cross-linking.** Each platform profile shows its related value
  chains; each chain profile shows its related platforms. IBRIZ/GAAS relates to
  the mining and ports pathways only as a *potential regulated enabling layer,
  never active financing* — carried by `relatedChainsNote` and asserted in
  tests.
- **Chain-aware reception.** `/[lang]/reception?type=<request-type>&chain=<chain-id>`
  preselects the approved request type, shows a chain-context panel (name,
  scenario status, preparation) and includes the chain in the review summary,
  the prepared email subject/body and the local `.txt` draft. Invalid chain ids
  fail safe (ignored). No backend, storage, cookies, uploads, accounts, case
  numbers or automatic submission were introduced (ADR-009 transport preserved).
- **Homepage unchanged.** The homepage keeps its concise value-chain teaser
  (`components/sections/ValueChains.tsx`, driven by `SiteContent.chains`); the
  `/value-chains` route is the deepened destination. Keyboard and RTL behaviour
  of the homepage component is untouched.

## Consequences

- Adding or reordering a chain is a single edit in `lib/value-chains.ts` plus
  the three locale records; the template, routes, sitemap, redirects,
  cross-links and reception follow automatically and are guarded by parity
  tests.
- Scenario claims control (ADR-015) extends to pathways: statuses carry a
  `sourceBasis` and `lastReviewed`; no market volumes, tariffs, transit times or
  fixed prices appear; corridors are labelled conceptual; mining is marked
  regulated/sensitive with a mandatory regulatory note. Enforced by
  `tests/p2-value-chains.test.ts`.
- Out of scope and not built: marketplace, transaction/settlement, logistics
  optimization or port APIs, banking or financing service, data rooms, CRM,
  databases, accounts, uploads and automated qualification.
