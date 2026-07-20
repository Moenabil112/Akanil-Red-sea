#!/usr/bin/env bash
# P4-A/P4-B local backup-and-restore smoke procedure (§20/§25). Demonstrates
# that a synthetic database can be logically backed up and restored. Uses a
# throwaway verification database; never touches production and never commits a
# dump (backups/ is git-ignored).
#
# PostgreSQL CLI tools (pg_dump/psql) must NOT receive Prisma-only query
# parameters such as "?schema=public". Use PGTOOLS_DATABASE_URL — a pg-tools-safe
# connection URL — for all CLI operations. DATABASE_URL stays unchanged for
# Prisma. Passwords and full connection strings are never logged.
#
# Usage:
#   DATABASE_URL=postgresql://user:pass@localhost:5432/akanil_p4_dev?schema=public \
#     bash scripts/internal/backup-restore-smoke.sh
#   # or explicitly:
#   PGTOOLS_DATABASE_URL=postgresql://user:pass@localhost:5432/akanil_p4_dev \
#     bash scripts/internal/backup-restore-smoke.sh
set -euo pipefail

# Prerequisite tools.
for tool in pg_dump psql gzip gunzip; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Missing required tool: ${tool}"; exit 2; }
done

: "${DATABASE_URL:=}"
# pg-tools-safe URL: strip any ?query from DATABASE_URL if not provided directly.
PGTOOLS_DATABASE_URL="${PGTOOLS_DATABASE_URL:-${DATABASE_URL%%\?*}}"
: "${PGTOOLS_DATABASE_URL:?Set PGTOOLS_DATABASE_URL or DATABASE_URL (source database)}"

STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p backups
DUMP="backups/akanil-p4-smoke-${STAMP}.sql.gz"
VERIFY_DB="akanil_p4_restore_smoke"

# Parse host/port/user from the pg-tools-safe URL (no query string present).
proto_removed="${PGTOOLS_DATABASE_URL#*://}"
creds="${proto_removed%%@*}"
hostportdb="${proto_removed#*@}"
PGUSER="${creds%%:*}"
PGPASSWORD_LOCAL="${creds#*:}"; PGPASSWORD_LOCAL="${PGPASSWORD_LOCAL%%@*}"
hostport="${hostportdb%%/*}"
PGHOST="${hostport%%:*}"
PGPORT="${hostport#*:}"; [ "$PGPORT" = "$PGHOST" ] && PGPORT=5432
export PGPASSWORD="$PGPASSWORD_LOCAL"

# Cleanup on success OR failure: drop the temp restore DB and remove the dump.
# Committed backups remain prohibited (backups/ is git-ignored).
cleanup() {
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres \
    -c "DROP DATABASE IF EXISTS ${VERIFY_DB};" >/dev/null 2>&1 || true
  rm -f "$DUMP"
}
trap cleanup EXIT

echo "1) Logical backup (source: host ${PGHOST}, db ${hostportdb#*/})"
pg_dump "$PGTOOLS_DATABASE_URL" | gzip > "$DUMP"

echo "2) Recreate a throwaway verification database"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres \
  -c "DROP DATABASE IF EXISTS ${VERIFY_DB};" -c "CREATE DATABASE ${VERIFY_DB};" >/dev/null

echo "3) Restore into the verification database"
gunzip -c "$DUMP" | psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$VERIFY_DB" >/dev/null

echo "4) Verify: at least the expected tables restored"
COUNT="$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$VERIFY_DB" -tAc \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d '[:space:]')"
echo "   restored tables: ${COUNT}"
if [ "${COUNT:-0}" -lt 15 ]; then
  echo "RESTORE VERIFICATION FAILED (expected >= 15 tables)"; exit 1
fi

echo "BACKUP-AND-RESTORE SMOKE OK"
