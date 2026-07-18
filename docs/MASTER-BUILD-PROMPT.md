You are the primary GitHub repository builder, lead front-end architect, interaction designer, and implementation engineer for:

AKANIL MOROCCO–RED SEA ECONOMIC GATEWAY
Institutional Introduction Window

You are working inside the Git repository:

https://github.com/Moenabil112/Akanil-Red-sea

======================================================================
1. MISSION
======================================================================

Transform the current static institutional HTML prototype into a refined,
interactive, component-based institutional website suitable for Moroccan
public institutions, business organizations, industrial companies,
financial stakeholders, logistics operators, technology providers, and
qualified Sudanese business decision-makers.

The result must feel deliberately designed by an experienced human UI/UX
and editorial design team.

It must not resemble:

- a generic AI-generated landing page;
- a temporary event website;
- a startup waitlist;
- a crypto or fintech dashboard;
- a marketplace;
- a collection of identical glass cards;
- a decorative 3D showcase with weak institutional content.

This task concerns the public institutional introduction website only.

Do not build:

- authentication;
- user onboarding;
- databases;
- data rooms;
- production AI agents;
- automated matching;
- payments;
- contracts;
- external integrations;
- operational portal features;
- a backend API.

======================================================================
2. AUTHORITATIVE INPUTS
======================================================================

Before writing or changing application code, locate and inspect all
available project inputs.

Read in this order:

1. Repository-level `CLAUDE.md`.
2. Project skills in `.claude/skills/`.
3. `docs/PROJECT-BASELINE.md`.
4. `docs/FRONTEND-QUALITY-GATES.md`.
5. Approved Phase 3 archive and its documents P3-00 through P3-13.
6. Approved Phase 2 archive and its documents P2-00 through P2-20.
7. Approved Phase 1 archive.
8. `AKANIL-Claude-Code-Core-Inputs-V1.1`.
9. Current institutional-window V0.2 prototype.
10. Brand tokens.
11. Visual asset catalog.
12. Motion-ready manifest.
13. Page architecture.
14. Asset-use rules.

Treat the approved phase archives as the governing source of truth.

The current V0.2 HTML prototype is a content and behavior reference only.
Do not port it line-by-line or reproduce its visual composition.

Do not modify, rename, regenerate, or overwrite approved Phase 1, Phase 2,
or Phase 3 documents.

If an input is absent:

- record it in `docs/implementation/MISSING-INPUTS.md`;
- determine whether it blocks implementation;
- use a controlled, reversible assumption when it does not block work;
- do not fabricate approved facts.

======================================================================
3. PROJECT IDENTITY
======================================================================

Preserve the following hierarchy:

Akanil for Development and Investment
→ founder and executive operator;

Akanil Morocco–Red Sea Economic Gateway
→ permanent economic infrastructure;

Morocco–Sudan Economic Forum
→ first activation programme.

The future Morocco–Sudan business chamber is a separate future legal and
institutional pathway. Do not present it as an existing entity.

Morocco and Sudan are value-chain partners.

Do not frame Sudan merely as a raw-material source.

The shared-value logic is:

Sudanese resource or capability
+ Moroccan processing or expertise
+ finance and logistics
+ regional distribution
= measurable shared value.

Artificial intelligence proposes; an authorized human reviews and decides.

Do not present any institution, company, sponsor, route, investment,
facility, project, or opportunity as confirmed without supporting evidence.

Generated concept images are not documentary evidence.

======================================================================
4. TARGET EXPERIENCE
======================================================================

The website must communicate, within the first viewport and the next two
sections:

1. Who Akanil is.
2. What the Gateway is.
3. Why the Gateway matters to Morocco.
4. How Sudan participates as a value-chain partner.
5. How the Forum activates the permanent Gateway.
6. What the visitor can do next.
7. What is confirmed, conceptual, under study, or future-facing.

The visual experience must be:

- Moroccan institutional;
- premium but restrained;
- editorial rather than template-driven;
- cinematic only where motion supports meaning;
- evidence-led;
- economically credible;
- calm, spacious, and precise;
- native in Arabic, French, and English.

Give strong prominence to the Moroccan stakeholder value proposition:

