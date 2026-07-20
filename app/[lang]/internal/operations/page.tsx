import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { getWorkQueueSummary } from "@/lib/internal/services/work-queue";
import { getOperationsSummary } from "@/lib/internal/services/operations-report";
import { getFinalReadinessAreas } from "@/lib/internal/services/readiness";
import { statusClass } from "../readiness/page";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function OperationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "operations.pilot.view");
  const p = dict.p4c;

  const [wq, report, areas] = await Promise.all([
    getWorkQueueSummary(employee),
    getOperationsSummary(employee),
    getFinalReadinessAreas(),
  ]);

  const wqRows: [string, number][] = [
    ["New cases", wq.newCases], ["Unassigned", wq.unassignedCases], ["Qualification pending", wq.qualificationPending],
    ["Specialist reviews", wq.specialistReviewsPending], ["Open info gaps", wq.openInformationGaps],
    ["Meeting records incomplete", wq.meetingRecordsIncomplete], ["Decisions awaiting approval", wq.decisionsAwaitingApproval],
    ["Open commitments", wq.openCommitments], ["Overdue commitments", wq.overdueCommitments],
    ["Overdue access reviews", wq.overdueAccessReviews], ["Open security events", wq.openSecurityEvents],
    ["Open incidents", wq.openIncidents], ["Failed exercises", wq.failedExercises],
    ["Open corrective actions", wq.openCorrectiveActions], ["Open data-quality findings", wq.openDataQualityFindings],
    ["Procedures awaiting ack", wq.proceduresAwaitingAcknowledgement], ["Authorizations nearing expiry", wq.authorizationsNearingExpiry],
  ];

  return (
    <>
      <h1 className={styles.h1}>{p.overview.title}</h1>
      <p className={styles.subtle}>{p.overview.lead}</p>
      <p className={styles.info}>{p.overview.humanDecisionPending}</p>

      <nav className={styles.sectionNav} aria-label={p.overview.title}>
        <Link href={`/${locale}/internal/operations/pilot`} className={styles.navLink}>{p.overview.pilotLink}</Link>
        <Link href={`/${locale}/internal/operations/data-quality`} className={styles.navLink}>{p.overview.dataQualityLink}</Link>
        <Link href={`/${locale}/internal/operations/procedures`} className={styles.navLink}>{p.overview.proceduresLink}</Link>
        <Link href={`/${locale}/internal/operations/release`} className={styles.navLink}>{p.overview.releaseLink}</Link>
        <Link href={`/${locale}/internal/operations/authorization`} className={styles.navLink}>{p.overview.authorizationLink}</Link>
      </nav>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.overview.workQueue}</h2>
        <table className={styles.table}>
          <thead><tr><th>Item</th><th>Count</th></tr></thead>
          <tbody>{wqRows.map(([k, v]) => <tr key={k}><td>{k}</td><td className={v > 0 ? styles.areaWarn : styles.areaNeutral}>{v}</td></tr>)}</tbody>
        </table>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.overview.report}</h2>
        <p className={styles.info}>
          Cases by status: {report.casesByStatus.map((r) => `${r.key} ${r.count}`).join(" · ") || "—"}
        </p>
        <p className={styles.info}>
          Unassigned {report.unassignedCases} · Pending decisions {report.pendingDecisions} · Open commitments {report.openCommitments} ·
          {" "}Overdue commitments {report.overdueCommitments} · Completed pilot scenarios {report.completedPilotScenarios} ·
          {" "}Open data-quality {report.openDataQualityFindings} · Open corrective {report.openCorrectiveActions}
        </p>
        <p className={styles.info}>Latest backup: {report.latestBackup} · Latest restore: {report.latestRestore}</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{p.overview.finalReadiness}</h2>
        <table className={styles.table}>
          <thead><tr><th>{p.common.area}</th><th>{p.common.status}</th><th>{p.common.detail}</th></tr></thead>
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
    </>
  );
}
