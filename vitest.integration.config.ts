import { defineConfig } from "vitest/config";
import path from "node:path";

// Load local .env (DATABASE_URL_TEST) when present; CI supplies env directly.
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (process as any).loadEnvFile?.(".env");
} catch {
  /* no .env — env comes from the environment (CI) */
}

// Integration tests use a dedicated PostgreSQL database.
process.env.DATABASE_URL =
  process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL ?? "";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["tests/integration/**/*.test.ts"],
    fileParallelism: false,
    hookTimeout: 30_000,
    testTimeout: 30_000,
  },
});
