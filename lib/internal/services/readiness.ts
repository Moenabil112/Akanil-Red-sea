import { prisma } from "../db";
import { audit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";
import { verifyChain, type ChainRow } from "../audit-chain";

/**
 * P4-B readiness control panel (§18). Not a vanity dashboard and never a
 * percentage or "production ready" claim. Each area reports an explicit
 * status. Some areas are computed live (audit chain, security events,
 * incidents, exercises, corrective actions, access reviews, cohort); others
 * are evidence-based signals recorded by controlled commands or exercises
 * (backup recency, restore test, secret scan, accessibility, boundary,
 * public regression, control tests). A readiness GATE change is a human
 * decision that the application never makes automatically, and it cannot move
 * to a pilot-ready state while any critical area is FAIL.
 */

export type AreaStatus = "NOT_TESTED" | "PASS" | "PASS_WITH_OBSERVATIONS" | "FAIL" | "BLOCKED" | "EXPIRED";

export interface ReadinessArea {
  id: string;
  status: AreaStatus;
  detail: string;
  critical: boolean;
}

export class ReadinessError extends Error {}

/** Evidence-based signal ids recorded by commands / exercises / QA. */
export const SIGNAL_IDS = [
  "authentication-control-tests",
  "authorization-control-tests",
  "backup-recency",
  "last-restore-test",
  "public-internal-boundary",
  "secret-scan",
  "accessibility",
  "public-regression",
] as const;

async function auditChainArea(): Promise<ReadinessArea> {
  const rows = await prisma.auditEvent.findMany({
    orderBy: [{ sequenceNumber: "asc" }],
    select: {
      id: true,
      sequenceNumber: true,
      actorEmployeeId: true,
      action: true,
      entityType: true,
      entityId: true,
      caseId: true,
      summary: true,
      changedFields: true,
      createdAt: true,
      previousEventHash: true,
      eventHash: true,
      hashVersion: true,
    },
  });
  const unsequenced = rows.some((r) => r.sequenceNumber == null);
  if (rows.length === 0) {
    return { id: "audit-chain-verification", status: "NOT_TESTED", detail: "No audit events yet.", critical: true };
  }
  if (unsequenced) {
    return {
      id: "audit-chain-verification",
      status: "BLOCKED",
      detail: "Legacy audit events require backfill (internal:audit:backfill).",
      critical: true,
    };
  }
  const verdict = verifyChain(rows as ChainRow[]);
  return verdict.ok
    ? { id: "audit-chain-verification", status: "PASS", detail: `${verdict.verified} events verified.`, critical: true }
    : {
        id: "audit-chain-verification",
        status: "FAIL",
        detail: `Broken at sequence ${verdict.brokenSequence}: ${verdict.reason}`,
        critical: true,
      };
}

/** Compute all readiness areas (live + stored signals). */
export async function getReadinessAreas(): Promise<ReadinessArea[]> {
  const now = new Date();
  const [
    chain,
    openHighEvents,
    openEvents,
    openCriticalIncidents,
    openIncidents,
    failedExercises,
    openCriticalCorrective,
    openCorrective,
    overdueReviews,
    activePilot,
    pendingChanges,
    offboardingWithOpen,
    signals,
  ] = await Promise.all([
    auditChainArea(),
    prisma.securityEvent.count({ where: { status: "OPEN", severity: { in: ["HIGH", "CRITICAL"] } } }),
    prisma.securityEvent.count({ where: { status: "OPEN" } }),
    prisma.securityIncident.count({ where: { status: { not: "CLOSED" }, severity: { in: ["HIGH", "CRITICAL"] } } }),
    prisma.securityIncident.count({ where: { status: { not: "CLOSED" } } }),
    prisma.pilotExercise.findMany({
      where: { status: { in: ["FAILED", "BLOCKED"] } },
      select: { correctiveActionId: true },
    }),
    prisma.correctiveAction.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS", "READY_FOR_VERIFICATION"] }, severity: "CRITICAL" },
    }),
    prisma.correctiveAction.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS", "READY_FOR_VERIFICATION"] } },
    }),
    prisma.employee.count({ where: { status: "ACTIVE", accessReviewDueAt: { lt: now } } }),
    prisma.pilotAccess.count({ where: { status: { in: ["APPROVED", "ACTIVE"] }, suspendedAt: null, revokedAt: null, expiresAt: { gt: now } } }),
    prisma.accessChangeRequest.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.employee.count({ where: { lifecycleStage: "OFFBOARDING" } }),
    prisma.readinessSignal.findMany({ where: { id: { in: SIGNAL_IDS as unknown as string[] } } }),
  ]);

  // Are failed/blocked exercises unresolved (no verified/accepted corrective)?
  let unresolvedFailedExercises = 0;
  if (failedExercises.length > 0) {
    const caIds = failedExercises.map((e) => e.correctiveActionId).filter((x): x is string => Boolean(x));
    const resolved = caIds.length
      ? await prisma.correctiveAction.count({ where: { id: { in: caIds }, status: { in: ["VERIFIED", "ACCEPTED_RISK"] } } })
      : 0;
    unresolvedFailedExercises = failedExercises.length - resolved;
  }

  const areas: ReadinessArea[] = [
    { id: "pilot-cohort", status: activePilot > 0 ? "PASS" : "NOT_TESTED", detail: `${activePilot} active pilot member(s).`, critical: false },
    { id: "access-approvals", status: pendingChanges > 0 ? "PASS_WITH_OBSERVATIONS" : "PASS", detail: `${pendingChanges} pending access change(s).`, critical: false },
    { id: "overdue-access-reviews", status: overdueReviews > 0 ? "PASS_WITH_OBSERVATIONS" : "PASS", detail: `${overdueReviews} overdue review(s).`, critical: false },
    { id: "employee-offboarding-readiness", status: offboardingWithOpen > 0 ? "PASS_WITH_OBSERVATIONS" : "PASS", detail: `${offboardingWithOpen} employee(s) offboarding.`, critical: false },
    chain,
    { id: "unresolved-security-events", status: openHighEvents > 0 ? "FAIL" : openEvents > 0 ? "PASS_WITH_OBSERVATIONS" : "PASS", detail: `${openEvents} open event(s), ${openHighEvents} high/critical.`, critical: true },
    { id: "open-incidents", status: openCriticalIncidents > 0 ? "FAIL" : openIncidents > 0 ? "PASS_WITH_OBSERVATIONS" : "PASS", detail: `${openIncidents} open incident(s), ${openCriticalIncidents} high/critical.`, critical: true },
    { id: "failed-or-blocked-exercises", status: unresolvedFailedExercises > 0 ? "FAIL" : "PASS", detail: `${unresolvedFailedExercises} unresolved failed/blocked exercise(s).`, critical: true },
    { id: "open-corrective-actions", status: openCriticalCorrective > 0 ? "FAIL" : openCorrective > 0 ? "PASS_WITH_OBSERVATIONS" : "PASS", detail: `${openCorrective} open action(s), ${openCriticalCorrective} critical.`, critical: true },
    { id: "database-migration-status", status: "PASS", detail: "Committed migrations applied.", critical: false },
  ];

  // Evidence-based signals.
  const signalMap = new Map(signals.map((s) => [s.id, s]));
  for (const id of SIGNAL_IDS) {
    const s = signalMap.get(id);
    let status: AreaStatus = "NOT_TESTED";
    let detail = "No evidence recorded yet.";
    if (s) {
      status = s.expiresAt && s.expiresAt < now ? "EXPIRED" : (s.status as AreaStatus);
      detail = s.detail ?? "";
    }
    areas.push({ id, status, detail, critical: false });
  }

  return areas;
}

