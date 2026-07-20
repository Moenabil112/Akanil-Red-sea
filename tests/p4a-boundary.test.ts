import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { redactFields } from "@/lib/internal/audit";
import { enExperience } from "@/content/en/experience";
import pkg from "@/package.json";

/**
 * P4-A boundary and prohibited-feature guarantees (§27.5–§27.7). These
 * scans fail the build if a forbidden capability is (re)introduced.
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

const allInternalSource = internalFiles
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

/* ---------------- Public / internal boundary (§27.5) ---------------- */

describe("public/internal boundary", () => {
  it("keeps public reception on the mailto transport (no P4 API)", () => {
    const reception = readFileSync(join(root, "lib", "reception.ts"), "utf8");
    expect(reception).toContain("mailto:");
    expect(reception).not.toMatch(/\bfetch\s*\(/);
    expect(reception).not.toMatch(/lib\/internal/);
  });

  it("does not connect the public reception UI to the internal database", () => {
    const desk = readFileSync(
      join(root, "components", "reception", "ReceptionDesk.tsx"),
      "utf8",
    );
    expect(desk).not.toMatch(/lib\/internal|prisma|@\/lib\/generated/);
  });

  it("keeps internal routes out of the public sitemap", () => {
    const sitemap = readFileSync(join(root, "app", "sitemap.ts"), "utf8");
    expect(sitemap.toLowerCase()).not.toContain("internal");
  });

  it("disallows internal routes in robots and marks them noindex", () => {
    const robots = readFileSync(join(root, "app", "robots.ts"), "utf8");
    expect(robots).toContain("/en/internal/");
    const middleware = readFileSync(join(root, "middleware.ts"), "utf8");
    expect(middleware).toContain("noindex");
    expect(middleware).toContain("no-store");
    const layout = readFileSync(
      join(root, "app", "[lang]", "internal", "layout.tsx"),
      "utf8",
    );
    expect(layout).toMatch(/index:\s*false/);
  });

  it("adds no public navigation link to the internal app", () => {
    const nav = JSON.stringify([enExperience.navGroups, enExperience.footerNav]);
    expect(nav.toLowerCase()).not.toContain("internal");
  });

  it("never claims a public case number on the public site", () => {
    const publicContent = [
      readFileSync(join(root, "content", "en", "reception.ts"), "utf8"),
      readFileSync(join(root, "lib", "reception.ts"), "utf8"),
    ].join("\n");
    expect(publicContent).not.toMatch(/AKN-\d{4}/);
    expect(publicContent.toLowerCase()).not.toContain("case number");
  });
});

/* ---------------- Prohibited features (§27.6) ---------------- */

describe("prohibited features are absent from the internal app", () => {
  it("contains no file upload control or endpoint", () => {
    expect(allInternalSource).not.toMatch(/type=["']file["']/);
    expect(allInternalSource).not.toMatch(/multipart\/form-data/);
    expect(allInternalSource.toLowerCase()).not.toContain("presigned");
  });

  it("imports no storage, email, sms, calendar, webhook or AI SDKs", () => {
    const bannedImports = [
      /@aws-sdk/,
      /@google-cloud\/storage/,
      /\bmulter\b/,
      /\bformidable\b/,
      /nodemailer/,
      /@sendgrid/,
      /\bresend\b/,
      /postmark/,
      /\btwilio\b/,
      /whatsapp/i,
      /googleapis/,
      /\bopenai\b/,
      /@anthropic/,
      /\bcohere\b/,
    ];
    for (const pattern of bannedImports) {
      expect(pattern.test(allInternalSource), `internal source matches ${pattern}`).toBe(false);
    }
  });

  it("declares none of those SDKs as dependencies", () => {
    const deps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    } as Record<string, string>;
    const bannedPackages = [
      "@aws-sdk/client-s3",
      "@google-cloud/storage",
      "multer",
      "formidable",
      "nodemailer",
      "@sendgrid/mail",
      "resend",
      "postmark",
      "twilio",
      "googleapis",
      "openai",
      "@anthropic-ai/sdk",
      "cohere-ai",
      "next-auth",
    ];
    for (const name of bannedPackages) {
      expect(deps[name], `unexpected dependency ${name}`).toBeUndefined();
    }
  });

  it("exposes no self-registration or external-invitation flow", () => {
    // No route directory named register/signup/invite under internal.
    const routeDirs = internalFiles.join("\n").toLowerCase();
    expect(routeDirs).not.toMatch(/internal[/\\](register|signup|invite)/);
    // The login page states there is no self-registration.
    const dict = readFileSync(join(root, "content", "internal", "dictionary.ts"), "utf8");
    expect(dict.toLowerCase()).toContain("no self-registration");
  });
});

/* ---------------- Privacy (§27.7) ---------------- */

describe("privacy: sensitive identity fields are never collected", () => {
  it("collects no passport, national identifier or banking fields", () => {
    const schema = readFileSync(join(root, "prisma", "schema.prisma"), "utf8").toLowerCase();
    const forbidden = ["passport", "nationalid", "national_id", "iban", "bankaccount", "bank_account", "creditcard"];
    for (const term of forbidden) {
      expect(schema, `schema mentions ${term}`).not.toContain(term);
      expect(allInternalSource.toLowerCase(), `internal UI mentions ${term}`).not.toContain(term);
    }
  });

  it("redacts secrets from audit change diffs", () => {
    const redacted = redactFields({
      password: "hunter2000000",
      passwordHash: "$argon2id$...",
      tokenHash: "abc",
      status: "ACTIVE",
    });
    expect(redacted?.password).toBe("[redacted]");
    expect(redacted?.passwordHash).toBe("[redacted]");
    expect(redacted?.tokenHash).toBe("[redacted]");
    expect(redacted?.status).toBe("ACTIVE");
  });
});
