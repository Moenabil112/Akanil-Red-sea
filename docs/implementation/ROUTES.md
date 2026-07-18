# Route Inventory — Gateway Experience (V1.1)

All content routes are statically generated in Arabic (RTL, default), French and English: 30 pages + the not-found route.

| Route | Purpose | Sections composed | Reception preselection |
|---|---|---|---|
| `/{lang}` | Clarity journey homepage | Hero, status, audience entry, value/journey/chains/corridor/forum/trust/about summaries, reception call | via audience cards |
| `/{lang}/gateway` | Gateway model | Why the Gateway, three-layer architecture, operating layer | — |
| `/{lang}/morocco` | Value for Morocco | Morocco value proposition | `qualification` |
| `/{lang}/sudan` | Partnership with Sudan | Sudan shared value | `need-opportunity` |
| `/{lang}/corridor` | Corridor intelligence | Interactive conceptual corridor map | `value-chain` |
| `/{lang}/value-chains` | Priority chains | Value-chain tabs (4 chains × 6 stages) | `value-chain` |
| `/{lang}/forum` | First activation programme | Forum section | `forum` |
| `/{lang}/trust` | Trust, data and AI | Eight governance principles | — |
| `/{lang}/about-akanil` | Founder and operator | About Akanil | — |
| `/{lang}/reception` | Digital Reception Lite | Channels, privacy, structured desk | `?type=&audience=` |

## Redirects

- `/` → `/ar` (307)
- `/gateway`, `/morocco`, `/sudan`, `/corridor`, `/value-chains`, `/forum`, `/trust`, `/about-akanil`, `/reception` → `/ar/<route>` (307)

## Legacy anchors (V1.0 single page)

`#why #morocco #sudan #operating #chains #corridor #forum #trust #about #contact` remain valid homepage targets attached to the corresponding summary blocks (ADR-011), plus `#status` and `#entry` for the new sections.

## Language switching

The header switcher preserves route and hash: `/fr/forum` → `/en/forum`, `/ar#chains` → `/fr#chains` (`lib/routes.ts: switchLocalePath`).
