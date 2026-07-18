"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  AudienceId,
  ExperienceContent,
  Locale,
  ReceptionContent,
  RequestTypeId,
  SiteContent,
} from "@/content/types";
import {
  RECEPTION_EMAIL,
  RECEPTION_PHONE_DISPLAY,
  RECEPTION_TEL_HREF,
  mailtoTransport,
  parsePreselection,
  requestTypeIds,
  validateReceptionRequest,
  type ReceptionRequest,
  type ValidationErrors,
} from "@/lib/reception";
import styles from "./ReceptionDesk.module.css";

type Step = "form" | "review" | "opened";

interface ReceptionDeskProps {
  locale: Locale;
  reception: ReceptionContent;
  experience: ExperienceContent;
  site: SiteContent;
}

const emptyRequest = (requestType: RequestTypeId): ReceptionRequest => ({
  requestType,
  organization: "",
  country: "",
  sector: "",
  contactName: "",
  role: "",
  email: "",
  summary: "",
  consent: false,
  phone: "",
  website: "",
  preferredLanguage: "",
  valueChain: "",
});

/**
 * Digital Reception Lite (Phase 3, ADR-009).
 * Deliberately limited: the data lives only in this component's state,
 * is never persisted anywhere, and leaves the page only when the visitor
 * explicitly opens the prepared email in their own email application.
 */
