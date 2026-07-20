import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listCases } from "@/lib/internal/services/queries";
import { CASE_STATUSES } from "@/lib/internal/lifecycle";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function CasesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { lang } = await params;
  const sp = await searchParams;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "view.dashboard");

  const cases = await listCases(employee, {
    status: sp.status,
    priority: sp.priority,
    search: sp.q,
  });

  return (
    <>
      <div className={styles.actionsRow} style={{ justifyContent: "space-between" }}>
        <h1 className={styles.h1}>{dict.cases.title}</h1>
        {can(employee.role, "case.create") ? (
          <Link className={styles.button} href={`/${locale}/internal/cases/new`}>
            {dict.nav.newCase}
          </Link>
        ) : null}
      </div>

      <form className={styles.actionsRow} style={{ marginBlock: "1rem" }} method="get">
        <div className={styles.field} style={{ flex: "1 1 18rem" }}>
          <label className={styles.label} htmlFor="q">
            {dict.cases.search}
          </label>
          <input id="q" name="q" defaultValue={sp.q ?? ""} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="status">
            {dict.cases.status}
          </label>
          <select id="status" name="status" defaultValue={sp.status ?? ""} className={styles.select}>
            <option value="">—</option>
            {CASE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.buttonGhost + " " + styles.button}>
          {dict.cases.filter}
        </button>
      </form>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{dict.cases.reference}</th>
              <th>{dict.cases.caseTitle}</th>
              <th>{dict.cases.status}</th>
              <th>{dict.cases.priority}</th>
              <th>{dict.cases.classification}</th>
              <th>{dict.cases.organization}</th>
              <th>{dict.cases.owner}</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td className={styles.mono}>
                  <Link className={styles.link} href={`/${locale}/internal/cases/${c.id}`}>
                    {c.internalReference}
                  </Link>
                </td>
                <td>{c.title}</td>
                <td>
                  <span className={c.status === "CLOSED" ? `${styles.pill} ${styles.pillClosed}` : styles.pill}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <span className={c.priority === "URGENT" ? `${styles.pill} ${styles.pillUrgent}` : styles.pill}>
                    {c.priority}
                  </span>
                </td>
                <td>{c.classification}</td>
                <td>{c.organization?.workingName ?? "—"}</td>
                <td>{c.currentOwner?.displayName ?? "—"}</td>
              </tr>
            ))}
            {cases.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.info}>
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
