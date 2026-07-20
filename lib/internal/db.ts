import { PrismaClient } from "@/lib/generated/prisma";

/**
 * Prisma client singleton (P4-A/P4-B). **Lazily constructed**: the client is
 * only instantiated on first property access, so a disabled public build never
 * constructs `PrismaClient` and never validates operational secrets. Prisma
 * also connects lazily (on first query), so importing this module is
 * side-effect-safe. Internal runtime operations still fail closed via
 * `internalEnabled()` / `operationMode()` before any query is issued.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

let instance: PrismaClient | undefined;
function getClient(): PrismaClient {
  if (!instance) instance = createClient();
  return instance;
}

/**
 * A lazy proxy that constructs the real client on first use. Methods are bound
 * to the underlying client so `$transaction`, `$queryRawUnsafe`, `$disconnect`
 * and model delegates behave exactly as a direct client would.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export type { PrismaClient } from "@/lib/generated/prisma";
