import { prisma } from "@/lib/internal/db";
import { CASE_COUNTER_ID } from "@/lib/internal/reference";

/**
 * Development seeding of controlled records only (P4-A §6/§21). Ensures the
 * case-reference counter exists. NEVER seeds a known password and NEVER
 * creates demo cases in production. Employee accounts are provisioned
 * separately via the create-user script.
 */
async function main() {
  await prisma.counter.upsert({
    where: { id: CASE_COUNTER_ID },
    create: { id: CASE_COUNTER_ID, value: 0 },
    update: {},
  });
  console.log("Seeded controlled records: case-reference counter ensured.");
  console.log(
    "No employee accounts and no demo cases were created. Use `npm run internal:user:create` to provision employees.",
  );
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
