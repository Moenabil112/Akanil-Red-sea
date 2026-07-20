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
export async function revokeAllSessions(employeeId: string): Promise<number> {
  const result = await prisma.session.updateMany({
    where: { employeeId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count;
}

/** Revoke a single session by id (session administration). */
export async function revokeSessionById(
  sessionId: string,
  employeeId?: string,
): Promise<number> {
  const result = await prisma.session.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
      ...(employeeId ? { employeeId } : {}),
    },
    data: { revokedAt: new Date() },
  });
  return result.count;
}

/**
 * P4-B session maintenance (§11): remove sessions that are already revoked or
 * fully expired. Never run automatically on public startup — invoked only by
 * the explicit `internal:sessions:cleanup` command.
 */
export async function cleanupExpiredSessions(now: Date = new Date()): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      OR: [
        { revokedAt: { not: null } },
        { absoluteExpiry: { lt: now } },
        { idleExpiry: { lt: now } },
      ],
    },
  });
  return result.count;
}

/**
 * Derive a privacy-minimized, coarse device label from a user-agent string.
 * Never stores the full UA and never an IP address.
 */
export function deviceLabelFromUserAgent(ua: string | null | undefined): string | null {
  if (!ua) return null;
  const browser = /Firefox/i.test(ua)
    ? "Firefox"
    : /Edg/i.test(ua)
      ? "Edge"
      : /Chrome/i.test(ua)
        ? "Chrome"
        : /Safari/i.test(ua)
          ? "Safari"
          : "Browser";
  const os = /Windows/i.test(ua)
    ? "Windows"
    : /Mac OS X|Macintosh/i.test(ua)
      ? "macOS"
      : /Android/i.test(ua)
        ? "Android"
        : /iPhone|iPad|iOS/i.test(ua)
          ? "iOS"
          : /Linux/i.test(ua)
            ? "Linux"
            : "Unknown OS";
  return `${browser} on ${os}`;
}
