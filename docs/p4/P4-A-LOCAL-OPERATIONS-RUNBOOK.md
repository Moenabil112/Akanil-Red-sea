# P4-A — Local Operations Runbook

Local development only. No cloud database, no deployment, no production
infrastructure. Never commit `.env`, credentials, dumps or backups.

## 1. Environment

Copy `.env.example` to `.env` (git-ignored) and fill placeholders:

- `P4_INTERNAL_ENABLED=true` (leave `false`/unset to keep the system off).
- `DATABASE_URL` / `DATABASE_URL_TEST` — local PostgreSQL only.
- `AUTH_SECRET` — generate locally, e.g. `openssl rand -base64 48`.
- Session/lockout tuning: `P4_SESSION_MAX_AGE_MINUTES`,
  `P4_SESSION_IDLE_TIMEOUT_MINUTES`, `P4_LOGIN_MAX_FAILURES`,
  `P4_LOGIN_LOCK_MINUTES`.

## 2. Database (Docker Compose)

```
POSTGRES_PASSWORD=<local-dev-only> docker compose up -d   # start PostgreSQL 16
docker compose ps                                          # check health
docker compose down                                        # stop (keeps volume)
```

A local system PostgreSQL 16 works equally well; point `DATABASE_URL` at it.

## 3. Prisma client and migrations

```
npm run db:generate        # generate the client into lib/generated/prisma (git-ignored)
npm run db:migrate:dev     # create/apply a migration during development
npm run db:migrate         # apply committed migrations (prisma migrate deploy)
npm run db:migrate:test    # apply migrations to the test database
npm run db:seed:roles      # ensure the case-reference counter (no accounts, no demo cases)
npm run db:studio          # DEVELOPMENT ONLY data browser (not exposed by the app)
```

Migration status / rollback (development):

```
npx prisma migrate status
npx prisma migrate resolve --rolled-back <migration_name>   # dev rollback marker
# To revert schema in dev, restore from a local logical backup (below) or
# drop and recreate the dev database, then re-apply migrations.
```

Migrations are **never** run automatically at application startup.

## 4. Provision employees (administrative only)

Passwords are read from `INTERNAL_USER_PASSWORD`, never the command line:

```
INTERNAL_USER_PASSWORD='<strong-temp-password>' \
  npm run internal:user:create -- --email a@akanil.example --name "A. Osman" --role CASE_MANAGER

npm run internal:user:disable -- --user a@akanil.example

INTERNAL_USER_PASSWORD='<new-temp-password>' \
  npm run internal:user:reset-password -- --user a@akanil.example
```

Roles: SYSTEM_ADMIN, OPERATIONS_MANAGER, CASE_MANAGER, SPECIALIST_REVIEWER,
FORUM_COORDINATOR, READ_ONLY_AUDITOR. New accounts must change their password on
first login. No default admin credential exists; never seed a known password.

## 5. Run and validate

```
npm run dev            # http://localhost:3000/en/internal/login
npm run typecheck
npm test               # unit + component + boundary/prohibited scans
npm run test:integration   # PostgreSQL integration tests
npm run build          # public build succeeds without a database
npm run lint
```

## 6. Backup and restore (local)

Logical backup + verified restore into a throwaway database:

```
DATABASE_URL='postgresql://akanil_p4:<pw>@localhost:5432/akanil_p4_dev' \
  bash scripts/internal/backup-restore-smoke.sh
```

The script dumps to `backups/` (git-ignored), restores into a temporary
verification database, checks the table count, and drops the verification
database. Recommendations:

- Encrypt any backup handled outside the local machine (e.g. `age`/`gpg`).
- Test restores regularly; a backup is only as good as its last verified restore.
- **Never commit a database dump or backup to source control.**

## 7. Safety notes

- Do not connect production services. Do not deploy. Do not expose Prisma Studio
  or a database-admin route through the application.
- Keep `.env`, backups and dumps out of git (already git-ignored).