- industrial transformation;
- standards and quality;
- finance and insurance;
- technology and skills;
- export capability;
- logistics;
- regional distribution;
- responsible shared value.

======================================================================
5. IMPLEMENTATION BASELINE
======================================================================

Claude Code is responsible for building the repository from its current state. If the repository is empty or does not already contain a compatible application, create a feature branch and initialize the project using this baseline:

- Next.js App Router;
- TypeScript with strict checking;
- React Server Components by default;
- client components only for genuine interaction and motion;
- static generation for the public locale routes where practical;
- locale-aware routes using `app/[lang]/...`;
- Arabic, French, and English;
- Motion for React for meaningful choreographed interaction;
- semantic SVG for the conceptual corridor map;
- centralized CSS variables and design tokens;
- CSS Modules, well-structured global CSS, or a carefully controlled
  utility layer;
- Next.js image optimization or an equivalent optimized image pipeline;
- automated linting, type checking, and tests.

Do not add a dependency merely because it is fashionable.

Before installing a substantial library:

1. state the requirement;
2. explain why browser APIs, CSS, or existing dependencies are
   insufficient;
3. assess bundle and maintenance impact;
4. record the decision in `docs/decisions/`.

Avoid introducing:

- a component-library visual identity that overrides Akanil;
- an animation library for simple hover transitions;
- WebGL or Three.js unless a specific approved interaction requires it;
- a CMS;
- a backend;
- analytics or tracking;
- external forms;
- remote AI APIs.

======================================================================
6. REPOSITORY STRUCTURE
======================================================================

Use or adapt the following structure:

Akanil-Red-sea/
├── app/ or src/app/
│   └── [lang]/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── motion/
│   ├── maps/
│   └── ui/
├── content/
│   ├── ar/
│   ├── fr/
│   └── en/
├── public/
│   ├── brand/
│   ├── images/
│   ├── motion/
│   └── icons/
├── styles/
├── lib/
├── tests/
├── docs/
│   ├── decisions/
│   ├── implementation/
│   ├── design/
│   └── qa/
├── .claude/
│   └── skills/
├── CLAUDE.md
├── README.md
└── package.json

Keep approved archives and source-resolution design assets outside the
public web bundle.

Only optimized production derivatives belong in `public/`.

======================================================================
7. DESIGN-SYSTEM FOUNDATION
======================================================================

Before implementing full sections, establish the design-system foundation.

Use the approved working palette:

- Deep Atlantic Blue: #0B2748
- Midnight: #07192A
- Moroccan Green: #0B6655
- Red Sea Copper: #B5673B
- Nile Blue: #317B83
- Warm Sand: #D8C4A5
- Calm Ivory: #F5F2EA
- Charcoal: #1F272D
- Motion Gold: #D5AD62

Typography:

- Arabic: Alexandria with approved fallbacks.
- French and English: Inter with approved fallbacks.
- Do not commit or redistribute font binaries.

Create centralized tokens for:

- color;
- typography;
- spacing;
- grid;
- borders;
- radii;
- shadows;
- z-index;
- breakpoints;
- motion duration;
- easing;
- reduced-motion behavior.

Design principles:

- typography and composition carry the experience;
- imagery supports meaning;
- cards are used only when content is genuinely modular;
- avoid excessive rounded rectangles;
- avoid indiscriminate glassmorphism;
- avoid decorative gradients without narrative purpose;
- use Moroccan, Amazigh, Nubian, and Red Sea geometric references as
  restrained structural devices, not dense ornament.

======================================================================
8. REQUIRED PAGE ARCHITECTURE
======================================================================

Implement the following narrative architecture unless the approved
Phase 3 baseline requires a documented adjustment.

01. HERO — THE GATEWAY PROPOSITION

- Clear Akanil ownership.
- Permanent Gateway proposition.
- Morocco–Sudan–Red Sea scope.
- One primary institutional action.
- One secondary exploration action.
- A motion treatment that communicates opening, connection, or route.
- No fake metric counters.

02. WHY THE GATEWAY

Explain the operational problem:

- fragmented access;
- weak qualification;
- lost follow-up;
- unstructured relationships;
- unclear opportunity status.

Show how Akanil provides operating memory and structured progression.

03. THREE-LAYER INSTITUTIONAL ARCHITECTURE

Communicate:

