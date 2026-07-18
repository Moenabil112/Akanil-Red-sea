# ADR-002 — Motion via CSS, SVG and a small IntersectionObserver primitive (no animation library)

- **Status:** Accepted
- **Date:** 2026-07-18

## Requirement

Choreographed but restrained motion: gateway reveal, staggered section reveals, SVG route drawing, node pulses, progressive value-chain stages, reduced-motion fallbacks (Master Build Prompt §11; `/motion-storytelling` tokens).

## Why browser APIs and CSS are sufficient

- Reveal choreography: one small `Reveal` client component using `IntersectionObserver` toggling a class; stagger via CSS custom-property delays.
- Route drawing: SVG `stroke-dasharray`/`stroke-dashoffset` transitions keyed to selection state.
- Node pulses / ambient loops: CSS keyframes, disabled under `prefers-reduced-motion`.
- State transitions (tabs, dialog, map selection): CSS transitions on class/data-attribute changes.

None of the approved motion patterns requires spring physics, layout projection or scroll-linked orchestration — the only capabilities that would justify Motion for React.

## Bundle and maintenance impact

Motion for React would add roughly 30–50 KB compressed against a 220 KB initial-route JS budget while duplicating what CSS already does here. The custom primitive is ~40 lines.

## Decision

Do not install an animation library in this release. The Master Build Prompt lists "Motion for React for meaningful choreographed interaction" as baseline; per §5's dependency gate, it is deferred until a section genuinely requires choreography CSS cannot express (e.g. shared-layout transitions in a future phase).

## Consequences / Reversibility

Fully reversible — adding Motion later is additive and does not change the content or component architecture.

## Source requirements

Master Build Prompt §5, §11; `/accessible-motion-and-performance` budgets; motion-tokens.json.
