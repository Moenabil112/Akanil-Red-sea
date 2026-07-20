import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { listAuditEvents } from "@/lib/internal/services/queries";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function AuditPage({
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
  await requireEmployee(locale, "audit.view");
  const events = await listAuditEvents({ action: sp.action, entityType: sp.entity });

  return (
    <>
      <h1 className={styles.h1}>{dict.audit.title}</h1>
      <p className={styles.subtle}>{dict.audit.appendOnly}</p>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{dict.audit.when}</th>
              <th>{dict.audit.actor}</th>
              <th>{dict.audit.action}</th>
              <th>{dict.audit.entity}</th>
              <th>{dict.audit.summary}</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{e.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                <td>{e.actor?.displayName ?? "system"}</td>
                <td className={styles.mono}>{e.action}</td>
                <td>{e.entityType}</td>
                <td>{e.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
