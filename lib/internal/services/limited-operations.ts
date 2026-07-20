import { prisma } from "../db";
import { audit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";
import { pilotSuspended } from "../env";
import { verifyChain, type ChainRow } from "../audit-chain";

/**
 * P4-C limited-internal-operations authorization (§7/§8/§19). The
 * `limited_internal` environment mode is NEVER sufficient on its own — an
 * ACTIVE, in-window, human-approved LimitedOperationsAuthorization is
 * additionally required, together with the employee/case limits and allowed
 * data categories it defines. Decisions are human-only; approved records are
 * superseded, never silently edited; records are never deleted; every action is
 * audited.
 *
 * An authorization can NEVER become ACTIVE while a critical readiness area is
 * failing (open critical incident/corrective action, a broken audit chain, a
 * failed/absent restore test, or an active pilot suspension).
 */

export class LimitedOpsError extends Error {}

export const ALLOWED_DATA_VALUES = ["SYNTHETIC", "DE_IDENTIFIED"] as const;

export function parseDataCategories(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isAuthorizationActive(
  row: { status: string; validFrom: Date | null; validUntil: Date | null; suspendedAt: Date | null } | null,
  now: Date = new Date(),
): boolean {
  if (!row) return false;
  if (row.status !== "ACTIVE" || row.suspendedAt) return false;
  if (!row.validFrom || row.validFrom > now) return false;
  if (!row.validUntil || row.validUntil <= now) return false;
  return true;
}

/** The current active authorization, or null. */
export async function activeAuthorization(now: Date = new Date()) {
  const row = await prisma.limitedOperationsAuthorization.findFirst({
    where: { status: "ACTIVE", suspendedAt: null, validFrom: { lte: now }, validUntil: { gt: now } },
    orderBy: { decidedAt: "desc" },
  });
  return row;
}

/**
 * Blockers that prevent an authorization from becoming ACTIVE (§7/§19). Returns
 * a list of human-readable reasons; empty means the critical gates pass.
 */
export async function authorizationBlockers(): Promise<string[]> {
  const blockers: string[] = [];
  if (pilotSuspended()) blockers.push("pilot is suspended");

  const [criticalIncidents, criticalCorrectives, restoreSignal, auditRows] = await Promise.all([
    prisma.securityIncident.count({ where: { status: { not: "CLOSED" }, severity: "CRITICAL" } }),
    prisma.correctiveAction.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS", "READY_FOR_VERIFICATION"] }, severity: "CRITICAL" },
    }),
    prisma.readinessSignal.findUnique({ where: { id: "last-restore-test" } }),
    prisma.auditEvent.findMany({
      orderBy: { sequenceNumber: "asc" },
      select: {
        id: true, sequenceNumber: true, actorEmployeeId: true, action: true, entityType: true,
        entityId: true, caseId: true, summary: true, changedFields: true, createdAt: true,
        previousEventHash: true, eventHash: true, hashVersion: true,
      },
    }),
  ]);

  if (criticalIncidents > 0) blockers.push("an open critical security incident");
  if (criticalCorrectives > 0) blockers.push("an open critical corrective action");
  if (!restoreSignal || restoreSignal.status !== "PASS") blockers.push("restore test is not passing");

  if (auditRows.length > 0) {
    if (auditRows.some((r) => r.sequenceNumber == null)) {
      blockers.push("audit chain not backfilled");
    } else {
      const verdict = verifyChain(auditRows as ChainRow[]);
      if (!verdict.ok) blockers.push(`audit chain broken at sequence ${verdict.brokenSequence}`);
    }
  }

  return blockers;
}

// ---------------- Enforcement (§8) ----------------

export class LimitedInternalDenied extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LimitedInternalDenied";
  }
}

/**
 * Enforce the limited_internal preconditions beyond authentication, RBAC,
 * object-level authz and pilot access (which are checked elsewhere): an active
 * authorization within validity, and the employee/case limits it defines. Fail
 * closed. Never silently falls back to pilot mode.
 */
