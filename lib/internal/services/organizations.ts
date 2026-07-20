import { prisma } from "../db";
import { recordAudit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";
import { ConcurrencyError } from "./cases";

/**
 * Organizations and professional contacts (P4-A §9.3/§9.4). Organizations
 * are archived, never deleted, so related cases are preserved. Sensitive
 * personal identifiers are never collected (enforced by the form schema and
 * privacy tests).
 */

export async function createOrganization(
  actor: CurrentEmployee,
  input: {
    workingName: string;
    legalName?: string;
    organizationType?: string;
    country?: string;
    region?: string;
    officialWebsite?: string;
    officialEmail?: string;
    officialPhone?: string;
    operationalNotes?: string;
  },
): Promise<string> {
  assertCan(actor, "organization.manage");
  const org = await prisma.$transaction(async (tx) => {
    const created = await tx.organization.create({
      data: {
        workingName: input.workingName.trim(),
        legalName: input.legalName || null,
        organizationType: input.organizationType || null,
        country: input.country || null,
        region: input.region || null,
        officialWebsite: input.officialWebsite || null,
        officialEmail: input.officialEmail || null,
        officialPhone: input.officialPhone || null,
        operationalNotes: input.operationalNotes || null,
        createdById: actor.id,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "ORGANIZATION_CREATED",
      entityType: "Organization",
      entityId: created.id,
      summary: `Organization created: ${created.workingName}`,
    });
    return created;
  });
  return org.id;
}

export async function updateOrganizationVerification(
  actor: CurrentEmployee,
  organizationId: string,
  verificationStatus: string,
  expectedVersion: number,
): Promise<void> {
  assertCan(actor, "organization.manage");
  await prisma.$transaction(async (tx) => {
    const existing = await tx.organization.findUnique({ where: { id: organizationId } });
    if (!existing) throw new Error("NOT_FOUND");
    if (existing.recordVersion !== expectedVersion) throw new ConcurrencyError();
    await tx.organization.update({
      where: { id: organizationId },
      data: {
        verificationStatus: verificationStatus as never,
        recordVersion: { increment: 1 },
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "ORGANIZATION_VERIFICATION_UPDATED",
      entityType: "Organization",
      entityId: organizationId,
      summary: `Verification status → ${verificationStatus}`,
      changedFields: { verificationStatus },
    });
  });
}

/** Archive (never delete) an organization; related cases are preserved. */
export async function archiveOrganization(
  actor: CurrentEmployee,
  organizationId: string,
  expectedVersion: number,
): Promise<void> {
  assertCan(actor, "organization.manage");
  await prisma.$transaction(async (tx) => {
    const existing = await tx.organization.findUnique({ where: { id: organizationId } });
    if (!existing) throw new Error("NOT_FOUND");
    if (existing.recordVersion !== expectedVersion) throw new ConcurrencyError();
    await tx.organization.update({
      where: { id: organizationId },
      data: {
        verificationStatus: "ARCHIVED",
        archivedAt: new Date(),
        recordVersion: { increment: 1 },
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "ORGANIZATION_ARCHIVED",
      entityType: "Organization",
      entityId: organizationId,
      summary: "Organization archived",
    });
  });
}

export async function createContact(
  actor: CurrentEmployee,
  organizationId: string,
  input: {
    fullName: string;
    professionalRole?: string;
    professionalEmail?: string;
    professionalPhone?: string;
    preferredLanguage?: string;
    operationalNotes?: string;
  },
): Promise<void> {
  assertCan(actor, "contact.manage");
  await prisma.$transaction(async (tx) => {
    const contact = await tx.contact.create({
      data: {
        organizationId,
        fullName: input.fullName.trim(),
        professionalRole: input.professionalRole || null,
        professionalEmail: input.professionalEmail || null,
        professionalPhone: input.professionalPhone || null,
        preferredLanguage: input.preferredLanguage || null,
        operationalNotes: input.operationalNotes || null,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "CONTACT_CREATED",
      entityType: "Contact",
      entityId: contact.id,
      summary: `Professional contact created for organization ${organizationId}`,
    });
  });
}