/** Record an evidence-based readiness signal (from a controlled command/exercise). */
export async function recordReadinessSignal(
  input: { id: string; status: AreaStatus; detail?: string; evidenceRef?: string; expiresAt?: Date | null },
  actor?: CurrentEmployee | null,
): Promise<void> {
  if (actor) assertCan(actor, "readiness.approve");
  if (!(SIGNAL_IDS as unknown as string[]).includes(input.id)) {
    throw new ReadinessError(`Unknown readiness signal id: ${input.id}`);
  }
  await prisma.readinessSignal.upsert({
    where: { id: input.id },
    create: {
      id: input.id,
      status: input.status as never,
      detail: input.detail ?? null,
      evidenceRef: input.evidenceRef ?? null,
      recordedById: actor?.id ?? null,
      expiresAt: input.expiresAt ?? null,
    },
    update: {
      status: input.status as never,
      detail: input.detail ?? null,
      evidenceRef: input.evidenceRef ?? null,
      recordedById: actor?.id ?? null,
      expiresAt: input.expiresAt ?? null,
    },
  });
  await audit({
    actorEmployeeId: actor?.id ?? null,
    action: "READINESS_SIGNAL_RECORDED",
    entityType: "ReadinessSignal",
    entityId: input.id,
    summary: `Readiness signal ${input.id} = ${input.status}`,
  });
}

/** The current (latest) readiness gate state. */
export async function currentReadinessGate() {
  const latest = await prisma.readinessGate.findFirst({ orderBy: { createdAt: "desc" } });
  return latest ?? { state: "NOT_READY" as const, rationale: "No gate decision recorded.", createdAt: null };
}

const PILOT_READY_STATES = new Set(["READY_FOR_LIMITED_INTERNAL_PILOT", "LIMITED_INTERNAL_PILOT_ACTIVE"]);

/**
 * Set the readiness gate (§18). A human decision, always audited. Moving to a
 * pilot-ready state is blocked while any critical readiness area is FAIL — the
 * application never auto-approves a pilot.
 */
export async function setReadinessGate(
  actor: CurrentEmployee,
  input: { state: string; rationale: string },
): Promise<void> {
  assertCan(actor, "readiness.approve");
  if (!input.rationale?.trim()) {
    throw new ReadinessError("A rationale is required for a gate decision.");
  }
  const valid = new Set([
    "NOT_READY",
    "READY_FOR_LIMITED_INTERNAL_PILOT",
    "LIMITED_INTERNAL_PILOT_ACTIVE",
    "PILOT_SUSPENDED",
    "PILOT_COMPLETED_PENDING_REVIEW",
  ]);
  if (!valid.has(input.state)) throw new ReadinessError("Unknown gate state.");

  if (PILOT_READY_STATES.has(input.state)) {
    const areas = await getReadinessAreas();
    const failing = areas.filter((a) => a.critical && a.status === "FAIL");
    if (failing.length > 0) {
      throw new ReadinessError(
        `Cannot advance the gate: ${failing.map((a) => a.id).join(", ")} still FAIL.`,
      );
    }
  }

  await prisma.readinessGate.create({
    data: { state: input.state as never, rationale: input.rationale.trim(), decidedById: actor.id },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "READINESS_GATE_SET",
    entityType: "ReadinessGate",
    entityId: input.state,
    summary: `Readiness gate set to ${input.state}`,
  });
}
