/**
 * Internal case-reference format (P4-A §10): AKN-YYYY-000001.
 * The numeric value is produced by a transaction-safe database counter
 * (see lib/internal/services/cases.ts) — never derived by counting rows
 * on the client, and never supplied by the browser.
 */

export const CASE_COUNTER_ID = "case-reference";

export function formatCaseReference(year: number, value: number): string {
  return `AKN-${year}-${String(value).padStart(6, "0")}`;
}

/** Loose shape check for display/validation (not a security control). */
export function isCaseReferenceShape(value: string): boolean {
  return /^AKN-\d{4}-\d{6,}$/.test(value);
}

/**
 * Internal security-incident reference (P4-B §14): SEC-YYYY-000001. Also
 * produced by a transaction-safe database counter — never public, never a
 * public case number.
 */
export const INCIDENT_COUNTER_ID = "incident-reference";

export function formatIncidentReference(year: number, value: number): string {
  return `SEC-${year}-${String(value).padStart(6, "0")}`;
}

/** Internal operational-pilot-run reference (P4-C §9): OPR-YYYY-000001. */
export const PILOT_RUN_COUNTER_ID = "pilot-run-reference";

export function formatPilotRunReference(year: number, value: number): string {
  return `OPR-${year}-${String(value).padStart(6, "0")}`;
}
