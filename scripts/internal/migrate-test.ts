import { execFileSync } from "node:child_process";

/**
 * Apply migrations to the dedicated test database (P4-A §20/§28). Loads the
 * local .env when present, points DATABASE_URL at DATABASE_URL_TEST, and runs
 * `prisma migrate deploy`. Never touches the development or production database.
 */
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (process as any).loadEnvFile?.(".env");
} catch {
  /* CI supplies env directly */
}

const testUrl = process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL;
if (!testUrl) {
  console.error("DATABASE_URL_TEST (or DATABASE_URL) must be set for test migrations.");
  process.exit(1);
}

execFileSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: testUrl },
});
