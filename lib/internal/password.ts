import { hash, verify } from "@node-rs/argon2";
import type { Algorithm } from "@node-rs/argon2";

// Argon2id is variant 2 in @node-rs/argon2's Algorithm enum. Referenced by
// value (not the ambient const enum) to satisfy isolatedModules.
const ARGON2ID = 2 as Algorithm;

/**
 * Argon2id password hashing (P4-A §7). Minimum length 14. Raw passwords
 * and hashes are never logged. Argon2id parameters follow current OWASP
 * guidance (memory-hard, moderate iterations).
 */

export const MIN_PASSWORD_LENGTH = 14;

const ARGON2ID_OPTIONS = {
  algorithm: ARGON2ID,
  memoryCost: 19_456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
} as const;

export interface PasswordPolicyResult {
  ok: boolean;
  reason?: "too-short" | "too-common" | "empty";
}

/** Minimum-strength policy: length ≥ 14 and not an obvious weak value. */
export function checkPasswordPolicy(password: string): PasswordPolicyResult {
  if (!password) return { ok: false, reason: "empty" };
  if (password.length < MIN_PASSWORD_LENGTH) return { ok: false, reason: "too-short" };
  const lowered = password.toLowerCase();
  const banned = ["password", "aaaaaaaaaaaaaa", "12345678901234", "akanilakanil"];
  if (banned.some((b) => lowered.includes(b))) return { ok: false, reason: "too-common" };
  return { ok: true };
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2ID_OPTIONS);
}

export async function verifyPassword(
  storedHash: string,
  password: string,
): Promise<boolean> {
  try {
    return await verify(storedHash, password, ARGON2ID_OPTIONS);
  } catch {
    // Malformed hash or verification error — treat as a failed match.
    return false;
  }
}
