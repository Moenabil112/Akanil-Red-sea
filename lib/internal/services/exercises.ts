import { prisma } from "../db";
import { audit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";

/**
 * P4-B pilot-workflow exercises (§16) and corrective actions (§17). Exercises
 * use synthetic/de-identified data only. A failed exercise creates a
 * corrective action. No employee approves an exercise they executed alone.
 * Corrective actions require independent verification; accepting a critical
 * item as risk is not silent — it needs an OPERATIONS_MANAGER and a rationale.
 * Neither exercises nor corrective actions can be deleted through the app.
 */

export class ExerciseError extends Error {}

// ---------------- Corrective actions (§17) ----------------

export async function createCorrectiveAction(
  actor: CurrentEmployee,
  input: {
    sourceType: string;
    sourceId?: string | null;
    title: string;
    description: string;
    severity?: string;
    ownerId?: string | null;
    dueDate?: Date | null;
  },
): Promise<string> {
  assertCan(actor, "corrective.manage");
  if (!input.title?.trim() || !input.description?.trim()) {
    throw new ExerciseError("Title and description are required.");
  }
  const created = await prisma.correctiveAction.create({
    data: {
      sourceType: input.sourceType as never,
      sourceId: input.sourceId ?? null,
      title: input.title.trim(),
      description: input.description.trim(),
      severity: (input.severity as never) ?? "MEDIUM",
      ownerId: input.ownerId ?? null,
      dueDate: input.dueDate ?? null,
      status: "OPEN",
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "CORRECTIVE_ACTION_CREATED",
    entityType: "CorrectiveAction",
    entityId: created.id,
    summary: `Corrective action created from ${input.sourceType}`,
  });
  return created.id;
}

export async function updateCorrectiveActionStatus(
  actor: CurrentEmployee,
  id: string,
  input: { status: "IN_PROGRESS" | "READY_FOR_VERIFICATION"; resolutionEvidence?: string | null },
): Promise<void> {
  assertCan(actor, "corrective.manage");
  const record = await prisma.correctiveAction.findUnique({ where: { id } });
  if (!record) throw new ExerciseError("Corrective action not found.");
  if (input.status === "READY_FOR_VERIFICATION" && !input.resolutionEvidence?.trim()) {
    throw new ExerciseError("Resolution evidence is required before verification.");
  }
  await prisma.correctiveAction.update({
    where: { id },
    data: {
      status: input.status,
      resolutionEvidence: input.resolutionEvidence?.trim() ?? record.resolutionEvidence,
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "CORRECTIVE_ACTION_UPDATED",
    entityType: "CorrectiveAction",
    entityId: id,
    summary: `Corrective action → ${input.status}`,
  });
}

/** Independent verification (§17): the verifier must not be the owner. */
export async function verifyCorrectiveAction(
  actor: CurrentEmployee,
  id: string,
): Promise<void> {
  assertCan(actor, "corrective.verify");
  const record = await prisma.correctiveAction.findUnique({ where: { id } });
  if (!record) throw new ExerciseError("Corrective action not found.");
  if (record.status !== "READY_FOR_VERIFICATION") {
    throw new ExerciseError("Only an action ready for verification can be verified.");
  }
  if (record.ownerId && record.ownerId === actor.id) {
    throw new ExerciseError("The owner cannot verify their own corrective action.");
  }
  await prisma.correctiveAction.update({
    where: { id },
    data: { status: "VERIFIED", verifiedById: actor.id, verifiedAt: new Date() },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "CORRECTIVE_ACTION_VERIFIED",
    entityType: "CorrectiveAction",
    entityId: id,
    summary: "Corrective action independently verified",
  });
}

/** Accept-risk (§17): OPERATIONS_MANAGER only, rationale required, never silent. */
export async function acceptCorrectiveActionRisk(
  actor: CurrentEmployee,
  id: string,
  rationale: string,
): Promise<void> {
  assertCan(actor, "corrective.manage");
  if (actor.role !== "OPERATIONS_MANAGER") {
    throw new ExerciseError("Only an OPERATIONS_MANAGER may accept residual risk.");
  }
  if (!rationale?.trim()) {
    throw new ExerciseError("A rationale is required to accept risk.");
  }
  const record = await prisma.correctiveAction.findUnique({ where: { id } });
  if (!record) throw new ExerciseError("Corrective action not found.");
  await prisma.correctiveAction.update({
    where: { id },
    data: {
      status: "ACCEPTED_RISK",
      acceptedRiskById: actor.id,
      acceptedRiskRationale: rationale.trim(),
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "CORRECTIVE_ACTION_RISK_ACCEPTED",
    entityType: "CorrectiveAction",
    entityId: id,
    summary: "Residual risk accepted with rationale",
  });
}

export async function listCorrectiveActions(actor: CurrentEmployee) {
  assertCan(actor, "corrective.view");
  return prisma.correctiveAction.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { owner: { select: { displayName: true } } },
  });
}

// ---------------- Pilot exercises (§16) ----------------

export async function createExercise(
  actor: CurrentEmployee,
  input: { type: string; title: string; expectedResult: string },
): Promise<string> {
  assertCan(actor, "exercise.manage");
  if (!input.title?.trim() || !input.expectedResult?.trim()) {
    throw new ExerciseError("Title and expected result are required.");
  }
  const created = await prisma.pilotExercise.create({
    data: {
      type: input.type as never,
      title: input.title.trim(),
      expectedResult: input.expectedResult.trim(),
      plannedById: actor.id,
      status: "PLANNED",
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "EXERCISE_PLANNED",
    entityType: "PilotExercise",
    entityId: created.id,
    summary: `Pilot exercise planned (${input.type})`,
  });
  return created.id;
}

export async function startExercise(actor: CurrentEmployee, id: string): Promise<void> {
  assertCan(actor, "exercise.manage");
  const record = await prisma.pilotExercise.findUnique({ where: { id } });
  if (!record) throw new ExerciseError("Exercise not found.");
  await prisma.pilotExercise.update({
    where: { id },
    data: { status: "IN_PROGRESS", executedById: actor.id, startedAt: new Date() },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "EXERCISE_STARTED",
    entityType: "PilotExercise",
    entityId: id,
    summary: "Pilot exercise started",
  });
}

/**
 * Record an exercise result. A FAILED or BLOCKED exercise requires a deviation
 * and creates a corrective action.
 */
export async function recordExerciseResult(
  actor: CurrentEmployee,
  id: string,
  input: {
    status: "PASSED" | "PASSED_WITH_OBSERVATIONS" | "FAILED" | "BLOCKED";
    actualResult: string;
    evidenceSummary?: string | null;
    deviation?: string | null;
  },
): Promise<void> {
  assertCan(actor, "exercise.manage");
  const record = await prisma.pilotExercise.findUnique({ where: { id } });
  if (!record) throw new ExerciseError("Exercise not found.");
  if (!input.actualResult?.trim()) {
    throw new ExerciseError("An actual result is required.");
  }
  const isFailure = input.status === "FAILED" || input.status === "BLOCKED";
  if (isFailure && !input.deviation?.trim()) {
    throw new ExerciseError("A deviation description is required for a failed or blocked exercise.");
  }

  let correctiveActionId: string | null = record.correctiveActionId;
  if (isFailure) {
    correctiveActionId = await createCorrectiveAction(actor, {
      sourceType: "PILOT_EXERCISE",
      sourceId: id,
      title: `Corrective action for exercise: ${record.title}`,
      description: input.deviation!.trim(),
      severity: input.status === "BLOCKED" ? "HIGH" : "MEDIUM",
    });
  }

  await prisma.pilotExercise.update({
    where: { id },
    data: {
      status: input.status,
      actualResult: input.actualResult.trim(),
      evidenceSummary: input.evidenceSummary?.trim() ?? null,
      deviation: input.deviation?.trim() ?? null,
      correctiveActionId,
      observedById: actor.id,
      completedAt: new Date(),
      recordVersion: { increment: 1 },
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "EXERCISE_RESULT_RECORDED",
    entityType: "PilotExercise",
    entityId: id,
    summary: `Pilot exercise result: ${input.status}`,
  });
}

/** Approve an exercise. The approver must not be the sole executor (§16). */
export async function approveExercise(actor: CurrentEmployee, id: string): Promise<void> {
  assertCan(actor, "exercise.approve");
  const record = await prisma.pilotExercise.findUnique({ where: { id } });
  if (!record) throw new ExerciseError("Exercise not found.");
  if (!record.completedAt) {
    throw new ExerciseError("Only a completed exercise can be approved.");
  }
  if (record.executedById && record.executedById === actor.id) {
    throw new ExerciseError("An employee cannot approve an exercise they executed.");
  }
  await prisma.pilotExercise.update({
    where: { id },
    data: { approvedById: actor.id, recordVersion: { increment: 1 } },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "EXERCISE_APPROVED",
    entityType: "PilotExercise",
    entityId: id,
    summary: "Pilot exercise independently approved",
  });
}

export async function listExercises(actor: CurrentEmployee) {
  assertCan(actor, "exercise.view");
  return prisma.pilotExercise.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
}
