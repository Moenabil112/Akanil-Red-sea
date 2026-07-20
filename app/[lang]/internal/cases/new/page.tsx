import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { requestTypeIds, platformIds } from "@/lib/ecosystem";
import { valueChainIds } from "@/lib/value-chains";
import { participationPathIds, sectorTrackIds } from "@/lib/forum";
import { createCaseAction } from "../../actions";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

const SOURCES = ["PUBLIC_RECEPTION_EMAIL", "DIRECT_EMAIL", "PHONE", "FORUM", "INTERNAL_REFERRAL", "OTHER"];
const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];
const CLASSIFICATIONS = ["INTERNAL", "CONFIDENTIAL", "RESTRICTED"];

export default async function NewCasePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  await requireEmployee(locale, "case.create");

  return (
    <>
      <h1 className={styles.h1}>{dict.cases.create}</h1>
      <p className={styles.warning}>{dict.cases.sensitiveWarning}</p>
      <p className={styles.warning}>{dict.p4b.common.minimizationWarning}</p>

      <form action={createCaseAction.bind(null, locale)} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pilotDataCategory">
            Pilot data category
          </label>
          <select id="pilotDataCategory" name="pilotDataCategory" defaultValue="SYNTHETIC" className={styles.select}>
            <option value="SYNTHETIC">SYNTHETIC</option>
            <option value="DE_IDENTIFIED">DE_IDENTIFIED</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            {dict.cases.caseTitle}
          </label>
          <input id="title" name="title" required className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="summary">
            {dict.cases.summary}
          </label>
          <textarea id="summary" name="summary" required className={styles.textarea} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="source">
            {dict.cases.source}
          </label>
          <select id="source" name="source" required className={styles.select}>
            {SOURCES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="requestType">
            {dict.cases.requestType}
          </label>
          <select id="requestType" name="requestType" className={styles.select}>
            <option value="">—</option>
            {requestTypeIds.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <TaxonomySelect id="platform" label="Platform" options={[...platformIds]} />
        <TaxonomySelect id="chain" label="Value chain" options={[...valueChainIds]} />
        <TaxonomySelect id="participant" label="Forum participation path" options={[...participationPathIds]} />
        <TaxonomySelect id="track" label="Forum sector track" options={[...sectorTrackIds]} />
        <div className={styles.field}>
          <label className={styles.label} htmlFor="priority">
            {dict.cases.priority}
          </label>
          <select id="priority" name="priority" defaultValue="NORMAL" className={styles.select}>
            {PRIORITIES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="classification">
            {dict.cases.classification}
          </label>
          <select id="classification" name="classification" defaultValue="INTERNAL" className={styles.select}>
            {CLASSIFICATIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <label className={styles.label} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <input type="checkbox" required />
          <span>{dict.cases.confirmChannel}</span>
        </label>
        <button type="submit" className={styles.button}>
          {dict.cases.save}
        </button>
      </form>
    </>
  );
}

function TaxonomySelect({ id, label, options }: { id: string; label: string; options: string[] }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select id={id} name={id} className={styles.select}>
        <option value="">—</option>
        {options.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
