import { PrismaClient } from "@/lib/generated/prisma";

/**
 * Prisma client singleton (P4-A). Lazily constructed so the public static
 * build never needs a database connection. Prisma connects on first query,
 * not at construction, so importing this module is side-effect-safe.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type { PrismaClient } from "@/lib/generated/prisma";
