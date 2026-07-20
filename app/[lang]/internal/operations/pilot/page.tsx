import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listPilotRuns } from "@/lib/internal/services/operational-pilot";
import { CreateRunForm } from "../OperationsForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

export default async function PilotListPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "operations.pilot.view");
  const p = dict.p4c.pilot;
  const runs = await listPilotRuns(employee);

  return (
    <>
      <h1 className={styles.h1}>{p.title}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/operations`} className={styles.link}>← {dict.p4c.overview.title}</Link>
      </p>
      <p className={styles.info}>{p.proportionNote}</p>

      <div className={styles.card}>
        {runs.length === 0 ? <p className={styles.subtle}>{dict.p4c.common.none}</p> : (
          <table className={styles.table}>
            <thead><tr><th>{p.reference}</th><th>{dict.cases.caseTitle}</th><th>{p.status}</th><th>{p.maxEmployees}</th><th>{p.maxCases}</th></tr></thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id}>
                  <td className={styles.mono}><Link href={`/${locale}/internal/operations/pilot/${r.id}`} className={styles.link}>{r.internalReference}</Link></td>
                  <td>{r.title}</td><td>{r.status}</td><td>{r.maximumEmployees}</td><td>{r.maximumCases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {can(employee.role, "operations.pilot.create") ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.create}</h2>
          <CreateRunForm locale={locale} dict={dict} />
        </div>
      ) : null}
    </>
  );
}
