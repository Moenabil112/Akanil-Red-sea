# P3 — Participation and Sector Register

The six participation paths and five sector tracks, their platform/chain
mappings and their reception routing. Enforced by
`tests/p3-forum-engagement.test.ts`. Structure lives in `lib/forum.ts`; wording
in `content/{ar,fr,en}/forum.ts`.

## Participation paths (6)

| Id | Reception route |
| --- | --- |
| `moroccan-institutions` | `forum-qualification` |
| `moroccan-companies-exporters` | `forum-qualification` |
| `sudanese-institutions-decision-makers` | `forum-qualification` |
| `sudanese-producers-project-sponsors` | `forum-qualification` |
| `finance-investment-development` | `forum-qualification` — mandatory non-guarantee notice |
| `technology-logistics-knowledge` | `forum-qualification` |

Every path carries `whoItIncludes`, `potentialObjectives`,
`preparationRequirements` and `expectedOutcomes`. The finance path's note states
no opportunity is automatically investment-ready, financeable, approved or open
for public subscription.

## Sector tracks (5)

| Id | Related platforms | Related value chains |
| --- | --- | --- |
| `agriculture-food-industrialization` | VALURA · RWAFID · Trade-Chain Africa | oilseeds-agro-processing · food-cold-chain · water-energy-agritech |
| `feed-livestock-animal-value` | RWAFID · Trade-Chain Africa | feed-livestock · food-cold-chain · ports-logistics-corridors |
| `water-energy-agritech` | VALURA · RWAFID | water-energy-agritech |
| `mining-industrial-value` | Trade-Chain Africa · IBRIZ/GAAS* | mining-mineral-value |
| `ports-logistics-finance-technology` | Trade-Chain Africa · IBRIZ/GAAS* | ports-logistics-corridors |

\* IBRIZ/GAAS appears only as a potential regulated infrastructure concept —
**never active project finance** (asserted in the mining track note and tests).

Tracks organize discussions and meetings; they do not replace the six value-chain
pathways.

## Path → sector-track relevance

| Path | Relevant tracks |
| --- | --- |
| moroccan-institutions | agriculture-food · water-energy · mining-industrial · ports-logistics |
| moroccan-companies-exporters | all five |
| sudanese-institutions-decision-makers | agriculture-food · water-energy · mining-industrial · ports-logistics |
| sudanese-producers-project-sponsors | agriculture-food · feed-livestock · water-energy · mining-industrial |
| finance-investment-development | agriculture-food · mining-industrial · ports-logistics |
| technology-logistics-knowledge | water-energy · mining-industrial · ports-logistics |

Platforms and value chains for a path are derived from its tracks (union), so a
path can never link an invalid platform or chain.

## Five proposed programme days

`institutional-framework` → `sector-workshops` → `b2b-b2g-meetings` →
`industrial-institutional-visits` → `decisions-follow-up`. Day 3 defines the
meeting-preparation requirements and states the website neither schedules nor
confirms meetings; Day 4 shows only categories of potential visits (no confirmed
visit); Day 5 uses the nine possible outcome categories and implements no
workflow.

## Request-type mapping

All Forum participation and sector-track qualification routes use the single
`forum-qualification` request type. Platform (`platform`) and chain (`chain`)
contexts from P1/P2 continue to compose with the Forum `participant`/`track`
contexts.