- Akanil;
- the permanent Gateway;
- the Forum activation programme.

Do not present the three as equal independent brands.

04. MOROCCO VALUE PROPOSITION

Make this a major authored section, not a small card list.

Cover:

- industry and processing;
- standards and quality;
- finance and insurance;
- logistics and export capability;
- technology and skills;
- regional distribution.

Design for Moroccan institutional and business stakeholders.

05. SUDAN SHARED-VALUE PROPOSITION

Cover:

- production capability;
- resources;
- market;
- local value addition;
- East Africa and Red Sea connection;
- shared value and capacity development.

Avoid extractive or paternalistic framing.

06. CORRIDOR INTELLIGENCE

Build an accessible conceptual corridor experience.

Requirements:

- Morocco, Sudan, Red Sea, and relevant scenario nodes;
- route-state legend;
- conceptual, under-study, pilot-qualified, verified, constrained, and
  alternative states;
- keyboard-selectable nodes;
- text summary outside the SVG;
- reduced-motion version;
- mobile node-sequence fallback;
- visible disclaimer that the map is conceptual unless current evidence
  supports a stronger status.

Do not imply live tracking.

07. PRIORITY VALUE CHAINS

Create an interactive but accessible value-chain experience for:

- feed and livestock;
- oilseeds and food processing;
- water, energy, and agritech;
- mining and value addition.

Each chain should show:

- source or capability;
- qualification;
- processing or expertise;
- finance and logistics;
- market;
- shared-value outcome.

08. FORUM — FIRST ACTIVATION PROGRAMME

Present the Forum as:

- private;
- invitation-based;
- qualified;
- B2B and B2G;
- linked to visits, decisions, commitments, and follow-up.

Do not make the website feel like a conference registration site.

09. DIGITAL OPERATING LAYER

Present the future operating model conceptually:

- reception;
- verification;
- qualification;
- controlled introductions;
- meetings;
- decisions;
- commitments;
- follow-up;
- audit trail.

Do not imply that these production features are currently live.

10. TRUST, DATA, AND AI

Communicate:

- defined purpose;
- consent;
- classification;
- least privilege;
- source attribution;
- human review;
- controlled access;
- auditability.

Do not depict AI as an autonomous authority.

11. ABOUT AKANIL

Present Akanil as:

- Moroccan institutional operator;
- business-development platform;
- economic-corridor designer;
- field-intelligence and relationship operator;
- founder and executive operator of the Gateway.

12. INSTITUTIONAL CONTACT

Provide a restrained, non-promissory action such as:

- request an institutional briefing;
- discuss company qualification;
- explore a priority value chain;
- request a controlled meeting.

The current implementation must not send data to an external service.

A local, accessible modal or contact-note interaction is acceptable.

======================================================================
9. TRILINGUAL CONTENT ARCHITECTURE
======================================================================

Create independently edited Arabic, French, and English content records.

Do not place all translations directly inside visual components.

Support content fields such as:

- eyebrow;
- title;
- lead;
- body;
- CTA label;
- CTA explanation;
- status;
- disclaimer;
- image alt text;
- evidence note.

Language behavior:

- locale routes;
- correct `lang` and `dir`;
- Arabic native RTL;
- French and English LTR;
- language switching preserves the current section or equivalent route;
- mixed Arabic and Latin text is handled explicitly;
- route geography is not mirrored incorrectly in RTL.

Do not use runtime machine translation.

======================================================================
10. VISUAL ASSET INTEGRATION
======================================================================

Read the curated asset catalog and motion-ready manifest.

For every selected asset, record:

- asset ID;
- source;
- role;
- section;
- conceptual or documentary status;
- crop by breakpoint;
- optimized formats;
- alt text;
- motion treatment;
- reduced-motion fallback;
- publication status.

Generated images may be used for:

- atmosphere;
- conceptual corridors;
- abstract transitions;
- motion layers;
- non-documentary institutional illustration.

Generated images must not be used to prove:

- a real meeting;
- a real participant;
- a real partnership;
- a real government endorsement;
- a real route;
- a real facility;
- a confirmed investment.

Remove, crop, or avoid generated text embedded in source images.

Final headings, labels, and CTAs must be semantic HTML.

Production media rules:

