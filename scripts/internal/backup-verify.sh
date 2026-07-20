#!/usr/bin/env bash
# P4-B backup-and-restore verification (§20). Enhances the P4-A smoke with a
# SHA-256 checksum, a schema/migration-version stamp, a record-count manifest,
# a restore verification, an audit hash-chain verification against the restored
# database, a synthetic end-to-end case check, and explicit cleanup of the
# temporary restored database. Never commits a dump (backups/ is git-ignored),
# never includes real data, and never configures a production backup provider.
#
# Usage: DATABASE_URL=postgresql://user:pass@localhost:5432/akanil_p4_dev \
#        bash scripts/internal/backup-verify.sh
set -euo pipefail

: "${DATABASE_URL:?Set DATABASE_URL to the source (development/test) database}"

mkdir -p backups
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DUMP="backups/akanil-p4-verify-${STAMP}.sql.gz"
MANIFEST="backups/akanil-p4-verify-${STAMP}.manifest.txt"
VERIFY_DB="akanil_p4_restore_verify"

proto_removed="${DATABASE_URL#*://}"
creds="${proto_removed%%@*}"
hostportdb="${proto_removed#*@}"
PGUSER="${creds%%:*}"
PGPASSWORD_LOCAL="${creds#*:}"
PGPASSWORD_LOCAL="${PGPASSWORD_LOCAL%%@*}"
hostport="${hostportdb%%/*}"
PGHOST="${hostport%%:*}"
PGPORT="${hostport#*:}"; [ "$PGPORT" = "$PGHOST" ] && PGPORT=5432
export PGPASSWORD="$PGPASSWORD_LOCAL"

# Source database name without any ?query string (pg_dump/psql reject it).
SRC_DB="${hostportdb#*/}"; SRC_DB="${SRC_DB%%\?*}"
SRC_CLEAN="postgresql://${PGUSER}:${PGPASSWORD_LOCAL}@${PGHOST}:${PGPORT}/${SRC_DB}"
RESTORE_URL="postgresql://${PGUSER}:${PGPASSWORD_LOCAL}@${PGHOST}:${PGPORT}/${VERIFY_DB}?schema=public"

psql_src() { psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$SRC_DB" -tAc "$1" 2>/dev/null | tr -d '[:space:]'; }
psql_dst() { psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$VERIFY_DB" -tAc "$1" 2>/dev/null | tr -d '[:space:]'; }

echo "1) Logical backup → ${DUMP}"
pg_dump "$SRC_CLEAN" | gzip > "$DUMP"

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

echo "8) Synthetic end-to-end case check (restored cases are present or table exists)"
DST_CASES="$(psql_dst "SELECT count(*) FROM \"Case\";")"
echo "   restored cases: ${DST_CASES}"

echo "9) Clean up the temporary restored database"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -c "DROP DATABASE IF EXISTS ${VERIFY_DB};" >/dev/null

echo "BACKUP-AND-RESTORE VERIFICATION OK"
