# ADR-020 — Internal / public application boundary

Date: 2026-07-20 · Status: accepted

## Context

P4-A introduces an internal, employee-only case-management system inside the
same Next.js application as the public Gateway. The public site must remain a
no-backend introduction window; the internal system must never leak to the
public, and the public build must never require a database.

## Decision

- The internal application lives under `/[lang]/internal/*` with its own
  layout, styles and dictionary. It is never linked from the public header,
  footer, navigation, sitemap or Open Graph.
- `app/robots.ts` disallows `/[lang]/internal/`; `middleware.ts` sets
  `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`, `Cache-Control:
  no-store`, and a strict CSP on every internal route; the internal layout also
  declares `robots: { index: false }`.
- Route hiding is not security. Every internal page calls `requireEmployee`
  and every mutation (server action → service) re-derives the session
  server-side and enforces the RBAC permission plus object-level access.
  Middleware only adds headers and a coarse unauthenticated redirect.
- The public Digital Reception Lite is unchanged and stays disconnected: it
  never calls a P4 API, never writes to the database, and never claims a case
  was created or exposes a case reference. An authorized employee manually
  creates an internal case from the institutional inbox.
- `P4_INTERNAL_ENABLED` gates the system and defaults to false. When disabled,
  `getCurrentEmployee` returns null before any database access, so the public
  static build compiles with no `DATABASE_URL` (verified in CI and locally).
- The Prisma client is imported only by internal routes, actions and CLI
  scripts; internal pages are `force-dynamic`, so no internal page is
  statically evaluated with a database at build time.

## Consequences

- The public and internal surfaces share a codebase but not a trust boundary;
  the split is enforced by headers, robots, sitemap exclusion, the feature flag
  and server-side authorization — verified by `tests/p4a-boundary.test.ts` and
  the public-surface privacy scan (which excludes `lib/internal`,
  `app/**/internal`, `content/internal` and the generated client).
