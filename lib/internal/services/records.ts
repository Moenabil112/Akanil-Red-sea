import { prisma } from "../db";
import { recordAudit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";
import { ConcurrencyError } from "./cases";

/**
 * Case-attached operational records (P4-A §9.8–9.14): qualification reviews,
 * information gaps, evidence references, meeting preparations and records,
 * decisions and commitments. Every mutation is permission-checked and
 * audited. Approved decisions and held meeting records are never silently
 * edited — a superseding record is required.
 */

/* -------- Information gaps (§9.9) -------- */

export async function createGap(
  actor: CurrentEmployee,
  caseId: string,
  input: { category: string; title: string; description?: string; dueDate?: Date | null; internalOwnerId?: string | null },
): Promise<void> {
  assertCan(actor, "gap.manage");
  await prisma.$transaction(async (tx) => {
    const gap = await tx.informationGap.create({
      data: {
        caseId,
        category: input.category,
        title: input.title,
        description: input.description || null,
        dueDate: input.dueDate || null,
        internalOwnerId: input.internalOwnerId || null,
        createdById: actor.id,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "GAP_CREATED",
      entityType: "InformationGap",
      entityId: gap.id,
      caseId,
      summary: `Information gap opened: ${input.title}`,
    });
  });
}

export async function resolveGap(
  actor: CurrentEmployee,
  gapId: string,
  status: "RESOLVED" | "WAIVED",
  resolutionNote: string,
): Promise<void> {
  assertCan(actor, "gap.manage");
  await prisma.$transaction(async (tx) => {
    const gap = await tx.informationGap.update({
      where: { id: gapId },
      data: { status, resolutionNote, resolvedAt: new Date() },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "GAP_RESOLVED",
      entityType: "InformationGap",
      entityId: gapId,
      caseId: gap.caseId,
      summary: `Information gap ${status.toLowerCase()}`,
      changedFields: { status },
    });
  });
}

/* -------- Evidence references (metadata only, §9.10) -------- */

export async function createEvidenceReference(
  actor: CurrentEmployee,
  caseId: string,
  input: {
    title: string;
    evidenceType?: string;
    sourceOrganization?: string;
    locationNote?: string;
    classification?: string;
    notes?: string;
  },
): Promise<void> {
  assertCan(actor, "evidence.manage");
  await prisma.$transaction(async (tx) => {
    const ref = await tx.evidenceReference.create({
      data: {
        caseId,
        title: input.title,
        evidenceType: input.evidenceType || null,
        sourceOrganization: input.sourceOrganization || null,
        locationNote: input.locationNote || null,
        classification: (input.classification as never) ?? "INTERNAL",
        notes: input.notes || null,
        recordedById: actor.id,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "EVIDENCE_REFERENCE_CREATED",
      entityType: "EvidenceReference",
      entityId: ref.id,
      caseId,
      summary: `Evidence reference recorded: ${input.title}`,
    });
  });
}

/* -------- Qualification review (§9.8) -------- */

const CRITERIA = [
  "organizationIdentity",
  "representativeAuthority",
  "statedPurpose",
  "informationCompleteness",
  "evidenceAvailability",
  "regulatoryOrRiskConcern",
] as const;

export async function submitQualificationRecommendation(
  actor: CurrentEmployee,
  caseId: string,
  input: { criteria: Record<string, string>; recommendation: string },
): Promise<void> {
  assertCan(actor, "qualification.recommend");
  const data: Record<string, unknown> = {
    caseId,
    reviewerId: actor.id,
    recommendation: input.recommendation,
  };
  for (const key of CRITERIA) {
    if (input.criteria[key]) data[key] = input.criteria[key];
  }
  await prisma.$transaction(async (tx) => {
    const review = await tx.qualificationReview.create({ data: data as never });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "QUALIFICATION_RECOMMENDED",
      entityType: "QualificationReview",
      entityId: review.id,
      caseId,
      summary: "Specialist qualification recommendation submitted",
    });
  });
}

/** Only an authorized manager may approve the final qualification outcome. */
export async function approveQualificationOutcome(
  actor: CurrentEmployee,
  reviewId: string,
  outcome: string,
): Promise<void> {
  assertCan(actor, "qualification.approve");
  await prisma.$transaction(async (tx) => {
    const review = await tx.qualificationReview.update({
      where: { id: reviewId },
      data: {
        finalOutcome: outcome as never,
        decisionOwnerId: actor.id,
        approvedAt: new Date(),
      },
    });
    await tx.case.update({
      where: { id: review.caseId },
      data: { qualificationStatus: outcome as never, recordVersion: { increment: 1 } },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "QUALIFICATION_APPROVED",
      entityType: "QualificationReview",
      entityId: reviewId,
      caseId: review.caseId,
      summary: `Qualification outcome approved: ${outcome}`,
      changedFields: { outcome },
    });
  });
}

/* -------- Meeting preparation and record (§9.11–9.12) -------- */

export async function createMeetingPreparation(
  actor: CurrentEmployee,
  caseId: string,
  input: {
    title: string;
    meetingType: string;
    purpose?: string;
    participantCategories?: string;
    keyQuestions?: string;
    decisionsSought?: string;
    expectedOutcome?: string;
  },
): Promise<void> {
  assertCan(actor, "meeting.prepare");
  await prisma.$transaction(async (tx) => {
    const prep = await tx.meetingPreparation.create({
      data: {
        caseId,
        title: input.title,
        meetingType: (input.meetingType as never) ?? "INTERNAL_REVIEW",
        purpose: input.purpose || null,
        participantCategories: input.participantCategories || null,
        keyQuestions: input.keyQuestions || null,
        decisionsSought: input.decisionsSought || null,
        expectedOutcome: input.expectedOutcome || null,
        preparedById: actor.id,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "MEETING_PREPARED",
      entityType: "MeetingPreparation",
      entityId: prep.id,
      caseId,
      summary: `Meeting preparation drafted: ${input.title}`,
    });
  });
}

export async function createMeetingRecord(
  actor: CurrentEmployee,
  caseId: string,
  input: {
    summary: string;
    meetingPreparationId?: string | null;
    internalAttendees?: string;
    externalParticipantCategories?: string;
    proposedNextSteps?: string;
  },
): Promise<void> {
  assertCan(actor, "meeting.record");
  await prisma.$transaction(async (tx) => {
    const rec = await tx.meetingRecord.create({
      data: {
        caseId,
        meetingPreparationId: input.meetingPreparationId || null,
        summary: input.summary,
        internalAttendees: input.internalAttendees || null,
        externalParticipantCategories: input.externalParticipantCategories || null,
        proposedNextSteps: input.proposedNextSteps || null,
        recordedById: actor.id,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "MEETING_RECORDED",
      entityType: "MeetingRecord",
      entityId: rec.id,
      caseId,
      summary: "Internal meeting record created",
    });
  });
}

/* -------- Decisions (§9.13) -------- */

export async function proposeDecision(
  actor: CurrentEmployee,
  caseId: string,
  input: { title: string; decisionType: string; recommendation?: string; rationale?: string; supersedesDecisionId?: string | null },
): Promise<void> {
  assertCan(actor, "decision.propose");
  await prisma.$transaction(async (tx) => {
    const decision = await tx.decision.create({
      data: {
        caseId,
        title: input.title,
        decisionType: input.decisionType as never,
        recommendation: input.recommendation || null,
        rationale: input.rationale || null,
        proposedById: actor.id,
        supersedesDecisionId: input.supersedesDecisionId || null,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "DECISION_PROPOSED",
      entityType: "Decision",
      entityId: decision.id,
      caseId,
      summary: `Decision proposed: ${input.decisionType}`,
    });
  });
}

/**
 * Approve or reject a decision (managers only). An APPROVED decision cannot
 * later be silently edited: a change requires a new superseding decision
 * (enforced here — only PROPOSED decisions may be approved/rejected).
 */
export async function resolveDecision(
  actor: CurrentEmployee,
  decisionId: string,
  outcome: "APPROVED" | "REJECTED" | "DEFERRED",
): Promise<void> {
  assertCan(actor, "decision.approve");
  await prisma.$transaction(async (tx) => {
    const existing = await tx.decision.findUnique({ where: { id: decisionId } });
    if (!existing) throw new Error("NOT_FOUND");
    if (existing.status !== "PROPOSED") throw new Error("DECISION_NOT_PENDING");

    const decision = await tx.decision.update({
      where: { id: decisionId },
      data: {
        status: outcome,
        approvedById: actor.id,
        decidedAt: new Date(),
      },
    });
    // A superseding decision marks the prior one SUPERSEDED (history kept).
    if (outcome === "APPROVED" && existing.supersedesDecisionId) {
      await tx.decision.update({
        where: { id: existing.supersedesDecisionId },
        data: { status: "SUPERSEDED" },
      });
    }
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "DECISION_RESOLVED",
      entityType: "Decision",
      entityId: decisionId,
      caseId: decision.caseId,
      summary: `Decision ${outcome.toLowerCase()}`,
      changedFields: { outcome },
    });
  });
}

/* -------- Commitments (§9.14) -------- */

export async function createCommitment(
  actor: CurrentEmployee,
  caseId: string,
  input: { title: string; description?: string; internalOwnerId?: string | null; dueDate?: Date | null; relatedOrganizationId?: string | null },
): Promise<void> {
  assertCan(actor, "commitment.manage");
  await prisma.$transaction(async (tx) => {
    const commitment = await tx.commitment.create({
      data: {
        caseId,
        title: input.title,
        description: input.description || null,
        internalOwnerId: input.internalOwnerId || null,
        dueDate: input.dueDate || null,
        relatedOrganizationId: input.relatedOrganizationId || null,
        createdById: actor.id,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "COMMITMENT_CREATED",
      entityType: "Commitment",
      entityId: commitment.id,
      caseId,
      summary: `Commitment created: ${input.title}`,
    });
  });
}

export async function updateCommitmentStatus(
  actor: CurrentEmployee,
  commitmentId: string,
  status: string,
  expectedVersion: number,
  completionNote?: string,
): Promise<void> {
  assertCan(actor, "commitment.manage");
  await prisma.$transaction(async (tx) => {
    const existing = await tx.commitment.findUnique({ where: { id: commitmentId } });
    if (!existing) throw new Error("NOT_FOUND");
    if (existing.recordVersion !== expectedVersion) throw new ConcurrencyError();
    const commitment = await tx.commitment.update({
      where: { id: commitmentId },
      data: {
        status: status as never,
        completionNote: completionNote || existing.completionNote,
        completedAt: status === "COMPLETED" ? new Date() : existing.completedAt,
        recordVersion: { increment: 1 },
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "COMMITMENT_UPDATED",
      entityType: "Commitment",
      entityId: commitmentId,
      caseId: commitment.caseId,
      summary: `Commitment status → ${status}`,
      changedFields: { status },
    });
  });
}
