# P4-C — Final Residual Risk Register

P4-C claims no ISO, SOC, penetration-test or legal-compliance certification and
no production readiness. This register carries forward the P4-B residual risks
(`P4-B-RESIDUAL-RISK-REGISTER.md`) and records the P4-C-specific ones.

| # | Risk | Current mitigation | Residual / future work |
| --- | --- | --- | --- |
| C1 | `limited_internal` could be requested via env without an approved authorization. | Environment value alone never authorizes; `assertLimitedInternalAuthorized` requires an ACTIVE authorization + employee/case limits + data category, fail-closed. | Operational discipline: env controls change-managed. |
| C2 | An authorization could be activated while a critical gate fails. | `authorizationBlockers` blocks activation on open critical incident/corrective, broken audit chain, failed restore, or suspension; enforced in `decideAuthorization`. | Periodic re-verification of gates before each activation. |
| C3 | One person could drive the go-live decision. | Proposer ≠ reviewer ≠ approver; no self-approval; SYSTEM_ADMIN cannot approve go-live; step-up on decision. | Independent management oversight of the decision. |
| C4 | De-identified data could be mislabeled. | Category required per case; live categories impossible by type; data-minimization warnings; synthetic-only in QA. | Human approval of any DE_IDENTIFIED classification before real pilot data. |
| C5 | Deterministic duplicate suggestions may miss or over-flag. | Explainable normalized matching; suggestion-only; never auto-merged; human resolution with waiver rationale. | Manual review; no fuzzy/AI matching introduced. |
| C6 | Release evidence could embed a secret/URL. | Commit SHA validated; all evidence fields reject URLs/secrets; no production URL/secret stored; immutable once reviewed. | Reviewer diligence; secret scan in CI. |
| C7 | Manual pilot not yet performed. | Software controls validated synthetically; manual checklist provided; no claim of a completed pilot. | Authorized humans run the pilot after merge. |
| C8 | Rollback is manual and environment-neutral. | Documented criteria and procedure; emergency suspension verified; no automatic production rollback. | Rehearse rollback with the operations team before any live use. |

## Explicit non-authorizations

- Production is **not** authorized or deployed; no hosting/DNS/infrastructure is
  configured.
- `limited_internal` is not activated outside an isolated synthetic test.
- No external accounts, portals, uploads, notifications, webhooks, AI providers,
  automatic matching, automatic Go/No-Go, automatic environment change or public
  case tracking are activated.
- The public Digital Reception Lite remains disconnected from the internal
  database.
