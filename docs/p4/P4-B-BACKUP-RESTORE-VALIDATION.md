# P4-B — Backup and Recovery Validation

Local development only. Backups are **never committed** (`backups/` is
git-ignored), never contain real data, and never include encryption keys. No
production backup provider is configured.

## Commands

- `npm run internal:backup:smoke` — the P4-A logical backup/restore smoke into a
  throwaway database (retained).
- `npm run internal:restore:verify` — the P4-B hardened verification
  (`scripts/internal/backup-verify.sh`).

## `internal:restore:verify` steps (§20)

1. Logical backup → `backups/…​.sql.gz`.
2. **SHA-256 checksum** written alongside the dump.
3. **Manifest**: timestamp, checksum, latest applied migration, and record
   counts for Employee, Case, AuditEvent, PilotAccess, AccessChangeRequest,
   SecurityEvent, SecurityIncident, PilotExercise, CorrectiveAction.
4. Recreate a throwaway restore database and restore the dump.
5. **Restore verification**: at least the expected tables are present (≥ 22).
6. **Audit count match** between source and restored databases.
7. **Audit hash-chain verification** in the restored database
   (`internal:audit:verify` against the restore URL).
8. Synthetic end-to-end case check.
9. **Cleanup** of the temporary restored database.

## Recovery procedure

To recover from database loss/corruption locally:

1. Recreate the database and apply committed migrations
   (`prisma migrate deploy`).
2. Restore the most recent verified dump.
3. Run `internal:audit:verify`; if the chain is broken at or before the restore
   point, open an AUDIT_INTEGRITY incident.
4. Run `internal:restore:verify` to confirm counts and chain integrity.

## Failure handling

A failed restore test should open (or support) a BACKUP_RESTORE security
incident and a corrective action in the pilot environment, tracked to
independent verification. It also drives the readiness `last-restore-test`
signal to FAIL, which blocks a pilot-ready gate.

## Future (out of scope now)

Operational backups must be **encrypted outside the repository** before any
future live deployment. Encryption keys are never committed.
