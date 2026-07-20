import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict, type InternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { getReadinessAreas, currentReadinessGate, type AreaStatus } from "@/lib/internal/services/readiness";
import styles from "../internal.module.css";
import { GateForm } from "./ReadinessForms";

export const dynamic = "force-dynamic";

export function statusClass(status: AreaStatus): string {
  if (status === "PASS") return styles.areaOk ?? "";
  if (status === "FAIL") return styles.areaFail ?? "";
  if (status === "PASS_WITH_OBSERVATIONS" || status === "EXPIRED" || status === "BLOCKED") return styles.areaWarn ?? "";
  return styles.areaNeutral ?? "";
}

export default async function ReadinessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict: InternalDict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "readiness.view");
  const p = dict.p4b;

  const [areas, gate] = await Promise.all([getReadinessAreas(), currentReadinessGate()]);

  return (
    <>
      <h1 className={styles.h1}>{p.readiness.title}</h1>
      <p className={styles.subtle}>{p.readiness.lead}</p>

      <nav className={styles.sectionNav} aria-label={p.readiness.title}>
        <Link href={`/${locale}/internal/readiness/access`} className={styles.navLink}>{p.readiness.accessLink}</Link>
        <Link href={`/${locale}/internal/readiness/exercises`} className={styles.navLink}>{p.readiness.exercisesLink}</Link>
        <Link href={`/${locale}/internal/readiness/recovery`} className={styles.navLink}>{p.readiness.recoveryLink}</Link>
      </nav>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.readiness.gate}</h2>
        <p>
          <span className={styles.pill}>{p.gateStates[gate.state] ?? gate.state}</span>
        </p>
        <p className={styles.info}>{gate.rationale}</p>
        <p className={styles.subtle}>{p.readiness.notProductionReady}</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.readiness.title}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{p.readiness.area}</th>
              <th>{p.readiness.status}</th>
              <th>{p.readiness.detail}</th>
            </tr>
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
      </div>

      {can(employee.role, "readiness.approve") ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.readiness.setGate}</h2>
          <GateForm locale={locale} dict={dict} />
        </div>
      ) : null}
    </>
  );
}
