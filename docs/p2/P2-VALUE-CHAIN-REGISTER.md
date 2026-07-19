# P2 — Value-Chain Register

The six priority pathways, their scenario status, source basis, reception
routing and platform relationships. Enforced by `tests/p2-value-chains.test.ts`.
Structure lives in `lib/value-chains.ts`; wording in
`content/{ar,fr,en}/value-chains.ts`.

## Scenario status vocabulary

- **Public pathway overview** — the pathway concept and stages are public.
- **Requires current verification** — the specific structures need current
  commercial, regulatory and logistics review before anything is asserted.
- **Additional information available after review** — a fuller briefing follows
  a controlled specialist review.
- **Regulated or sensitive elements** — the pathway contains regulated or
  sensitive components (e.g. minerals) and carries a mandatory regulatory note.

Each pathway also carries a `sourceBasis` (which approved baseline grounds it)
and a `lastReviewed` date. Neither implies a market figure or a confirmed
counterpart.

## The six pathways

| Id | Scenario status | Reception route |
| --- | --- | --- |
| `oilseeds-agro-processing` | Public pathway overview | `supply-offtake-requirement` |
| `food-cold-chain` | Public pathway overview | `industrial-partnership` |
| `feed-livestock` | Requires current verification | `supply-offtake-requirement` |
| `water-energy-agritech` | Requires current verification | `technology-data-partnership` |
| `mining-mineral-value` | Regulated or sensitive elements | `submit-project-asset` |
| `ports-logistics-corridors` | Requires current verification | `port-logistics-cooperation` |

## Level-3 platform ↔ chain mapping

Single source of truth: `platformChainMap` in `lib/value-chains.ts`. The reverse
(chain → platforms) is derived, so the two directions cannot disagree.

| Platform | Related pathways |
| --- | --- |
| VALURA | oilseeds-agro-processing · food-cold-chain · water-energy-agritech |
| RWAFID | oilseeds-agro-processing · food-cold-chain · feed-livestock · water-energy-agritech |
| Trade-Chain Africa | oilseeds-agro-processing · food-cold-chain · feed-livestock · mining-mineral-value · ports-logistics-corridors |
| IBRIZ / GAAS | mining-mineral-value · ports-logistics-corridors — **potential regulated enabling layer only, never active financing** |

| Pathway | Related platforms |
| --- | --- |
| oilseeds-agro-processing | VALURA · RWAFID · Trade-Chain Africa |
| food-cold-chain | VALURA · RWAFID · Trade-Chain Africa |
| feed-livestock | RWAFID · Trade-Chain Africa |
| water-energy-agritech | VALURA · RWAFID |
| mining-mineral-value | Trade-Chain Africa · IBRIZ/GAAS |
| ports-logistics-corridors | Trade-Chain Africa · IBRIZ/GAAS |

## Shared-value flow

Every pathway renders an ordered `ValueFlowPath` following the approved logic:
Sudanese source and capability → qualification and standards → Moroccan
processing / solutions and expertise → finance and logistics → regional
distribution / responsible market route → measurable shared value. Each stage
names where the value is contributed (Sudan, Morocco, corridor or both sides).
Sudan is never framed merely as a raw-material source.
