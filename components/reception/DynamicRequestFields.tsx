"use client";

import type { ReceptionContent } from "@/content/types";
import type { IntakeFieldId, PlatformId } from "@/content/ecosystem-types";
import type { ReceptionRequest, ValidationErrors } from "@/lib/reception";
import styles from "./ReceptionDesk.module.css";

interface DynamicRequestFieldsProps {
  fields: IntakeFieldId[];
  required: boolean;
  reception: ReceptionContent;
  platformNames: Record<PlatformId, string>;
  data: ReceptionRequest;
  errors: ValidationErrors;
  onValue: (field: IntakeFieldId, value: string) => void;
  onEvidence: (id: string, checked: boolean) => void;
}

const INPUT_TYPES: Partial<Record<IntakeFieldId, string>> = {
  email: "email",
  phone: "tel",
  website: "url",
};

/**
 * Schema-driven intake fields (P0 §32, ADR-014). Only the fields the
 * selected request type declares are rendered, so data collection never
 * exceeds the taxonomy. Evidence availability is a checklist — files
 * are never uploaded or attached.
 */
export default function DynamicRequestFields({
  fields,
  required,
  reception,
  platformNames,
  data,
  errors,
  onValue,
  onEvidence,
}: DynamicRequestFieldsProps) {
  const mark = required
    ? reception.form.requiredMark
    : reception.form.optionalMark;

  const errorText = (field: IntakeFieldId): string | undefined => {
    const code = errors[field];
    if (!code) return undefined;
    return reception.form.errors[
      code === "consent" ? "consent" : code
    ];
  };

  const labelFor = (field: IntakeFieldId, id: string) => (
    <label htmlFor={id} className={styles.label}>
      {reception.fieldLabels[field]}{" "}
      <span className={styles.mark}>({mark})</span>
    </label>
  );

  return (
    <>
      {fields.map((field) => {
        const id = `rc-${field}`;
        const hint = reception.fieldHints[field];
        const error = errorText(field);
        const describedBy =
          [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined;

        if (field === "evidenceAvailable") {
          return (
            <fieldset key={field} className={styles.evidenceGroup}>
              <legend className={styles.label}>
                {reception.fieldLabels.evidenceAvailable}{" "}
                <span className={styles.mark}>({mark})</span>
              </legend>
              {hint ? (
                <p id={`${id}-hint`} className={styles.hint}>
                  {hint}
                </p>
              ) : null}
              <div className={styles.evidenceOptions}>
                {reception.evidenceOptions.map((option) => (
                  <label key={option.id} className={styles.evidenceOption}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={data.evidence.includes(option.id)}
                      onChange={(event) =>
                        onEvidence(option.id, event.target.checked)
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              {error ? (
                <p id={`${id}-error`} className={styles.error}>
                  {error}
                </p>
              ) : null}
            </fieldset>
          );
        }

        if (field === "summary") {
          return (
            <div key={field} className={styles.field}>
              {labelFor(field, id)}
              {hint ? (
                <p id={`${id}-hint`} className={styles.hint}>
                  {hint}
                </p>
              ) : null}
              <textarea
                id={id}
                rows={5}
                className={error ? styles.inputError : styles.input}
                value={data.values.summary ?? ""}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                onChange={(event) => onValue("summary", event.target.value)}
              />
              {error ? (
                <p id={`${id}-error`} className={styles.error}>
                  {error}
                </p>
              ) : null}
            </div>
          );
        }

        if (field === "platform") {
          return (
            <div key={field} className={styles.field}>
              {labelFor(field, id)}
              <select
                id={id}
                className={styles.input}
                value={data.values.platform ?? ""}
                onChange={(event) => onValue("platform", event.target.value)}
              >
                <option value="">—</option>
                {Object.values(platformNames).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field === "preferredLanguage") {
          return (
            <div key={field} className={styles.field}>
              {labelFor(field, id)}
              <select
                id={id}
                className={styles.input}
                value={data.values.preferredLanguage ?? ""}
                onChange={(event) =>
                  onValue("preferredLanguage", event.target.value)
                }
              >
                <option value="">—</option>
                <option value="العربية">العربية</option>
                <option value="Français">Français</option>
                <option value="English">English</option>
              </select>
            </div>
          );
        }

        const type = INPUT_TYPES[field] ?? "text";
        return (
          <div key={field} className={styles.field}>
            {labelFor(field, id)}
            {hint ? (
              <p id={`${id}-hint`} className={styles.hint}>
                {hint}
              </p>
            ) : null}
            <input
              id={id}
              type={type}
              dir={type === "text" ? undefined : "ltr"}
              className={error ? styles.inputError : styles.input}
              value={data.values[field] ?? ""}
              required={required}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              onChange={(event) => onValue(field, event.target.value)}
            />
            {error ? (
              <p id={`${id}-error`} className={styles.error}>
                {error}
              </p>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
