# Missing Inputs Register

| ID | Input | Status | Blocking? | Controlled assumption / action |
|----|-------|--------|-----------|-------------------------------|
| MI-01 | Approved Phase 3 archive `AKANIL-MOROCCO-RED-SEA-GATEWAY-PHASE-3-PRODUCT-DESIGN-AND-BUILD-READINESS-V1.0` (P3-00 … P3-13, incl. design system and interactive-prototype document) | **Absent from all uploaded packages** (only Phase 1 and Phase 2 archives are present in `01-GOVERNING-CONTEXT/`) | Not blocking for the first implementation pass | Build proceeds on Phase 1 + Phase 2 baselines, the Master Build Prompt's explicit design-system foundation (§7) and page architecture (§8), and the V1.1 core-input guardrails. All design-system and section decisions are recorded as **reversible** in `docs/decisions/` so they can be reconciled against Phase 3 (P3 design system and prototype doc) when the archive is supplied. Any conflict discovered later is treated as a Phase-3-wins correction, not a reopened decision. |
| MI-02 | Approved public contact channel (address, legal review) | Not provided | Not blocking | Contact section uses a local, accessible, non-transmitting modal exactly as the V0.2 prototype did; wording states the public channel is connected after review. |
| MI-03 | Documentary photography (real facilities, meetings) | Not provided (expected later per guardrails) | Not blocking | Only curated concept assets are used, labelled conceptual; no documentary claims. |
| MI-04 | Forum dates/venue/participant facts | Not in approved public-facing inputs | Not blocking | Forum presented as first activation programme without dates, venues, participant counts or logos. |

Recorded per Master Build Prompt §2 ("If an input is absent…"). Do not fabricate approved facts.
