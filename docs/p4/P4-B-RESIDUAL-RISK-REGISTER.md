# P4-B — Residual Risk Register

P4-B does not claim ISO, SOC, penetration-test or legal-compliance
certification, and does not claim production readiness. The following residual
risks are recorded for the limited internal pilot.

| # | Risk | Current mitigation | Residual / future work |
| --- | --- | --- | --- |
| R1 | Single-factor authentication (password only). | Argon2id, min length 14, lockout, step-up for sensitive actions. | Add WebAuthn / TOTP MFA (future). |
| R2 | CSP allows `'unsafe-inline'` for the Next.js hydration bootstrap. | No third-party script origin; `frame-ancestors 'none'`. | Nonce-based CSP (carried from ADR-021). |
| R3 | Audit tamper-evidence is application-level, not externally notarized. | SHA-256 hash chain, verifier, restore re-verification, no UI reset. | External notarization only if ever required (not now). |
| R4 | Local, unencrypted backups. | `backups/` git-ignored; no real data; checksum + restore verify. | Encrypt operational backups outside the repo before any live deployment. |
| R5 | No automated external security monitoring / alerting. | Internal SecurityEvent + readiness surfacing; incident module. | SIEM/alerting is future work; intentionally excluded. |
| R6 | Step-up is single-session recent-auth, not per-action challenge. | 15-minute window; failures recorded; server-enforced. | Per-action re-prompt / hardware MFA (future). |
| R7 | Pilot data could in principle be mislabeled DE_IDENTIFIED. | Category required per case; live categories rejected; data-minimization warnings; synthetic seeds only. | Human review of de-identification before any real pilot data. |
| R8 | Insider misuse by a privileged pair. | Two-person approval, separation of duties, append-only audit + hash chain, access reviews. | Periodic independent audit review (operational process). |
| R9 | `next lint` deprecation (Next 16). | Informational only. | Migrate to ESLint CLI (future). |
| R10 | Unresolved evidence/publication inputs from prior phases. | Unchanged; no confirmation without controlled evidence. | Carried in `docs/p0/P0-MISSING-INPUTS-REGISTER.md`. |

## Explicit non-authorizations

- Production is **not** authorized or deployed.
- No external accounts, portals, integrations, uploads, notifications, webhooks,
  AI providers, automatic matching, or public case tracking are activated.
- The public Digital Reception Lite remains disconnected from the internal
  database.
