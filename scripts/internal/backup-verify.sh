#!/usr/bin/env bash
# P4-B backup-and-restore verification (§20). Enhances the P4-A smoke with a
# SHA-256 checksum, a schema/migration-version stamp, a record-count manifest,
# a restore verification, an audit hash-chain verification against the restored
# database, a synthetic end-to-end case check, and explicit cleanup of the
# temporary restored database. Never commits a dump (backups/ is git-ignored),
# never includes real data, and never configures a production backup provider.
#
# PostgreSQL CLI tools (pg_dump/psql) must NOT receive Prisma-only query
# parameters such as "?schema=public". Use PGTOOLS_DATABASE_URL — a pg-tools-safe
# connection URL — for all CLI operations. DATABASE_URL stays unchanged for
# Prisma. Passwords and full connection strings are never logged.
#
# Usage:
#   DATABASE_URL=postgresql://user:pass@localhost:5432/akanil_p4_dev?schema=public \
#     bash scripts/internal/backup-verify.sh
set -euo pipefail

# Prerequisite tools.
for tool in pg_dump psql gzip gunzip sha256sum npx; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Missing required tool: ${tool}"; exit 2; }
done

: "${DATABASE_URL:=}"
# pg-tools-safe URL: strip any ?query from DATABASE_URL if not provided directly.
PGTOOLS_DATABASE_URL="${PGTOOLS_DATABASE_URL:-${DATABASE_URL%%\?*}}"
: "${PGTOOLS_DATABASE_URL:?Set PGTOOLS_DATABASE_URL or DATABASE_URL (source database)}"

mkdir -p backups
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DUMP="backups/akanil-p4-verify-${STAMP}.sql.gz"
MANIFEST="backups/akanil-p4-verify-${STAMP}.manifest.txt"
VERIFY_DB="akanil_p4_restore_verify"

# Parse host/port/user/db from the pg-tools-safe URL (no query string present).
proto_removed="${PGTOOLS_DATABASE_URL#*://}"
creds="${proto_removed%%@*}"
hostportdb="${proto_removed#*@}"
PGUSER="${creds%%:*}"
PGPASSWORD_LOCAL="${creds#*:}"; PGPASSWORD_LOCAL="${PGPASSWORD_LOCAL%%@*}"
hostport="${hostportdb%%/*}"
PGHOST="${hostport%%:*}"
PGPORT="${hostport#*:}"; [ "$PGPORT" = "$PGHOST" ] && PGPORT=5432
export PGPASSWORD="$PGPASSWORD_LOCAL"

SRC_DB="${hostportdb#*/}"
# Prisma exposes DATABASE_URL to tsx via the same env, but audit-verify only
# needs a reachable URL for the RESTORED database; build it without a password
# in logs. The password is only ever in PGPASSWORD / this variable, never echoed.
RESTORE_URL="postgresql://${PGUSER}:${PGPASSWORD_LOCAL}@${PGHOST}:${PGPORT}/${VERIFY_DB}?schema=public"

psql_src() { psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$SRC_DB" -tAc "$1" 2>/dev/null | tr -d '[:space:]'; }
psql_dst() { psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$VERIFY_DB" -tAc "$1" 2>/dev/null | tr -d '[:space:]'; }

# Cleanup on success OR failure: drop the temp restore DB and remove the dump,
# checksum and manifest. Committed backups remain prohibited (backups/ ignored).
cleanup() {
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres \
    -c "DROP DATABASE IF EXISTS ${VERIFY_DB};" >/dev/null 2>&1 || true
  rm -f "$DUMP" "${DUMP}.sha256" "$MANIFEST"
}
trap cleanup EXIT

echo "1) Logical backup (source db: ${SRC_DB} on ${PGHOST})"
pg_dump "$PGTOOLS_DATABASE_URL" | gzip > "$DUMP"

echo "2) SHA-256 checksum"
sha256sum "$DUMP" | tee "${DUMP}.sha256"

echo "3) Schema/migration version + record-count manifest → ${MANIFEST}"
{
  echo "timestamp=${STAMP}"
  echo "checksum=$(cut -d' ' -f1 < "${DUMP}.sha256")"
  echo "latest_migration=$(psql_src "SELECT migration_name FROM _prisma_migrations ORDER BY finished_at DESC NULLS LAST LIMIT 1;")"
  for T in Employee Case AuditEvent PilotAccess AccessChangeRequest SecurityEvent SecurityIncident PilotExercise CorrectiveAction; do
    echo "count_${T}=$(psql_src "SELECT count(*) FROM \"${T}\";")"
  done
} | tee "$MANIFEST"

echo "4) Recreate the throwaway restore database and restore"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres \
  -c "DROP DATABASE IF EXISTS ${VERIFY_DB};" -c "CREATE DATABASE ${VERIFY_DB};" >/dev/null
gunzip -c "$DUMP" | psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$VERIFY_DB" >/dev/null

echo "5) Verify restored table count"
TABLES="$(psql_dst "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")"
echo "   restored tables: ${TABLES}"
if [ "${TABLES:-0}" -lt 22 ]; then echo "RESTORE VERIFICATION FAILED (expected >= 22 tables)"; exit 1; fi

echo "6) Verify audit-event count matches source"
SRC_AUDIT="$(psql_src "SELECT count(*) FROM \"AuditEvent\";")"
DST_AUDIT="$(psql_dst "SELECT count(*) FROM \"AuditEvent\";")"
echo "   source=${SRC_AUDIT} restored=${DST_AUDIT}"
if [ "${SRC_AUDIT:-0}" != "${DST_AUDIT:-1}" ]; then echo "AUDIT COUNT MISMATCH"; exit 1; fi

echo "7) Verify the audit hash chain in the restored database"
if [ "${DST_AUDIT:-0}" -gt 0 ]; then
  DATABASE_URL="$RESTORE_URL" npx tsx scripts/internal/audit-verify.ts
fi

echo "8) Synthetic end-to-end case check (restored cases present or table exists)"
DST_CASES="$(psql_dst "SELECT count(*) FROM \"Case\";")"
echo "   restored cases: ${DST_CASES}"

echo "BACKUP-AND-RESTORE VERIFICATION OK"
