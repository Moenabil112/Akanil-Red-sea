import { describe, expect, it } from "vitest";
import {
  RECEPTION_EMAIL,
  RECEPTION_PHONE_E164,
  RECEPTION_TEL_HREF,
  buildEmailBody,
  buildSubject,
  mailtoTransport,
  parsePreselection,
  validateReceptionRequest,
  type ReceptionRequest,
} from "@/lib/reception";
import { enReception } from "@/content/en/reception";
import { arReception } from "@/content/ar/reception";
import { switchLocalePath, localizedPath } from "@/lib/routes";

const validRequest: ReceptionRequest = {
  requestType: "qualification",
  organization: "Atlas Industries",
  country: "Morocco",
  sector: "Food processing",
  contactName: "K. Alaoui",
  role: "Export director",
  email: "export@atlas.example",
  summary:
    "We produce packaged food products and want to understand the qualification path.",
  consent: true,
  phone: "+212600000000",
};

describe("reception validation", () => {
  it("accepts a complete request", () => {
    expect(validateReceptionRequest(validRequest)).toEqual({});
  });

  it("requires the minimum structured fields", () => {
    const errors = validateReceptionRequest({
      ...validRequest,
      organization: " ",
      country: "",
      email: "",
    });
    expect(errors.organization).toBe("required");
    expect(errors.country).toBe("required");
    expect(errors.email).toBe("required");
  });

  it("rejects invalid professional emails and short summaries", () => {
    expect(
      validateReceptionRequest({ ...validRequest, email: "not-an-email" })
        .email,
    ).toBe("email");
    expect(
      validateReceptionRequest({ ...validRequest, summary: "too short" })
        .summary,
    ).toBe("summaryLength");
  });

  it("requires explicit consent", () => {
    expect(
      validateReceptionRequest({ ...validRequest, consent: false }).consent,
    ).toBe("consent");
  });
});

describe("audience-path preselection", () => {
  it("accepts known type and audience ids", () => {
    expect(
      parsePreselection({ type: "forum", audience: "financial-partner" }),
    ).toEqual({ requestType: "forum", audience: "financial-partner" });
  });

  it("ignores unknown or missing values", () => {
    expect(parsePreselection({ type: "hack", audience: null })).toEqual({});
    expect(parsePreselection({ type: null, audience: "x" })).toEqual({});
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
    expect(prepared.href).toContain(
      encodeURIComponent("Atlas Industries"),
    );
    // Raw spaces and newlines must never leak unencoded into the href.
    expect(prepared.href).not.toMatch(/[ \n]/);
  });

  it("builds a localized subject with type and organization", () => {
    expect(buildSubject(validRequest, enReception)).toBe(
      "[Gateway Reception] Company qualification — Atlas Industries",
    );
    expect(buildSubject(validRequest, arReception)).toContain(
      "[استقبال البوابة]",
    );
  });

  it("includes structured fields and outro in the body", () => {
    const body = buildEmailBody("en", validRequest, enReception);
    expect(body).toContain("Organization: Atlas Industries");
    expect(body).toContain("Request summary");
    expect(body).toContain(enReception.email.outro);
  });

  it("isolates LTR runs inside the Arabic body", () => {
    const body = buildEmailBody("ar", validRequest, arReception);
    expect(body).toContain("⁦export@atlas.example⁩");
    expect(body).toContain("⁦+212600000000⁩");
  });

  it("omits empty optional fields from the body", () => {
    const body = buildEmailBody(
      "en",
      { ...validRequest, phone: "", website: "" },
      enReception,
    );
    expect(body).not.toContain("Telephone:");
    expect(body).not.toContain("Website:");
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
