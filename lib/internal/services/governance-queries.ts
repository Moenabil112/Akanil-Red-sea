import { prisma } from "../db";
import { assertCan, type CurrentEmployee } from "../authz";

/**
 * P4-B read queries for the governance and security views. Every query
 * enforces the appropriate view permission (default-deny). Reads never expose
 * secrets, token hashes, IP addresses or confidential content.
 */

export async function listPilotAccess(actor: CurrentEmployee) {
  assertCan(actor, "pilot.view");
  return prisma.pilotAccess.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      employee: { select: { displayName: true, email: true, role: true } },
      requestedBy: { select: { displayName: true } },
      approvedBy: { select: { displayName: true } },
    },
  });
}

export async function listAccessChanges(actor: CurrentEmployee) {
  assertCan(actor, "access.change.request");
  return prisma.accessChangeRequest.findMany({
    orderBy: { requestedAt: "desc" },
    take: 200,
    include: {
      targetEmployee: { select: { displayName: true, email: true } },
      requestedBy: { select: { displayName: true } },
      approvedBy: { select: { displayName: true } },
    },
  });
}

export async function listAccessReviews(actor: CurrentEmployee) {
  assertCan(actor, "access.review.conduct");
  return prisma.accessReview.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      employee: { select: { displayName: true, email: true } },
      reviewer: { select: { displayName: true } },
    },
  });
}

/** Employees list for governance forms (no hashes, minimal fields). */
export async function listEmployeesForGovernance(actor: CurrentEmployee) {
  assertCan(actor, "pilot.view");
  return prisma.employee.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      status: true,
      lifecycleStage: true,
      accessReviewDueAt: true,
      accessPurpose: true,
    },
  });
}

/** All active sessions across employees, privacy-minimized (session admin). */
export async function listAllActiveSessions(actor: CurrentEmployee) {
  assertCan(actor, "session.admin");
  const now = new Date();
  return prisma.session.findMany({
    where: { revokedAt: null, absoluteExpiry: { gt: now }, idleExpiry: { gt: now } },
    orderBy: { lastActivityAt: "desc" },
    take: 200,
    select: {
      id: true,
      createdAt: true,
      lastActivityAt: true,
      absoluteExpiry: true,
      deviceLabel: true,
      employee: { select: { displayName: true, email: true } },
    },
  });
}

export async function listIncidents(actor: CurrentEmployee) {
  assertCan(actor, "incident.view");
  return prisma.securityIncident.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { owner: { select: { displayName: true } } },
  });
}

export async function getIncident(actor: CurrentEmployee, id: string) {
  assertCan(actor, "incident.view");
  return prisma.securityIncident.findUnique({
    where: { id },
    include: { owner: { select: { displayName: true } } },
  });
}