export async function assertLimitedInternalAuthorized(): Promise<void> {
  const now = new Date();
  const auth = await activeAuthorization(now);
  if (!auth) throw new LimitedInternalDenied("LIMITED_OPS_NOT_AUTHORIZED");

  const [activeMembers, activeCases] = await Promise.all([
    prisma.operationalPilotMember.count({ where: { status: "ACTIVE" } }),
    prisma.operationalPilotCase.count({ where: { status: { in: ["SELECTED", "IN_PROGRESS"] } } }),
  ]);
  if (activeMembers > auth.approvedEmployeeLimit) {
    throw new LimitedInternalDenied("EMPLOYEE_LIMIT_EXCEEDED");
  }
  if (activeCases > auth.approvedCaseLimit) {
    throw new LimitedInternalDenied("CASE_LIMIT_EXCEEDED");
  }
}

/** Whether a data category is permitted by the active authorization (§8.12). */
export async function isDataCategoryAllowed(category: string): Promise<boolean> {
  const auth = await activeAuthorization();
  if (!auth) return false;
  return parseDataCategories(auth.allowedDataCategories).includes(category);
}

// ---------------- Authorization lifecycle (§7) ----------------

export async function proposeAuthorization(
  actor: CurrentEmployee,
  input: {
    title: string;
    scope: string;
    evidenceSummary?: string;
    conditions?: string;
    approvedEmployeeLimit: number;
    approvedCaseLimit: number;
    allowedDataCategories: string[];
    validFrom: Date;
    validUntil: Date;
  },
): Promise<string> {
  assertCan(actor, "operations.authorization.propose");
  if (!input.title?.trim() || !input.scope?.trim()) {
    throw new LimitedOpsError("Title and scope are required.");
  }
  if (input.approvedEmployeeLimit < 1 || input.approvedEmployeeLimit > 6) {
    throw new LimitedOpsError("Approved employee limit must be between 1 and 6.");
  }
  if (input.approvedCaseLimit < 1 || input.approvedCaseLimit > 10) {
    throw new LimitedOpsError("Approved case limit must be between 1 and 10.");
  }
  const cats = input.allowedDataCategories.filter((c) => (ALLOWED_DATA_VALUES as readonly string[]).includes(c));
  if (cats.length === 0) {
    throw new LimitedOpsError("At least one allowed data category (SYNTHETIC/DE_IDENTIFIED) is required.");
  }
  if (!input.validFrom || !input.validUntil || input.validUntil <= input.validFrom) {
    throw new LimitedOpsError("A valid start and later expiry are required (no indefinite authorization).");
  }
  const created = await prisma.limitedOperationsAuthorization.create({
    data: {
      title: input.title.trim(),
      scope: input.scope.trim(),
      evidenceSummary: input.evidenceSummary?.trim() || null,
      conditions: input.conditions?.trim() || null,
      approvedEmployeeLimit: input.approvedEmployeeLimit,
      approvedCaseLimit: input.approvedCaseLimit,
      allowedDataCategories: cats.join(","),
      validFrom: input.validFrom,
      validUntil: input.validUntil,
      proposedById: actor.id,
      status: "PENDING_REVIEW",
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "LIMITED_OPS_AUTH_PROPOSED",
    entityType: "LimitedOperationsAuthorization",
    entityId: created.id,
    summary: `Limited-operations authorization proposed (${input.approvedEmployeeLimit} employees, ${input.approvedCaseLimit} cases)`,
  });
  return created.id;
}

export async function reviewAuthorization(actor: CurrentEmployee, id: string): Promise<void> {
  assertCan(actor, "operations.authorization.review");
  const row = await prisma.limitedOperationsAuthorization.findUnique({ where: { id } });
  if (!row) throw new LimitedOpsError("Authorization not found.");
  if (row.status !== "PENDING_REVIEW") throw new LimitedOpsError("Only a pending authorization can be reviewed.");
  if (actor.id === row.proposedById) {
    throw new LimitedOpsError("The proposer cannot review their own authorization.");
  }
  await prisma.limitedOperationsAuthorization.update({
    where: { id },
    data: { reviewedById: actor.id, reviewedAt: new Date(), recordVersion: { increment: 1 } },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "LIMITED_OPS_AUTH_REVIEWED",
    entityType: "LimitedOperationsAuthorization",
    entityId: id,
    summary: "Limited-operations authorization reviewed",
  });
}

/**
 * Record the final human decision (§7/§19). Requires a recent step-up
 * (enforced at the action layer) and strict separation of duties. A GO or
 * CONDITIONAL_GO activates the authorization only when no critical gate is
 * failing; CONDITIONAL_GO requires conditions. NO_GO/SUSPEND/EXTEND never
 * activate. The application never selects or auto-approves a decision.
 */
export async function decideAuthorization(
  actor: CurrentEmployee,
  id: string,
  input: { decision: string; conditions?: string },
): Promise<void> {
  assertCan(actor, "operations.authorization.approve");
  const row = await prisma.limitedOperationsAuthorization.findUnique({ where: { id } });
  if (!row) throw new LimitedOpsError("Authorization not found.");
  if (row.status !== "PENDING_REVIEW") {
    throw new LimitedOpsError("Only a reviewed, pending authorization can be decided.");
  }
  if (!row.reviewedById) throw new LimitedOpsError("The authorization must be reviewed before a decision.");
  // Separation of duties: proposer/reviewer/approver must not all be the same;
  // an approver can never approve their own proposal or their own review.
  if (actor.id === row.proposedById) throw new LimitedOpsError("An employee cannot approve their own proposal.");
  if (actor.id === row.reviewedById) throw new LimitedOpsError("The reviewer cannot also be the final approver.");

  const valid = new Set([
    "GO_LIMITED_INTERNAL_OPERATIONS",
    "CONDITIONAL_GO",
    "EXTEND_CONTROLLED_PILOT",
    "SUSPEND_PILOT",
    "NO_GO",
  ]);
  if (!valid.has(input.decision)) throw new LimitedOpsError("Unknown decision.");

  const activates = input.decision === "GO_LIMITED_INTERNAL_OPERATIONS" || input.decision === "CONDITIONAL_GO";
  if (input.decision === "CONDITIONAL_GO" && !input.conditions?.trim()) {
    throw new LimitedOpsError("A CONDITIONAL_GO must include conditions.");
  }

  let status: string;
  const data: Record<string, unknown> = {
    decision: input.decision as never,
    approvedById: actor.id,
    decidedAt: new Date(),
    recordVersion: { increment: 1 },
  };
  if (input.conditions?.trim()) data.conditions = input.conditions.trim();

  if (activates) {
    const blockers = await authorizationBlockers();
    if (blockers.length > 0) {
      throw new LimitedOpsError(`Cannot activate: ${blockers.join("; ")}.`);
    }
    status = "ACTIVE";
  } else if (input.decision === "NO_GO") {
    status = "REJECTED";
  } else if (input.decision === "SUSPEND_PILOT") {
    status = "SUSPENDED";
    data.suspendedAt = new Date();
  } else {
    // EXTEND_CONTROLLED_PILOT: not a limited-internal activation.
    status = "REJECTED";
  }
  data.status = status as never;

  await prisma.limitedOperationsAuthorization.update({ where: { id }, data });
  await audit({
    actorEmployeeId: actor.id,
    action: "LIMITED_OPS_AUTH_DECIDED",
    entityType: "LimitedOperationsAuthorization",
    entityId: id,
    summary: `Limited-operations decision: ${input.decision} → ${status}`,
  });
}

/** Suspend an ACTIVE authorization (control action). */
export async function suspendAuthorization(actor: CurrentEmployee, id: string, reason: string): Promise<void> {
  assertCan(actor, "operations.authorization.approve");
  const row = await prisma.limitedOperationsAuthorization.findUnique({ where: { id } });
  if (!row) throw new LimitedOpsError("Authorization not found.");
  await prisma.limitedOperationsAuthorization.update({
    where: { id },
    data: { status: "SUSPENDED", suspendedAt: new Date(), recordVersion: { increment: 1 } },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "LIMITED_OPS_AUTH_SUSPENDED",
    entityType: "LimitedOperationsAuthorization",
    entityId: id,
    summary: `Limited-operations authorization suspended: ${reason?.trim() || "no reason"}`,
  });
}

export async function listAuthorizations(actor: CurrentEmployee) {
  assertCan(actor, "operations.authorization.view");
  return prisma.limitedOperationsAuthorization.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}
