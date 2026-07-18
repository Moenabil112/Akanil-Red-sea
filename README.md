# Akanil Morocco–Red Sea Economic Gateway — Institutional Window

Trilingual (AR/FR/EN) institutional introduction website for the
**Akanil Morocco–Red Sea Economic Gateway**, founded and operated by
**Akanil for Development and Investment**, with the
**Morocco–Sudan Economic Forum** as the first activation programme.

بوابة أكانيل الاقتصادية بين المغرب والبحر الأحمر — نافذة تعريفية مؤسسية.

## Stack

- Next.js (App Router) + strict TypeScript, React Server Components
- Static locale routes `/ar` (RTL, default), `/fr`, `/en`, each with nine
  content routes (`gateway`, `morocco`, `sudan`, `corridor`,
  `value-chains`, `forum`, `trust`, `about-akanil`, `reception`)
- Digital Reception Lite: structured, human-reviewed request desk with a
  privacy-preserving mailto transport (no backend, no storage)
- CSS Modules + centralized design tokens (`styles/tokens.css`)
- No animation library, no CMS, no backend, no analytics, no external services
- Vitest + Testing Library; ESLint; axe-verified WCAG 2.2 AA target

## Commands

```bash
npm install        # install dependencies
npm run dev        # development server
npm run build      # production build (SSG for ar/fr/en)
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest suite
```

## Structure

```
app/[lang]/        clarity homepage + nine trilingual content routes
components/        layout / sections (+ home summaries) / maps / motion /
                   reception / ui
content/           independently edited AR/FR/EN records: site, experience
                   (status, audiences, summaries, page meta), reception
lib/               i18n, content access, routes, reception transport,
                   corridor geometry, page metadata
styles/            tokens + globals (logical properties, native RTL)
public/            optimized WebP derivatives + brand emblem only
tests/             content/experience parity, reception model + desk,
                   corridor, tabs, homepage structure
docs/              plan, ROUTES.md, decisions (ADR-001…011), QA reports
.claude/skills/    project skills governing design and QA
```

## Governance

- Approved Phase 1/2 archives are the source of truth; the Phase 3
  archive is pending import (`docs/implementation/MISSING-INPUTS.md`).
- All imagery is labelled concept art; nothing on the page presents an
  external institution, partner, route or investment as confirmed.
- The contact note is local-only: no data is transmitted or stored.
- Do not deploy or connect external services without explicit
  authorization from the project owner.

Reception channels: `akanil.consulting@proton.me` · `+212 663 177 864`.
Set `NEXT_PUBLIC_SITE_URL` to the production domain before publishing so
social metadata resolves absolutely.

See `docs/implementation/IMPLEMENTATION-PLAN.md`,
`docs/implementation/ROUTES.md`, `docs/design/ASSET-USE-REGISTER.md`,
`docs/qa/QA-REPORT.md` and `docs/qa/QA-REPORT-GATEWAY-EXPERIENCE.md`.
