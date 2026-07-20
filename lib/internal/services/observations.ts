import { prisma } from "../db";
import { audit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";
import { createCorrectiveAction } from "./exercises";

/**
 * P4-C operational observations (§17). Observations assess the process and
 * system — never employee performance. A critical observation requires a
 * CorrectiveAction (created and linked automatically). No automatic closure; no
 * deletion; all changes are audited.
 */

export class ObservationError extends Error {}

export async function createObservation(
  actor: CurrentEmployee,
  input: {
    pilotRunId?: string | null;
    caseId?: string | null;
    category: string;
    severity: string;
    title: string;
    description: string;
  },
): Promise<string> {
  assertCan(actor, "operations.pilot.view");
  if (!input.title?.trim() || !input.description?.trim()) {
    throw new ObservationError("Title and description are required.");
  }
  let linkedCorrectiveActionId: string | null = null;
  let status = "OPEN";
  if (input.severity === "CRITICAL") {
    // A critical observation requires a corrective action.
    linkedCorrectiveActionId = await createCorrectiveAction(actor, {
      sourceType: "OPERATIONAL_OBSERVATION",
      title: `Corrective action for critical observation: ${input.title.trim()}`,
      description: input.description.trim(),
      severity: "CRITICAL",
    }).catch(() => null as unknown as string);
    if (linkedCorrectiveActionId) status = "CORRECTIVE_ACTION_OPENED";
  }
  const created = await prisma.operationalObservation.create({
    data: {
      pilotRunId: input.pilotRunId ?? null,
      caseId: input.caseId ?? null,
      category: input.category as never,
      severity: input.severity as never,
      title: input.title.trim(),
      description: input.description.trim(),
      observedById: actor.id,
      status: status as never,
      linkedCorrectiveActionId,
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "OBSERVATION_RECORDED",
    entityType: "OperationalObservation",
    entityId: created.id,
    caseId: input.caseId ?? null,
    summary: `Operational observation recorded (${input.category}/${input.severity})`,
  });
  return created.id;
}

export async function resolveObservation(
  actor: CurrentEmployee,
  id: string,
  input: { status: "RESOLVED" | "ACCEPTED_OBSERVATION" | "UNDER_REVIEW"; resolutionSummary?: string },
): Promise<void> {
  assertCan(actor, "operations.pilot.manage");
  const obs = await prisma.operationalObservation.findUnique({ where: { id } });
  if (!obs) throw new ObservationError("Observation not found.");
  await prisma.operationalObservation.update({
    where: { id },
    data: {
      status: input.status,
      resolutionSummary: input.resolutionSummary?.trim() ?? obs.resolutionSummary,
      reviewedById: actor.id,
      closedAt: input.status === "RESOLVED" || input.status === "ACCEPTED_OBSERVATION" ? new Date() : obs.closedAt,
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "OBSERVATION_UPDATED",
    entityType: "OperationalObservation",
    entityId: id,
    summary: `Observation → ${input.status}`,
  });
}

export async function listObservations(actor: CurrentEmployee, pilotRunId?: string) {
  assertCan(actor, "operations.pilot.view");
  return prisma.operationalObservation.findMany({
    where: pilotRunId ? { pilotRunId } : {},
    orderBy: [{ severity: "desc" }, { observedAt: "desc" }],
    take: 300,
  });
}
