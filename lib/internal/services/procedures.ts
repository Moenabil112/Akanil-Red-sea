import { prisma } from "../db";
import { audit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";

/**
 * P4-C operating-procedure register and acknowledgements (§12/§13). The
 * authoritative procedure content lives in repository Markdown
 * (docs/p4/P4-C-INTERNAL-OPERATING-PROCEDURES.md); this service tracks metadata
 * and lifecycle only. History is never overwritten — a new effective version
 * supersedes the previous one, which is retained. Acknowledgement is not a
 * professional certification; it is never automatic and never fabricated
 * through client input; records are never deleted.
 */

export class ProcedureError extends Error {}

/** The required SOP keys (§12). */
export const REQUIRED_PROCEDURES: { key: string; title: string }[] = [
  { key: "SOP-INTAKE-01", title: "Manual intake from authorized channel" },
  { key: "SOP-ORG-01", title: "Organization and professional-contact creation" },
  { key: "SOP-CLASS-01", title: "Classification and data minimization" },
  { key: "SOP-ASSIGN-01", title: "Case ownership and specialist assignment" },
  { key: "SOP-QUAL-01", title: "Qualification and information-gap handling" },
  { key: "SOP-MEET-01", title: "Meeting preparation and recording" },
  { key: "SOP-DEC-01", title: "Decision proposal and approval" },
  { key: "SOP-COMMIT-01", title: "Commitment and follow-up" },
  { key: "SOP-CLOSE-01", title: "Closure, duplicate handling and reopening" },
  { key: "SOP-ACCESS-01", title: "Employee access and offboarding" },
  { key: "SOP-INCIDENT-01", title: "Security-event and incident handling" },
  { key: "SOP-RECOVERY-01", title: "Backup, restore and recovery" },
  { key: "SOP-SUSPEND-01", title: "Emergency pilot suspension" },
];

/** Register (or bump) a procedure to a new DRAFT version. */
export async function registerProcedure(
  actor: CurrentEmployee,
  input: { procedureKey: string; title: string; requiresAcknowledgement?: boolean },
): Promise<string> {
  assertCan(actor, "operations.procedure.manage");
  const latest = await prisma.operatingProcedure.findFirst({
    where: { procedureKey: input.procedureKey },
    orderBy: { version: "desc" },
  });
  const version = (latest?.version ?? 0) + 1;
  const created = await prisma.operatingProcedure.create({
    data: {
      procedureKey: input.procedureKey,
      version,
      title: input.title.trim(),
      ownerId: actor.id,
      status: "DRAFT",
      requiresAcknowledgement: input.requiresAcknowledgement ?? true,
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PROCEDURE_REGISTERED",
    entityType: "OperatingProcedure",
    entityId: created.id,
    summary: `Procedure ${input.procedureKey} v${version} drafted`,
  });
  return created.id;
}

export async function approveProcedure(actor: CurrentEmployee, id: string): Promise<void> {
  assertCan(actor, "operations.procedure.manage");
  const proc = await prisma.operatingProcedure.findUnique({ where: { id } });
  if (!proc) throw new ProcedureError("Procedure not found.");
  if (proc.status !== "DRAFT") throw new ProcedureError("Only a draft procedure can be approved.");
  await prisma.operatingProcedure.update({
    where: { id },
    data: { status: "APPROVED", approvedById: actor.id },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PROCEDURE_APPROVED",
    entityType: "OperatingProcedure",
    entityId: id,
    summary: `Procedure ${proc.procedureKey} v${proc.version} approved`,
  });
}

/** Make a procedure EFFECTIVE, superseding the previously effective version. */
export async function makeProcedureEffective(actor: CurrentEmployee, id: string): Promise<void> {
  assertCan(actor, "operations.procedure.manage");
  const proc = await prisma.operatingProcedure.findUnique({ where: { id } });
  if (!proc) throw new ProcedureError("Procedure not found.");
  if (proc.status !== "APPROVED") throw new ProcedureError("Only an approved procedure can become effective.");
  await prisma.$transaction(async (tx) => {
    await tx.operatingProcedure.updateMany({
      where: { procedureKey: proc.procedureKey, status: "EFFECTIVE" },
      data: { status: "SUPERSEDED", supersededAt: new Date() },
    });
    await tx.operatingProcedure.update({
      where: { id },
      data: { status: "EFFECTIVE", effectiveFrom: new Date() },
    });
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PROCEDURE_EFFECTIVE",
    entityType: "OperatingProcedure",
    entityId: id,
    summary: `Procedure ${proc.procedureKey} v${proc.version} effective (prior version superseded)`,
  });
}

/**
 * Record a procedure acknowledgement. An employee may acknowledge for
 * themselves; acknowledging on behalf of another requires a BRIEFED type and
 * records the acting employee. Never fabricated from client-supplied identity.
 */
export async function acknowledgeProcedure(
  actor: CurrentEmployee,
  input: { procedureKey: string; procedureVersion: number; employeeId?: string; acknowledgementType?: string },
): Promise<void> {
  assertCan(actor, "operations.procedure.acknowledge");
  const employeeId = input.employeeId ?? actor.id;
  const type = input.acknowledgementType ?? "READ_AND_UNDERSTOOD";
  if (employeeId !== actor.id && type !== "BRIEFED" && type !== "PRACTICAL_EXERCISE_COMPLETED") {
    throw new ProcedureError("Acknowledging on behalf of another requires a BRIEFED or practical type.");
  }
  const proc = await prisma.operatingProcedure.findUnique({
    where: { procedureKey_version: { procedureKey: input.procedureKey, version: input.procedureVersion } },
  });
  if (!proc || proc.status !== "EFFECTIVE") {
    throw new ProcedureError("Only an effective procedure version can be acknowledged.");
  }
  await prisma.procedureAcknowledgement.create({
    data: {
      procedureKey: input.procedureKey,
      procedureVersion: input.procedureVersion,
      employeeId,
      acknowledgementType: type as never,
      recordedById: actor.id,
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PROCEDURE_ACKNOWLEDGED",
    entityType: "OperatingProcedure",
    entityId: proc.id,
    summary: `Procedure ${input.procedureKey} v${input.procedureVersion} acknowledged (${type})`,
  });
}

export async function listProcedures(actor: CurrentEmployee) {
  assertCan(actor, "operations.procedure.view");
  return prisma.operatingProcedure.findMany({ orderBy: [{ procedureKey: "asc" }, { version: "desc" }], take: 200 });
}

/** Effective procedures still missing an acknowledgement for the given employee. */
export async function missingAcknowledgements(employeeId: string): Promise<string[]> {
  const effective = await prisma.operatingProcedure.findMany({
    where: { status: "EFFECTIVE", requiresAcknowledgement: true },
    select: { procedureKey: true, version: true },
  });
  const missing: string[] = [];
  for (const p of effective) {
    const ack = await prisma.procedureAcknowledgement.count({
      where: { employeeId, procedureKey: p.procedureKey, procedureVersion: p.version },
    });
    if (ack === 0) missing.push(`${p.procedureKey} v${p.version}`);
  }
  return missing;
}
