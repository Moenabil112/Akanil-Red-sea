import { stepUpConfig } from "./env";

/**
 * P4-B step-up (recent-reauthentication) enforcement (§8). Sensitive actions
 * require a successful password reauthentication within a short window. The
 * password is verified server-side and never stored; a successful step-up
 * only stamps a timestamp on the CURRENT session (it does not create a second
 * long-lived login). UI hiding is never the boundary — services and actions
 * call assertRecentStepUp on the server.
 *
 * This module is framework-free (no next/*), so services and tests can use it
 * without a request context.
 */

/** Sensitive actions that require a recent step-up reauthentication. */
export const STEP_UP_ACTIONS = [
  "access.change.approve",
  "access.change.apply",
  "employee.disable",
  "employee.enable",
  "employee.reset_password",
  "session.revoke_all",
  "pilot.grant",
  "pilot.revoke",
  "case.reopen",
  "qualification.approve",
  "decision.approve",
  "decision.supersede",
  "case.close_restricted",
  "incident.acknowledge_critical",
  "security.config_change",
] as const;

export type StepUpAction = (typeof STEP_UP_ACTIONS)[number];

export class StepUpRequiredError extends Error {
  constructor(message = "STEP_UP_REQUIRED") {
    super(message);
    this.name = "StepUpRequiredError";
  }
}

/** True when the given step-up timestamp is within the configured window. */
export function isRecentStepUp(
  stepUpVerifiedAt: Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!stepUpVerifiedAt) return false;
  const ageMs = now.getTime() - stepUpVerifiedAt.getTime();
  if (ageMs < 0) return false;
  return ageMs <= stepUpConfig.windowMinutes * 60_000;
}

/** Throw STEP_UP_REQUIRED when the session lacks a recent reauthentication. */
export function assertRecentStepUp(
  stepUpVerifiedAt: Date | null | undefined,
  now: Date = new Date(),
): void {
  if (!isRecentStepUp(stepUpVerifiedAt, now)) {
    throw new StepUpRequiredError();
  }
}
