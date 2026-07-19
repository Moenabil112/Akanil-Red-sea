# P0 — Audience and Request Matrix

Source of truth: `lib/ecosystem.ts` (`audienceRequestMatrix`, `intakeSchemas`).
Wording lives in `content/{en,fr,ar}/ecosystem.ts` and
`content/{en,fr,ar}/reception.ts`. Parity is enforced by
`tests/ecosystem-architecture.test.ts`.

## Seven audience paths

| Audience | Allowed request types | Default |
| --- | --- | --- |
| moroccan-institutions | institutional-cooperation, forum-qualification | institutional-cooperation |
| moroccan-industry-exporters | market-expansion, supply-offtake-requirement, industrial-partnership, forum-qualification | market-expansion |
| moroccan-finance-investment | project-investment-review, institutional-cooperation, forum-qualification | project-investment-review |
| sudanese-decision-makers | institutional-cooperation, industrial-partnership, forum-qualification | institutional-cooperation |
| sudanese-producers-asset-owners | submit-project-asset, supply-offtake-requirement, industrial-partnership, forum-qualification | submit-project-asset |
| red-sea-ports-economic-zones | port-logistics-cooperation, institutional-cooperation | port-logistics-cooperation |
| technology-logistics-knowledge-partners | technology-data-partnership, industrial-partnership, port-logistics-cooperation | technology-data-partnership |

Each path defines (per locale): title, whoItIncludes, strategicNeed,
gatewayValue, relevantPlatforms, preparationRequirements, expectedReviewOutput
and ctaLabel. Deep links preselect audience + default type:
`/[lang]/reception?type=<default>&audience=<id>`. Disallowed combinations fall
back to the audience default (`parsePreselection`).

## Nine request types

institutional-cooperation · market-expansion · project-investment-review ·
supply-offtake-requirement · industrial-partnership ·
port-logistics-cooperation · technology-data-partnership ·
forum-qualification · submit-project-asset

Each type defines label, description, expectedReviewOutput,
preparationRequirements and (where mandated) a disclaimer:

- **project-investment-review** — reception does not constitute investment
  approval, solicitation, financing availability or endorsement.
- **forum-qualification** — qualification review does not promise
  participation or invitation.
- **submit-project-asset** — submission does not publish the project and does
  not constitute acceptance; publication never happens automatically.

## Intake schemas (minimum data collection)

Base required: organization, country, sector, contactName, role, email,
summary, consent. Base optional: phone, website, preferredLanguage,
requestedNextStep. Type-specific additions:

| Request type | Extra required | Extra optional |
| --- | --- | --- |
| institutional-cooperation | organizationType | region |
| market-expansion | targetMarket | region, requiredPartner |
| project-investment-review | projectName | investmentRange, evidenceAvailable, licenceStatus |
| supply-offtake-requirement | assetType | requiredVolume, targetMarket |
| industrial-partnership | — | productionCapacity, requiredPartner, platform |
| port-logistics-cooperation | organizationType | location |
| technology-data-partnership | — | platform |
| forum-qualification | — | evidenceAvailable |
| submit-project-asset | projectName, assetType, location | productionCapacity, investmentRange, evidenceAvailable, licenceStatus |

Fields outside a request's schema are never rendered. Evidence availability is
a high-level checklist (11 options); **no file uploads exist in P0** and
documents are never emailed automatically.
