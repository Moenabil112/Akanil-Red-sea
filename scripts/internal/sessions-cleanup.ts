import { prisma } from "@/lib/internal/db";
import { cleanupExpiredSessions } from "@/lib/internal/session-store";

/**
 * P4-B session maintenance (§11). Removes revoked and fully-expired sessions.
 * Invoked ONLY as an explicit command — never automatically on public
 * application startup.
 */
async function main() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (process as any).loadEnvFile?.(".env");
  } catch {
    /* env supplied directly */
  }
  const removed = await cleanupExpiredSessions();
  console.log(`Removed ${removed} revoked/expired session(s).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
