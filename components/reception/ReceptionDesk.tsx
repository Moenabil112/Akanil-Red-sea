"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale, ReceptionContent } from "@/content/types";
import type {
  AudienceId,
  EcosystemContent,
  IntakeFieldId,
  PlatformId,
  RequestTypeId,
} from "@/content/ecosystem-types";
import { audienceIds, requestTypeIds } from "@/lib/ecosystem";
import {
  RECEPTION_EMAIL,
  RECEPTION_PHONE_DISPLAY,
  RECEPTION_TEL_HREF,
  allowedRequestTypes,
  buildDraftFile,
  emptyReceptionRequest,
  mailtoTransport,
  parsePreselection,
  schemaFor,
  validateReceptionRequest,
  visibleFields,
  type ReceptionRequest,
  type ValidationErrors,
} from "@/lib/reception";
import RequestContextPanel from "./RequestContextPanel";
import DynamicRequestFields from "./DynamicRequestFields";
import styles from "./ReceptionDesk.module.css";

type Step = "form" | "review" | "opened";

interface ReceptionDeskProps {
  locale: Locale;
  reception: ReceptionContent;
  ecosystem: EcosystemContent;
}

/**
 * Digital Reception Lite (P0 §32–33, ADR-009/014). Zero-backend by
 * design: values live only in component state, no storage, cookies,
 * analytics or uploads exist, and information leaves the page only when
 * the visitor explicitly opens, copies or downloads the prepared
 * request. Fields are driven by the request-type intake schemas.
 */
