# ADR-031 — Consolidation of P4-C and P4-D

Date: 2026-07-20 · Status: accepted

## Context

The internal-system programme originally anticipated a P4-C operational-pilot
package followed by a separate P4-D production-readiness package. Given the
proportionate initial scope (3–6 employees, 3–10 controlled cases, employee-only,
synthetic/de-identified data), maintaining two further phases would be
disproportionate and would risk implying a production commitment that has not
been authorized.

## Decision

- **P4-C is the final implementation package.** It combines the operational
  pilot and the production-readiness (release-evidence, rollback, Go/No-Go
  gate) concerns into one proportionate phase. **There is no separate P4-D.**
- P4-C prepares evidence for a **human Limited Internal Operations Go/No-Go
  decision** but never makes that decision, never activates `limited_internal`
  outside an isolated synthetic test, and never deploys or configures production
  infrastructure.
- Production remains a **separate, future authorization** outside this
  programme.

## Consequences

- A single final phase closes the internal-system programme with a decision
  pack rather than an open-ended sequence.
- The Phase Closure and Decision Pack explicitly distinguishes implementation
  evidence, synthetic validation, required manual-pilot evidence, residual risks
  and the pending human decision.
