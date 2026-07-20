import { prisma } from "../db";
import { audit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";
import { INCIDENT_COUNTER_ID, formatIncidentReference } from "../reference";

/**
 * P4-B security-event handling and internal incident management (§13/§14).
 * Internal use only; no external notification; no legal-breach determination.
 * Events and incidents can never be deleted through the application. Incident
 * closure requires lessons learned and an authorized approval. Security-event
 * detail payloads are already minimized (see recordSecurityEvent).
 */

export class SecurityServiceError extends Error {}

// ---------------- Security events (§13) ----------------

export async function listSecurityEvents(
  actor: CurrentEmployee,
  filter: { status?: string; severity?: string } = {},
) {
  assertCan(actor, "security.event.view");
  return prisma.securityEvent.findMany({
    where: {
      ...(filter.status ? { status: filter.status as never } : {}),
      ...(filter.severity ? { severity: filter.severity as never } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { displayName: true } } },
  });
}

export async function acknowledgeSecurityEvent(
  actor: CurrentEmployee,
  eventId: string,
): Promise<void> {
  assertCan(actor, "security.event.manage");
  const event = await prisma.securityEvent.findUnique({ where: { id: eventId } });
  if (!event) throw new SecurityServiceError("Security event not found.");
  await prisma.securityEvent.update({
    where: { id: eventId },
    data: { status: "ACKNOWLEDGED", acknowledgedById: actor.id, acknowledgedAt: new Date() },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "SECURITY_EVENT_ACKNOWLEDGED",
    entityType: "SecurityEvent",
    entityId: eventId,
    summary: "Security event acknowledged",
  });
}

export async function resolveSecurityEvent(
  actor: CurrentEmployee,
  eventId: string,
  input: { status: "RESOLVED" | "FALSE_POSITIVE"; resolution: string },
): Promise<void> {
  assertCan(actor, "security.event.manage");
  const event = await prisma.securityEvent.findUnique({ where: { id: eventId } });
  if (!event) throw new SecurityServiceError("Security event not found.");
  // Critical resolution requires a rationale.
  if (event.severity === "CRITICAL" && !input.resolution?.trim()) {
    throw new SecurityServiceError("A rationale is required to resolve a critical event.");
  }
  await prisma.securityEvent.update({
    where: { id: eventId },
    data: {
      status: input.status,
      resolution: input.resolution?.trim() || null,
      resolvedById: actor.id,
      resolvedAt: new Date(),
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "SECURITY_EVENT_RESOLVED",
    entityType: "SecurityEvent",
    entityId: eventId,
    summary: `Security event ${input.status.toLowerCase()}`,
  });
}

// ---------------- Incidents (§14) ----------------

const INCIDENT_TRANSITIONS: Record<string, string[]> = {
  OPEN: ["TRIAGE", "CLOSED"],
  TRIAGE: ["CONTAINMENT", "INVESTIGATION", "CLOSED"],
  CONTAINMENT: ["INVESTIGATION", "RECOVERY", "CLOSED"],
  INVESTIGATION: ["CONTAINMENT", "RECOVERY", "CLOSED"],
  RECOVERY: ["INVESTIGATION", "CLOSED"],
  CLOSED: [],
};

export async function createIncident(
  actor: CurrentEmployee,
  input: {
    title: string;
    category: string;
    severity: string;
    summary: string;
    affectedAreas?: string | null;
  },
): Promise<{ id: string; reference: string }> {
  assertCan(actor, "incident.manage");
  if (!input.title?.trim() || !input.summary?.trim()) {
    throw new SecurityServiceError("Title and summary are required.");
  }
  const year = new Date().getFullYear();
  return prisma.$transaction(async (tx) => {
    const counter = await tx.counter.upsert({
      where: { id: INCIDENT_COUNTER_ID },
      create: { id: INCIDENT_COUNTER_ID, value: 1 },
      update: { value: { increment: 1 } },
    });
    const reference = formatIncidentReference(year, counter.value);
    const incident = await tx.securityIncident.create({
      data: {
        internalReference: reference,
        title: input.title.trim(),
        category: input.category as never,
        severity: input.severity as never,
        summary: input.summary.trim(),
        affectedAreas: input.affectedAreas?.trim() || null,
        detectedById: actor.id,
        ownerId: actor.id,
        status: "OPEN",
      },
      select: { id: true },
    });
    const { recordAudit } = await import("../audit");
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "INCIDENT_OPENED",
      entityType: "SecurityIncident",
      entityId: incident.id,
      summary: `Incident ${reference} opened (${input.severity})`,
    });
    return { id: incident.id, reference };
  });
}

