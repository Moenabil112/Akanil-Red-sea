import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listExercises, listCorrectiveActions } from "@/lib/internal/services/exercises";
import { createExerciseAction, startExerciseAction, updateCorrectiveAction2 } from "../../governance-actions";
import { RecordResultForm, ApproveExerciseForm, VerifyCorrectiveForm, AcceptRiskForm } from "../ExerciseForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

const EXERCISE_TYPES = [
  "EMPLOYEE_ONBOARDING", "EMPLOYEE_OFFBOARDING", "ROLE_CHANGE", "MANUAL_CASE_CREATION",
  "CASE_ASSIGNMENT", "QUALIFICATION_REVIEW", "INFORMATION_GAP", "MEETING_PREPARATION",
  "DECISION_APPROVAL", "COMMITMENT_FOLLOW_UP", "CASE_CLOSURE_AND_REOPEN", "SESSION_REVOCATION",
  "ACCOUNT_LOCKOUT", "OBJECT_ACCESS_DENIAL", "CONCURRENCY_CONFLICT", "AUDIT_CHAIN_VERIFICATION",
  "BACKUP_AND_RESTORE", "INCIDENT_RESPONSE", "PUBLIC_INTERNAL_BOUNDARY", "INTERNAL_FEATURE_SHUTDOWN",
];

export default async function ExercisesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "exercise.view");
  const p = dict.p4b.exercises;

  const canManage = can(employee.role, "exercise.manage");
  const canApprove = can(employee.role, "exercise.approve");
  const canCorrective = can(employee.role, "corrective.manage");
  const canVerify = can(employee.role, "corrective.verify");

  const [exercises, corrective] = await Promise.all([
    listExercises(employee),
    can(employee.role, "corrective.view") ? listCorrectiveActions(employee) : Promise.resolve([]),
  ]);

  return (
    <>
      <h1 className={styles.h1}>{p.title}</h1>
      <p className={styles.subtle}>
        <Link href={`/${locale}/internal/readiness`} className={styles.link}>← {dict.p4b.readiness.title}</Link>
      </p>
      <p className={styles.info}>{p.syntheticOnly}</p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.title}</h2>
        {exercises.length === 0 ? <p className={styles.subtle}>{dict.p4b.common.none}</p> : (
          <table className={styles.table}>
            <thead>
              <tr><th>{p.type}</th><th>{dict.p4b.readiness.status}</th><th>{p.result}</th><th></th></tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id}>
                  <td className={styles.mono}>{ex.type}</td>
                  <td>{ex.status}</td>
                  <td>{ex.actualResult ?? "—"}</td>
                  <td className={styles.actionsRow}>
                    {canManage && ex.status === "PLANNED" ? (
                      <form action={startExerciseAction.bind(null, locale)}>
                        <input type="hidden" name="exerciseId" value={ex.id} />
                        <button type="submit" className={styles.buttonGhost}>{p.start}</button>
                      </form>
                    ) : null}
                    {canManage && ex.status === "IN_PROGRESS" ? (
                      <RecordResultForm locale={locale} exerciseId={ex.id} dict={dict} />
                    ) : null}
                    {canApprove && ex.completedAt && !ex.approvedById ? (
                      <ApproveExerciseForm locale={locale} exerciseId={ex.id} dict={dict} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {canManage ? (
          <form action={createExerciseAction.bind(null, locale)} className={styles.actionsRow}>
            <select name="type" aria-label={p.type} className={styles.select}>
              {EXERCISE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input name="title" aria-label={dict.cases.caseTitle} placeholder={dict.cases.caseTitle} required className={styles.input} />
            <input name="expectedResult" aria-label={p.expected} placeholder={p.expected} required className={styles.input} />
            <button type="submit" className={styles.button}>{p.plan}</button>
          </form>
        ) : null}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.corrective}</h2>
        {corrective.length === 0 ? <p className={styles.subtle}>{dict.p4b.common.none}</p> : (
          <table className={styles.table}>
            <thead>
              <tr><th>{dict.cases.caseTitle}</th><th>{dict.p4b.security.severity}</th><th>{dict.p4b.readiness.status}</th><th></th></tr>
            </thead>
            <tbody>
              {corrective.map((ca) => (
                <tr key={ca.id}>
                  <td>{ca.title}</td>
                  <td>{ca.severity}</td>
                  <td>{ca.status}</td>
                  <td className={styles.actionsRow}>
                    {canCorrective && (ca.status === "OPEN" || ca.status === "IN_PROGRESS") ? (
                      <form action={updateCorrectiveAction2.bind(null, locale)} className={styles.actionsRow}>
                        <input type="hidden" name="id" value={ca.id} />
                        <input type="hidden" name="status" value="READY_FOR_VERIFICATION" />
                        <input name="resolutionEvidence" aria-label={p.evidence} placeholder={p.evidence} required className={styles.input} />
                        <button type="submit" className={styles.buttonGhost}>{dict.p4b.common.save}</button>
                      </form>
                    ) : null}
                    {canVerify && ca.status === "READY_FOR_VERIFICATION" ? (
                      <VerifyCorrectiveForm locale={locale} id={ca.id} dict={dict} />
                    ) : null}
                    {canCorrective && ca.status !== "VERIFIED" && ca.status !== "ACCEPTED_RISK" ? (
                      <AcceptRiskForm locale={locale} id={ca.id} dict={dict} />
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
