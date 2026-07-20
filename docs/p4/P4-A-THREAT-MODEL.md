# P4-A — Threat Model

Scope: the internal employee-only case-management system. For each threat:
risk, implemented control, test, and residual limitation. P4-A claims **no
penetration-test certification**.

| # | Threat | Implemented control | Test | Residual |
| --- | --- | --- | --- | --- |
| 1 | Unauthorized route access | `requireEmployee` on every internal page; middleware redirects unauthenticated requests; `P4_INTERNAL_ENABLED` fail-closed. | rbac-lifecycle; boundary (noindex/redirect); integration auth. | Middleware redirect is UX only; server checks are authoritative. |
| 2 | Privilege escalation | Single default-deny RBAC matrix enforced in every service via `assertCan`; separation of duties (recommend vs approve, propose vs approve). | rbac-lifecycle; integration (create rejected for reviewer; reopen rejected for case-manager). | Role assignment is an administrative trust decision. |
| 3 | Broken object-level authorization (IDOR) | `canAccessCase` (owner/assignee) re-checked before every case mutation; assigned-only roles cannot open unrelated cases. | integration (FORBIDDEN paths); rbac. | Manager/auditor roles legitimately see all cases by design. |
| 4 | Session theft | HttpOnly + SameSite=Lax + Secure cookies; only the token hash is stored; revocable; absolute + idle expiry. | session logic exercised in integration/auth. | XSS is mitigated by CSP + no third-party scripts; cookie theft via device compromise is out of scope. |
| 5 | Credential stuffing | Argon2id (memory-hard); lockout after N failures; generic errors; no email enumeration. | rbac (password policy); auth service. | No rate-limiting at the network edge in P4-A (single-node MVP). |
| 6 | Account-lockout abuse (DoS of a user) | Temporary, time-boxed lock (default 15 min); admin reset clears it; success auto-unlocks expired locks. | auth logic. | A determined attacker can keep a known account locked; mitigated by short window + admin reset. |
| 7 | CSRF | SameSite cookies; same-origin server actions; CSP `form-action 'self'`; no cross-origin state-changing GETs. | boundary (CSP present); manual review. | Relies on browser SameSite support. |
| 8 | Injection (SQL) | Prisma parameterized queries; the one raw statement is a fixed `TRUNCATE` in tests only. | integration runs real SQL via Prisma. | New raw SQL must stay parameterized. |
| 9 | Sensitive data in logs | Passwords/hashes/tokens never logged; audit diffs redact secrets and note bodies; CLI never prints hashes/passwords. | boundary (redactFields); code review. | Operational DB logs should be access-controlled by the operator. |
| 10 | Audit tampering | Append-only `AuditEvent`; no update/delete path, including for SYSTEM_ADMIN. | boundary (no delete API); integration (events created). | Direct DB access by a DBA is outside app control; restrict DB roles. |
| 11 | Insecure direct object references | See #3; ids are opaque cuids; mutations validate access. | integration. | — |
| 12 | Accidental public indexing | robots disallow; noindex headers + route metadata; sitemap excludes internal; no public nav. | boundary. | Depends on crawler honoring robots/noindex (belt-and-suspenders headers reduce risk). |
| 13 | Data leakage through caching | `Cache-Control: no-store` on internal routes; internal pages `force-dynamic`; no shared caching of employee data. | boundary (no-store present). | Operator must not place a caching proxy in front without honoring no-store. |
| 14 | Lost updates | Optimistic concurrency (`recordVersion`) on cases/orgs/contacts/commitments/meeting prep; conflicts rejected with a reload prompt. | integration (ConcurrencyError). | Records without a version use last-write-wins by design (append-only records don't update). |
| 15 | Malicious free-text content | Output is escaped by React; CSP blocks inline/third-party scripts; free-text warnings discourage pasting secrets. | boundary (CSP). | Stored content is internal-only; a future rich-text renderer would need sanitization. |
| 16 | Secrets committed to source control | `.env*`, `lib/generated`, `backups/`, dumps git-ignored; CI uses synthetic inline credentials, no repo secret contexts; no default admin credential. | boundary (dependency + no-default-cred); secret scan in delivery. | Operators must keep real secrets in a managed store, not the repo. |
| 17 | Database backup exposure | Backups written to git-ignored `backups/`; runbook mandates encryption for off-machine handling and prohibits committing dumps. | backup/restore smoke; boundary (git-ignore). | Production backup encryption/rotation is a future (P4-B/ops) concern; not configured here. |

## Notes

- No external attack surface is added to the public site: the reception stays
  mailto-only and disconnected from the database.
- No AI, external notification, upload or data-room surface exists to attack
  (ADR-024), reducing the threat surface accordingly.