export async function updateIncidentFields(
  actor: CurrentEmployee,
  incidentId: string,
  input: {
    version: number;
    affectedAreas?: string | null;
    containmentActions?: string | null;
    evidenceNotes?: string | null;
    recoveryActions?: string | null;
  },
): Promise<void> {
  assertCan(actor, "incident.manage");
  const incident = await prisma.securityIncident.findUnique({ where: { id: incidentId } });
  if (!incident) throw new SecurityServiceError("Incident not found.");
  if (incident.recordVersion !== input.version) {
    throw new SecurityServiceError("CONFLICT");
  }
  await prisma.securityIncident.update({
    where: { id: incidentId },
    data: {
      affectedAreas: input.affectedAreas ?? incident.affectedAreas,
      containmentActions: input.containmentActions ?? incident.containmentActions,
      evidenceNotes: input.evidenceNotes ?? incident.evidenceNotes,
      recoveryActions: input.recoveryActions ?? incident.recoveryActions,
      recordVersion: { increment: 1 },
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "INCIDENT_UPDATED",
    entityType: "SecurityIncident",
    entityId: incidentId,
    summary: "Incident fields updated",
  });
}

export async function transitionIncident(
  actor: CurrentEmployee,
  incidentId: string,
  toStatus: string,
): Promise<void> {
  assertCan(actor, "incident.manage");
  const incident = await prisma.securityIncident.findUnique({ where: { id: incidentId } });
  if (!incident) throw new SecurityServiceError("Incident not found.");
  if (toStatus === "CLOSED") {
    throw new SecurityServiceError("Use closeIncident to close an incident.");
  }
  const allowed = INCIDENT_TRANSITIONS[incident.status] ?? [];
  if (!allowed.includes(toStatus)) {
    throw new SecurityServiceError(`Invalid transition ${incident.status} → ${toStatus}.`);
  }
  await prisma.securityIncident.update({
    where: { id: incidentId },
    data: { status: toStatus as never, recordVersion: { increment: 1 } },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "INCIDENT_TRANSITIONED",
    entityType: "SecurityIncident",
    entityId: incidentId,
    summary: `Incident moved ${incident.status} → ${toStatus}`,
  });
}

/**
 * Close an incident. Requires lessons learned and records the approving
 * closer. Step-up reauthentication for a critical incident closure is enforced
 * at the action layer.
 */
export async function closeIncident(
  actor: CurrentEmployee,
  incidentId: string,
  input: { lessonsLearned: string; recoveryActions?: string | null },
): Promise<void> {
  assertCan(actor, "incident.manage");
  const incident = await prisma.securityIncident.findUnique({ where: { id: incidentId } });
  if (!incident) throw new SecurityServiceError("Incident not found.");
  if (incident.status === "CLOSED") {
    throw new SecurityServiceError("Incident is already closed.");
  }
  if (!input.lessonsLearned?.trim()) {
    throw new SecurityServiceError("Lessons learned are required to close an incident.");
  }
  await prisma.securityIncident.update({
    where: { id: incidentId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
      approvedClosureById: actor.id,
      lessonsLearned: input.lessonsLearned.trim(),
      recoveryActions: input.recoveryActions ?? incident.recoveryActions,
      recordVersion: { increment: 1 },
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "INCIDENT_CLOSED",
    entityType: "SecurityIncident",
    entityId: incidentId,
    summary: `Incident ${incident.internalReference} closed with lessons learned`,
  });
}
