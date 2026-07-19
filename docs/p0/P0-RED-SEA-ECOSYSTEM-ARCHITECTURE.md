# P0 — Red Sea Ecosystem Architecture

Status: implemented on `feature/p0-red-sea-ecosystem-architecture` (draft PR, not merged, not deployed).

## Repositioning

P0 repositions the public interface from a cautious institutional introduction
window into the public representation of an operating economic and technology
ecosystem. The site now explains that Akanil:

- connects African production, assets and market demand;
- structures supply chains across the Red Sea;
- coordinates qualified stakeholders;
- links ports, economic zones, industries, finance and technology;
- uses Morocco as a manufacturing, standards, financing and market-access platform;
- reviews institutional requests through a specialized multidisciplinary team;
- manages a controlled portfolio of projects and economic platforms.

The implementation stays evidence-led: no unverified partnership,
investment-readiness, licensing or operational claim is published
(see `P0-CLAIMS-AND-EVIDENCE-BOUNDARIES.md`).

## Binding institutional hierarchy

1. **Akanil for Development and Investment** — founder and executive operator.
2. **Akanil Morocco–Red Sea Economic Gateway** — the permanent economic,
   institutional and technology ecosystem.
3. **Morocco–Sudan Economic Forum** — the first controlled activation programme.
4. **Portfolio platforms** — Trade-Chain Africa, Valura, RWAFID (روافد),
   IBRIZ/GAAS — operated, developed or structured within the ecosystem.

## Homepage order (directive §24)

01 hero (ecosystem promise) · 02 Why the Red Sea · 03 how the ecosystem creates
value · 04 choose your role (7 audience paths) · 05 portfolio platforms ·
06 value for Morocco · 07 value for Sudan · 08 Red Sea nodes and trade-chain
architecture · 09 technology and operating intelligence · 10 Forum ·
11 specialized review process · 12 institutional reception · 13 public scope and
current status (+ claims boundary) · 14 trust and Akanil identity.

The limitation matrix never precedes the value proposition.

## Type system

- `content/ecosystem-types.ts` — enums (`PublicStatus`, `EvidenceState`,
  `CapabilityState`, `AudienceId`, `RequestTypeId`, `IntakeFieldId`,
  `PlatformId`, `NodeKind`, `EcosystemNodeId`) and the `EcosystemContent`
  locale contract.
- `lib/ecosystem.ts` — shared non-locale structure: audience→request matrix,
  per-request intake schemas, schematic node geometry.
- `content/{en,fr,ar}/ecosystem.ts` — independently authored locale records.

## Route architecture

All Phase 4 routes preserved; `/[lang]/portfolio` added (statically generated,
localized metadata, nav + footer + non-localized redirect). Language switching
preserves the route.

## Components

`WhyRedSea`, `EcosystemValueFlow`, `AudienceEntryMatrix`,
`PortfolioPlatformCard`, `PortfolioPlatformGrid`, `RedSeaNodeMap`,
`TechnologyOperatingLayer`, `SpecialistReviewProcess`, `PublicStatusControl`,
`ClaimsBoundaryNotice`, `RequestContextPanel`, `DynamicRequestFields`.

Strategic content lives in typed locale records; shared controlled constants
live outside locale records; no single large homepage component.

## Related documents

- `P0-PUBLIC-PRODUCT-MODEL.md`
- `P0-AUDIENCE-AND-REQUEST-MATRIX.md`
- `P0-PORTFOLIO-PLATFORM-REGISTER.md`
- `P0-CLAIMS-AND-EVIDENCE-BOUNDARIES.md`
- `P0-MISSING-INPUTS-REGISTER.md`
- ADR-012 … ADR-017 in `docs/decisions/`.
