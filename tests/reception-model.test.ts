import { describe, expect, it } from "vitest";
import {
  RECEPTION_EMAIL,
  RECEPTION_PHONE_E164,
  RECEPTION_TEL_HREF,
  allowedRequestTypes,
  buildDraftFile,
  buildEmailBody,
  buildSubject,
  emptyReceptionRequest,
  mailtoTransport,
  parsePreselection,
  schemaFor,
  validateReceptionRequest,
  type ReceptionRequest,
} from "@/lib/reception";
import { audienceRequestMatrix, requestTypeIds } from "@/lib/ecosystem";
import { enReception } from "@/content/en/reception";
import { arReception } from "@/content/ar/reception";
import { switchLocalePath, localizedPath } from "@/lib/routes";

const validRequest: ReceptionRequest = {
  requestType: "market-expansion",
  audience: "moroccan-industry-exporters",
  values: {
    organization: "Atlas Industries",
    country: "Morocco",
    sector: "Food processing",
    contactName: "K. Alaoui",
    role: "Export director",
    email: "export@atlas.example",
    targetMarket: "Sudan and the Horn of Africa",
    summary:
      "We produce packaged food products and want a structured market-entry review.",
    phone: "+212600000000",
  },
  evidence: [],
  consent: true,
};

describe("schema-driven reception validation", () => {
  it("accepts a complete request for its schema", () => {
    expect(validateReceptionRequest(validRequest)).toEqual({});
  });

  it("requires the schema's required fields only", () => {
    const errors = validateReceptionRequest({
      ...validRequest,
      values: {
        ...validRequest.values,
        organization: " ",
        country: "",
        email: "",
        targetMarket: "",
      },
    });
    expect(errors.organization).toBe("required");
    expect(errors.country).toBe("required");
    expect(errors.email).toBe("required");
    expect(errors.targetMarket).toBe("required");
  });

  it("does not require fields outside the request schema", () => {
    // projectName is required for submit-project-asset, not market-expansion.
    expect(validateReceptionRequest(validRequest).projectName).toBeUndefined();
    const submission = validateReceptionRequest({
      ...emptyReceptionRequest("submit-project-asset"),
      consent: true,
    });
    expect(submission.projectName).toBe("required");
    expect(submission.assetType).toBe("required");
    expect(submission.location).toBe("required");
  });

  it("rejects invalid professional emails and short summaries", () => {
    expect(
      validateReceptionRequest({
        ...validRequest,
        values: { ...validRequest.values, email: "not-an-email" },
      }).email,
    ).toBe("email");
    expect(
      validateReceptionRequest({
        ...validRequest,
        values: { ...validRequest.values, summary: "too short" },
      }).summary,
    ).toBe("summaryLength");
  });

  it("requires explicit consent", () => {
    expect(
      validateReceptionRequest({ ...validRequest, consent: false }).consent,
    ).toBe("consent");
  });
});

describe("audience-path preselection and safe fallback", () => {
  it("accepts known type and audience combinations", () => {
    expect(
      parsePreselection({
        type: "market-expansion",
        audience: "moroccan-industry-exporters",
      }),
    ).toEqual({
      requestType: "market-expansion",
      audience: "moroccan-industry-exporters",
    });
  });

  it("falls back to the audience default for disallowed combinations", () => {
    const result = parsePreselection({
      type: "port-logistics-cooperation",
      audience: "moroccan-institutions",
    });
    expect(result.audience).toBe("moroccan-institutions");
    expect(result.requestType).toBe(
      audienceRequestMatrix["moroccan-institutions"].default,
    );
  });

  it("ignores unknown or missing values", () => {
    expect(parsePreselection({ type: "hack", audience: null })).toEqual({});
    expect(parsePreselection({ type: null, audience: "x" })).toEqual({});
  });

  it("restricts request types to the audience matrix", () => {
    for (const [audience, matrix] of Object.entries(audienceRequestMatrix)) {
      const allowed = allowedRequestTypes(
        audience as keyof typeof audienceRequestMatrix,
        requestTypeIds,
      );
      expect(allowed).toEqual(matrix.allowed);
      expect(allowed).toContain(matrix.default);
    }
    expect(allowedRequestTypes(undefined, requestTypeIds)).toEqual(
      requestTypeIds,
    );
  });
});

