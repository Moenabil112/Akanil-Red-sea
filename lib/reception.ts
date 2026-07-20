import type { Locale, ReceptionContent } from "@/content/types";
import type {
  AudienceId,
  IntakeFieldId,
  PlatformId,
  RequestTypeId,
} from "@/content/ecosystem-types";
import type { ValueChainId } from "@/content/value-chains-types";
import type {
  ForumParticipationPathId,
  ForumSectorTrackId,
} from "@/content/forum-types";
import {
  audienceRequestMatrix,
  intakeSchemas,
  isAudienceId,
  isPlatformId,
  isRequestTypeId,
  type IntakeSchema,
} from "@/lib/ecosystem";
import { isValueChainId } from "@/lib/value-chains";
import { isParticipationPathId, isSectorTrackId } from "@/lib/forum";

/** Approved direct channels (Phase 3). */
export const RECEPTION_EMAIL = "akanil.consulting@proton.me";
export const RECEPTION_PHONE_E164 = "+212663177864";
export const RECEPTION_PHONE_DISPLAY = "+212 663 177 864";
export const RECEPTION_TEL_HREF = `tel:${RECEPTION_PHONE_E164}`;

export {
  isAudienceId,
  isRequestTypeId,
  isPlatformId,
  isValueChainId,
  isParticipationPathId,
  isSectorTrackId,
};

/**
 * Data captured by the structured reception form (P0 §32, ADR-014).
 * Values live only in component state; nothing is persisted, uploaded
 * or transmitted by the site itself.
 */
export interface ReceptionRequest {
  requestType: RequestTypeId;
  audience?: AudienceId;
  /** Portfolio platform this request concerns (P1 §12), when arrived via a profile. */
  platform?: PlatformId;
  /** Value chain this request concerns (P2), when arrived via a chain profile. */
  chain?: ValueChainId;
  /** Forum participation path this request concerns (P3), when arrived via the Forum. */
  participant?: ForumParticipationPathId;
  /** Forum sector track this request concerns (P3). */
  track?: ForumSectorTrackId;
  /** Free-text values keyed by intake field. */
  values: Partial<Record<IntakeFieldId, string>>;
  /** Selected evidence-availability option ids (no uploads, P0 §32). */
  evidence: string[];
  consent: boolean;
}

export function emptyReceptionRequest(
  requestType: RequestTypeId,
  audience?: AudienceId,
  platform?: PlatformId,
  chain?: ValueChainId,
  participant?: ForumParticipationPathId,
  track?: ForumSectorTrackId,
): ReceptionRequest {
  return {
    requestType,
    audience,
    platform,
    chain,
    participant,
    track,
    values: {},
    evidence: [],
    consent: false,
  };
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
  platform?: string | null;
  chain?: string | null;
  participant?: string | null;
  track?: string | null;
}): {
  requestType?: RequestTypeId;
  audience?: AudienceId;
  platform?: PlatformId;
  chain?: ValueChainId;
  participant?: ForumParticipationPathId;
  track?: ForumSectorTrackId;
} {
  const result: {
    requestType?: RequestTypeId;
    audience?: AudienceId;
    platform?: PlatformId;
    chain?: ValueChainId;
    participant?: ForumParticipationPathId;
    track?: ForumSectorTrackId;
  } = {};
  if (params.audience && isAudienceId(params.audience)) {
    result.audience = params.audience;
  }
  if (params.type && isRequestTypeId(params.type)) {
    result.requestType = params.type;
  }
  if (params.platform && isPlatformId(params.platform)) {
    result.platform = params.platform;
  }
  if (params.chain && isValueChainId(params.chain)) {
    result.chain = params.chain;
  }
  if (params.participant && isParticipationPathId(params.participant)) {
    result.participant = params.participant;
  }
  if (params.track && isSectorTrackId(params.track)) {
    result.track = params.track;
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

/**
 * Localized display names for the context a request arrived with — a
 * portfolio platform (P1), a value chain (P2) or a Forum participation
 * path and sector track (P3). Resolved by the caller from the content
 * records; the transport is otherwise content-agnostic.
 */
export interface ReceptionContextNames {
  platformName?: string;
  chainName?: string;
  participantName?: string;
  trackName?: string;
}

export interface ReceptionTransport {
  prepare(
    locale: Locale,
    request: ReceptionRequest,
    content: ReceptionContent,
    names?: ReceptionContextNames,
  ): PreparedRequest;
}

const LTR_FIELDS: IntakeFieldId[] = ["email", "phone", "website"];

/** Localized structured email body. LTR runs are isolated for Arabic. */
export function buildEmailBody(
  locale: Locale,
  request: ReceptionRequest,
  content: ReceptionContent,
  names: ReceptionContextNames = {},
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
  if (request.platform && names.platformName) {
    push(labels.platform, names.platformName);
  }
  if (request.chain && names.chainName) {
    push(content.chainLabel, names.chainName);
  }
  if (request.participant && names.participantName) {
    push(content.participantLabel, names.participantName);
  }
  if (request.track && names.trackName) {
    push(content.trackLabel, names.trackName);
  }
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
    // Profile-derived platform is already listed above; skip the manual select.
    if (field === "platform" && request.platform) continue;
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
  names: ReceptionContextNames = {},
): string {
  const typeLabel = content.requestTypes[request.requestType].label;
  const organization = (request.values.organization ?? "").trim();
  const parts = [
    request.platform ? names.platformName : undefined,
    request.chain ? names.chainName : undefined,
    request.participant ? names.participantName : undefined,
    request.track ? names.trackName : undefined,
  ]
    .filter((part): part is string => Boolean(part))
    .map((part) => ` · ${part}`)
    .join("");
  return `${content.email.subjectPrefix} ${typeLabel}${parts} — ${organization}`;
}

/**
 * Local, non-authoritative `.txt` draft (P0 §33). Carries no case
 * number: the file is a convenience copy for the visitor, nothing more.
 */
export function buildDraftFile(
  locale: Locale,
  request: ReceptionRequest,
  content: ReceptionContent,
  names: ReceptionContextNames = {},
): { filename: string; text: string } {
  const subject = buildSubject(request, content, names);
  const body = buildEmailBody(locale, request, content, names);
  return {
    filename: "akanil-request-draft.txt",
    text: `${subject}\n\n${body}\n`,
  };
}

/** Default transport: a properly encoded mailto handoff. */
export const mailtoTransport: ReceptionTransport = {
  prepare(locale, request, content, names = {}) {
    const subject = buildSubject(request, content, names);
    const body = buildEmailBody(locale, request, content, names);
    const href = `mailto:${RECEPTION_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    return { kind: "mailto", href, to: RECEPTION_EMAIL, subject, body };
  },
};
