import { parseArgs, confirm, fail } from "./cli-utils";
import { disableEmployeeAccount, UserServiceError } from "@/lib/internal/services/users";
import { prisma } from "@/lib/internal/db";

/**
 * npm run internal:user:disable -- --user a@akanil.example [--yes]
 * Disables the account and revokes all its sessions. Records an audit event.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const user = String(args.user ?? "");
  if (!user) fail("Usage: --user <email|id> [--yes]");

  console.log(`About to DISABLE the internal account: ${user}`);
  if (args.yes !== true) {
    const ok = await confirm("Confirm you want to disable this account and revoke its sessions?");
    if (!ok) fail("Aborted.");
  }

  try {
    await disableEmployeeAccount(user, null);
    console.log(`Account ${user} disabled; all sessions revoked.`);
  } catch (error) {
    if (error instanceof UserServiceError) fail(error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