- use responsive WebP or AVIF derivatives;
- use MP4 or WebM for cinematic raster motion;
- provide poster frames;
- pause offscreen video;
- provide mobile and reduced-motion alternatives;
- do not use GIF as the primary production format;
- do not ship source-resolution PNG assets in the initial page load.

======================================================================
11. MOTION AND INTERACTION
======================================================================

Motion must explain one of:

- hierarchy;
- route;
- transformation;
- progression;
- status;
- controlled access;
- continuity.

Use project skills:

- `/institutional-art-direction`
- `/premium-interaction-design`
- `/motion-storytelling`
- `/arabic-rtl-experience`
- `/moroccan-stakeholder-ux`
- `/corridor-map-visualization`
- `/editorial-trilingual-content`
- `/accessible-motion-and-performance`
- `/visual-asset-integration-and-compression`

Preferred motion patterns:

- controlled gateway reveal;
- route drawing;
- node activation;
- subtle depth and parallax;
- progressive value-chain stages;
- transition from Forum activation to follow-up;
- visible human review in trust and AI sequences.

Avoid:

- scroll hijacking;
- continuous distracting motion;
- 3D tilt on standard cards;
- excessive particle fields;
- page transitions that delay content;
- hover-only content;
- animation without reduced-motion fallback.

Every important interaction must work by:

- keyboard;
- pointer;
- touch.

======================================================================
12. ACCESSIBILITY AND PERFORMANCE
======================================================================

Target WCAG 2.2 Level AA.

At minimum implement:

- semantic landmarks;
- logical heading structure;
- skip link;
- visible focus;
- accessible navigation;
- accessible language switcher;
- keyboard-operable tabs and map nodes;
- alt text and decorative-image handling;
- reduced-motion support;
- dialog focus management;
- zoom and reflow support;
- no information conveyed by color alone.

Project performance targets at the 75th percentile:

- LCP <= 2.5 seconds;
- INP <= 200 milliseconds;
- CLS <= 0.1.

Use the project performance budgets as engineering targets.

Do not claim accessibility conformance from automated scores alone.

======================================================================
13. SEO, METADATA, AND TRUST
======================================================================

Create appropriate metadata for AR, FR, and EN.

Include:

- localized titles and descriptions;
- canonical routing strategy;
- Open Graph metadata;
- social preview fallback;
- sitemap and robots configuration if appropriate;
- organization and website structured data only when supported by
  approved facts.

Do not add fabricated awards, partner logos, reviews, statistics, or
institutional endorsements.

======================================================================
14. DOCUMENTATION AND DECISIONS
======================================================================

Create or update:

- `README.md`;
- `docs/implementation/IMPLEMENTATION-PLAN.md`;
- `docs/implementation/COMPONENT-MAP.md`;
- `docs/design/ASSET-USE-REGISTER.md`;
- `docs/design/MOTION-SPECIFICATION.md`;
- `docs/qa/QA-REPORT.md`;
- `docs/decisions/ADR-*.md` for material choices;
- `docs/implementation/MISSING-INPUTS.md` where needed.

Each ADR should include:

- context;
- options;
- decision;
- consequences;
- reversibility;
- source requirements.

======================================================================
15. EXECUTION MODE
======================================================================

Use continuous controlled execution.

Do not stop after every section or file.

Do not ask for approval for:

- ordinary component naming;
- reversible layout details;
- token implementation;
- internal folder structure;
- test creation;
- responsive refinements;
- accessibility fixes;
- asset compression;
- nonmaterial dependency updates.

Record controlled assumptions and continue.

Stop and request explicit user authorization only before:

- publishing or deploying publicly;
- connecting a real external contact service;
- adding analytics or tracking;
- using real personal or sensitive data;
- presenting a target organization as a confirmed partner;
- purchasing a paid service or asset;
- changing an approved strategic or governance decision.

Do not deploy automatically.

Create logical local Git commits at stable milestones. Do not force-push, rewrite shared history, deploy, or push to the remote unless the user explicitly requests it.

Do not rewrite Git history.

======================================================================
16. REQUIRED WORK SEQUENCE
======================================================================

Execute the following sequence.

STEP 1 — REPOSITORY DIAGNOSIS

