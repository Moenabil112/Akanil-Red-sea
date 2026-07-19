# P0 — Missing Inputs Register

Every fact required for public publication that is not evidenced in the
repository. Implementation proceeded with controlled placeholders and omitted
claims; nothing here blocks the architecture. Updated at the P1-context
reconciliation pass (2026-07-19).

## Resolved at the reconciliation pass

The controlled context file (`AKANIL_P1_Portfolio_and_Institutional_Trust_Context_V1.0.md`)
supplied verifiable institutional facts, now published on the About page:

- Akanil for Development and Investment — Moroccan company founded 2014,
  established through the Regional Investment Center, Casablanca, Moroccan
  Commercial Register No. 10015.
- Registered Sudan branch since 2017, Sudan Commercial Register No. 121.
- Regional representation via **agents / regional representatives** (not legal
  branches) in Saudi Arabia, Egypt, Ethiopia, Somalia, Kenya, Eritrea, South
  Sudan, Uganda, Tanzania.

## Still missing / withheld

| # | Missing input | Current public handling |
| --- | --- | --- |
| 1 | Exact legal/project relationship between Akanil and each portfolio platform | Platforms presented as products developed or structured within the ecosystem; no separate-entity claims |
| 2 | VALURA final site, feasibility, ESIA, ownership/project-right basis | Locations shown as "potential, under study" (Kassala, Gedaref, Gezira); no fixed site; "Public Profile Available — Preliminary Blueprint" |
| 3 | Which VALURA figures remain valid; current investment ask | Only capital/capacity/land/jobs shown, labelled "Preliminary estimates from VALURA Blueprint V1.0 — March 2026"; IRR, payback and revenue withheld |
| 4 | RWAFID pilot result, actual farmer count, technical build status | "Update Required Before Publication"; Q1 2026 pilot, 100-farmer pilot, 5,000-farmer cooperative, Ministry letter, completed-design and USD 1.5M claims all withheld |
| 5 | RWAFID current cooperative agreement, Ministry letter and financing status | Withheld pending verification; stage states current-status verification underway |
| 6 | Trade-Chain Africa verified partners, updated model, current stage | "Update Required Before Publication"; legacy partner/NILLY/blockchain/Series A/return claims all absent |
| 7 | Whether NILLY is removed, retained or transferred to IBRIZ | Not published anywhere; recorded as an open decision |
| 8 | IBRIZ/GAAS legal entity, jurisdiction, licensing roadmap, regulated perimeter | "Regulated or Sensitive Project" + mandatory regulatory note; no bank/account/payment/custody/lending claims; CTA limited to regulated-infrastructure discussion |
| 9 | Evidence manifest for any due-diligence or investment-ready status | No such status is used; the vocabulary exists but stays inactive |
| 10 | Permission to publish project locations and portfolio imagery | Only region-level references; text-only cards, no imagery |
| 11 | Exact scope of KAEC, Ain Sokhna, Port Sudan, Bosaso, Asmara–Massawa nodes | Ecosystem nodes only; explicit note that a node is not an Akanil project, partner or licensed operation |
| 12 | Aswan role | Inland economic/logistics node; never a seaport |
| 13 | Evidence and role definition for agents in each represented country | Described as agents/representatives with differing mandates; no agent names or contact details published |
| 14 | Founder's Moroccan exporters association membership (since 2016) | Not published; `InstitutionalAffiliation` structure ready with `evidence-required` |
| 15 | Founder's Sudanese exporters union membership (since 2017) and current validity | Not published; same handling as #14 |
| 16 | Official domain and institutional email/address | `NEXT_PUBLIC_SITE_URL` unset ⇒ no metadataBase; proton.me reception address + telephone remain the only published channels |
| 17 | Legal company name exactly as on registration certificates; certificate copies | Canonical name used; certificates not published |

## Resolution path

Each item resolves by supplying controlled documentation to the repository
(or a controlled evidence manifest), after which the corresponding simplified
status may be upgraded and withheld claims published. No claim is upgraded
automatically; a passed date on a source claim keeps that claim withheld until
re-verified.
