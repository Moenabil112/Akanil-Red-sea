# Motion Specification

Motion tokens come from `styles/tokens.css` (durations 120/180/320/600/1200 ms; enter/standard/exit easings per approved motion-tokens.json). No animation library ships (ADR-002). Every behavior below has a reduced-motion fallback; `prefers-reduced-motion` globally collapses transitions and animations, and `Reveal` renders content immediately.

| # | Sequence | What it communicates | Implementation | Reduced motion |
|---|---|---|---|---|
| 1 | Hero gateway reveal | Opening the gateway | One-time CSS keyframe on the hero visual: scale 1.06→1 + opacity, `--duration-cinematic` `--ease-enter`; one cinematic event per viewport | Static frame |
| 2 | Section reveals | Hierarchy and reading order | `Reveal` (IntersectionObserver) adds a class; opacity/translateY transition at `--duration-emphasis`; stagger via `--reveal-delay` (≤120 ms steps) | Content visible immediately |
| 3 | Corridor route emphasis | Which scenarios touch the selected node | Route stroke opacity 0.3→1 and width +1 at `--duration-emphasis`; state encoded by dash pattern + text badge, never by animation | Instant state change (transitions collapse to 0.01 ms) |
| 4 | Corridor node pulse | Current selection focus | 2.4 s CSS ring pulse on the selected node only | Pulse removed (`animation: none`) |
| 5 | Value-chain stage progression | Source→market progression order | Per-stage `stage-in` keyframe with 90 ms per-stage delay on tab activation | Stages render complete |
| 6 | Tab / button / nav states | Interactive affordance | `--duration-fast` color/border transitions; hover always paired with focus-visible | Collapse to instant |
| 7 | Header condensation | Orientation while scrolling | Background/border transition at `--duration-standard` on scroll threshold | Instant |
| 8 | Contact note dialog | Controlled access to contact | Native `<dialog>` open/close; backdrop blur; focus trapped by the platform | No transition to suppress |

Prohibited by design (and absent): scroll hijacking, parallax tied to scroll position, continuous background loops, 3D tilt, particle fields, hover-only content, page transitions that delay content.
