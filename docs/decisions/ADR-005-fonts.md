# ADR-005 — Alexandria + Inter via Google Fonts stylesheet, no committed binaries

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

Approved typography is Alexandria (Arabic) and Inter (Latin); font binaries must not be committed or redistributed (Master Build Prompt §7; brand tokens note).

## Options

1. `next/font/google` (self-hosts at build time — requires build-machine network access to fonts.google.com; fails the build offline).
2. Google Fonts `<link>` stylesheet with preconnect + `display=swap` and strong system fallback stacks (chosen).
3. System fonts only (rejected: loses approved identity).

## Decision

Option 2: runtime stylesheet loading keeps the build deterministic in restricted-network environments, commits no binaries, and `font-display: swap` plus metric-compatible fallback stacks (`Tahoma`/`Segoe UI` for Arabic, system-ui for Latin) keeps CLS low. Weights are constrained (400/500/600/700/800 Latin; 400/500/700/800 Arabic) to limit transfer.

## Consequences

First paint may use fallback metrics briefly; acceptable for an introduction window and consistent with performance budgets.

## Reversibility

High — switching to `next/font` later is a layout-file change only.

## Source requirements

Master Build Prompt §7; design-tokens.json typography note; P2-17 VUX-DEC-06.
