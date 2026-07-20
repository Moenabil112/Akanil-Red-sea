import { parseArgs, confirm, requirePasswordEnv, fail } from "./cli-utils";
import { createEmployeeAccount, UserServiceError } from "@/lib/internal/services/users";
import { EMPLOYEE_ROLES } from "@/lib/internal/roles";
import { prisma } from "@/lib/internal/db";

/**
 * npm run internal:user:create -- --email a@akanil.example --name "A. Osman" --role CASE_MANAGER [--yes]
 * The password is read from INTERNAL_USER_PASSWORD (never argv). The account
 * is created ACTIVE with mustChangePassword=true. Hashes/passwords are never
 * printed. Only intended for authorized Akanil employees.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = String(args.email ?? "");
  const name = String(args.name ?? "");
  const role = String(args.role ?? "");
  if (!email || !name || !role) {
    fail("Usage: --email <email> --name <name> --role <ROLE> [--yes]");
  }
  if (!EMPLOYEE_ROLES.includes(role as never)) {
    fail(`Role must be one of: ${EMPLOYEE_ROLES.join(", ")}`);
  }
  const password = requirePasswordEnv("INTERNAL_USER_PASSWORD");

  console.log(`About to create an internal employee account:`);
  console.log(`  email : ${email}`);
  console.log(`  name  : ${name}`);
  console.log(`  role  : ${role}`);
  console.log(`  (password taken from INTERNAL_USER_PASSWORD; never shown)`);
  if (args.yes !== true) {
    const ok = await confirm("Confirm this is an authorized Akanil employee?");
    if (!ok) fail("Aborted.");
  }

  try {
    const id = await createEmployeeAccount({ email, displayName: name, role, password }, null);
    console.log(
      `Created employee ${id} (${email}, ${role}). They must change their password on first login.`,
    );
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
