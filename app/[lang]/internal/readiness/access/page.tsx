import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import {
  listPilotAccess,
  listAccessChanges,
  listAccessReviews,
  listEmployeesForGovernance,
  listAllActiveSessions,
} from "@/lib/internal/services/governance-queries";
import {
  approvePilotAccessAction,
  suspendPilotAccessAction,
  revokePilotAccessAction,
  approveAccessChangeAction,
  rejectAccessChangeAction,
  applyAccessChangeAction,
  createAccessReviewAction,
  beginOffboardingAction,
  adminRevokeSessionAction,
  signOutOthersAction,
} from "../../governance-actions";
import {
  PilotRequestForm,
  AccessChangeForm,
  ReviewForm,
  CompleteOffboardingForm,
} from "../AccessForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

export default async function AccessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "pilot.view");
  const p = dict.p4b.access;

  const canApprovePilot = can(employee.role, "pilot.approve");
  const canChange = can(employee.role, "access.change.request");
  const canApproveChange = can(employee.role, "access.change.approve");
  const canReview = can(employee.role, "access.review.conduct");
  const canLifecycle = can(employee.role, "employee.lifecycle");
  const canSessions = can(employee.role, "session.admin");

  const [cohort, employees, changes, reviews, sessions] = await Promise.all([
    listPilotAccess(employee),
    listEmployeesForGovernance(employee),
    canChange ? listAccessChanges(employee) : Promise.resolve([]),
    canReview ? listAccessReviews(employee) : Promise.resolve([]),
    canSessions ? listAllActiveSessions(employee) : Promise.resolve([]),
  ]);
  const emps = employees.map((e) => ({ id: e.id, email: e.email, displayName: e.displayName }));

  return (
    <>
      <h1 className={styles.h1}>{p.title}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/readiness`} className={styles.link}>← {dict.p4b.readiness.title}</Link>
      </p>
      <p className={styles.info}>{p.twoPersonNote}</p>

      {/* Pilot cohort */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.cohort}</h2>
        {cohort.length === 0 ? <p className={styles.subtle}>{dict.p4b.common.none}</p> : (
          <table className={styles.table}>
            <thead>
              <tr><th>{p.employee}</th><th>{p.role}</th><th>{dict.p4b.readiness.status}</th><th>{p.expires}</th><th></th></tr>
            </thead>
            <tbody>
              {cohort.map((c) => (
                <tr key={c.id}>
                  <td>{c.employee.displayName}</td>
                  <td>{c.approvedRole}</td>
                  <td>{c.status}</td>
                  <td>{c.expiresAt ? c.expiresAt.toISOString().slice(0, 10) : "—"}</td>
                  <td className={styles.actionsRow}>
                    {canApprovePilot && c.status === "REQUESTED" ? (
                      <form action={approvePilotAccessAction.bind(null, locale)}>
                        <input type="hidden" name="pilotAccessId" value={c.id} />
                        <button type="submit" className={styles.button}>{p.approve}</button>
                      </form>
                    ) : null}
                    {canApprovePilot && (c.status === "ACTIVE" || c.status === "APPROVED") ? (
                      <form action={suspendPilotAccessAction.bind(null, locale)}>
                        <input type="hidden" name="pilotAccessId" value={c.id} />
                        <input name="reason" aria-label={p.reason} placeholder={p.reason} className={styles.input} />
                        <button type="submit" className={styles.buttonGhost}>{p.suspend}</button>
                      </form>
                    ) : null}
                    {canApprovePilot && c.status !== "REVOKED" ? (
                      <form action={revokePilotAccessAction.bind(null, locale)}>
                        <input type="hidden" name="pilotAccessId" value={c.id} />
                        <input name="reason" aria-label={p.reason} placeholder={p.reason} className={styles.input} />
                        <button type="submit" className={styles.buttonGhost}>{p.revoke}</button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {can(employee.role, "pilot.request") ? <PilotRequestForm locale={locale} employees={emps} dict={dict} /> : null}
      </div>

      {/* Access-change requests */}
      {canChange ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.changes}</h2>
          {changes.length === 0 ? <p className={styles.subtle}>{dict.p4b.common.none}</p> : (
            <table className={styles.table}>
              <thead>
                <tr><th>{p.employee}</th><th>{p.changeType}</th><th>{p.proposedRole}</th><th>{dict.p4b.readiness.status}</th><th></th></tr>
              </thead>
              <tbody>
                {changes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.targetEmployee.displayName}</td>
                    <td className={styles.mono}>{c.changeType}</td>
                    <td>{c.proposedRole ?? "—"}</td>
                    <td>{c.status}</td>
                    <td className={styles.actionsRow}>
                      {canApproveChange && c.status === "PENDING_APPROVAL" ? (
                        <>
                          <form action={approveAccessChangeAction.bind(null, locale)}>
                            <input type="hidden" name="requestId" value={c.id} />
                            <button type="submit" className={styles.button}>{p.approve}</button>
                          </form>
                          <form action={rejectAccessChangeAction.bind(null, locale)}>
                            <input type="hidden" name="requestId" value={c.id} />
                            <button type="submit" className={styles.buttonGhost}>{p.reject}</button>
                          </form>
                        </>
                      ) : null}
                      {canApproveChange && c.status === "APPROVED" ? (
                        <form action={applyAccessChangeAction.bind(null, locale)}>
                          <input type="hidden" name="requestId" value={c.id} />
                          <button type="submit" className={styles.button}>{p.apply}</button>
                        </form>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <AccessChangeForm locale={locale} employees={emps} dict={dict} />
        </div>
      ) : null}

      {/* Access reviews */}
      {canReview ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.reviews}</h2>
          {reviews.length === 0 ? <p className={styles.subtle}>{dict.p4b.common.none}</p> : (
            <ul className={styles.info}>
              {reviews.map((r) => (
                <li key={r.id}>
                  {r.employee.displayName} · {r.currentRole} · {r.outcome ?? "OPEN"}
                  {!r.reviewedAt ? <ReviewForm locale={locale} reviewId={r.id} dict={dict} /> : null}
                </li>
              ))}
            </ul>
          )}
          <form action={createAccessReviewAction.bind(null, locale)} className={styles.actionsRow}>
            <select name="employeeId" aria-label={p.employee} className={styles.select}>
              {emps.map((e) => <option key={e.id} value={e.id}>{e.displayName}</option>)}
            </select>
            <button type="submit" className={styles.button}>{p.openReview}</button>
          </form>
        </div>
      ) : null}

      {/* Employee lifecycle / offboarding */}
      {canLifecycle ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.lifecycle}</h2>
          <table className={styles.table}>
            <thead>
              <tr><th>{p.employee}</th><th>{dict.p4b.readiness.status}</th><th></th></tr>
            </thead>
            <tbody>
              {employees.filter((e) => e.id !== employee.id).map((e) => (
                <tr key={e.id}>
                  <td>{e.displayName}</td>
                  <td>{e.lifecycleStage}</td>
                  <td className={styles.actionsRow}>
                    {e.lifecycleStage === "ACTIVE" ? (
                      <form action={beginOffboardingAction.bind(null, locale)} className={styles.actionsRow}>
                        <input type="hidden" name="employeeId" value={e.id} />
                        <input name="reason" aria-label={p.reason} placeholder={p.reason} className={styles.input} required />
                        <button type="submit" className={styles.buttonGhost}>{p.offboard}</button>
                      </form>
                    ) : null}
                    {e.lifecycleStage === "OFFBOARDING" ? (
                      <CompleteOffboardingForm locale={locale} employeeId={e.id} dict={dict} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Session administration */}
      {canSessions ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.sessions}</h2>
          <form action={signOutOthersAction.bind(null, locale)} style={{ marginBottom: "0.75rem" }}>
            <button type="submit" className={styles.buttonGhost}>{p.signOutOthers}</button>
          </form>
          {sessions.length === 0 ? <p className={styles.subtle}>{dict.p4b.common.none}</p> : (
            <table className={styles.table}>
              <thead>
                <tr><th>{p.employee}</th><th>{p.device}</th><th>{p.lastActivity}</th><th></th></tr>
              </thead>
              <tbody>
                {sessions.map((sn) => (
                  <tr key={sn.id}>
                    <td>{sn.employee.displayName}</td>
                    <td>{sn.deviceLabel ?? "—"}</td>
                    <td>{sn.lastActivityAt ? sn.lastActivityAt.toISOString().slice(0, 16).replace("T", " ") : "—"}</td>
                    <td>
                      <form action={adminRevokeSessionAction.bind(null, locale)}>
                        <input type="hidden" name="sessionId" value={sn.id} />
                        <button type="submit" className={styles.buttonGhost}>{p.revokeSession}</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </>
  );
}
