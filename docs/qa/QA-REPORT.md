# Final Interface QA Report — V1.0

- **Date:** 2026-07-18
- **Branch:** `claude/build-akanil-interface-uv6qnd`
- **Environment:** Linux CI container, Node 22.22.2, npm 10.9.7, Next.js 15.5.20, Chromium (Playwright) 1366×900 / 1440×900 / 768×1024 / 390×844 / 360×800
- **Reviewed routes:** `/ar`, `/fr`, `/en` (all statically generated), root redirect `/` → `/ar`

## 1. Build integrity

| Check | Result |
|---|---|
| `npm install` from lockfile | Pass |
| `npm run build` | Pass — 3 locale routes SSG; first-load JS 115 kB (budget ≤ 220 kB) |
| `npm run typecheck` (strict, `noUncheckedIndexedAccess`) | Pass, 0 errors |
| `npm run lint` | Pass, 0 warnings (`no-page-custom-font` disabled: App Router false positive, ADR-005) |
| `npm test` (Vitest) | Pass — 18/18 across 4 files |
| Secrets / local paths in repo | None found |

## 2. Narrative review

Akanil ownership, permanent Gateway, Forum-as-activation, Morocco stakeholder value, Sudan shared-value partnership, conceptual corridor and human decision authority are each carried by a dedicated section in the approved order (12 sections). First viewport identifies Akanil + Gateway + scope and offers one primary and one secondary action. No fake counters, no fabricated metrics, no partner logos.

## 3. Language review

| Check | AR | FR | EN |
|---|---|---|---|
| `<html lang dir>` | `ar` / `rtl` | `fr` / `ltr` | `en` / `ltr` |
| Missing keys | Impossible by type contract (compile-time) + parity tests | ✓ | ✓ |
| Canonical names present (P2-16) | ✓ | ✓ | ✓ |
| Restricted terms absent | ✓ (tested) | ✓ (tested) | ✓ (tested) |
| Metadata / OG localized | ✓ | ✓ | ✓ |
| Language switch preserves section | ✓ verified (switching at corridor landed on `/fr#corridor`) | ✓ | ✓ |
| Mixed-direction runs (`AKANIL`, `CR-01`, reference codes) | Isolated with `latin-run` | — | — |

Arabic is authored (independent copy, taller display leading, no letter-spacing tricks, non-mirrored geography).

## 4. Responsive review

Screenshots reviewed at 360×800, 390×844 (AR + EN), 768×1024 (FR), 1440×900 (AR/EN/FR) for every section. Mobile is authored: single-column pillars, corridor map replaced by node sequence, tabs scrollable, no clipped Arabic headings, no horizontal overflow observed.

## 5. Interaction review (Playwright, production build)

| Check | Result |
|---|---|
| Contact dialog opens, focus moves inside, Escape closes | Pass |
| Corridor node select via keyboard (focus + Enter) updates live summary | Pass |
| Value-chain tabs: click + ArrowRight/Left/Home/End roving tabindex | Pass (RTL arrow direction inverted by design) |
| Mobile menu button aria-expanded / Escape | Pass (code review + phone screenshots) |
| Reduced motion: content fully visible, no reveals/pulses | Pass (`reducedMotion: reduce` context) |
| Single `h1`; landmarks header/nav/main/footer present | Pass |

## 6. Visual review

Authored hierarchy per section (no repeated card rows); concept labels on all figurative generated imagery; assets with embedded generated text or third-party logos excluded (see ASSET-USE-REGISTER); no layout-shift placeholders (explicit dimensions everywhere).

## 7. Performance and accessibility

- axe-core 4.x, WCAG 2.0/2.1/2.2 A+AA rulesets: **0 violations on /ar, /fr, /en** (settled state; transient reveal opacity states excluded via reduced-motion audit). Earlier contrast findings (muted text, copper/nile small text) were fixed by darkening/lightening token values.
- Automated scores are not claimed as conformance; manual keyboard pass and screen-reader landmark structure were reviewed on top of axe.
- Transfer: initial route ≈ 115 kB JS + ≈ 9 kB CSS (compressed) + hero WebP 229 kB — within all project budgets (hero mobile budget 450 kB).
- Video: none shipped; no autoplay media; offscreen images lazy-loaded.

## 8. Content and trust

- No external institution, sponsor, partner, route, investment or opportunity presented as confirmed (footer + corridor disclaimers; tested restricted-term list).
- All corridor routes are `conceptual` or `alternative`; test enforces that no route ships `verified`/`pilot-qualified` without evidence.
- AI presented only under human authority; operating layer labelled as operating vision, not live features.
- Contact interaction is local-only; no data transmitted or stored; no analytics or tracking of any kind.

## Anti-generic AI interface review (scorecard)

| Dimension | Score /5 |
|---|---|
| Institutional authorship | 4 |
| Akanil identity | 5 |
| Moroccan stakeholder relevance | 5 |
| Narrative clarity | 5 |
| Visual hierarchy | 4 |
| Interaction meaning | 5 |
| Image credibility | 5 |
| Arabic RTL quality | 4 |
| Accessibility | 5 |
| Performance discipline | 5 |
| **Total** | **47 / 50 → Pass** (threshold 43) |

Strongest elements: three-layer ownership hierarchy; status-aware corridor model with text summary; trilingual authored copy tied to approved baselines; evidence-led labelling; restrained token-driven art direction.
Remaining risks (nonblocking): all imagery is still generated concept art (documentary photography recommended before wide publication); hero display size on mid-width laptops wraps the EN title to three lines; Alexandria loads from Google Fonts at runtime (brief fallback flash on first visit).

## Blocking issues

None open.

## Nonblocking follow-ups

1. Commission documentary photography to replace concept art in Forum/Morocco sections before public launch.
2. Reconcile design tokens and section order against the approved Phase 3 archive when supplied (MI-01).
3. Add responsive AVIF recrops from the source PNG packs if hero LCP on 3G needs tightening.
4. Connect the real contact channel only after legal/publication review (explicit user authorization required).

## Final status

**Conditional Pass** — conditional only on the Phase 3 reconciliation (MI-01) and the documentary-imagery follow-up; no critical accessibility, trust or build issue is open. No deployment was performed.
