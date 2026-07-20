#!/usr/bin/env node
/**
 * Build-safe Prisma Client generation (P4-B CI/Preview fix).
 *
 * `prisma generate` reads the schema and requires the datasource's env var to
 * be *present* — even though it never connects. On hosts that build the public
 * site without operational variables (e.g. Vercel Preview), DATABASE_URL is
 * absent, so `next build` fails to resolve the (git-ignored) generated client.
 *
 * This script runs ONLY `prisma generate`. When DATABASE_URL is missing it
 * supplies a syntactically valid, unreachable placeholder to the child process
 * for code generation only. It:
 *   - never connects to the placeholder;
 *   - never exposes it to the browser (child-process env only);
 *   - never enables P4, runs migrations, creates users or seeds data;
 *   - never alters the public/internal boundary;
 *   - never prints a database password or a full connection string.
 */
import { spawnSync } from "node:child_process";

const childEnv = { ...process.env };

if (!childEnv.DATABASE_URL || childEnv.DATABASE_URL.trim() === "") {
  // Unreachable placeholder for code generation only. Not a real database.
  childEnv.DATABASE_URL =
    "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder?schema=public";
  console.log(
    "prisma-generate-build: DATABASE_URL absent — using an unreachable placeholder for code generation only (no connection, no migration, no seed).",
  );
}

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: childEnv,
});

process.exit(result.status ?? 1);
