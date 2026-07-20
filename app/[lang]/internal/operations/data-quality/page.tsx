import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listDataQualityFindings } from "@/lib/internal/services/data-quality";
import { RunScanForm, ResolveDqForm } from "../OperationsForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

export default async function DataQualityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "operations.data_quality.view");
  const p = dict.p4c.dataQuality;
  const canManage = can(employee.role, "operations.data_quality.manage");
  const findings = await listDataQualityFindings(employee);

  return (
    <>
      <h1 className={styles.h1}>{p.title}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/operations`} className={styles.link}>← {dict.p4c.overview.title}</Link>
      </p>
      <p className={styles.info}>{p.deterministicNote}</p>
      {canManage ? <div className={styles.card}><RunScanForm locale={locale} dict={dict} /></div> : null}

      <div className={styles.card}>
        {findings.length === 0 ? <p className={styles.subtle}>{dict.p4c.common.none}</p> : (
          <table className={styles.table}>
            <thead><tr><th>{p.category}</th><th>{p.severity}</th><th>{p.status}</th><th>{dict.cases.caseTitle}</th><th></th></tr></thead>
            <tbody>
              {findings.map((f) => (
                <tr key={f.id}>
                  <td className={styles.mono}>{f.category}</td><td>{f.severity}</td><td>{f.status}</td><td>{f.title}</td>
                  <td>{canManage && (f.status === "OPEN" || f.status === "UNDER_REVIEW") ? <ResolveDqForm locale={locale} id={f.id} dict={dict} /> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
