# Skills Map and Invocation Guide

Project skills are committed under `.claude/skills/<skill-name>/SKILL.md`.

Claude Code can load a skill automatically when the task matches its description, or you can invoke it directly with `/skill-name`.

## Recommended sequence for the first build

1. `/build-akanil-interface plan`
2. `/institutional-art-direction`
3. `/moroccan-stakeholder-ux`
4. `/premium-interaction-design`
5. `/motion-storytelling`
6. `/arabic-rtl-experience`
7. `/corridor-map-visualization`
8. `/editorial-trilingual-content`
9. `/visual-asset-integration-and-compression`
10. `/accessible-motion-and-performance`
11. `/anti-generic-ai-interface-review`
12. `/final-interface-qa`

## Do not load every skill blindly

Load only the skills relevant to the current task. Skill content persists in the Claude Code session, so using a focused set reduces context pressure.

## Suggested task combinations

### Hero redesign
`/institutional-art-direction /premium-interaction-design /motion-storytelling`

### Arabic navigation and responsive layout
`/arabic-rtl-experience /accessible-motion-and-performance`

### Corridor section
`/corridor-map-visualization /motion-storytelling /moroccan-stakeholder-ux`

### Trilingual content pass
`/editorial-trilingual-content /arabic-rtl-experience`

### Final review
`/anti-generic-ai-interface-review /final-interface-qa`
