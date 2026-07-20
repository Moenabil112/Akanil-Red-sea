import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { getReadinessAreas } from "@/lib/internal/services/readiness";
import { statusClass } from "../page";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

const RECOVERY_AREAS = new Set(["backup-recency", "last-restore-test"]);

export default async function RecoveryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  await requireEmployee(locale, "readiness.view");
  const p = dict.p4b;

  const areas = (await getReadinessAreas()).filter((a) => RECOVERY_AREAS.has(a.id));

  return (
    <>
      <h1 className={styles.h1}>{p.recovery.title}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/readiness`} className={styles.link}>← {p.readiness.title}</Link>
      </p>
      <p className={styles.info}>{p.recovery.lead}</p>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr><th>{p.readiness.area}</th><th>{p.readiness.status}</th><th>{p.readiness.detail}</th></tr>
          </thead>
          <tbody>
            {areas.map((a) => (
              <tr key={a.id}>
                <td>{p.areaLabels[a.id] ?? a.id}</td>
                <td className={statusClass(a.status)}>{a.status}</td>
                <td>{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.subtle} style={{ marginTop: "0.75rem" }}>{p.recovery.note}</p>
      </div>
    </>
  );
}
