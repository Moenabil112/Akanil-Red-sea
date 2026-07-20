import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import pkg from "@/package.json";

/**
 * P4-B boundary and no-regression guarantees (§25/§26/§30). These scans fail
 * the build if a forbidden external capability is (re)introduced by P4-B, and
 * confirm the pilot controls and public/internal separation remain intact.
 */

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "generated" || entry === "node_modules") continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(path);
  }
  return out;
}

const root = process.cwd();
const internalFiles = [
  join(root, "lib", "internal"),
  join(root, "app", "[lang]", "internal"),
  join(root, "content", "internal"),
  join(root, "scripts", "internal"),
].flatMap((dir) => walk(dir));
const source = internalFiles.map((f) => readFileSync(f, "utf8")).join("\n");

describe("no external-capability regression (§25)", () => {
  it("introduces no file upload or object storage", () => {
    expect(source).not.toMatch(/type=["']file["']/);
    expect(source).not.toMatch(/multipart\/form-data/);
    expect(source).not.toMatch(/getSignedUrl|createPresignedPost|presign/i);
    expect(source).not.toMatch(/@aws-sdk|aws-sdk|multer|formidable/i);
  });

  it("introduces no external notification / messaging / calendar provider", () => {
    expect(source).not.toMatch(/nodemailer|sendgrid|mailgun|postmark|twilio|whatsapp|web-push|firebase-admin|node-ical|ical-generator|calendar-link/i);
  });

  it("introduces no external webhook or AI provider", () => {
    expect(source).not.toMatch(/webhook/i);
    expect(source).not.toMatch(/\bopenai\b|@anthropic|anthropic-ai|cohere-ai|replicate\.com|langchain/i);
  });

  it("adds no external-capability dependencies to package.json", () => {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies } as Record<string, string>;
    const forbidden = [
      "nodemailer", "@sendgrid/mail", "twilio", "web-push", "aws-sdk", "@aws-sdk/client-s3",
      "openai", "@anthropic-ai/sdk", "cohere-ai", "langchain", "googleapis", "firebase-admin",
      "multer", "formidable", "next-auth",
    ];
    for (const f of forbidden) expect(deps[f]).toBeUndefined();
  });

  it("exposes no self-registration or external-invitation action in the internal UI", () => {
    expect(source).not.toMatch(/Sign up|Create account|Send invitation|invite external/i);
  });
});

describe("pilot controls remain enforced (§5/§19)", () => {
  it("keeps the operating mode fail-closed and mutation gating on the server", () => {
    const env = readFileSync(join(root, "lib", "internal", "env.ts"), "utf8");
    expect(env).toContain("operationMode");
    expect(env).toContain("internalMutationsAllowed");
    expect(env).toContain("pilotSuspended");
    // Defaults to disabled / not-suspended without explicit env.
    expect(env).toMatch(/return "disabled"/);
  });

  it("enforces the pilot-cohort gate on operational actions", () => {
    const actions = readFileSync(join(root, "app", "[lang]", "internal", "actions.ts"), "utf8");
    expect(actions).toContain("assertPilotOperational");
  });

  it("chains audit events with a tamper-evident hash", () => {
    const schema = readFileSync(join(root, "prisma", "schema.prisma"), "utf8");
    expect(schema).toContain("sequenceNumber");
    expect(schema).toContain("previousEventHash");
    expect(schema).toContain("eventHash");
  });
});

describe("public/internal separation preserved (§26)", () => {
  it("keeps public reception on mailto and disconnected from the internal DB", () => {
    const reception = readFileSync(join(root, "lib", "reception.ts"), "utf8");
    expect(reception).toContain("mailto:");
    expect(reception).not.toMatch(/lib\/internal|prisma/);
  });
  it("keeps internal routes out of the public sitemap and noindexed", () => {
    const sitemap = readFileSync(join(root, "app", "sitemap.ts"), "utf8");
    expect(sitemap.toLowerCase()).not.toContain("internal");
    const middleware = readFileSync(join(root, "middleware.ts"), "utf8");
    expect(middleware).toContain("noindex");
    expect(middleware).toContain("no-store");
  });
});
