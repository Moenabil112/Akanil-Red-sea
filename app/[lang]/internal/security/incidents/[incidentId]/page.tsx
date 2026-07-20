import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { getIncident } from "@/lib/internal/services/governance-queries";
import { transitionIncidentAction, updateIncidentAction } from "../../../governance-actions";
import { CloseIncidentForm } from "../../SecurityForms";
import styles from "../../../internal.module.css";

export const dynamic = "force-dynamic";

const NEXT: Record<string, string[]> = {
  OPEN: ["TRIAGE"],
  TRIAGE: ["CONTAINMENT", "INVESTIGATION"],
  CONTAINMENT: ["INVESTIGATION", "RECOVERY"],
  INVESTIGATION: ["CONTAINMENT", "RECOVERY"],
  RECOVERY: ["INVESTIGATION"],
  CLOSED: [],
};

export default async function IncidentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; incidentId: string }>;
  searchParams: Promise<{ conflict?: string }>;
}) {
  const { lang, incidentId } = await params;
  const sp = await searchParams;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "incident.view");
  const p = dict.p4b.security;

  const inc = await getIncident(employee, incidentId);
  if (!inc) notFound();
  const canManage = can(employee.role, "incident.manage");
  const transitions = NEXT[inc.status] ?? [];

  return (
    <>
      {sp.conflict ? <p className={styles.error}>{dict.p4b.common.conflict}</p> : null}
      <h1 className={styles.h1}>
        <span className={styles.mono}>{inc.internalReference}</span> — {inc.title}
      </h1>
      <p className={styles.subtle}>
        <span className={styles.pill}>{inc.status}</span> · {inc.severity} · {inc.category}
        {" · "}
        <Link href={`/${locale}/internal/security/incidents`} className={styles.link}>{p.incidents}</Link>
      </p>
      <p className={styles.info}>{p.internalOnly}</p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.summary}</h2>
        <p>{inc.summary}</p>
        <p className={styles.info}>{p.affected}: {inc.affectedAreas ?? "—"}</p>
        <p className={styles.info}>{p.containment}: {inc.containmentActions ?? "—"}</p>
        <p className={styles.info}>{p.recovery}: {inc.recoveryActions ?? "—"}</p>
        <p className={styles.info}>{p.lessons}: {inc.lessonsLearned ?? "—"}</p>
      </div>

      {canManage && inc.status !== "CLOSED" ? (
        <>
          {transitions.length > 0 ? (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{p.transition}</h2>
              <form action={transitionIncidentAction.bind(null, locale)} className={styles.actionsRow}>
                <input type="hidden" name="incidentId" value={inc.id} />
                <select name="toStatus" aria-label={p.transition} className={styles.select}>
                  {transitions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button type="submit" className={styles.button}>{p.transition}</button>
              </form>
            </div>
          ) : null}

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{dict.p4b.common.save}</h2>
            <form action={updateIncidentAction.bind(null, locale)} className={styles.form}>
              <input type="hidden" name="incidentId" value={inc.id} />
              <input type="hidden" name="version" value={inc.recordVersion} />
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ic-affected">{p.affected}</label>
                <input id="ic-affected" name="affectedAreas" defaultValue={inc.affectedAreas ?? ""} className={styles.input} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ic-contain">{p.containment}</label>
                <input id="ic-contain" name="containmentActions" defaultValue={inc.containmentActions ?? ""} className={styles.input} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ic-evidence">{p.evidence}</label>
                <input id="ic-evidence" name="evidenceNotes" defaultValue={inc.evidenceNotes ?? ""} className={styles.input} />
              </div>
              <button type="submit" className={styles.button}>{dict.p4b.common.save}</button>
            </form>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{p.close}</h2>
            <CloseIncidentForm locale={locale} incidentId={inc.id} dict={dict} />
          </div>
        </>
      ) : null}
    </>
  );
}
