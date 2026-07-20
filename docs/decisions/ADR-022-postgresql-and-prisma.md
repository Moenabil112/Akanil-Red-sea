# ADR-022 — PostgreSQL and Prisma ORM

Date: 2026-07-20 · Status: accepted

## Context

P4-A needs a normalized relational store with transactions (case-reference
generation, assignment changes, decision/qualification approval, audit tied to
mutations), schema migrations committed to the repository, and a local Docker
Compose database. No cloud/hosted database in this task; no in-memory or SQLite
production model.

## Decision

- **PostgreSQL 16** as the only database (Docker Compose for local dev, a
  local server for tests/CI). Chosen for transactional integrity, row-locking
  (used by the case-reference counter and optimistic-concurrency updates) and
  mature tooling.
- **Prisma 6.x** as the ORM and migration tool. Prisma 7 was evaluated and
  rejected for this MVP: it mandates driver adapters, removes the datasource
  `url` from the schema and drops automatic `.env` loading, adding churn and
  complexity for a local internal system. Prisma 6.19 is the mature, stable
  release with direct connection support and automatic env loading, and is
  fully compatible with Next.js 15 / React 19 / Node 22.
- The generated client is emitted to `lib/generated/prisma` (git-ignored;
  produced by `npm run db:generate` in CI). Migrations are committed under
  `prisma/migrations` and applied explicitly — never automatically at app
  startup. `npm run db:migrate:test` targets a separate test database.
- Optimistic concurrency uses a `recordVersion` integer on cases,
  organizations, contacts, commitments and meeting preparations; stale writes
  raise a `ConcurrencyError` that the UI surfaces as a reload prompt.

## Consequences

- The stack is standard and reproducible locally and in CI. The Prisma 6 pin is
  documented; a future upgrade to Prisma 7 would adopt a `pg` driver adapter and
  a `prisma.config.ts` and is out of scope for P4-A.
