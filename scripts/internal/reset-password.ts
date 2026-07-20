import { parseArgs, confirm, requirePasswordEnv, fail } from "./cli-utils";
import { resetEmployeePassword, UserServiceError } from "@/lib/internal/services/users";
import { prisma } from "@/lib/internal/db";

/**
 * npm run internal:user:reset-password -- --user a@akanil.example [--yes]
 * The new password is read from INTERNAL_USER_PASSWORD (never argv). Forces a
 * password change on next login and revokes all sessions. Hashes/passwords are
 * never printed.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const user = String(args.user ?? "");
  if (!user) fail("Usage: --user <email|id> [--yes]");
  const password = requirePasswordEnv("INTERNAL_USER_PASSWORD");

  console.log(`About to reset the password for: ${user}`);
  console.log(`  (new password taken from INTERNAL_USER_PASSWORD; never shown)`);
  if (args.yes !== true) {
    const ok = await confirm("Confirm you want to reset this password and revoke sessions?");
    if (!ok) fail("Aborted.");
  }

  try {
    await resetEmployeePassword(user, password, null);
    console.log(`Password reset for ${user}; sessions revoked; change required on next login.`);
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
