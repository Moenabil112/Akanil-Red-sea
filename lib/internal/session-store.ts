import { createHash } from "node:crypto";
import { prisma } from "./db";

/**
 * Prisma-only session helpers (no next/headers), so they are safe to import
 * from administrative CLI scripts that run outside a Next.js request.
 */

export function hashSessionToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Revoke every active session for an employee (password reset / disable). */
export async function revokeAllSessions(employeeId: string): Promise<void> {
  await prisma.session.updateMany({
    where: { employeeId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
