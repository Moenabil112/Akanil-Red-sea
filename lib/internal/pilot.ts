import { prisma } from "./db";
import { internalMutationsAllowed, operationMode } from "./env";

/**
 * P4-B pilot-cohort control (§6). An ACTIVE employee account alone never
 * grants pilot operational access. To perform operational case work an
 * employee must ALSO hold an approved, time-limited, non-suspended,
 * non-revoked, non-expired PilotAccess record. Governance roles administer
 * the cohort by RBAC permission and do not need a pilot record to do so.
 */

export type PilotAccessRow = {
  status: string;
  startsAt: Date | null;
  expiresAt: Date | null;
  suspendedAt: Date | null;
  revokedAt: Date | null;
};

/** True when a pilot-access record currently grants operational access. */
export function isPilotAccessActive(
  row: PilotAccessRow | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!row) return false;
  if (row.suspendedAt || row.revokedAt) return false;
  if (row.status !== "APPROVED" && row.status !== "ACTIVE") return false;
  if (!row.startsAt || row.startsAt > now) return false;
  if (!row.expiresAt || row.expiresAt <= now) return false;
  return true;
}

/** The effective (most recent) pilot-access record for an employee. */
export async function currentPilotAccess(employeeId: string) {
  return prisma.pilotAccess.findFirst({
    where: { employeeId },
    orderBy: { createdAt: "desc" },
  });
}

/** Whether the employee currently holds active pilot operational access. */
export async function hasActivePilotAccess(employeeId: string): Promise<boolean> {
  const row = await currentPilotAccess(employeeId);
  return isPilotAccessActive(row);
}

export class PilotAccessError extends Error {
  constructor(message = "PILOT_ACCESS_REQUIRED") {
    super(message);
    this.name = "PilotAccessError";
  }
}

/**
 * Assert that operational case work is permitted right now for this employee:
 * operations must be available, the pilot must not be suspended, and — when a
 * mode is active — the employee must hold active pilot access. Throws
 * "PILOT_ACCESS_REQUIRED" (or "OPERATIONS_SUSPENDED") otherwise.
 */
export async function assertPilotOperational(employeeId: string): Promise<void> {
  if (operationMode() === "disabled") throw new PilotAccessError("OPERATIONS_DISABLED");
  if (!internalMutationsAllowed()) throw new PilotAccessError("OPERATIONS_SUSPENDED");
  const active = await hasActivePilotAccess(employeeId);
  if (!active) throw new PilotAccessError("PILOT_ACCESS_REQUIRED");
}
