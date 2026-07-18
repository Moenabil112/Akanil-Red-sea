# Akanil Morocco–Red Sea Economic Gateway — Institutional Window

Trilingual (AR/FR/EN) institutional introduction website for the
**Akanil Morocco–Red Sea Economic Gateway**, founded and operated by
**Akanil for Development and Investment**, with the
**Morocco–Sudan Economic Forum** as the first activation programme.

بوابة أكانيل الاقتصادية بين المغرب والبحر الأحمر — نافذة تعريفية مؤسسية.

## Stack

- Next.js (App Router) + strict TypeScript, React Server Components
- Static locale routes `/ar` (RTL, default), `/fr`, `/en`
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
app/[lang]/        locale layout + single-page narrative (12 sections)
components/        layout / sections / maps / motion / ui
content/           independently edited AR/FR/EN records + terminology
lib/               i18n, content access, corridor geometry
styles/            tokens + globals (logical properties, native RTL)
public/            optimized WebP derivatives + brand emblem only
tests/             content parity, terminology, corridor, ARIA behavior
docs/              plan, decisions (ADR), design registers, QA report
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

See `docs/implementation/IMPLEMENTATION-PLAN.md`,
`docs/design/ASSET-USE-REGISTER.md` and `docs/qa/QA-REPORT.md`.
