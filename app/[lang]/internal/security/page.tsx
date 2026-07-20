import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listSecurityEvents } from "@/lib/internal/services/security";
import { ackEventAction } from "../governance-actions";
import { ResolveEventForm } from "./SecurityForms";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function SecurityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "security.event.view");
  const p = dict.p4b.security;
  const canManage = can(employee.role, "security.event.manage");

  const events = await listSecurityEvents(employee);

  return (
    <>
      <h1 className={styles.h1}>{p.title}</h1>
      <p className={styles.info}>{p.internalOnly}</p>
      <nav className={styles.sectionNav} aria-label={p.title}>
        <Link href={`/${locale}/internal/security/incidents`} className={styles.navLink}>{p.incidents}</Link>
      </nav>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.events}</h2>
        {events.length === 0 ? <p className={styles.subtle}>{dict.p4b.common.none}</p> : (
          <table className={styles.table}>
            <thead>
              <tr><th>{p.category}</th><th>{p.severity}</th><th>{p.status}</th><th>{p.summary}</th><th></th></tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td className={styles.mono}>{e.category}</td>
                  <td>{e.severity}</td>
                  <td>{e.status}</td>
                  <td>{e.summary}</td>
                  <td className={styles.actionsRow}>
                    {canManage && e.status === "OPEN" ? (
                      <form action={ackEventAction.bind(null, locale)}>
                        <input type="hidden" name="eventId" value={e.id} />
                        <button type="submit" className={styles.buttonGhost}>{p.acknowledge}</button>
                      </form>
                    ) : null}
                    {canManage && e.status !== "RESOLVED" && e.status !== "FALSE_POSITIVE" ? (
                      <ResolveEventForm locale={locale} eventId={e.id} dict={dict} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
