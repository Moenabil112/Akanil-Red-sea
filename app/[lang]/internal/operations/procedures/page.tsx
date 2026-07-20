import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listProcedures, REQUIRED_PROCEDURES } from "@/lib/internal/services/procedures";
import { approveProcedureAction, makeProcedureEffectiveAction, registerProcedureAction } from "../../operations-actions";
import { AcknowledgeForm } from "../OperationsForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

export default async function ProceduresPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "operations.procedure.view");
  const p = dict.p4c.procedures;
  const canManage = can(employee.role, "operations.procedure.manage");
  const canAck = can(employee.role, "operations.procedure.acknowledge");
  const procs = await listProcedures(employee);
  const registeredKeys = new Set(procs.map((pr) => pr.procedureKey));

  return (
    <>
      <h1 className={styles.h1}>{p.title}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/operations`} className={styles.link}>← {dict.p4c.overview.title}</Link>
      </p>
      <p className={styles.info}>{p.note}</p>

      <div className={styles.card}>
        {procs.length === 0 ? <p className={styles.subtle}>{dict.p4c.common.none}</p> : (
          <table className={styles.table}>
            <thead><tr><th>{p.key}</th><th>{p.version}</th><th>{dict.cases.caseTitle}</th><th>{p.status}</th><th></th></tr></thead>
            <tbody>
              {procs.map((pr) => (
                <tr key={pr.id}>
                  <td className={styles.mono}>{pr.procedureKey}</td><td>{pr.version}</td><td>{pr.title}</td><td>{pr.status}</td>
                  <td className={styles.actionsRow}>
                    {canManage && pr.status === "DRAFT" ? (
                      <form action={approveProcedureAction.bind(null, locale)}><input type="hidden" name="id" value={pr.id} /><button type="submit" className={styles.buttonGhost}>{p.approve}</button></form>
                    ) : null}
                    {canManage && pr.status === "APPROVED" ? (
                      <form action={makeProcedureEffectiveAction.bind(null, locale)}><input type="hidden" name="id" value={pr.id} /><button type="submit" className={styles.button}>{p.makeEffective}</button></form>
                    ) : null}
                    {canAck && pr.status === "EFFECTIVE" ? <AcknowledgeForm locale={locale} procedureKey={pr.procedureKey} version={pr.version} dict={dict} /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {canManage ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.register}</h2>
          <form action={registerProcedureAction.bind(null, locale)} className={styles.actionsRow}>
            <select name="procedureKey" aria-label={p.key} className={styles.select}>
              {REQUIRED_PROCEDURES.map((r) => <option key={r.key} value={r.key} disabled={registeredKeys.has(r.key)}>{r.key} — {r.title}</option>)}
            </select>
            <input name="title" aria-label={dict.cases.caseTitle} placeholder={dict.cases.caseTitle} required className={styles.input} />
            <button type="submit" className={styles.button}>{p.register}</button>
          </form>
        </div>
      ) : null}
    </>
  );
}
