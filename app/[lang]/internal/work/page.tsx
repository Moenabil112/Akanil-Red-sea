import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { getWorkQueue } from "@/lib/internal/services/queries";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "view.dashboard");
  const q = await getWorkQueue(employee);

  const caseLink = (id: string, label: string) => (
    <Link className={styles.link} href={`/${locale}/internal/cases/${id}`}>
      {label}
    </Link>
  );

  return (
    <>
      <h1 className={styles.h1}>{dict.work.title}</h1>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{dict.work.assignedCases}</h2>
        <ul className={styles.info}>
          {q.assignedCases.map((c) => (
            <li key={c.id}>
              {caseLink(c.id, c.internalReference)} — {c.title} [{c.status}]
            </li>
          ))}
          {q.assignedCases.length === 0 ? <li>—</li> : null}
        </ul>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{dict.work.myGaps}</h2>
        <ul className={styles.info}>
          {q.myGaps.map((g) => (
            <li key={g.id}>
              {g.title} [{g.status}] — {caseLink(g.caseId, "case")}
            </li>
          ))}
          {q.myGaps.length === 0 ? <li>—</li> : null}
        </ul>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{dict.work.myCommitments}</h2>
        <ul className={styles.info}>
          {q.myCommitments.map((m) => (
            <li key={m.id}>
              {m.title} [{m.status}] — {caseLink(m.caseId, "case")}
            </li>
          ))}
          {q.myCommitments.length === 0 ? <li>—</li> : null}
        </ul>
      </div>

      {q.overdueCommitments.length > 0 ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{dict.work.overdue}</h2>
          <ul className={styles.info}>
            {q.overdueCommitments.map((m) => (
              <li key={m.id}>
                {m.title} — {caseLink(m.caseId, "case")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {q.pendingDecisions.length > 0 ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{dict.work.pendingDecisions}</h2>
          <ul className={styles.info}>
            {q.pendingDecisions.map((d) => (
              <li key={d.id}>
                {d.decisionType} — {caseLink(d.caseId, "case")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