describe("mailto transport", () => {
  it("addresses the approved reception inbox with an encoded subject and body", () => {
    const prepared = mailtoTransport.prepare("en", validRequest, enReception);
    expect(prepared.kind).toBe("mailto");
    expect(prepared.to).toBe(RECEPTION_EMAIL);
    expect(prepared.href.startsWith(`mailto:${RECEPTION_EMAIL}?subject=`)).toBe(
      true,
    );
    expect(prepared.href).toContain(encodeURIComponent("[Gateway Reception]"));
    expect(prepared.href).toContain(encodeURIComponent("Atlas Industries"));
    // Raw spaces and newlines must never leak unencoded into the href.
    expect(prepared.href).not.toMatch(/[ \n]/);
  });

  it("builds a localized subject with type and organization", () => {
    expect(buildSubject(validRequest, enReception)).toBe(
      "[Gateway Reception] Market expansion — Atlas Industries",
    );
    expect(buildSubject(validRequest, arReception)).toContain(
      "[استقبال البوابة]",
    );
  });

  it("includes schema fields, audience and outro in the body", () => {
    const body = buildEmailBody("en", validRequest, enReception);
    expect(body).toContain("Organization: Atlas Industries");
    expect(body).toContain("Entry path: Moroccan industry and exporters");
    expect(body).toContain("Target market: Sudan and the Horn of Africa");
    expect(body).toContain("Request summary");
    expect(body).toContain(enReception.email.outro);
  });

  it("lists selected evidence labels without any file transfer", () => {
    const withEvidence: ReceptionRequest = {
      ...validRequest,
      requestType: "project-investment-review",
      values: { ...validRequest.values, projectName: "Northern hub" },
      evidence: ["technical-study", "market-study"],
    };
    const body = buildEmailBody("en", withEvidence, enReception);
    expect(body).toContain("Evidence available: Technical study · Market study");
    expect(body).not.toMatch(/attach|upload/i);
  });

  it("isolates LTR runs inside the Arabic body", () => {
    const body = buildEmailBody("ar", validRequest, arReception);
    expect(body).toContain("⁦export@atlas.example⁩");
    expect(body).toContain("⁦+212600000000⁩");
  });

  it("omits empty optional fields from the body", () => {
    const body = buildEmailBody(
      "en",
      {
        ...validRequest,
        values: { ...validRequest.values, phone: "", website: "" },
      },
      enReception,
    );
    expect(body).not.toContain("Telephone:");
    expect(body).not.toContain("Website:");
  });
});

describe("local draft download", () => {
  it("produces a plain-text draft without any case number", () => {
    const draft = buildDraftFile("en", validRequest, enReception);
    expect(draft.filename.endsWith(".txt")).toBe(true);
    expect(draft.text).toContain("Atlas Industries");
    expect(draft.text).not.toMatch(/case\s*(no|number|#)|reference\s*number/i);
  });
});

describe("intake schemas stay minimal", () => {
  it("keeps every request type's required set small and purposeful", () => {
    for (const typeId of requestTypeIds) {
      const schema = schemaFor(typeId);
      expect(schema.required.length).toBeLessThanOrEqual(12);
      for (const base of ["organization", "email", "summary", "consent"]) {
        expect(schema.required).toContain(base);
      }
    }
  });
});

describe("direct telephone channel", () => {
  it("uses the approved E.164 tel href", () => {
    expect(RECEPTION_TEL_HREF).toBe("tel:+212663177864");
    expect(RECEPTION_PHONE_E164).toBe("+212663177864");
  });
});

describe("locale-preserving routing helpers", () => {
  it("switches locale while preserving the route", () => {
    expect(switchLocalePath("/ar/corridor", "fr")).toBe("/fr/corridor");
    expect(switchLocalePath("/fr/forum", "en")).toBe("/en/forum");
    expect(switchLocalePath("/en/reception", "ar")).toBe("/ar/reception");
    expect(switchLocalePath("/ar/portfolio", "en")).toBe("/en/portfolio");
  });

  it("preserves hashes and handles the home route", () => {
    expect(switchLocalePath("/ar#chains", "fr")).toBe("/fr#chains");
    expect(switchLocalePath("/en", "ar")).toBe("/ar");
  });

  it("builds localized paths", () => {
    expect(localizedPath("ar", "/gateway")).toBe("/ar/gateway");
    expect(localizedPath("fr", "/")).toBe("/fr");
  });
});
