import { prisma } from "@/lib/internal/db";
import { createCase } from "@/lib/internal/services/cases";
import { createOrganization } from "@/lib/internal/services/organizations";
import { createGap, proposeDecision, createCommitment } from "@/lib/internal/services/records";
import { addNote } from "@/lib/internal/services/cases";
import { devUserAllowed } from "@/lib/internal/env";
import type { CurrentEmployee } from "@/lib/internal/authz";

/**
 * DEVELOPMENT-ONLY synthetic seeding (P4-A §21). Guarded by P4_ALLOW_DEV_USER.
 * Creates clearly-marked synthetic organizations and cases for local QA and
 * screenshots. NEVER run against production; NEVER creates demo cases in
 * production. Also clears mustChangePassword on existing synthetic accounts so
 * local QA can sign straight in (their passwords still come from provisioning).
 */
async function main() {
  if (!devUserAllowed()) {
    console.error("Refusing to seed dev data: set P4_ALLOW_DEV_USER=true (local only).");
    process.exit(1);
  }

  // Let synthetic accounts sign straight in for local QA/screenshots.
  await prisma.employee.updateMany({
    where: { email: { endsWith: "@akanil.example" } },
    data: { mustChangePassword: false },
  });

  const ops = await prisma.employee.findFirst({ where: { role: "OPERATIONS_MANAGER" } });
  const cm = await prisma.employee.findFirst({ where: { role: "CASE_MANAGER" } });
  if (!ops || !cm) {
    console.error("Create synthetic employees first (npm run internal:user:create).");
    process.exit(1);
  }
  const opsActor: CurrentEmployee = { id: ops.id, email: ops.email, displayName: ops.displayName, role: "OPERATIONS_MANAGER", mustChangePassword: false };
  const cmActor: CurrentEmployee = { id: cm.id, email: cm.email, displayName: cm.displayName, role: "CASE_MANAGER", mustChangePassword: false };

  const existing = await prisma.case.count();
  if (existing > 0) {
    console.log(`Synthetic data already present (${existing} cases). Skipping.`);
    await prisma.$disconnect();
    return;
  }

  const orgId = await createOrganization(cmActor, {
    workingName: "Atlas Agro Synthetic Co. (synthetic)",
    country: "Morocco",
    organizationType: "Manufacturer",
  });
  await createOrganization(cmActor, {
    workingName: "Nile Oilseeds Synthetic (synthetic)",
    country: "Sudan",
  });

  const c1 = await createCase(cmActor, {
    title: "Oilseeds supply enquiry (synthetic)",
    summary: "Synthetic case: a manufacturer enquiry received via the institutional inbox.",
    source: "PUBLIC_RECEPTION_EMAIL",
    organizationId: orgId,
    requestType: "supply-offtake-requirement",
    primaryValueChainId: "oilseeds-agro-processing",
    priority: "HIGH",
  });
  await addNote(cmActor, c1.id, { noteType: "REVIEW", classification: "INTERNAL", body: "Synthetic internal review note." });
  await createGap(cmActor, c1.id, { category: "IDENTITY", title: "Organization registration document (synthetic)" });
  await proposeDecision(cmActor, c1.id, { title: "Progress to specialist review (synthetic)", decisionType: "PROGRESS_TO_SPECIALIST_REVIEW" });
  await createCommitment(opsActor, c1.id, { title: "Prepare qualification briefing (synthetic)", internalOwnerId: cm.id });

  await createCase(cmActor, {
    title: "Forum qualification — Moroccan company (synthetic)",
    summary: "Synthetic case: a Forum participation enquiry for the agriculture track.",
    source: "FORUM",
    requestType: "forum-qualification",
    forumParticipationPathId: "moroccan-companies-exporters",
    forumSectorTrackId: "agriculture-food-industrialization",
    priority: "NORMAL",
  });

  console.log("Synthetic dev data seeded (clearly marked synthetic).");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
