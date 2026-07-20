import { prisma } from "../db";
import { recordAudit } from "../audit";
import { CASE_COUNTER_ID, formatCaseReference } from "../reference";
import {
  canTransition,
  isCaseStatus,
  isClosureReason,
  requiresClosureReason,
  REOPEN_TARGET,
  type CaseStatus,
} from "../lifecycle";
import { validPublicId } from "../taxonomy";
import { assertCan, type CurrentEmployee } from "../authz";
import { can } from "../rbac";
import type { Case, CasePriority, CaseSource, Classification } from "@/lib/generated/prisma";

/** Conflict raised when optimistic concurrency detects a stale write. */
export class ConcurrencyError extends Error {
  constructor() {
    super("RECORD_CHANGED");
    this.name = "ConcurrencyError";
  }
}

export interface NewCaseInput {
  title: string;
  summary: string;
  source: CaseSource;
  organizationId?: string | null;
  primaryContactId?: string | null;
  requestType?: string | null;
  primaryPlatformId?: string | null;
  primaryValueChainId?: string | null;
  forumParticipationPathId?: string | null;
  forumSectorTrackId?: string | null;
  priority?: CasePriority;
  classification?: Classification;
  initialOwnerId?: string | null;
}

/**
 * Create a case manually (P4-A §14) in a single transaction: increment the
 * reference counter (row-locked, transaction-safe), create the case with a
 * server-generated immutable reference, record the initial owner assignment,
 * and write the audit event. Public taxonomy ids are validated; unknown ids
 * are dropped rather than stored.
 */
export async function createCase(
  actor: CurrentEmployee,
  input: NewCaseInput,
): Promise<Case> {
  assertCan(actor, "case.create");

  const year = new Date().getFullYear();
  const ownerId = input.initialOwnerId || actor.id;

  return prisma.$transaction(async (tx) => {
    const counter = await tx.counter.upsert({
      where: { id: CASE_COUNTER_ID },
      create: { id: CASE_COUNTER_ID, value: 1 },
      update: { value: { increment: 1 } },
    });
    const internalReference = formatCaseReference(year, counter.value);

    const created = await tx.case.create({
      data: {
        internalReference,
        title: input.title.trim(),
        summary: input.summary.trim(),
        source: input.source,
        organizationId: input.organizationId || null,
        primaryContactId: input.primaryContactId || null,
        requestType: validPublicId("requestType", input.requestType),
        primaryPlatformId: validPublicId("platform", input.primaryPlatformId),
        primaryValueChainId: validPublicId("chain", input.primaryValueChainId),
        forumParticipationPathId: validPublicId(
          "participant",
          input.forumParticipationPathId,
        ),
        forumSectorTrackId: validPublicId("track", input.forumSectorTrackId),
        priority: input.priority ?? "NORMAL",
        classification: input.classification ?? "INTERNAL",
        status: "NEW",
        currentOwnerId: ownerId,
        createdById: actor.id,
      },
    });

    await tx.caseAssignment.create({
      data: {
        caseId: created.id,
        employeeId: ownerId,
        assignmentType: "OWNER",
        assignedById: actor.id,
      },
    });

    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "CASE_CREATED",
      entityType: "Case",
      entityId: created.id,
      caseId: created.id,
      summary: `Case ${internalReference} created (source ${created.source})`,
      changedFields: { internalReference, status: "NEW", ownerId },
    });

    return created;
  });
}

/** Whether the employee may view a specific case (object-level, §27.2). */
export async function canAccessCase(
  employee: CurrentEmployee,
  caseId: string,
): Promise<boolean> {
  if (can(employee.role, "case.viewAll")) return true;
  if (!can(employee.role, "case.viewAssigned")) return false;
  const assignment = await prisma.caseAssignment.findFirst({
    where: { caseId, employeeId: employee.id, endedAt: null },
    select: { id: true },
  });
  if (assignment) return true;
  const owned = await prisma.case.findFirst({
    where: { id: caseId, currentOwnerId: employee.id },
    select: { id: true },
  });
  return Boolean(owned);
}

/**
 * Server-enforced status transition (P4-A §11/§12). Validates the transition,
 * enforces role permission, applies optimistic concurrency and writes an
 * audit event — all in one transaction. Reopening a CLOSED case is a
 * distinct, role-restricted operation requiring a reason.
 */
