import { prisma } from "../db";
import { assertCan, type CurrentEmployee } from "../authz";

/**
 * P4-C lightweight operational reporting (§16). Restrained internal summary —
 * simple counts and status summaries only. NO employee performance scores, no
 * productivity rankings, no public/investor metrics, no financial forecasts, no
 * BI dashboards, no charts, no analytics, no CSV/bulk export.
 */

function toCounts(rows: { key: string | null; _count: number }[]): { key: string; count: number }[] {
  return rows.map((r) => ({ key: r.key ?? "—", count: r._count })).sort((a, b) => b.count - a.count);
}

export async function getOperationsSummary(actor: CurrentEmployee) {
  assertCan(actor, "operations.pilot.view");
  const now = new Date();

  const [
    byStatus, byOwner, byRequestType, byPlatform, byChain, byTrack,
    unassigned, openGaps, pendingDecisions, openCommitments, overdueCommitments,
    completedScenarios, openFindings, openCorrective, overdueReviews, restoreSignal, auditSignal,
  ] = await Promise.all([
    prisma.case.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.case.groupBy({ by: ["currentOwnerId"], _count: { _all: true }, where: { status: { not: "CLOSED" } } }),
    prisma.case.groupBy({ by: ["requestType"], _count: { _all: true } }),
    prisma.case.groupBy({ by: ["primaryPlatformId"], _count: { _all: true } }),
    prisma.case.groupBy({ by: ["primaryValueChainId"], _count: { _all: true } }),
    prisma.case.groupBy({ by: ["forumSectorTrackId"], _count: { _all: true } }),
    prisma.case.count({ where: { status: { not: "CLOSED" }, currentOwnerId: null } }),
    prisma.informationGap.count({ where: { status: "OPEN" } }),
    prisma.decision.count({ where: { status: "PROPOSED" } }),
    prisma.commitment.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.commitment.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] }, dueDate: { lt: now } } }),
    prisma.operationalPilotCase.count({ where: { status: "COMPLETED" } }),
    prisma.dataQualityFinding.count({ where: { status: { in: ["OPEN", "UNDER_REVIEW"] } } }),
    prisma.correctiveAction.count({ where: { status: { in: ["OPEN", "IN_PROGRESS", "READY_FOR_VERIFICATION"] } } }),
    prisma.employee.count({ where: { status: "ACTIVE", accessReviewDueAt: { lt: now } } }),
    prisma.readinessSignal.findUnique({ where: { id: "last-restore-test" } }),
    prisma.readinessSignal.findUnique({ where: { id: "backup-recency" } }),
  ]);

  // Resolve owner display names for the by-owner summary.
  const ownerIds = byOwner.map((o) => o.currentOwnerId).filter((x): x is string => Boolean(x));
  const owners = ownerIds.length
    ? await prisma.employee.findMany({ where: { id: { in: ownerIds } }, select: { id: true, displayName: true } })
    : [];
  const ownerName = new Map(owners.map((o) => [o.id, o.displayName]));

  return {
    casesByStatus: toCounts(byStatus.map((r) => ({ key: r.status, _count: r._count._all }))),
    casesByOwner: toCounts(byOwner.map((r) => ({ key: r.currentOwnerId ? (ownerName.get(r.currentOwnerId) ?? "—") : "unassigned", _count: r._count._all }))),
    casesByRequestType: toCounts(byRequestType.map((r) => ({ key: r.requestType, _count: r._count._all }))),
    casesByPlatform: toCounts(byPlatform.map((r) => ({ key: r.primaryPlatformId, _count: r._count._all }))),
    casesByChain: toCounts(byChain.map((r) => ({ key: r.primaryValueChainId, _count: r._count._all }))),
    casesByTrack: toCounts(byTrack.map((r) => ({ key: r.forumSectorTrackId, _count: r._count._all }))),
    unassignedCases: unassigned,
    openInformationGaps: openGaps,
    pendingDecisions,
    openCommitments,
    overdueCommitments,
    completedPilotScenarios: completedScenarios,
    openDataQualityFindings: openFindings,
    openCorrectiveActions: openCorrective,
    overdueAccessReviews: overdueReviews,
    latestBackup: auditSignal?.detail ?? "not recorded",
    latestRestore: restoreSignal ? `${restoreSignal.status}${restoreSignal.detail ? " — " + restoreSignal.detail : ""}` : "not recorded",
  };
}
