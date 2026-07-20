import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { getDashboard } from "@/lib/internal/services/queries";
import styles from "./internal.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "view.dashboard");
  const data = await getDashboard(employee);

  const stats = [
    { label: dict.dashboard.myCases, value: data.myCases },
    { label: dict.dashboard.newCases, value: data.newCases },
    { label: dict.dashboard.awaitingQualification, value: data.awaitingQualification },
    { label: dict.dashboard.openGaps, value: data.openGaps },
    { label: dict.dashboard.decisionsPending, value: data.decisionsPending },
    { label: dict.dashboard.commitmentsDue, value: data.commitmentsDue },
  ];

  return (
    <>
      <h1 className={styles.h1}>{dict.dashboard.title}</h1>
      <p className={styles.subtle}>{dict.privacyNote}</p>

      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{dict.dashboard.recentlyUpdated}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{dict.cases.reference}</th>
              <th>{dict.cases.caseTitle}</th>
              <th>{dict.cases.status}</th>
            </tr>
          </thead>
          <tbody>
            {data.recentlyUpdated.map((c) => (
              <tr key={c.id}>
                <td className={styles.mono}>
                  <Link className={styles.link} href={`/${locale}/internal/cases/${c.id}`}>
                    {c.internalReference}
                  </Link>
                </td>
                <td>{c.title}</td>
                <td>
                  <span className={styles.pill}>{c.status}</span>
                </td>
              </tr>
            ))}
            {data.recentlyUpdated.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.info}>
                  {dict.cases.none}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