export default function ReceptionDesk({
  locale,
  reception,
  ecosystem,
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
  const [data, setData] = useState<ReceptionRequest>(() =>
    emptyReceptionRequest(
      pre.requestType ?? "institutional-cooperation",
      pre.audience,
    ),
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [announcement, setAnnouncement] = useState("");
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const platformNames = useMemo(
    () =>
      Object.fromEntries(
        ecosystem.platforms.items.map((platform) => [
          platform.id,
          platform.name,
        ]),
      ) as Record<PlatformId, string>,
    [ecosystem],
  );

  const typeOptions = allowedRequestTypes(data.audience, requestTypeIds);
  const schema = schemaFor(data.requestType);
  const fields = visibleFields(schema);

  const setValue = (field: IntakeFieldId, value: string) =>
    setData((current) => ({
      ...current,
      values: { ...current.values, [field]: value },
    }));

  const setEvidence = (id: string, checked: boolean) =>
    setData((current) => ({
      ...current,
      evidence: checked
        ? [...current.evidence, id]
        : current.evidence.filter((entry) => entry !== id),
    }));

  const setAudience = (value: string) =>
    setData((current) => {
      const audience = (value || undefined) as AudienceId | undefined;
      const allowed = allowedRequestTypes(audience, requestTypeIds);
      return {
        ...current,
        audience,
        requestType: allowed.includes(current.requestType)
          ? current.requestType
          : allowed[0]!,
      };
    });

  const errorMessage = (field: IntakeFieldId): string | undefined => {
    const code = errors[field];
    return code ? reception.form.errors[code] : undefined;
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
    () => mailtoTransport.prepare(locale, data, reception),
    [locale, data, reception],
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setAnnouncement(reception.review.copiedAnnouncement);
    } catch {
      /* Clipboard unavailable: the visitor can still open or download. */
    }
  };

  const downloadDraft = () => {
    const draft = buildDraftFile(locale, data, reception);
    const blob = new Blob([draft.text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = draft.filename;
    anchor.click();
    URL.revokeObjectURL(url);
    setAnnouncement(reception.review.downloadedAnnouncement);
  };

  if (step === "review" || step === "opened") {
    const definition = reception.requestTypes[data.requestType];
    const labels = reception.email.fieldLabels;
    const ltrFields: IntakeFieldId[] = ["email", "phone", "website"];

    const summaryRows: [string, string, boolean?][] = [
      [labels.requestType, definition.label],
      ...(data.audience
        ? ([[labels.audience, reception.audienceNames[data.audience]]] as [
            string,
            string,
          ][])
        : []),
    ];
    const ordered = [...schema.required, ...schema.optional];
    for (const field of ordered) {
      if (
        field === "audience" ||
        field === "requestType" ||
        field === "consent"
      )
        continue;
      if (field === "evidenceAvailable") {
        if (data.evidence.length > 0) {
          summaryRows.push([
            labels.evidenceAvailable,
            data.evidence
              .map(
                (id) =>
                  reception.evidenceOptions.find((option) => option.id === id)
                    ?.label,
              )
              .filter(Boolean)
              .join(" · "),
          ]);
        }
        continue;
      }
      const value = (data.values[field] ?? "").trim();
      if (!value) continue;
      summaryRows.push([labels[field], value, ltrFields.includes(field)]);
    }

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
            <div className={styles.reviewContext}>
              <h4 className={styles.whatHappensTitle}>
                {reception.expectedReviewLabel}
              </h4>
              <ul className={styles.contextList}>
                {definition.expectedReviewOutput.map((item) => (
                  <li key={item} className={styles.contextItem}>
                    {item}
                  </li>
                ))}
              </ul>
              {definition.disclaimer ? (
                <p className={styles.contextDisclaimer}>
                  {definition.disclaimer}
                </p>
              ) : null}
              <p className={styles.missingNote}>
                {reception.review.missingOptionalNote}
              </p>
            </div>

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
            <div className={styles.actionCluster}>
              <button
                type="button"
                className={styles.tertiaryAction}
                onClick={() => copyToClipboard(prepared.subject)}
              >
                {reception.review.copySubjectButton}
              </button>
              <button
                type="button"
                className={styles.tertiaryAction}
                onClick={() => copyToClipboard(prepared.body)}
              >
                {reception.review.copyBodyButton}
              </button>
              <button
                type="button"
                className={styles.tertiaryAction}
                onClick={downloadDraft}
              >
                {reception.review.downloadDraftButton}
              </button>
            </div>
            <p aria-live="polite" role="status" className={styles.announcement}>
              {announcement}
            </p>
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

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{reception.form.legend}</legend>

        <div className={styles.field}>
          <label htmlFor="rc-audience" className={styles.label}>
            {reception.fieldLabels.audience}{" "}
            <span className={styles.mark}>({reception.form.optionalMark})</span>
          </label>
          <select
            id="rc-audience"
            className={styles.input}
            value={data.audience ?? ""}
            onChange={(event) => setAudience(event.target.value)}
          >
            <option value="">—</option>
            {audienceIds.map((audienceId) => (
              <option key={audienceId} value={audienceId}>
                {reception.audienceNames[audienceId]}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="rc-type" className={styles.label}>
            {reception.fieldLabels.requestType}{" "}
            <span className={styles.mark}>({reception.form.requiredMark})</span>
          </label>
          <select
            id="rc-type"
            className={styles.input}
            value={data.requestType}
            onChange={(event) =>
              setData((current) => ({
                ...current,
                requestType: event.target.value as RequestTypeId,
              }))
            }
          >
            {typeOptions.map((typeId) => (
              <option key={typeId} value={typeId}>
                {reception.requestTypes[typeId].label}
              </option>
            ))}
          </select>
        </div>

        <RequestContextPanel
          reception={reception}
          requestType={data.requestType}
        />

        <DynamicRequestFields
          fields={fields.required}
          required
          reception={reception}
          platformNames={platformNames}
          data={data}
          errors={errors}
          onValue={setValue}
          onEvidence={setEvidence}
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          {reception.form.optionalLegend}
        </legend>
        <DynamicRequestFields
          fields={fields.optional}
          required={false}
          reception={reception}
          platformNames={platformNames}
          data={data}
          errors={errors}
          onValue={setValue}
          onEvidence={setEvidence}
        />
      </fieldset>

      <div className={styles.consentRow}>
        <input
          id="rc-consent"
          type="checkbox"
          className={styles.checkbox}
          checked={data.consent}
          aria-invalid={errorMessage("consent") ? true : undefined}
          aria-describedby={
            errorMessage("consent") ? "rc-consent-error" : undefined
          }
          onChange={(event) =>
            setData((current) => ({
              ...current,
              consent: event.target.checked,
            }))
          }
        />
        <label htmlFor="rc-consent" className={styles.consentLabel}>
          <strong>{reception.form.consentLabel}</strong> —{" "}
          {reception.form.consentText}
        </label>
      </div>
      {errorMessage("consent") ? (
        <p id="rc-consent-error" className={styles.error}>
          {errorMessage("consent")}
        </p>
      ) : null}

      <button type="submit" className={styles.primaryAction}>
        {reception.form.reviewButton}
      </button>
    </form>
  );
}
