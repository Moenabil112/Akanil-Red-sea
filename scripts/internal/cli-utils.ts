import { createInterface } from "node:readline/promises";

/**
 * Shared helpers for the administrative CLI scripts (P4-A §6). Passwords are
 * read only from an environment variable — never from argv (which would leak
 * into shell history and process listings) — and are never printed or logged.
 */

export function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token || !token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      out[key] = next;
      i++;
    } else {
      out[key] = true;
    }
  }
  return out;
}

export async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(`${question} [y/N] `)).trim().toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

export function requirePasswordEnv(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    console.error(
      `Refusing to proceed: set ${varName} (the password is read from the environment, never from the command line).`,
    );
    process.exit(1);
  }
  return value;
}

export function fail(message: string): never {
  console.error(`Error: ${message}`);
  process.exit(1);
}
