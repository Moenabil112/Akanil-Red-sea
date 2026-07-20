import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listAuthorizations, authorizationBlockers } from "@/lib/internal/services/limited-operations";
import { reviewAuthorizationAction, suspendAuthorizationAction } from "../../operations-actions";
import { ProposeAuthForm, DecideAuthForm } from "../OperationsForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

export default async function AuthorizationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "operations.authorization.view");
  const p = dict.p4c.authorization;

  const [rows, blockers] = await Promise.all([listAuthorizations(employee), authorizationBlockers()]);
  const canPropose = can(employee.role, "operations.authorization.propose");
  const canReview = can(employee.role, "operations.authorization.review");
  const canApprove = can(employee.role, "operations.authorization.approve");

  return (
    <>
      <h1 className={styles.h1}>{p.title}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/operations`} className={styles.link}>← {dict.p4c.overview.title}</Link>
      </p>
      <p className={styles.info}>{p.envNotSufficient}</p>
      <p className={styles.warning}>{p.blockedNote}</p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Critical gate status</h2>
        {blockers.length === 0
          ? <p className={styles.areaOk}>No critical gate is failing — activation is not blocked.</p>
          : <ul className={styles.info}>{blockers.map((b) => <li key={b} className={styles.areaFail}>{b}</li>)}</ul>}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.title}</h2>
        {rows.length === 0 ? <p className={styles.subtle}>{dict.p4c.common.none}</p> : (
          <table className={styles.table}>
            <thead><tr><th>{dict.cases.caseTitle}</th><th>{p.status}</th><th>{p.employeeLimit}</th><th>{p.caseLimit}</th><th>{p.validUntil}</th><th></th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.status}</td>
                  <td>{a.approvedEmployeeLimit}</td>
                  <td>{a.approvedCaseLimit}</td>
                  <td>{a.validUntil ? a.validUntil.toISOString().slice(0, 10) : "—"}</td>
                  <td className={styles.actionsRow}>
                    {canReview && a.status === "PENDING_REVIEW" && !a.reviewedById ? (
                      <form action={reviewAuthorizationAction.bind(null, locale)}>
                        <input type="hidden" name="id" value={a.id} />
                        <button type="submit" className={styles.buttonGhost}>{p.review}</button>
                      </form>
                    ) : null}
                    {canApprove && a.status === "PENDING_REVIEW" && a.reviewedById ? (
                      <DecideAuthForm locale={locale} id={a.id} dict={dict} />
                    ) : null}
                    {canApprove && a.status === "ACTIVE" ? (
                      <form action={suspendAuthorizationAction.bind(null, locale)} className={styles.actionsRow}>
                        <input type="hidden" name="id" value={a.id} />
                        <input name="reason" aria-label={p.reason} placeholder={p.reason} className={styles.input} />
                        <button type="submit" className={styles.buttonGhost}>{p.suspend}</button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {canPropose ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.propose}</h2>
          <ProposeAuthForm locale={locale} dict={dict} />
        </div>
      ) : null}
    </>
  );
}
