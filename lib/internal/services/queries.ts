import { prisma } from "../db";
import { can } from "../rbac";
import type { CurrentEmployee } from "../authz";
import type { Prisma } from "@/lib/generated/prisma";

/**
 * Authorized read queries (P4-A §13). Access scope is applied server-side:
 * roles without `case.viewAll` see only cases they own or are assigned to.
 * Confidential note bodies are never included in global search.
 */

/** Where-clause restricting a role to the cases it may see. */
async function caseScope(
  employee: CurrentEmployee,
): Promise<Prisma.CaseWhereInput> {
  if (can(employee.role, "case.viewAll")) return {};
  return {
    OR: [
      { currentOwnerId: employee.id },
      { assignments: { some: { employeeId: employee.id, endedAt: null } } },
    ],
  };
}

export interface CaseFilters {
  status?: string;
  priority?: string;
  classification?: string;
  requestType?: string;
  platform?: string;
  valueChain?: string;
  forumTrack?: string;
  organizationId?: string;
  ownerId?: string;
  createdFrom?: Date;
  createdTo?: Date;
  search?: string;
}

export async function listCases(employee: CurrentEmployee, filters: CaseFilters) {
  const scope = await caseScope(employee);
  const where: Prisma.CaseWhereInput = { AND: [scope] };
  const and = where.AND as Prisma.CaseWhereInput[];

  if (filters.status) and.push({ status: filters.status as never });
  if (filters.priority) and.push({ priority: filters.priority as never });
  if (filters.classification) and.push({ classification: filters.classification as never });
  if (filters.requestType) and.push({ requestType: filters.requestType });
  if (filters.platform) and.push({ primaryPlatformId: filters.platform });
  if (filters.valueChain) and.push({ primaryValueChainId: filters.valueChain });
  if (filters.forumTrack) and.push({ forumSectorTrackId: filters.forumTrack });
  if (filters.organizationId) and.push({ organizationId: filters.organizationId });
  if (filters.ownerId) and.push({ currentOwnerId: filters.ownerId });
  if (filters.createdFrom) and.push({ createdAt: { gte: filters.createdFrom } });
  if (filters.createdTo) and.push({ createdAt: { lte: filters.createdTo } });

  // Safe search across reference, title and organization working name only —
  // never confidential note bodies (§13.2).
  const term = filters.search?.trim();
  if (term) {
    and.push({
      OR: [
        { internalReference: { contains: term, mode: "insensitive" } },
        { title: { contains: term, mode: "insensitive" } },
        { organization: { workingName: { contains: term, mode: "insensitive" } } },
      ],
    });
  }

  return prisma.case.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      internalReference: true,
      title: true,
      status: true,
      priority: true,
      classification: true,
      requestType: true,
      updatedAt: true,
      organization: { select: { workingName: true } },
      currentOwner: { select: { displayName: true } },
    },
  });
}

export async function getCaseDetail(caseId: string) {
  return prisma.case.findUnique({
    where: { id: caseId },
    include: {
      organization: true,
      primaryContact: true,
      currentOwner: { select: { id: true, displayName: true, role: true } },
      createdBy: { select: { displayName: true } },
      assignments: {
        where: { endedAt: null },
        include: { employee: { select: { displayName: true, role: true } } },
      },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { displayName: true } } } },
      qualificationReviews: { orderBy: { createdAt: "desc" } },
      informationGaps: { orderBy: { createdAt: "desc" } },
      evidenceReferences: { orderBy: { createdAt: "desc" } },
      meetingPreparations: { orderBy: { createdAt: "desc" } },
      meetingRecords: { orderBy: { createdAt: "desc" } },
      decisions: { orderBy: { proposedAt: "desc" } },
      commitments: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getDashboard(employee: CurrentEmployee) {
  const scope = await caseScope(employee);
  const [myCases, newCases, awaitingQualification, openGaps, decisionsPending, commitmentsDue, recentlyUpdated] =
    await Promise.all([
      prisma.case.count({ where: { AND: [scope, { currentOwnerId: employee.id }, { status: { not: "CLOSED" } }] } }),
      prisma.case.count({ where: { AND: [scope, { status: "NEW" }] } }),
      prisma.case.count({ where: { AND: [scope, { qualificationStatus: "PENDING" }, { status: { in: ["TRIAGE", "INFORMATION_REQUIRED", "UNDER_REVIEW"] } }] } }),
      prisma.informationGap.count({ where: { status: "OPEN", case: scope } }),
      prisma.decision.count({ where: { status: "PROPOSED", case: scope } }),
      prisma.commitment.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] }, dueDate: { lte: new Date() }, case: scope } }),
      prisma.case.findMany({ where: scope, orderBy: { updatedAt: "desc" }, take: 8, select: { id: true, internalReference: true, title: true, status: true, updatedAt: true } }),
    ]);
  return { myCases, newCases, awaitingQualification, openGaps, decisionsPending, commitmentsDue, recentlyUpdated };
}

