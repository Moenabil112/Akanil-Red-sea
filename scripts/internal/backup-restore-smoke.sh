#!/usr/bin/env bash
# P4-A local backup-and-restore smoke procedure (§25). Demonstrates that a
# synthetic database can be logically backed up and restored. Uses a
# throwaway verification database; never touches production and never
# commits a dump (backups/ is git-ignored).
#
# Usage: DATABASE_URL=postgresql://user:pass@localhost:5432/akanil_p4_dev \
#        bash scripts/internal/backup-restore-smoke.sh
set -euo pipefail

: "${DATABASE_URL:?Set DATABASE_URL to the source (development/test) database}"

mkdir -p backups
STAMP="$(date +%Y%m%d-%H%M%S)"
DUMP="backups/akanil-p4-smoke-${STAMP}.sql.gz"
VERIFY_DB="akanil_p4_restore_smoke"

# Parse host/port/user/db from DATABASE_URL for the restore target.
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

echo "1) Logical backup → ${DUMP}"
pg_dump "$DATABASE_URL" | gzip > "$DUMP"

echo "2) Recreate a throwaway verification database"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres \
  -c "DROP DATABASE IF EXISTS ${VERIFY_DB};" -c "CREATE DATABASE ${VERIFY_DB};"

echo "3) Restore into the verification database"
gunzip -c "$DUMP" | psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$VERIFY_DB" >/dev/null

echo "4) Verify: at least the expected tables restored"
COUNT="$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$VERIFY_DB" -tAc \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")"
echo "   restored tables: ${COUNT}"
if [ "${COUNT}" -lt 15 ]; then
  echo "RESTORE VERIFICATION FAILED (expected >= 15 tables)"; exit 1
fi

echo "5) Clean up verification database (dump retained locally, git-ignored)"
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres \
  -c "DROP DATABASE IF EXISTS ${VERIFY_DB};"

echo "BACKUP-AND-RESTORE SMOKE OK"
