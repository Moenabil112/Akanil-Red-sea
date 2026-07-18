# Asset Use Register

All catalog assets are AI-generated concept art (per `ASSET-CATALOG.md`). None may be presented as documentary evidence. Only optimized WebP derivatives ship in `public/`; source PNGs stay in the optional visual-source packs, outside the repository.

## Assets in production use

| Asset ID | File in `public/` | Section / role | Status label shown | Alt text | Crop / sizing | Format & weight | Motion | Reduced motion |
|---|---|---|---|---|---|---|---|---|
| V-AST-002 | `images/hero/hero-abstract-flow.webp` | 01 Hero — atmospheric gateway/flow visual | Not required (abstract, cannot be mistaken for documentation) | Decorative (`alt=""`); heading carried by semantic H1 | Native 1672×941, aspect reserved | WebP ≈ 229 KB (within hero budgets) | One-time CSS reveal (scale 1.06→1, `--duration-cinematic`) | Static image |
| V-AST-012 | `images/morocco/energy-global-connections.webp` | 04 Morocco — capability board beside statement | "Concept illustration — not documentary evidence" (localized) | Decorative (`alt=""`), labelled figcaption | Native 1672×941, lazy | WebP ≈ 208 KB | Reveal transition only | Static |
| V-AST-008 | `images/chains/value-chain-panorama.webp` | 05 Sudan — resource→market progression visual | Same localized concept label | Decorative (`alt=""`), labelled figcaption | Native 1672×941, lazy | WebP ≈ 246 KB | Reveal transition only | Static |
| V-AST-014 | `images/forum/forum-poster-portrait.webp` | 08 Forum — identity poster | "Concept identity artwork — not documentary evidence of an event" (localized) | Descriptive alt (localized) | Portrait 1055×1491, lazy | WebP ≈ 175 KB | Reveal transition only | Static |
| Brand | `brand/akanil-emblem.png` | Header, footer, favicon | — | Decorative (`alt=""`); brand name is semantic text | 256×256 transparent derivative produced from `akanil-logo-original.png` (black colorkeyed) | PNG ≈ 28 KB | None | — |
| Brand | `brand/akanil-logo-transparent.png` | Reserve for light surfaces / social | — | — | 640×325 transparent derivative | PNG ≈ 70 KB | None | — |

## Assets deliberately NOT used (with reasons)

| Asset ID | File | Reason for exclusion |
|---|---|---|
| V-AST-001 | `hero-gateway-portal` | Embedded generated wordmark ("Akanil,") with comma artifact in the central doorway; asset rules require editing before use and the text cannot be cropped out. Revisit with source PNG pack if retouching is commissioned. |
| V-AST-007 | `morocco-node-map` | Dense embedded infographic labels (AR/FR) incl. partially garbled French; "maps with route labels" require editing first. |
| V-AST-010 | `shared-value-chains` | **Contains real-organization logos (Managem, ASMEX, Attijariwafa Bank) captioned as partners — unverified partner claims are prohibited** (Master Prompt §13, QG-09). Must never ship publicly without documented authorization. |
| V-AST-009 | `industrial-growth` | Same unverified partner logos as V-AST-010. |
| V-AST-011 | `sustainable-industrial-partnership` | Same unverified partner logos. |
| V-AST-004/005/006 | corridor raster maps | Replaced by the semantic SVG corridor diagram (ADR-004); raster route maps with labels would need editing and would blur the status model. |
| V-AST-013/015/016 | forum scene visuals | Event-like scenes require editing per asset rules; the labelled identity poster (V-AST-014) is sufficient for this window. |
| V-AST-017–020 | trust / digital-UI concepts | Futuristic dashboard imagery risks implying live operational features (banned "unexplained futuristic dashboards" trust cue); the trust section is typographic instead. |
| V-AST-021–023 | motion bases | Reserved for future video compositing; no video ships in this release. |

## Publication status

All shipped assets: approved concept status, publication limited to this institutional window, no documentary claims. No third-party logos, no personal data, no fabricated metrics appear in any shipped asset.
