import type { Locale, ReceptionContent } from "@/content/types";
import type {
  AudienceId,
  IntakeFieldId,
  RequestTypeId,
} from "@/content/ecosystem-types";
import {
  audienceRequestMatrix,
  intakeSchemas,
  isAudienceId,
  isRequestTypeId,
  type IntakeSchema,
} from "@/lib/ecosystem";

/** Approved direct channels (Phase 3). */
export const RECEPTION_EMAIL = "akanil.consulting@proton.me";
export const RECEPTION_PHONE_E164 = "+212663177864";
export const RECEPTION_PHONE_DISPLAY = "+212 663 177 864";
export const RECEPTION_TEL_HREF = `tel:${RECEPTION_PHONE_E164}`;

export { isAudienceId, isRequestTypeId };

/**
 * Data captured by the structured reception form (P0 §32, ADR-014).
 * Values live only in component state; nothing is persisted, uploaded
 * or transmitted by the site itself.
 */
export interface ReceptionRequest {
  requestType: RequestTypeId;
  audience?: AudienceId;
  /** Free-text values keyed by intake field. */
  values: Partial<Record<IntakeFieldId, string>>;
  /** Selected evidence-availability option ids (no uploads, P0 §32). */
  evidence: string[];
  consent: boolean;
}

export function emptyReceptionRequest(
  requestType: RequestTypeId,
  audience?: AudienceId,
): ReceptionRequest {
  return { requestType, audience, values: {}, evidence: [], consent: false };
}

/** The intake schema for the current request type. */
export function schemaFor(requestType: RequestTypeId): IntakeSchema {
  return intakeSchemas[requestType];
}

/** Fields rendered by the dynamic form, excluding meta/consent controls. */
export function visibleFields(
  schema: IntakeSchema,
): { required: IntakeFieldId[]; optional: IntakeFieldId[] } {
  const meta: IntakeFieldId[] = ["audience", "requestType", "consent"];
  return {
    required: schema.required.filter((field) => !meta.includes(field)),
    optional: schema.optional.filter((field) => !meta.includes(field)),
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ValidationCode = "required" | "email" | "consent" | "summaryLength";
export type ValidationErrors = Partial<Record<IntakeFieldId, ValidationCode>>;

/**
 * Minimum-necessary validation driven by the request-type schema: only
 * fields the schema requires are validated, so data collection never
 * exceeds the taxonomy (P0 §32).
 */
export function validateReceptionRequest(
  request: ReceptionRequest,
): ValidationErrors {
  const errors: ValidationErrors = {};
  const schema = schemaFor(request.requestType);
  for (const field of schema.required) {
    if (field === "consent" || field === "audience" || field === "requestType")
      continue;
    if (field === "evidenceAvailable") {
      if (request.evidence.length === 0) errors[field] = "required";
      continue;
    }
    const value = (request.values[field] ?? "").trim();
    if (!value) {
      errors[field] = "required";
      continue;
    }
    if (field === "email" && !EMAIL_PATTERN.test(value)) {
      errors[field] = "email";
    }
    if (field === "summary" && value.length < 20) {
      errors[field] = "summaryLength";
    }
  }
  if (!request.consent) errors.consent = "consent";
  return errors;
}

/**
 * Preselection parsing for deep links:
 * /[lang]/reception?type=market-expansion&audience=moroccan-industry-exporters
 * Invalid audience/type combinations fall back safely to the audience's
 * default request type; unknown values are ignored.
 */
export function parsePreselection(params: {
  type?: string | null;
  audience?: string | null;
}): { requestType?: RequestTypeId; audience?: AudienceId } {
  const result: { requestType?: RequestTypeId; audience?: AudienceId } = {};
  if (params.audience && isAudienceId(params.audience)) {
    result.audience = params.audience;
  }
  if (params.type && isRequestTypeId(params.type)) {
    result.requestType = params.type;
  }
  if (result.audience) {
    const matrix = audienceRequestMatrix[result.audience];
    if (!result.requestType || !matrix.allowed.includes(result.requestType)) {
      result.requestType = matrix.default;
    }
  }
  return result;
}

/** Request types offered for an audience (all nine when none selected). */
export function allowedRequestTypes(
  audience: AudienceId | undefined,
  all: RequestTypeId[],
): RequestTypeId[] {
  if (!audience) return all;
  return audienceRequestMatrix[audience].allowed;
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
  ): PreparedRequest;
}

const LTR_FIELDS: IntakeFieldId[] = ["email", "phone", "website"];

/** Localized structured email body. LTR runs are isolated for Arabic. */
export function buildEmailBody(
  locale: Locale,
  request: ReceptionRequest,
  content: ReceptionContent,
): string {
  const labels = content.email.fieldLabels;
  // U+2066 LRI … U+2069 PDI isolate Latin runs inside RTL text.
  const isolate = (value: string) => (locale === "ar" ? `⁦${value}⁩` : value);
  const lines: string[] = [content.email.intro, ""];
  const push = (label: string, value: string | undefined, ltr = false) => {
    if (!value || !value.trim()) return;
    lines.push(`${label}: ${ltr ? isolate(value.trim()) : value.trim()}`);
  };

  push(labels.requestType, content.requestTypes[request.requestType].label);
  if (request.audience) {
    push(labels.audience, content.audienceNames[request.audience]);
  }

  const schema = schemaFor(request.requestType);
  const ordered = [...schema.required, ...schema.optional];
  for (const field of ordered) {
    if (
      field === "audience" ||
      field === "requestType" ||
      field === "consent" ||
      field === "summary"
    )
      continue;
    if (field === "evidenceAvailable") {
      if (request.evidence.length > 0) {
        const evidenceLabels = request.evidence
          .map(
            (id) =>
              content.evidenceOptions.find((option) => option.id === id)?.label,
          )
          .filter(Boolean)
          .join(" · ");
        push(labels.evidenceAvailable, evidenceLabels);
      }
      continue;
    }
    push(labels[field], request.values[field], LTR_FIELDS.includes(field));
  }

  const summary = (request.values.summary ?? "").trim();
  if (summary) lines.push("", `${labels.summary}:`, summary);
  lines.push("", "—", content.email.outro);
  return lines.join("\n");
}

export function buildSubject(
  request: ReceptionRequest,
  content: ReceptionContent,
): string {
  const typeLabel = content.requestTypes[request.requestType].label;
  const organization = (request.values.organization ?? "").trim();
  return `${content.email.subjectPrefix} ${typeLabel} — ${organization}`;
}

/**
 * Local, non-authoritative `.txt` draft (P0 §33). Carries no case
 * number: the file is a convenience copy for the visitor, nothing more.
 */
export function buildDraftFile(
  locale: Locale,
  request: ReceptionRequest,
  content: ReceptionContent,
): { filename: string; text: string } {
  const subject = buildSubject(request, content);
  const body = buildEmailBody(locale, request, content);
  return {
    filename: "akanil-request-draft.txt",
    text: `${subject}\n\n${body}\n`,
  };
}

/** Default transport: a properly encoded mailto handoff. */
export const mailtoTransport: ReceptionTransport = {
  prepare(locale, request, content) {
    const subject = buildSubject(request, content);
    const body = buildEmailBody(locale, request, content);
    const href = `mailto:${RECEPTION_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    return { kind: "mailto", href, to: RECEPTION_EMAIL, subject, body };
  },
};