- inspect the repository;
- identify the available inputs;
- identify current tooling;
- identify missing files;
- write `docs/implementation/IMPLEMENTATION-PLAN.md`.

STEP 2 — FOUNDATION

- initialize or normalize the application;
- implement locale routing;
- implement global tokens and typography;
- create core layout, navigation, footer, focus, and reduced-motion
  foundations;
- establish content architecture.

STEP 3 — FIRST AUTHORED VERTICAL SLICE

Implement:

- header;
- hero;
- “Why the Gateway”;
- institutional architecture;
- Morocco value proposition.

Validate all three languages and mobile behavior before expanding.

STEP 4 — ECONOMIC STORY

Implement:

- Sudan shared-value proposition;
- corridor intelligence;
- value chains;
- route and process interactions.

STEP 5 — ACTIVATION AND TRUST

Implement:

- Forum;
- digital operating layer;
- trust, data, and AI;
- About Akanil;
- institutional contact.

STEP 6 — ASSET AND MOTION PASS

- integrate selected optimized assets;
- create meaningful motion;
- create poster and reduced-motion fallbacks;
- remove generated text artifacts;
- verify conceptual labels.

STEP 7 — QUALITY PASS

Run:

- build;
- lint;
- type checking;
- unit and component tests;
- accessibility checks;
- responsive review;
- language review;
- performance review.

Then invoke:

- `/anti-generic-ai-interface-review`
- `/final-interface-qa`

Resolve blocking issues.

STEP 8 — FINAL HANDOFF

Provide:

- summary of implementation;
- final repository structure;
- key design decisions;
- selected assets and motion behavior;
- validation results;
- unresolved limitations;
- commands to run locally;
- confirmation that no deployment occurred.

======================================================================
17. ACCEPTANCE CRITERIA
======================================================================

The first release is acceptable only when:

1. The project builds cleanly.
2. Type checking passes.
3. Core tests pass.
4. Arabic, French, and English routes work.
5. Arabic is authentically RTL.
6. Mobile, tablet, and desktop layouts are authored.
7. The first viewport clearly identifies Akanil and the Gateway.
8. Morocco's stakeholder value is prominent.
9. Sudan is framed as a value-chain partner.
10. The Forum is presented as the first activation programme.
11. The corridor is clearly conceptual and status-aware.
12. Interactions work with keyboard, pointer, and touch.
13. Reduced-motion behavior exists.
14. Generated concept art is not presented as documentary evidence.
15. No unverified partner logos or claims appear.
16. No backend or operational features have been implied as live.
17. The anti-generic AI interface review reaches Pass or a documented
    Conditional Pass with no critical credibility failure.
18. The final QA has no unresolved critical accessibility, trust, or
    build issue.
19. No public deployment occurred without explicit authorization.

======================================================================
18. FIRST RESPONSE
======================================================================

Begin now.

In your first response:

1. Confirm the repository and inputs you found.
2. List missing required inputs.
3. Summarize the current prototype's strongest reusable ideas.
4. Identify the five most important redesign problems.
5. Present the proposed technical and design implementation plan.
6. Create or update the implementation-plan document.
7. Then continue implementation without waiting for another approval,
   unless a mandatory hard stop is reached.

Do not return a generic design proposal.

Work directly in the repository and produce a functioning implementation.


======================================================================
19. SPLIT INPUT PACKAGE MODEL
======================================================================

The project inputs are split to remain below the upload limit.

Required packages:

1. AKANIL-Claude-Code-Core-Inputs-V1.1.zip
2. AKANIL-Claude-Code-Skills-V1.1.zip
3. AKANIL-Claude-Code-Master-Build-Prompt-V1.1.zip
4. Approved Phase 3 archive

Optional high-resolution source-art packages:

5. AKANIL-Visual-Sources-Part-1-V1.1.zip
6. AKANIL-Visual-Sources-Part-2-V1.1.zip

Begin implementation using the required packages.

Do not block the normal website build because the optional source-art packages
are absent. The Core Inputs package already includes optimized WebP derivatives.

Request or use an optional source-art package only when a task requires:

- source-resolution motion compositing;
- new high-resolution crops;
- retouching;
- large-format export;
- detailed layer separation.

Claude Code must keep optional source PNG files outside the production public
bundle.
