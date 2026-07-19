# P0 — Claims and Evidence Boundaries

Enforced by `PublicStatusControl`, `ClaimsBoundaryNotice`, the state enums in
`content/ecosystem-types.ts`, and `tests/ecosystem-architecture.test.ts`.

## State vocabulary (ADR-015)

- `PublicStatus`: public-profile · structured-project ·
  controlled-review-available · institutional-review · technical-development ·
  regulated-development · not-publicly-active.
- `EvidenceState`: public-summary-available · controlled-evidence-available ·
  due-diligence-summary-available · evidence-update-required ·
  evidence-restricted · evidence-not-yet-published.
- `CapabilityState`: active-public · active-controlled ·
  manual-specialist-review · prototype · planned · regulated.

States are always localized explanatory text — never colors alone, never
percentages. `controlled-review-available` / due-diligence wording is only
activated when a controlled evidence manifest exists; none exists yet, so
platforms use controlled-evidence wording and the gap is recorded in the
missing-inputs register.

## Mandatory principles

- No partner claim without evidence (named institutions appear only as
  *relevant stakeholder categories / potential institutional audiences*).
- No operational-route claim without evidence; a route is never verified
  merely because it appears in a diagram.
- No investment-readiness claim without an evidence manifest.
- No licensing claim without a licence record.
- No financial-product activation without regulatory approval (IBRIZ/GAAS).
- No Forum-selection claim before qualification.
- No automatic project publication.
- No AI approval — AI may assist classification and completeness checks only.

## Geographical naming rules (ADR-017)

- Aswan is an inland economic/logistics node — never a seaport.
- "Port of Asmara" is never used; the Horn of Africa corridor is named
  **Asmara–Massawa Economic and Logistics Corridor** (localized) until exact
  project structure is documented.
- Bosaso Port (Puntland) and Port Sudan are ports; Northern State, Kassala
  and Gedaref are production regions.
- KAEC / King Abdullah Port, Ain Sokhna and Tanger Med appear as ecosystem
  nodes without any partnership implication.

## Disclosure style

Concise contextual notices at point of claim; one detailed scope block
(`ClaimsBoundaryNotice`) on the homepage status section, the portfolio page
and the corridor page; long disclaimers are not repeated after every
paragraph.

## Founder presentation (§23)

Legal name **Mohamed Abderrahim / محمد عبدالرحيم**; no former alias in legal
or institutional credentials. The bridge narrative states experience across
both Moroccan and Sudanese export ecosystems. The two association memberships
(Moroccan exporters association since 2016, Sudanese exporters union since
2017) are **not published** — evidence is not in the repository; recorded in
the missing-inputs register with the `InstitutionalAffiliation` structure
ready (`status: "evidence-required"`).
