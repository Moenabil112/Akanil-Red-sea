import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { getPilotRun } from "@/lib/internal/services/operational-pilot";
import { listEmployeesForGovernance } from "@/lib/internal/services/governance-queries";
import { prisma } from "@/lib/internal/db";
import { transitionPilotRunAction, removePilotMemberAction, removePilotCaseAction } from "../../../operations-actions";
import { CompleteRunForm, AddMemberForm, ActivateMemberForm, AddCaseForm, ObservationForm } from "../../OperationsForms";
import styles from "../../../internal.module.css";

export const dynamic = "force-dynamic";

const NEXT: Record<string, string[]> = {
  PLANNED: ["READY", "CANCELLED"], READY: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["PAUSED"], PAUSED: ["ACTIVE", "CANCELLED"], COMPLETED: [], CANCELLED: [],
};

export default async function PilotDetailPage({ params }: { params: Promise<{ lang: string; pilotRunId: string }> }) {
  const { lang, pilotRunId } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "operations.pilot.view");
  const p = dict.p4c.pilot;
  const canManage = can(employee.role, "operations.pilot.manage");
  const canComplete = can(employee.role, "operations.pilot.complete");

  const run = await getPilotRun(employee, pilotRunId);
  if (!run) notFound();

  const [employees, caseRows] = await Promise.all([
    canManage ? listEmployeesForGovernance(employee) : Promise.resolve([]),
    canManage ? prisma.case.findMany({ where: { pilotDataCategory: { in: ["SYNTHETIC", "DE_IDENTIFIED"] } }, select: { id: true, internalReference: true, title: true }, take: 50, orderBy: { createdAt: "desc" } }) : Promise.resolve([]),
  ]);
  const emps = employees.map((e) => ({ id: e.id, displayName: e.displayName }));
  const caseOpts = caseRows.map((c) => ({ id: c.id, label: `${c.internalReference} — ${c.title}` }));
  const transitions = NEXT[run.status] ?? [];

  return (
    <>
      <h1 className={styles.h1}><span className={styles.mono}>{run.internalReference}</span> — {run.title}</h1>
      <p className={styles.subtle}>
        <span className={styles.pill}>{run.status}</span> · {run.maximumEmployees} emp · {run.maximumCases} cases ·
        {" "}<Link href={`/${locale}/internal/operations/pilot`} className={styles.link}>{p.title}</Link>
      </p>
      <p className={styles.info}>{run.objective}</p>

      {canManage && transitions.length > 0 ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.transition}</h2>
          <form action={transitionPilotRunAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="pilotRunId" value={run.id} />
            <select name="toStatus" aria-label={p.transition} className={styles.select}>{transitions.map((t) => <option key={t} value={t}>{t}</option>)}</select>
            <button type="submit" className={styles.button}>{p.transition}</button>
          </form>
        </div>
      ) : null}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.members}</h2>
        {run.members.length === 0 ? <p className={styles.subtle}>{dict.p4c.common.none}</p> : (
          <table className={styles.table}>
            <thead><tr><th>{dict.p4b.access.employee}</th><th>{dict.p4b.access.role}</th><th>{p.status}</th><th></th></tr></thead>
            <tbody>
              {run.members.map((m) => (
                <tr key={m.id}>
                  <td className={styles.mono}>{m.employeeId.slice(0, 8)}</td><td>{m.operationalRole}</td><td>{m.status}</td>
                  <td className={styles.actionsRow}>
                    {canManage && (m.status === "PROPOSED" || m.status === "APPROVED") ? <ActivateMemberForm locale={locale} runId={run.id} memberId={m.id} dict={dict} /> : null}
                    {canManage && m.status === "ACTIVE" ? (
                      <form action={removePilotMemberAction.bind(null, locale)}>
                        <input type="hidden" name="pilotRunId" value={run.id} />
                        <input type="hidden" name="memberId" value={m.id} />
                        <button type="submit" className={styles.buttonGhost}>{p.remove}</button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {canManage ? <AddMemberForm locale={locale} runId={run.id} employees={emps} dict={dict} /> : null}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.cases}</h2>
        {run.cases.length === 0 ? <p className={styles.subtle}>{dict.p4c.common.none}</p> : (
          <table className={styles.table}>
            <thead><tr><th>{p.scenario}</th><th>{p.dataCategory}</th><th>{p.status}</th><th></th></tr></thead>
            <tbody>
              {run.cases.map((c) => (
                <tr key={c.id}>
                  <td className={styles.mono}>{c.scenarioType}</td><td>{c.dataCategory}</td><td>{c.status}</td>
                  <td>{canManage && c.status !== "REMOVED" ? (
                    <form action={removePilotCaseAction.bind(null, locale)}>
                      <input type="hidden" name="pilotRunId" value={run.id} />
                      <input type="hidden" name="pilotCaseId" value={c.id} />
                      <button type="submit" className={styles.buttonGhost}>{p.remove}</button>
                    </form>
                  ) : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {canManage ? <AddCaseForm locale={locale} runId={run.id} cases={caseOpts} dict={dict} /> : null}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.observations}</h2>
        {run.observations.length === 0 ? <p className={styles.subtle}>{dict.p4c.common.none}</p> : (
          <ul className={styles.info}>{run.observations.map((o) => <li key={o.id}>[{o.severity}] {o.category}: {o.title} — {o.status}</li>)}</ul>
        )}
        <ObservationForm locale={locale} runId={run.id} dict={dict} />
      </div>

      {canComplete && (run.status === "ACTIVE" || run.status === "PAUSED") ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{p.complete}</h2>
          <CompleteRunForm locale={locale} runId={run.id} dict={dict} />
        </div>
      ) : null}
    </>
  );
}
