@docs/PROJECT-BASELINE.md
@docs/FRONTEND-QUALITY-GATES.md

# Claude Code Instructions — AKANIL Front-End

## Source hierarchy

Read sources in this order before substantive implementation:

1. Approved Phase 3 baseline.
2. Approved Phase 2 knowledge baseline.
3. Approved Phase 1 strategic baseline.
4. Current institutional-window prototype.
5. Brand tokens and curated visual-asset catalog.
6. These project skills.

Do not reopen or silently reinterpret approved phase decisions.

## Working mode

- Build a modern component-based institutional front-end, not a direct conversion of the static HTML prototype.
- The repository may begin empty. You are the primary repository builder: inspect all inputs, create a feature branch, initialize the application, establish the architecture, implement the interface, run QA, and create logical local commits.
- Record architecture and design decisions in `docs/decisions/`.
- Use semantic HTML, progressive enhancement and content-first structure.
- Keep authoritative archives outside the public application bundle.
- Do not deploy, publish or connect real external services without explicit user authorization.

## Visual direction

The interface must feel:
- Moroccan institutional;
- calm and premium;
- editorial rather than template-driven;
- cinematic where motion carries meaning;
- evidence-led and commercially credible;
- modern without excessive glassmorphism, glow or decorative dashboards.

Avoid:
- generic AI landing-page compositions;
- full-screen generated artwork with weak content hierarchy;
- excessive rounded cards;
- random gradients and particle effects;
- startup or crypto aesthetics;
- fake metrics and fake dashboards;
- decorative 3D scenes that obscure the institutional message.

## Language

- Arabic, French and English are core.
- Arabic is native RTL.
- Store and edit each language independently.
- Do not use runtime machine translation for approved public copy.
- Do not include font files in the repository.

## Skills

Use the project skills in `.claude/skills/` when their descriptions match the work.
For a complete build or major redesign, start with `/build-akanil-interface`.
Before presenting a final result, run `/anti-generic-ai-interface-review` and `/final-interface-qa`.


## GitHub repository build responsibility

Claude Code is the primary implementation agent for the GitHub repository.

It should:

- work directly in the cloned repository;
- create a non-destructive feature branch;
- initialize the front-end when the repository is empty;
- create the complete component and content architecture;
- run build, lint, type checks and tests;
- make logical local commits after stable milestones;
- keep governing archives and source PNG assets outside the public bundle.

It must not:

- deploy publicly;
- force-push;
- rewrite shared history;
- commit secrets;
- push to the remote unless the user explicitly requests it.
