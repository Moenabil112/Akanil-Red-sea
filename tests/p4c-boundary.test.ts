import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import pkg from "@/package.json";

/**
 * P4-C boundary and no-regression guarantees (§26/§35). The limited_internal
 * mode must not introduce any external capability, must not weaken a P4-B
 * control, and must not add automatic Go/No-Go, automatic environment changes
 * or deployment actions.
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
const source = [
  join(root, "lib", "internal"),
  join(root, "app", "[lang]", "internal"),
  join(root, "content", "internal"),
  join(root, "scripts", "internal"),
].flatMap((d) => walk(d)).map((f) => readFileSync(f, "utf8")).join("\n");

describe("no external-capability regression (§26)", () => {
  it("adds no upload, storage, signed URLs, notification, webhook or AI provider", () => {
    expect(source).not.toMatch(/type=["']file["']|multipart\/form-data/);
    expect(source).not.toMatch(/getSignedUrl|createPresignedPost|@aws-sdk|aws-sdk|multer|formidable/i);
    expect(source).not.toMatch(/nodemailer|sendgrid|mailgun|postmark|twilio|whatsapp|web-push|firebase-admin|node-ical|ical-generator/i);
    expect(source).not.toMatch(/webhook/i);
    expect(source).not.toMatch(/\bopenai\b|@anthropic|anthropic-ai|cohere-ai|replicate\.com|langchain/i);
  });
  it("adds no external-capability dependencies", () => {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies } as Record<string, string>;
    for (const f of ["nodemailer", "@sendgrid/mail", "twilio", "web-push", "aws-sdk", "@aws-sdk/client-s3", "openai", "@anthropic-ai/sdk", "langchain", "googleapis", "multer", "next-auth"]) {
      expect(deps[f]).toBeUndefined();
    }
  });
  it("exposes no self-registration or external-invitation action", () => {
    expect(source).not.toMatch(/Sign up|Create account|Send invitation|invite external/i);
  });
});

describe("no automatic go-live / environment change / deployment (§19/§35)", () => {
  it("never mutates the operating-mode env vars from the app", () => {
    expect(source).not.toMatch(/process\.env\.P4_OPERATION_MODE\s*=(?!=)/);
    expect(source).not.toMatch(/process\.env\.P4_INTERNAL_ENABLED\s*=(?!=)/);
    expect(source).not.toMatch(/process\.env\.P4_PILOT_SUSPENDED\s*=(?!=)/);
  });
  it("takes no deployment action", () => {
    expect(source).not.toMatch(/vercel deploy|deployToVercel|\bkubectl\b|\bdocker push\b/i);
  });
});

describe("limited_internal keeps controls intact (§8)", () => {
  it("requires an active authorization beyond the environment mode", () => {
    const env = readFileSync(join(root, "lib", "internal", "env.ts"), "utf8");
    expect(env).toContain("limited_internal");
    const pilot = readFileSync(join(root, "lib", "internal", "pilot.ts"), "utf8");
    expect(pilot).toContain("assertLimitedInternalAuthorized");
    const limited = readFileSync(join(root, "lib", "internal", "services", "limited-operations.ts"), "utf8");
    expect(limited).toContain("EMPLOYEE_LIMIT_EXCEEDED");
    expect(limited).toContain("CASE_LIMIT_EXCEEDED");
    expect(limited).toContain("authorizationBlockers");
  });
});

describe("public/internal separation preserved (§26)", () => {
  it("keeps operations routes out of the public sitemap and reception mailto-based", () => {
    const sitemap = readFileSync(join(root, "app", "sitemap.ts"), "utf8");
    expect(sitemap.toLowerCase()).not.toContain("internal");
    const reception = readFileSync(join(root, "lib", "reception.ts"), "utf8");
    expect(reception).toContain("mailto:");
    expect(reception).not.toMatch(/lib\/internal|prisma/);
  });
});