export async function transitionCase(
  actor: CurrentEmployee,
  caseId: string,
  toRaw: string,
  expectedVersion: number,
  closureReasonRaw?: string | null,
): Promise<Case> {
  if (!isCaseStatus(toRaw)) throw new Error("INVALID_STATUS");
  const to = toRaw as CaseStatus;

  return prisma.$transaction(async (tx) => {
    const current = await tx.case.findUnique({ where: { id: caseId } });
    if (!current) throw new Error("NOT_FOUND");
    if (current.recordVersion !== expectedVersion) throw new ConcurrencyError();

    const from = current.status as CaseStatus;

    if (from === "CLOSED") {
      // Only a reopen to TRIAGE, restricted to reopen-capable roles.
      if (to !== REOPEN_TARGET) throw new Error("INVALID_TRANSITION");
      assertCan(actor, "case.reopen");
    } else {
      if (!canTransition(from, to)) throw new Error("INVALID_TRANSITION");
      if (to === "CLOSED") assertCan(actor, "case.close");
      else assertCan(actor, "case.transition");
    }

    let closureReason = current.closureReason;
    let closedAt = current.closedAt;
    if (to === "CLOSED") {
      if (!closureReasonRaw || !isClosureReason(closureReasonRaw)) {
        throw new Error("CLOSURE_REASON_REQUIRED");
      }
      closureReason = closureReasonRaw;
      closedAt = new Date();
    } else if (from === "CLOSED") {
      closureReason = null;
      closedAt = null;
    }
    if (requiresClosureReason(to) && !closureReason) {
      throw new Error("CLOSURE_REASON_REQUIRED");
    }

    const updated = await tx.case.update({
      where: { id: caseId },
      data: {
        status: to,
        closureReason,
        closedAt,
        recordVersion: { increment: 1 },
      },
    });

    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: from === "CLOSED" ? "CASE_REOPENED" : "CASE_STATUS_CHANGED",
      entityType: "Case",
      entityId: caseId,
      caseId,
      summary: `Status ${from} → ${to}`,
      changedFields: { from, to, closureReason },
    });

    return updated;
  });
}

/** Reassign the single active owner, preserving assignment history (§9.6). */
export async function assignOwner(
  actor: CurrentEmployee,
  caseId: string,
  newOwnerId: string,
): Promise<void> {
  assertCan(actor, "case.assign");
  await prisma.$transaction(async (tx) => {
    await tx.caseAssignment.updateMany({
      where: { caseId, assignmentType: "OWNER", endedAt: null },
      data: { endedAt: new Date() },
    });
    await tx.caseAssignment.create({
      data: {
        caseId,
        employeeId: newOwnerId,
        assignmentType: "OWNER",
        assignedById: actor.id,
      },
    });
    await tx.case.update({
      where: { id: caseId },
      data: { currentOwnerId: newOwnerId, recordVersion: { increment: 1 } },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "CASE_OWNER_ASSIGNED",
      entityType: "Case",
      entityId: caseId,
      caseId,
      summary: "Case owner reassigned",
      changedFields: { newOwnerId },
    });
  });
}

/** Add a reviewer assignment (multiple concurrent reviewers allowed). */
export async function addReviewer(
  actor: CurrentEmployee,
  caseId: string,
  reviewerId: string,
): Promise<void> {
  assertCan(actor, "case.assign");
  await prisma.$transaction(async (tx) => {
    const existing = await tx.caseAssignment.findFirst({
      where: {
        caseId,
        employeeId: reviewerId,
        assignmentType: "REVIEWER",
        endedAt: null,
      },
    });
    if (existing) return;
    await tx.caseAssignment.create({
      data: {
        caseId,
        employeeId: reviewerId,
        assignmentType: "REVIEWER",
        assignedById: actor.id,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "CASE_REVIEWER_ADDED",
      entityType: "Case",
      entityId: caseId,
      caseId,
      summary: "Reviewer added to case",
      changedFields: { reviewerId },
    });
  });
}

/** Append an internal note (append-only; corrections reference an earlier note). */
export async function addNote(
  actor: CurrentEmployee,
  caseId: string,
  input: { noteType: string; classification: string; body: string; supersedesNoteId?: string | null },
): Promise<void> {
  assertCan(actor, "note.create");
  await prisma.$transaction(async (tx) => {
    const note = await tx.internalNote.create({
      data: {
        caseId,
        noteType: input.noteType as never,
        classification: input.classification as never,
        body: input.body,
        authorId: actor.id,
        supersedesNoteId: input.supersedesNoteId || null,
      },
    });
    await recordAudit(tx, {
      actorEmployeeId: actor.id,
      action: "NOTE_CREATED",
      entityType: "InternalNote",
      entityId: note.id,
      caseId,
      summary: `Internal note added (${input.noteType})`,
      // Note body is intentionally excluded from the audit diff (§9.15).
    });
  });
}
