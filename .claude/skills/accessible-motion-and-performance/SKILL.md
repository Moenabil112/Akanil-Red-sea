---
name: accessible-motion-and-performance
description: Enforces accessibility, responsive motion and web performance. Use during component implementation, animation, media integration, responsive QA, Lighthouse work or final optimization.
---
# Accessibility, motion and performance

Target WCAG 2.2 Level AA and strong real-world performance.

## Accessibility requirements

- semantic landmarks and heading order;
- visible and unobscured keyboard focus;
- skip link;
- meaningful labels and alt text;
- touch targets with adequate size and spacing;
- no essential information conveyed by color alone;
- no forced dragging interaction without an alternative;
- accessible language switching;
- dialogs with focus management;
- charts and maps with text equivalents;
- zoom and reflow support.

## Motion accessibility

- respect `prefers-reduced-motion`;
- provide a non-animated equivalent;
- avoid fast parallax, flashing and continuous background distraction;
- pause offscreen and hidden media;
- do not tie essential progress solely to scroll position;
- allow users to pause long-running motion where appropriate.

## Performance targets

At the 75th percentile:

- LCP <= 2.5 seconds;
- INP <= 200 milliseconds;
- CLS <= 0.1.

## Project budgets

Read `references/performance-budgets.json`.

## Media

- include explicit dimensions or aspect ratios;
- reserve layout space;
- use responsive image sources;
- lazy-load noncritical media;
- preload only the true hero asset;
- provide a poster for video;
- avoid autoplay with sound;
- serve smaller mobile variants;
- do not ship source-resolution PNG files to production.

## JavaScript

- prefer server or static rendering for public content;
- progressively enhance interactions;
- isolate client-only motion;
- avoid loading an animation library for trivial transitions;
- remove unused dependencies;
- measure bundle impact before accepting a visual effect.

## Validation

Use automated tools, but also test:

- keyboard only;
- screen-reader landmark structure;
- reduced motion;
- throttled mobile network;
- lower-end mobile viewport;
- 200% zoom;
- Arabic RTL.

Do not claim conformance from an automated score alone.