export async function getWorkQueue(employee: CurrentEmployee) {
  const [assignedCases, myGaps, myCommitments, overdueCommitments, pendingDecisions] = await Promise.all([
    prisma.case.findMany({
      where: { OR: [{ currentOwnerId: employee.id }, { assignments: { some: { employeeId: employee.id, endedAt: null } } }], status: { not: "CLOSED" } },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: { id: true, internalReference: true, title: true, status: true, priority: true },
    }),
    prisma.informationGap.findMany({ where: { internalOwnerId: employee.id, status: { in: ["OPEN", "UNDER_REVIEW"] } }, take: 50, select: { id: true, title: true, status: true, dueDate: true, caseId: true } }),
    prisma.commitment.findMany({ where: { internalOwnerId: employee.id, status: { in: ["OPEN", "IN_PROGRESS", "BLOCKED"] } }, take: 50, select: { id: true, title: true, status: true, dueDate: true, caseId: true } }),
    prisma.commitment.findMany({ where: { internalOwnerId: employee.id, status: { in: ["OPEN", "IN_PROGRESS"] }, dueDate: { lte: new Date() } }, take: 50, select: { id: true, title: true, dueDate: true, caseId: true } }),
    can(employee.role, "decision.approve")
      ? prisma.decision.findMany({ where: { status: "PROPOSED" }, take: 50, orderBy: { proposedAt: "asc" }, select: { id: true, title: true, decisionType: true, caseId: true } })
      : Promise.resolve([]),
  ]);
  return { assignedCases, myGaps, myCommitments, overdueCommitments, pendingDecisions };
}

export interface AuditFilters {
  actorEmployeeId?: string;
  action?: string;
  entityType?: string;
  caseId?: string;
  from?: Date;
  to?: Date;
}

export async function listAuditEvents(filters: AuditFilters) {
  const where: Prisma.AuditEventWhereInput = {};
  if (filters.actorEmployeeId) where.actorEmployeeId = filters.actorEmployeeId;
  if (filters.action) where.action = filters.action;
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.caseId) where.caseId = filters.caseId;
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = filters.from;
    if (filters.to) where.createdAt.lte = filters.to;
  }
  return prisma.auditEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { displayName: true, email: true } } },
  });
}

export async function listOrganizations(search?: string) {
  const term = search?.trim();
  return prisma.organization.findMany({
    where: term ? { workingName: { contains: term, mode: "insensitive" } } : {},
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: { id: true, workingName: true, country: true, verificationStatus: true, _count: { select: { cases: true } } },
  });
}

export async function getOrganizationDetail(organizationId: string) {
  return prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      contacts: { orderBy: { createdAt: "asc" } },
      cases: { orderBy: { updatedAt: "desc" }, select: { id: true, internalReference: true, title: true, status: true } },
      createdBy: { select: { displayName: true } },
    },
  });
}

/** Active employees for owner/reviewer selectors. */
export async function listActiveEmployees() {
  return prisma.employee.findMany({
    where: { status: "ACTIVE" },
    orderBy: { displayName: "asc" },
    select: { id: true, displayName: true, role: true },
  });
}
