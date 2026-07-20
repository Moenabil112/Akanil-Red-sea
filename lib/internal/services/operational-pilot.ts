import { prisma } from "../db";
import { audit, recordAudit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";
import { PILOT_RUN_COUNTER_ID, formatPilotRunReference } from "../reference";
import { isPilotAccessActive } from "../pilot";
import { revokeAllSessions } from "../session-store";

/**
 * P4-C controlled operational pilot (§9/§10/§11). Proportionate to 1–6
 * employees and 1–10 cases; only one ACTIVE run initially. Server-enforced
 * status transitions; executor and final approver must differ; completion
 * requires an observations summary; no record is ever deleted; every action is
 * audited. Membership requires an authorized employee with valid PilotAccess
 * and complete required procedure acknowledgements; no self-approval, no shared
 * accounts. Pilot cases must be SYNTHETIC or approved DE_IDENTIFIED.
 */

export class OperationalPilotError extends Error {}

const RUN_TRANSITIONS: Record<string, string[]> = {
  PLANNED: ["READY", "CANCELLED"],
  READY: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["PAUSED", "COMPLETED"],
  PAUSED: ["ACTIVE", "COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function parseCats(csv: string): string[] {
  return csv.split(",").map((s) => s.trim()).filter(Boolean);
}

// ---------------- Pilot runs (§9) ----------------

export async function createPilotRun(
  actor: CurrentEmployee,
  input: {
    title: string;
    objective: string;
    maximumEmployees: number;
    maximumCases: number;
    allowedDataCategories: string[];
    plannedStart?: Date | null;
    plannedEnd?: Date | null;
  },
): Promise<{ id: string; reference: string }> {
  assertCan(actor, "operations.pilot.create");
  if (!input.title?.trim() || !input.objective?.trim()) {
    throw new OperationalPilotError("Title and objective are required.");
  }
  if (input.maximumEmployees < 1 || input.maximumEmployees > 6) {
    throw new OperationalPilotError("maximumEmployees must be between 1 and 6.");
  }
  if (input.maximumCases < 1 || input.maximumCases > 10) {
    throw new OperationalPilotError("maximumCases must be between 1 and 10 for the first controlled run.");
  }
  const cats = input.allowedDataCategories.filter((c) => c === "SYNTHETIC" || c === "DE_IDENTIFIED");
  if (cats.length === 0) throw new OperationalPilotError("At least one allowed data category is required.");

  const year = new Date().getFullYear();
  return prisma.$transaction(async (tx) => {
    const counter = await tx.counter.upsert({
      where: { id: PILOT_RUN_COUNTER_ID },
      create: { id: PILOT_RUN_COUNTER_ID, value: 1 },
      update: { value: { increment: 1 } },
    });
    const reference = formatPilotRunReference(year, counter.value);
    const run = await tx.operationalPilotRun.create({
      data: {
        internalReference: reference,
        title: input.title.trim(),
        objective: input.objective.trim(),
        maximumEmployees: input.maximumEmployees,
        maximumCases: input.maximumCases,
        allowedDataCategories: cats.join(","),
        plannedStart: input.plannedStart ?? null,
        plannedEnd: input.plannedEnd ?? null,
        ownerId: actor.id,
        status: "PLANNED",
      },
      select: { id: true },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "PILOT_RUN_CREATED",
      entityType: "OperationalPilotRun",
      entityId: run.id,
      summary: `Operational pilot run ${reference} created`,
    });
    return { id: run.id, reference };
  });
}

export async function transitionPilotRun(
  actor: CurrentEmployee,
  runId: string,
  toStatus: string,
): Promise<void> {
  assertCan(actor, "operations.pilot.manage");
  const run = await prisma.operationalPilotRun.findUnique({ where: { id: runId } });
  if (!run) throw new OperationalPilotError("Pilot run not found.");
  if (toStatus === "COMPLETED") {
    throw new OperationalPilotError("Use completePilotRun to complete a run.");
  }
  const allowed = RUN_TRANSITIONS[run.status] ?? [];
  if (!allowed.includes(toStatus)) {
    throw new OperationalPilotError(`Invalid transition ${run.status} → ${toStatus}.`);
  }
  // Only one ACTIVE run is permitted initially.
  if (toStatus === "ACTIVE") {
    const otherActive = await prisma.operationalPilotRun.count({
      where: { status: "ACTIVE", id: { not: runId } },
    });
    if (otherActive > 0) throw new OperationalPilotError("Another pilot run is already ACTIVE.");
    const approvedMembers = await prisma.operationalPilotMember.count({
      where: { pilotRunId: runId, status: { in: ["APPROVED", "ACTIVE"] } },
    });
    if (approvedMembers === 0) throw new OperationalPilotError("An ACTIVE run requires approved cohort access.");
  }
  await prisma.operationalPilotRun.update({
    where: { id: runId },
    data: {
      status: toStatus as never,
      ...(toStatus === "ACTIVE" ? { actualStart: new Date() } : {}),
      recordVersion: { increment: 1 },
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_RUN_TRANSITIONED",
    entityType: "OperationalPilotRun",
    entityId: runId,
    summary: `Pilot run moved ${run.status} → ${toStatus}`,
  });
}

export async function completePilotRun(
  actor: CurrentEmployee,
  runId: string,
  input: { observationsSummary: string; finalOutcome: string; readinessGateId?: string | null },
): Promise<void> {
  assertCan(actor, "operations.pilot.complete");
  const run = await prisma.operationalPilotRun.findUnique({ where: { id: runId } });
  if (!run) throw new OperationalPilotError("Pilot run not found.");
  if (run.status !== "ACTIVE" && run.status !== "PAUSED") {
    throw new OperationalPilotError("Only an active or paused run can be completed.");
  }
  if (!input.observationsSummary?.trim()) {
    throw new OperationalPilotError("An observations summary is required to complete a run.");
  }
  // Executor (owner) and final approver must differ.
  if (actor.id === run.ownerId) {
    throw new OperationalPilotError("The run owner cannot be the final approver of completion.");
  }
  const validOutcomes = new Set([
    "CONTINUE_PILOT", "CONTINUE_WITH_CONDITIONS", "READY_FOR_LIMITED_INTERNAL_OPERATIONS",
    "EXTEND_PILOT", "SUSPEND", "NOT_READY",
  ]);
  if (!validOutcomes.has(input.finalOutcome)) throw new OperationalPilotError("Unknown final outcome.");

  await prisma.operationalPilotRun.update({
    where: { id: runId },
    data: {
      status: "COMPLETED",
      actualEnd: new Date(),
      approvedById: actor.id,
      observationsSummary: input.observationsSummary.trim(),
      finalOutcome: input.finalOutcome as never,
      readinessGateId: input.readinessGateId ?? run.readinessGateId,
      recordVersion: { increment: 1 },
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_RUN_COMPLETED",
    entityType: "OperationalPilotRun",
    entityId: runId,
    summary: `Pilot run completed (${input.finalOutcome})`,
  });
}

// ---------------- Membership (§10) ----------------

export async function addPilotMember(
  actor: CurrentEmployee,
  runId: string,
  input: { employeeId: string; operationalRole: string },
): Promise<string> {
  assertCan(actor, "operations.pilot.manage");
  const run = await prisma.operationalPilotRun.findUnique({ where: { id: runId } });
  if (!run) throw new OperationalPilotError("Pilot run not found.");
  const employee = await prisma.employee.findUnique({ where: { id: input.employeeId } });
  if (!employee || employee.status !== "ACTIVE" || employee.lifecycleStage !== "ACTIVE") {
    throw new OperationalPilotError("The employee must be an active Akanil employee.");
  }
  const created = await prisma.operationalPilotMember.create({
    data: {
      pilotRunId: runId,
      employeeId: input.employeeId,
      operationalRole: input.operationalRole.trim() || employee.role,
      addedById: actor.id,
      status: "PROPOSED",
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_MEMBER_PROPOSED",
    entityType: "OperationalPilotMember",
    entityId: created.id,
    summary: `Pilot member proposed for run ${run.internalReference}`,
  });
  return created.id;
}

/**
 * Approve and activate a member. Enforces: no self-approval; valid PilotAccess;
 * complete required procedure acknowledgements; the run's maximum-employee
 * limit.
 */
export async function activatePilotMember(actor: CurrentEmployee, memberId: string): Promise<void> {
  assertCan(actor, "operations.pilot.manage");
  const member = await prisma.operationalPilotMember.findUnique({ where: { id: memberId } });
  if (!member) throw new OperationalPilotError("Member not found.");
  if (actor.id === member.employeeId) throw new OperationalPilotError("An employee cannot approve their own membership.");
  if (actor.id === member.addedById) throw new OperationalPilotError("The proposer cannot approve the membership.");

  const [run, pilotAccess] = await Promise.all([
    prisma.operationalPilotRun.findUnique({ where: { id: member.pilotRunId } }),
    prisma.pilotAccess.findFirst({ where: { employeeId: member.employeeId }, orderBy: { createdAt: "desc" } }),
  ]);
  if (!run) throw new OperationalPilotError("Pilot run not found.");
  if (!isPilotAccessActive(pilotAccess)) {
    throw new OperationalPilotError("The employee must hold active PilotAccess.");
  }
  // Required procedure acknowledgements must be complete for effective procedures.
  const effective = await prisma.operatingProcedure.findMany({
    where: { status: "EFFECTIVE", requiresAcknowledgement: true },
    select: { procedureKey: true, version: true },
  });
  for (const p of effective) {
    const ack = await prisma.procedureAcknowledgement.count({
      where: { employeeId: member.employeeId, procedureKey: p.procedureKey, procedureVersion: p.version },
    });
    if (ack === 0) {
      throw new OperationalPilotError(`Missing acknowledgement for ${p.procedureKey} v${p.version}.`);
    }
  }
  const activeCount = await prisma.operationalPilotMember.count({
    where: { pilotRunId: member.pilotRunId, status: "ACTIVE" },
  });
  if (activeCount >= run.maximumEmployees) {
    throw new OperationalPilotError("The run's maximum-employee limit would be exceeded.");
  }
  await prisma.operationalPilotMember.update({
    where: { id: memberId },
    data: { status: "ACTIVE", approvedById: actor.id, startsAt: new Date() },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_MEMBER_ACTIVATED",
    entityType: "OperationalPilotMember",
    entityId: memberId,
    summary: "Pilot member activated",
  });
}

export async function removePilotMember(
  actor: CurrentEmployee,
  memberId: string,
  revokeSessions = false,
): Promise<void> {
  assertCan(actor, "operations.pilot.manage");
  const member = await prisma.operationalPilotMember.findUnique({ where: { id: memberId } });
  if (!member) throw new OperationalPilotError("Member not found.");
  await prisma.operationalPilotMember.update({
    where: { id: memberId },
    data: { status: "REMOVED", removedAt: new Date() },
  });
  if (revokeSessions) await revokeAllSessions(member.employeeId);
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_MEMBER_REMOVED",
    entityType: "OperationalPilotMember",
    entityId: memberId,
    summary: `Pilot member removed${revokeSessions ? " (sessions revoked)" : ""}`,
  });
}

// ---------------- Pilot case coverage (§11) ----------------

export async function addPilotCase(
  actor: CurrentEmployee,
  runId: string,
  input: { caseId: string; scenarioType: string; dataCategory: string; expectedPath?: string },
): Promise<string> {
  assertCan(actor, "operations.pilot.manage");
  const run = await prisma.operationalPilotRun.findUnique({ where: { id: runId } });
  if (!run) throw new OperationalPilotError("Pilot run not found.");
  if (input.dataCategory !== "SYNTHETIC" && input.dataCategory !== "DE_IDENTIFIED") {
    throw new OperationalPilotError("Pilot case data must be SYNTHETIC or approved DE_IDENTIFIED.");
  }
  if (!parseCats(run.allowedDataCategories).includes(input.dataCategory)) {
    throw new OperationalPilotError("This data category is not allowed by the pilot run.");
  }
  const kase = await prisma.case.findUnique({ where: { id: input.caseId } });
  if (!kase) throw new OperationalPilotError("Case not found.");
  const activeCases = await prisma.operationalPilotCase.count({
    where: { pilotRunId: runId, status: { in: ["SELECTED", "IN_PROGRESS", "COMPLETED"] } },
  });
  if (activeCases >= run.maximumCases) {
    throw new OperationalPilotError("The run's maximum-case limit would be exceeded.");
  }
  const created = await prisma.operationalPilotCase.create({
    data: {
      pilotRunId: runId,
      caseId: input.caseId,
      scenarioType: input.scenarioType as never,
      dataCategory: input.dataCategory as never,
      expectedPath: input.expectedPath?.trim() || null,
      includedById: actor.id,
      status: "SELECTED",
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_CASE_ADDED",
    entityType: "OperationalPilotCase",
    entityId: created.id,
    caseId: input.caseId,
    summary: `Case added to pilot run ${run.internalReference} (${input.scenarioType})`,
  });
  return created.id;
}

export async function removePilotCase(actor: CurrentEmployee, pilotCaseId: string): Promise<void> {
  assertCan(actor, "operations.pilot.manage");
  const row = await prisma.operationalPilotCase.findUnique({ where: { id: pilotCaseId } });
  if (!row) throw new OperationalPilotError("Pilot case not found.");
  // Removing a case from a run never deletes the case.
  await prisma.operationalPilotCase.update({ where: { id: pilotCaseId }, data: { status: "REMOVED" } });
  await audit({
    actorEmployeeId: actor.id,
    action: "PILOT_CASE_REMOVED",
    entityType: "OperationalPilotCase",
    entityId: pilotCaseId,
    caseId: row.caseId,
    summary: "Case removed from pilot run (case preserved)",
  });
}

// ---------------- Reads ----------------

export async function listPilotRuns(actor: CurrentEmployee) {
  assertCan(actor, "operations.pilot.view");
  return prisma.operationalPilotRun.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}

export async function getPilotRun(actor: CurrentEmployee, runId: string) {
  assertCan(actor, "operations.pilot.view");
  return prisma.operationalPilotRun.findUnique({
    where: { id: runId },
    include: { members: true, cases: true, observations: true },
  });
}
