import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listIncidents } from "@/lib/internal/services/governance-queries";
import { NewIncidentForm } from "../SecurityForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

export default async function IncidentsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "incident.view");
  const p = dict.p4b.security;

  const incidents = await listIncidents(employee);

  return (
    <>
      <h1 className={styles.h1}>{p.incidents}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/security`} className={styles.link}>← {p.title}</Link>
      </p>
      <p className={styles.info}>{p.internalOnly}</p>

      <div className={styles.card}>
        {incidents.length === 0 ? <p className={styles.subtle}>{dict.p4b.common.none}</p> : (
          <table className={styles.table}>
            <thead>
              <tr><th>{p.reference}</th><th>{dict.cases.caseTitle}</th><th>{p.severity}</th><th>{p.status}</th></tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id}>
                  <td className={styles.mono}>
                    <Link href={`/${locale}/internal/security/incidents/${inc.id}`} className={styles.link}>
                      {inc.internalReference}
                    </Link>
                  </td>
                  <td>{inc.title}</td>
                  <td>{inc.severity}</td>
                  <td>{inc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {can(employee.role, "incident.manage") ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.newIncident}</h2>
          <NewIncidentForm locale={locale} dict={dict} />
        </div>
      ) : null}
    </>
  );
}
