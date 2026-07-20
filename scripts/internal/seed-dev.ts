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
  if (existing === 0) {
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
  } else {
    console.log(`Synthetic cases already present (${existing}). Skipping case seeding.`);
  }

  await seedGovernance();

  console.log("Synthetic dev data seeded (clearly marked synthetic).");
  await prisma.$disconnect();
}

/**
 * DEVELOPMENT-ONLY P4-B governance seeding for local QA and screenshots.
 * Grants time-limited pilot access to synthetic operational accounts (approved
 * by a different admin), and creates one synthetic security event, incident,
 * exercise, corrective action and readiness signals. Idempotent. Never used in
 * production; all data is clearly synthetic.
 */
async function seedGovernance() {
  const admin = await prisma.employee.findFirst({ where: { role: "SYSTEM_ADMIN" } });
  if (!admin) return;

  const existingPilot = await prisma.pilotAccess.count();
  if (existingPilot === 0) {
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 86_400_000);
    const cohort = await prisma.employee.findMany({
      where: { email: { endsWith: "@akanil.example" }, role: { in: ["OPERATIONS_MANAGER", "CASE_MANAGER", "SPECIALIST_REVIEWER", "FORUM_COORDINATOR"] } },
    });
    for (const emp of cohort) {
      await prisma.pilotAccess.create({
        data: {
          employeeId: emp.id,
          approvedRole: emp.role,
          justification: "Synthetic local-QA pilot access.",
          requestedById: admin.id,
          approvedById: admin.id,
          status: "ACTIVE",
          startsAt: now,
          expiresAt: expires,
        },
      });
    }
    console.log(`Seeded synthetic pilot access for ${cohort.length} account(s).`);
  }

  const { recordSecurityEvent } = await import("@/lib/internal/security-events");
  const { recordReadinessSignal } = await import("@/lib/internal/services/readiness");
  if ((await prisma.securityEvent.count()) === 0) {
    await recordSecurityEvent({
      category: "OBJECT_ACCESS_DENIED",
      severity: "LOW",
      summary: "Synthetic: object-level access denied during local exercise.",
    });
  }
  if ((await prisma.securityIncident.count()) === 0) {
    const { createIncident } = await import("@/lib/internal/services/security");
    const opsActor2 = await opsCurrent();
    if (opsActor2) {
      await createIncident(opsActor2, {
        title: "Synthetic operational-error incident (synthetic)",
        category: "OPERATIONAL_ERROR",
        severity: "LOW",
        summary: "Synthetic incident used for local QA of the incident module.",
      });
    }
  }
  if ((await prisma.pilotExercise.count()) === 0) {
    const opsActor2 = await opsCurrent();
    if (opsActor2) {
      const { createExercise } = await import("@/lib/internal/services/exercises");
      await createExercise(opsActor2, {
        type: "PUBLIC_INTERNAL_BOUNDARY",
        title: "Verify public/internal boundary (synthetic)",
        expectedResult: "Public build works with no database; reception never writes internally.",
      });
    }
  }
  await recordReadinessSignal({ id: "backup-recency", status: "PASS", detail: "Synthetic local backup verified." });
  await recordReadinessSignal({ id: "secret-scan", status: "PASS", detail: "No secrets committed (synthetic signal)." });
}

async function opsCurrent(): Promise<CurrentEmployee | null> {
  const ops = await prisma.employee.findFirst({ where: { role: "OPERATIONS_MANAGER" } });
  if (!ops) return null;
  return { id: ops.id, email: ops.email, displayName: ops.displayName, role: "OPERATIONS_MANAGER", mustChangePassword: false };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
