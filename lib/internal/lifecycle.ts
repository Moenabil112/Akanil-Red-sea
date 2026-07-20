/**
 * Server-enforced case lifecycle state machine (P4-A §11). Transitions are
 * defined explicitly; any transition not listed is rejected. Decoupled from
 * the generated Prisma client (plain string unions) so it is unit-testable
 * without a database.
 */

export const CASE_STATUSES = [
  "NEW",
  "TRIAGE",
  "INFORMATION_REQUIRED",
  "QUALIFIED",
  "UNDER_REVIEW",
  "MEETING_PREPARATION",
  "DECISION_PENDING",
  "FOLLOW_UP",
  "ON_HOLD",
  "CLOSED",
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

export const CLOSURE_REASONS = [
  "PROGRESSED_OUTSIDE_MVP",
  "NOT_PROGRESSED",
  "WITHDRAWN",
  "DUPLICATE",
  "COMPLETED",
  "OTHER",
] as const;

export type ClosureReason = (typeof CLOSURE_REASONS)[number];

/** Permitted forward transitions per status (P4-A §11). */
const TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  NEW: ["TRIAGE"],
  TRIAGE: ["INFORMATION_REQUIRED", "QUALIFIED", "ON_HOLD", "CLOSED"],
  INFORMATION_REQUIRED: ["TRIAGE", "QUALIFIED", "ON_HOLD", "CLOSED"],
  QUALIFIED: ["UNDER_REVIEW", "MEETING_PREPARATION", "DECISION_PENDING"],
  UNDER_REVIEW: [
    "INFORMATION_REQUIRED",
    "MEETING_PREPARATION",
    "DECISION_PENDING",
    "ON_HOLD",
  ],
  MEETING_PREPARATION: ["DECISION_PENDING", "FOLLOW_UP", "ON_HOLD"],
  DECISION_PENDING: ["FOLLOW_UP", "INFORMATION_REQUIRED", "ON_HOLD", "CLOSED"],
  FOLLOW_UP: ["DECISION_PENDING", "ON_HOLD", "CLOSED"],
  ON_HOLD: ["TRIAGE", "UNDER_REVIEW", "CLOSED"],
  // CLOSED is terminal for ordinary transitions; reopening is a distinct,
  // role-restricted operation handled by `reopenTarget`.
  CLOSED: [],
};

export function isCaseStatus(value: string): value is CaseStatus {
  return (CASE_STATUSES as readonly string[]).includes(value);
}

export function isClosureReason(value: string): value is ClosureReason {
  return (CLOSURE_REASONS as readonly string[]).includes(value);
}

/** True when `to` is a permitted transition from `from`. */
export function canTransition(from: CaseStatus, to: CaseStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

/** Allowed next statuses from a given status (for UI option lists). */
export function nextStatuses(from: CaseStatus): CaseStatus[] {
  return [...TRANSITIONS[from]];
}

/** Reopening a CLOSED case moves it back to TRIAGE (role-restricted, §11). */
export const REOPEN_TARGET: CaseStatus = "TRIAGE";

/** Whether closing requires a mandatory reason (always, for CLOSED). */
export function requiresClosureReason(to: CaseStatus): boolean {
  return to === "CLOSED";
}