export default function ReceptionDesk({
  locale,
  reception,
  experience,
  site,
}: ReceptionDeskProps) {
  const searchParams = useSearchParams();
  const pre = useMemo(
    () =>
      parsePreselection({
        type: searchParams.get("type"),
        audience: searchParams.get("audience"),
      }),
    [searchParams],
  );

  const [step, setStep] = useState<Step>("form");
  const [audience] = useState<AudienceId | undefined>(pre.audience);
  const [data, setData] = useState<ReceptionRequest>(() => ({
    ...emptyRequest(pre.requestType ?? "briefing"),
    audience: pre.audience,
  }));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const audiencePath = audience
    ? experience.audiences.paths.find((p) => p.id === audience)
    : undefined;

  const set = <K extends keyof ReceptionRequest>(
    key: K,
    value: ReceptionRequest[K],
  ) => setData((current) => ({ ...current, [key]: value }));

  const errorText = (key: keyof ValidationErrors): string | undefined => {
    const code = errors[key];
    if (!code) return undefined;
    return reception.form.errors[
      code === "required"
        ? "required"
        : code === "email"
          ? "email"
          : code === "consent"
            ? "consent"
            : "summaryLength"
    ];
  };

  const onReview = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validateReceptionRequest(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    setStep("review");
    window.scrollTo({ top: 0 });
  };

  const prepared = useMemo(
    () =>
      mailtoTransport.prepare(locale, data, reception, audiencePath?.name),
    [locale, data, reception, audiencePath],
  );

  const field = (
    key: keyof ReceptionRequest & string,
    label: string,
    options?: {
      type?: string;
      required?: boolean;
      hint?: string;
    },
  ) => {
    const error = errorText(key as keyof ValidationErrors);
    const id = `rc-${key}`;
    return (
      <div className={styles.field}>
        <label htmlFor={id} className={styles.label}>
          {label}{" "}
          <span className={styles.mark}>
            (
            {options?.required
              ? reception.form.requiredMark
              : reception.form.optionalMark}
            )
          </span>
        </label>
        {options?.hint ? (
          <p id={`${id}-hint`} className={styles.hint}>
            {options.hint}
          </p>
        ) : null}
        <input
          id={id}
          type={options?.type ?? "text"}
          dir={
            options?.type === "email" ||
            options?.type === "tel" ||
            options?.type === "url"
              ? "ltr"
              : undefined
          }
          className={error ? styles.inputError : styles.input}
          value={String(data[key] ?? "")}
          required={options?.required}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [options?.hint ? `${id}-hint` : null, error ? `${id}-error` : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          onChange={(event) =>
            set(key, event.target.value as ReceptionRequest[typeof key])
          }
        />
        {error ? (
          <p id={`${id}-error`} className={styles.error}>
            {error}
          </p>
        ) : null}
      </div>
    );
  };

  if (step === "review" || step === "opened") {
    const summaryRows: [string, string, boolean?][] = [
      [
        reception.email.fieldLabels.requestType,
        reception.requestTypes[data.requestType].label,
      ],
      ...(audiencePath
        ? ([[reception.email.fieldLabels.audience, audiencePath.name]] as [
            string,
            string,
          ][])
        : []),
      [reception.email.fieldLabels.organization, data.organization],
      [reception.email.fieldLabels.country, data.country],
      [reception.email.fieldLabels.sector, data.sector],
      [reception.email.fieldLabels.contactName, data.contactName],
      [reception.email.fieldLabels.role, data.role],
      [reception.email.fieldLabels.email, data.email, true],
      ...(data.phone?.trim()
        ? ([[reception.email.fieldLabels.phone, data.phone, true]] as [
            string,
            string,
            boolean,
          ][])
        : []),
      ...(data.website?.trim()
        ? ([[reception.email.fieldLabels.website, data.website, true]] as [
            string,
            string,
            boolean,
          ][])
        : []),
      ...(data.preferredLanguage?.trim()
        ? ([
            [
              reception.email.fieldLabels.preferredLanguage,
              data.preferredLanguage,
            ],
          ] as [string, string][])
        : []),
      ...(data.valueChain?.trim()
        ? ([[reception.email.fieldLabels.valueChain, data.valueChain]] as [
            string,
            string,
          ][])
        : []),
      [reception.email.fieldLabels.summary, data.summary],
    ];

    return (
      <div className={styles.stage}>
        {step === "opened" ? (
          <div className={styles.openedNote} role="status">
            <h3 className={styles.openedTitle}>{reception.afterOpen.title}</h3>
            <p className={styles.openedText}>{reception.afterOpen.text}</p>
            <p className={styles.openedWarning}>
              {reception.afterOpen.notSentWarning}
            </p>
            <dl className={styles.channels}>
              <div>
                <dt>{reception.emailChannelLabel}</dt>
                <dd>
                  <a className="latin-run" href={`mailto:${RECEPTION_EMAIL}`}>
                    {RECEPTION_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{reception.phoneChannelLabel}</dt>
                <dd>
                  <a className="latin-run" dir="ltr" href={RECEPTION_TEL_HREF}>
                    {RECEPTION_PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <>
            <h3 className={styles.reviewTitle}>{reception.review.title}</h3>
            <p className={styles.reviewLead}>{reception.review.lead}</p>
          </>
        )}

        <dl className={styles.reviewList}>
          {summaryRows.map(([label, value, ltr]) => (
            <div key={label} className={styles.reviewRow}>
              <dt className={styles.reviewLabel}>{label}</dt>
              <dd className={styles.reviewValue}>
                {ltr ? (
                  <span className="latin-run" dir="ltr">
                    {value}
                  </span>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>

        {step === "review" ? (
          <>
            <div className={styles.whatHappens}>
              <h4 className={styles.whatHappensTitle}>
                {reception.review.whatHappens}
              </h4>
              <ol className={styles.whatHappensList}>
                {reception.review.steps.map((text, index) => (
                  <li key={text} className={styles.whatHappensStep}>
                    <span aria-hidden="true" className={styles.stepNo}>
                      {index + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.reviewActions}>
              <a
                className={styles.primaryAction}
                href={prepared.href}
                onClick={() => setStep("opened")}
              >
                {reception.review.openEmailButton}
              </a>
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => setStep("form")}
              >
                {reception.review.editButton}
              </button>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <form className={styles.stage} onSubmit={onReview} noValidate>
      {Object.keys(errors).length > 0 ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className={styles.errorSummary}
        >
          {reception.form.errors.required}
        </div>
      ) : null}

      {audiencePath ? (
        <p className={styles.audienceChip}>
          <span className={styles.audienceChipLabel}>
            {reception.audienceLabel}:
          </span>{" "}
          {audiencePath.name}
        </p>
      ) : null}

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{reception.form.legend}</legend>

        <div className={styles.field}>
          <label htmlFor="rc-type" className={styles.label}>
            {reception.form.requestType}{" "}
            <span className={styles.mark}>({reception.form.requiredMark})</span>
          </label>
          <select
            id="rc-type"
            className={styles.input}
            value={data.requestType}
            onChange={(event) =>
              set("requestType", event.target.value as RequestTypeId)
            }
          >
            {requestTypeIds.map((typeId) => (
              <option key={typeId} value={typeId}>
                {reception.requestTypes[typeId].label}
              </option>
            ))}
          </select>
          <p className={styles.hint}>
            {reception.requestTypes[data.requestType].description}
          </p>
        </div>

        {field("organization", reception.form.organization, { required: true })}
        {field("country", reception.form.country, { required: true })}
        {field("sector", reception.form.sector, { required: true })}
        {field("contactName", reception.form.contactName, { required: true })}
        {field("role", reception.form.role, { required: true })}
        {field("email", reception.form.email, {
          required: true,
          type: "email",
        })}

        <div className={styles.field}>
          <label htmlFor="rc-summary" className={styles.label}>
            {reception.form.summary}{" "}
            <span className={styles.mark}>({reception.form.requiredMark})</span>
          </label>
          <p id="rc-summary-hint" className={styles.hint}>
            {reception.form.summaryHint}
          </p>
          <textarea
            id="rc-summary"
            rows={5}
            className={errorText("summary") ? styles.inputError : styles.input}
            value={data.summary}
            aria-invalid={errorText("summary") ? true : undefined}
            aria-describedby={
              errorText("summary")
                ? "rc-summary-hint rc-summary-error"
                : "rc-summary-hint"
            }
            onChange={(event) => set("summary", event.target.value)}
          />
          {errorText("summary") ? (
            <p id="rc-summary-error" className={styles.error}>
              {errorText("summary")}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{reception.form.optionalLegend}</legend>
        {field("phone", reception.form.phone, { type: "tel" })}
        {field("website", reception.form.website, { type: "url" })}
        <div className={styles.field}>
          <label htmlFor="rc-lang" className={styles.label}>
            {reception.form.preferredLanguage}{" "}
            <span className={styles.mark}>({reception.form.optionalMark})</span>
          </label>
          <select
            id="rc-lang"
            className={styles.input}
            value={data.preferredLanguage ?? ""}
            onChange={(event) => set("preferredLanguage", event.target.value)}
          >
            <option value="">—</option>
            <option value="العربية">العربية</option>
            <option value="Français">Français</option>
            <option value="English">English</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="rc-chain" className={styles.label}>
            {reception.form.valueChain}{" "}
            <span className={styles.mark}>({reception.form.optionalMark})</span>
          </label>
          <select
            id="rc-chain"
            className={styles.input}
            value={data.valueChain ?? ""}
            onChange={(event) => set("valueChain", event.target.value)}
          >
            <option value="">{reception.form.valueChainNone}</option>
            {site.chains.chains.map((chain) => (
              <option key={chain.name} value={chain.name}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <div className={styles.consentRow}>
        <input
          id="rc-consent"
          type="checkbox"
          className={styles.checkbox}
          checked={data.consent}
          aria-invalid={errorText("consent") ? true : undefined}
          aria-describedby={errorText("consent") ? "rc-consent-error" : undefined}
          onChange={(event) => set("consent", event.target.checked)}
        />
        <label htmlFor="rc-consent" className={styles.consentLabel}>
          <strong>{reception.form.consentLabel}</strong> —{" "}
          {reception.form.consentText}
        </label>
      </div>
      {errorText("consent") ? (
        <p id="rc-consent-error" className={styles.error}>
          {errorText("consent")}
        </p>
      ) : null}

      <button type="submit" className={styles.primaryAction}>
        {reception.form.reviewButton}
      </button>
    </form>
  );
}
