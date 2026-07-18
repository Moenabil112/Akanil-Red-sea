import type {
  AudienceId,
  Locale,
  ReceptionContent,
  RequestTypeId,
} from "@/content/types";

/** Approved direct channels (Phase 3). */
export const RECEPTION_EMAIL = "akanil.consulting@proton.me";
export const RECEPTION_PHONE_E164 = "+212663177864";
export const RECEPTION_PHONE_DISPLAY = "+212 663 177 864";
export const RECEPTION_TEL_HREF = `tel:${RECEPTION_PHONE_E164}`;

export const requestTypeIds: RequestTypeId[] = [
  "briefing",
  "qualification",
  "value-chain",
  "meeting",
  "capability",
  "need-opportunity",
  "forum",
];

export const audienceIds: AudienceId[] = [
  "moroccan-institution",
  "moroccan-company",
  "sudanese-organization",
  "financial-partner",
  "sector-partner",
];

export function isRequestTypeId(value: string): value is RequestTypeId {
  return (requestTypeIds as string[]).includes(value);
}

export function isAudienceId(value: string): value is AudienceId {
  return (audienceIds as string[]).includes(value);
}

/** Data captured by the structured reception form. Nothing is persisted. */
export interface ReceptionRequest {
  requestType: RequestTypeId;
  audience?: AudienceId;
  organization: string;
  country: string;
  sector: string;
  contactName: string;
  role: string;
  email: string;
  summary: string;
  consent: boolean;
  phone?: string;
  website?: string;
  preferredLanguage?: string;
  valueChain?: string;
}

export type ReceptionField = keyof ReceptionRequest;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ValidationErrors = Partial<
  Record<ReceptionField, "required" | "email" | "consent" | "summaryLength">
>;

/** Minimum-necessary validation for the structured request. */
export function validateReceptionRequest(
  data: ReceptionRequest,
): ValidationErrors {
  const errors: ValidationErrors = {};
  const requiredText: ReceptionField[] = [
    "organization",
    "country",
    "sector",
    "contactName",
    "role",
  ];
  for (const field of requiredText) {
    if (!String(data[field] ?? "").trim()) errors[field] = "required";
  }
  if (!data.requestType) errors.requestType = "required";
  if (!String(data.email ?? "").trim()) errors.email = "required";
  else if (!EMAIL_PATTERN.test(data.email.trim())) errors.email = "email";
  if (!String(data.summary ?? "").trim()) errors.summary = "required";
  else if (data.summary.trim().length < 20) errors.summary = "summaryLength";
  if (!data.consent) errors.consent = "consent";
  return errors;
}

/**
 * Preselection parsing for audience-path deep links:
 * /[lang]/reception?type=qualification&audience=moroccan-company
 */
export function parsePreselection(params: {
  type?: string | null;
  audience?: string | null;
}): { requestType?: RequestTypeId; audience?: AudienceId } {
  const result: { requestType?: RequestTypeId; audience?: AudienceId } = {};
  if (params.type && isRequestTypeId(params.type)) {
    result.requestType = params.type;
  }
  if (params.audience && isAudienceId(params.audience)) {
    result.audience = params.audience;
  }
  return result;
}

/* ================================================================
   Transport adapter (ADR-009). The UI talks only to this interface,
   so an approved secure backend can replace the mailto transport
   later without redesigning the reception experience.
   ================================================================ */

export interface PreparedRequest {
  kind: "mailto";
  /** Fully encoded mailto: href the visitor explicitly activates. */
  href: string;
  to: string;
  subject: string;
  body: string;
}

export interface ReceptionTransport {
  prepare(
    locale: Locale,
    request: ReceptionRequest,
    content: ReceptionContent,
    audienceName?: string,
  ): PreparedRequest;
}

/** Localized structured email body. LTR runs are isolated for Arabic. */
export function buildEmailBody(
  locale: Locale,
  request: ReceptionRequest,
  content: ReceptionContent,
  audienceName?: string,
): string {
  const labels = content.email.fieldLabels;
  const typeLabel = content.requestTypes[request.requestType].label;
  // U+2066 LRI … U+2069 PDI isolate Latin runs inside RTL text.
  const isolate = (value: string) =>
    locale === "ar" ? `⁦${value}⁩` : value;
  const lines: string[] = [content.email.intro, ""];
  const push = (label: string, value: string | undefined, ltr = false) => {
    if (!value || !value.trim()) return;
    lines.push(`${label}: ${ltr ? isolate(value.trim()) : value.trim()}`);
  };
  push(labels.requestType, typeLabel);
  push(labels.audience, audienceName);
  push(labels.organization, request.organization);
  push(labels.country, request.country);
  push(labels.sector, request.sector);
  push(labels.contactName, request.contactName);
  push(labels.role, request.role);
  push(labels.email, request.email, true);
  push(labels.phone, request.phone, true);
  push(labels.website, request.website, true);
  push(labels.preferredLanguage, request.preferredLanguage);
  push(labels.valueChain, request.valueChain);
  lines.push("", `${labels.summary}:`, request.summary.trim());
  lines.push("", "—", content.email.outro);
  return lines.join("\n");
}

export function buildSubject(
  request: ReceptionRequest,
  content: ReceptionContent,
): string {
  const typeLabel = content.requestTypes[request.requestType].label;
  return `${content.email.subjectPrefix} ${typeLabel} — ${request.organization.trim()}`;
}

/** Default Phase 3 transport: a properly encoded mailto handoff. */
export const mailtoTransport: ReceptionTransport = {
  prepare(locale, request, content, audienceName) {
    const subject = buildSubject(request, content);
    const body = buildEmailBody(locale, request, content, audienceName);
    const href = `mailto:${RECEPTION_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    return { kind: "mailto", href, to: RECEPTION_EMAIL, subject, body };
  },
};
