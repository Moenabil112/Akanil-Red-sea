import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listReleaseCandidates } from "@/lib/internal/services/release-candidate";
import { PrepareReleaseForm, ReviewReleaseForm } from "../OperationsForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

export default async function ReleasePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "operations.release.view");
  const p = dict.p4c.release;
  const canPrepare = can(employee.role, "operations.release.prepare");
  const rows = await listReleaseCandidates(employee);

  return (
    <>
      <h1 className={styles.h1}>{p.title}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/operations`} className={styles.link}>← {dict.p4c.overview.title}</Link>
      </p>
      <p className={styles.info}>{p.noDeployNote}</p>

      <div className={styles.card}>
        {rows.length === 0 ? <p className={styles.subtle}>{dict.p4c.common.none}</p> : (
          <table className={styles.table}>
            <thead><tr><th>{p.version}</th><th>{p.commit}</th><th>{p.status}</th><th></th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.version}</td><td className={styles.mono}>{r.commitSha.slice(0, 12)}</td><td>{r.status}</td>
                  <td>{canPrepare && (r.status === "DRAFT" || r.status === "VALIDATED") ? <ReviewReleaseForm locale={locale} id={r.id} sha={r.commitSha} dict={dict} /> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {canPrepare ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.prepare}</h2>
          <PrepareReleaseForm locale={locale} dict={dict} />
        </div>
      ) : null}
    </>
  );
}
