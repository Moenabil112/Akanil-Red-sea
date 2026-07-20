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
