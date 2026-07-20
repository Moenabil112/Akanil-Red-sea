import { prisma } from "../db";
import { assertCan, type CurrentEmployee } from "../authz";

/**
 * P4-C consolidated internal work queue (§15). Read-only counts across the
 * open work items. There is NO external notification service — nothing here
 * sends email, SMS, push or any external reminder. Counts are computed on demand.
 */

export interface WorkQueueSummary {
  newCases: number;
  unassignedCases: number;
  qualificationPending: number;
  specialistReviewsPending: number;
  openInformationGaps: number;
  meetingRecordsIncomplete: number;
  decisionsAwaitingApproval: number;
  openCommitments: number;
  overdueCommitments: number;
  overdueAccessReviews: number;
  openSecurityEvents: number;
  openIncidents: number;
  failedExercises: number;
  openCorrectiveActions: number;
  openDataQualityFindings: number;
  proceduresAwaitingAcknowledgement: number;
  authorizationsNearingExpiry: number;
}

export async function getWorkQueueSummary(actor: CurrentEmployee): Promise<WorkQueueSummary> {
  assertCan(actor, "view.dashboard");
  const now = new Date();
  const soon = new Date(now.getTime() + 7 * 86_400_000);
  const [
    newCases, unassignedCases, qualificationPending, specialistReviewsPending, openInformationGaps,
    meetingRecordsIncomplete, decisionsAwaitingApproval, openCommitments, overdueCommitments,
    overdueAccessReviews, openSecurityEvents, openIncidents, failedExercises, openCorrectiveActions,
    openDataQualityFindings, effectiveAckProcedures, authorizationsNearingExpiry,
  ] = await Promise.all([
    prisma.case.count({ where: { status: "NEW" } }),
    prisma.case.count({ where: { status: { not: "CLOSED" }, currentOwnerId: null } }),
    prisma.case.count({ where: { qualificationStatus: "PENDING", status: { notIn: ["NEW", "CLOSED"] } } }),
    prisma.qualificationReview.count({ where: { finalOutcome: "PENDING" } }),
    prisma.informationGap.count({ where: { status: "OPEN" } }),
    prisma.meetingRecord.count({ where: { proposedNextSteps: null } }),
    prisma.decision.count({ where: { status: "PROPOSED" } }),
    prisma.commitment.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.commitment.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] }, dueDate: { lt: now } } }),
    prisma.employee.count({ where: { status: "ACTIVE", accessReviewDueAt: { lt: now } } }),
    prisma.securityEvent.count({ where: { status: "OPEN" } }),
    prisma.securityIncident.count({ where: { status: { not: "CLOSED" } } }),
    prisma.pilotExercise.count({ where: { status: { in: ["FAILED", "BLOCKED"] } } }),
    prisma.correctiveAction.count({ where: { status: { in: ["OPEN", "IN_PROGRESS", "READY_FOR_VERIFICATION"] } } }),
    prisma.dataQualityFinding.count({ where: { status: { in: ["OPEN", "UNDER_REVIEW"] } } }),
    prisma.operatingProcedure.count({ where: { status: "EFFECTIVE", requiresAcknowledgement: true } }),
    prisma.limitedOperationsAuthorization.count({ where: { status: "ACTIVE", validUntil: { lt: soon, gt: now } } }),
  ]);

  // Procedures awaiting acknowledgement: effective ack-required procedures with
  // at least one active pilot member missing the acknowledgement.
  let proceduresAwaitingAcknowledgement = 0;
  if (effectiveAckProcedures > 0) {
    const [procs, members] = await Promise.all([
      prisma.operatingProcedure.findMany({ where: { status: "EFFECTIVE", requiresAcknowledgement: true }, select: { procedureKey: true, version: true } }),
      prisma.operationalPilotMember.findMany({ where: { status: "ACTIVE" }, select: { employeeId: true } }),
    ]);
    for (const p of procs) {
      for (const m of members) {
        const ack = await prisma.procedureAcknowledgement.count({
          where: { employeeId: m.employeeId, procedureKey: p.procedureKey, procedureVersion: p.version },
        });
        if (ack === 0) { proceduresAwaitingAcknowledgement += 1; break; }
      }
    }
  }

  return {
    newCases, unassignedCases, qualificationPending, specialistReviewsPending, openInformationGaps,
    meetingRecordsIncomplete, decisionsAwaitingApproval, openCommitments, overdueCommitments,
    overdueAccessReviews, openSecurityEvents, openIncidents, failedExercises, openCorrectiveActions,
    openDataQualityFindings, proceduresAwaitingAcknowledgement, authorizationsNearingExpiry,
  };
}
