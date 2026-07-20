import { redirect, notFound } from "next/navigation";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { canAccessCase } from "@/lib/internal/services/cases";
import { getCaseDetail, listActiveEmployees, listAuditEvents } from "@/lib/internal/services/queries";
import { nextStatuses, CLOSURE_REASONS, type CaseStatus } from "@/lib/internal/lifecycle";
import {
  transitionAction,
  assignOwnerAction,
  addNoteAction,
  createGapAction,
  resolveGapAction,
  createEvidenceAction,
  qualRecommendAction,
  qualApproveAction,
  decisionProposeAction,
  decisionResolveAction,
  commitmentCreateAction,
  commitmentUpdateAction,
} from "../../actions";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

const DECISION_TYPES = [
  "REQUEST_MORE_INFORMATION",
  "PROGRESS_TO_SPECIALIST_REVIEW",
  "PROGRESS_TO_MEETING",
  "PROGRESS_TO_PROJECT_REVIEW",
  "PROGRESS_TO_INSTITUTIONAL_DISCUSSION",
  "PROGRESS_TO_FOLLOW_UP",
  "PLACE_ON_HOLD",
  "DO_NOT_PROGRESS",
  "CLOSE_CASE",
];

export default async function CaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; caseId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { lang, caseId } = await params;
  const sp = await searchParams;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "view.dashboard");
  if (!(await canAccessCase(employee, caseId))) redirect(`/${locale}/internal/denied`);

  const c = await getCaseDetail(caseId);
  if (!c) notFound();

  const employees = can(employee.role, "case.assign") ? await listActiveEmployees() : [];
  const auditEvents = can(employee.role, "audit.view")
    ? await listAuditEvents({ caseId })
    : [];
  const transitions = nextStatuses(c.status as CaseStatus);
  const canTransition = can(employee.role, "case.transition") || can(employee.role, "case.close") || can(employee.role, "case.reopen");

  return (
    <>
      {sp.conflict ? <p className={styles.error}>{dict.detail.conflict}</p> : null}

      <h1 className={styles.h1}>
        <span className={styles.mono}>{c.internalReference}</span> — {c.title}
      </h1>
      <p className={styles.subtle}>
        <span className={styles.pill}>{c.status}</span> · {c.priority} · {c.classification}
        {" · "}
        {dict.cases.owner}: {c.currentOwner?.displayName ?? "—"}
      </p>

      {/* Overview */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{dict.detail.overview}</h2>
        <p>{c.summary}</p>
        <p className={styles.info} style={{ marginTop: "0.5rem" }}>
          {dict.cases.source}: {c.source} · {dict.cases.requestType}: {c.requestType ?? "—"} ·
          {" "}platform: {c.primaryPlatformId ?? "—"} · chain: {c.primaryValueChainId ?? "—"} ·
          {" "}participant: {c.forumParticipationPathId ?? "—"} · track: {c.forumSectorTrackId ?? "—"}
          {" · "}organization: {c.organization?.workingName ?? "—"}
        </p>
      </div>

      {/* Change status */}
      {canTransition && c.status !== "CLOSED" && transitions.length > 0 ? (
        <Section title={dict.detail.changeStatus}>
          <form action={transitionAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="caseId" value={c.id} />
            <input type="hidden" name="version" value={c.recordVersion} />
            <div className={styles.field}>
              <label className={styles.label} htmlFor="to">
                {dict.detail.changeStatus}
              </label>
              <select id="to" name="to" className={styles.select}>
                {transitions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="closureReason">
                {dict.detail.closureReason}
              </label>
              <select id="closureReason" name="closureReason" className={styles.select}>
                <option value="">—</option>
                {CLOSURE_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={styles.button}>
              {dict.detail.changeStatus}
            </button>
          </form>
        </Section>
      ) : null}

      {/* Assignments */}
      <Section title={dict.detail.assignments}>
        <ul className={styles.info}>
          {c.assignments.map((a) => (
            <li key={a.id}>
              {a.assignmentType}: {a.employee.displayName}
            </li>
          ))}
        </ul>
        {can(employee.role, "case.assign") ? (
          <form action={assignOwnerAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="caseId" value={c.id} />
            <select name="ownerId" aria-label={dict.detail.reassignOwner} className={styles.select}>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.displayName}
                </option>
              ))}
            </select>
            <button type="submit" className={styles.button}>
              {dict.detail.reassignOwner}
            </button>
          </form>
        ) : null}
      </Section>

      {/* Qualification */}
      <Section title={dict.detail.qualification}>
        <ul className={styles.info}>
          {c.qualificationReviews.map((q) => (
            <li key={q.id}>
              {q.finalOutcome} · {q.recommendation ?? ""}
              {can(employee.role, "qualification.approve") && q.finalOutcome === "PENDING" ? (
                <form action={qualApproveAction.bind(null, locale)} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
                  <input type="hidden" name="caseId" value={c.id} />
                  <input type="hidden" name="reviewId" value={q.id} />
                  <select name="outcome" aria-label={dict.detail.qualification} className={styles.select}>
                    {["QUALIFIED", "CONDITIONALLY_QUALIFIED", "NOT_QUALIFIED", "ON_HOLD"].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={styles.button}>
                    {dict.detail.approve}
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {can(employee.role, "qualification.recommend") ? (
          <form action={qualRecommendAction.bind(null, locale)} className={styles.form}>
            <input type="hidden" name="caseId" value={c.id} />
            <textarea name="recommendation" placeholder={dict.detail.recommend} required className={styles.textarea} />
            <button type="submit" className={styles.button}>
              {dict.detail.recommend}
            </button>
          </form>
        ) : null}
      </Section>

      {/* Internal notes (append-only) */}
      <Section title={dict.detail.notes}>
        <ul className={styles.info}>
          {c.notes.map((n) => (
            <li key={n.id}>
              [{n.noteType}] {n.author.displayName}: {n.body}
            </li>
          ))}
        </ul>
        {can(employee.role, "note.create") ? (
          <form action={addNoteAction.bind(null, locale)} className={styles.form}>
            <input type="hidden" name="caseId" value={c.id} />
            <textarea name="body" required placeholder={dict.detail.noteBody} className={styles.textarea} />
            <button type="submit" className={styles.button}>
              {dict.detail.addNote}
            </button>
          </form>
        ) : null}
      </Section>

      {/* Information gaps */}
      <Section title={dict.detail.gaps}>
        <ul className={styles.info}>
          {c.informationGaps.map((g) => (
            <li key={g.id}>
              [{g.status}] {g.title}
              {can(employee.role, "gap.manage") && g.status === "OPEN" ? (
                <form action={resolveGapAction.bind(null, locale)} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
                  <input type="hidden" name="caseId" value={c.id} />
                  <input type="hidden" name="gapId" value={g.id} />
                  <input name="resolutionNote" aria-label="resolution note" placeholder="resolution" className={styles.input} />
                  <select name="status" aria-label={dict.detail.resolve} className={styles.select}>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="WAIVED">WAIVED</option>
                  </select>
                  <button type="submit" className={styles.button}>
                    {dict.detail.resolve}
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {can(employee.role, "gap.manage") ? (
          <form action={createGapAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="caseId" value={c.id} />
            <input name="category" placeholder="category" required className={styles.input} />
            <input name="title" placeholder="title" required className={styles.input} />
            <button type="submit" className={styles.button}>
              {dict.detail.add}
            </button>
          </form>
        ) : null}
      </Section>

      {/* Evidence references (metadata only — no file upload) */}
      <Section title={dict.detail.evidence}>
        <ul className={styles.info}>
          {c.evidenceReferences.map((e) => (
            <li key={e.id}>
              [{e.verificationStatus}] {e.title} — {e.locationNote ?? ""}
            </li>
          ))}
        </ul>
        {can(employee.role, "evidence.manage") ? (
          <form action={createEvidenceAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="caseId" value={c.id} />
            <input name="title" placeholder="title" required className={styles.input} />
            <input name="locationNote" placeholder="internal location note (text only)" className={styles.input} />
            <button type="submit" className={styles.button}>
              {dict.detail.add}
            </button>
          </form>
        ) : null}
      </Section>

      {/* Decisions */}
      <Section title={dict.detail.decisions}>
        <ul className={styles.info}>
          {c.decisions.map((d) => (
            <li key={d.id}>
              [{d.status}] {d.decisionType} — {d.title}
              {can(employee.role, "decision.approve") && d.status === "PROPOSED" ? (
                <form action={decisionResolveAction.bind(null, locale)} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
                  <input type="hidden" name="caseId" value={c.id} />
                  <input type="hidden" name="decisionId" value={d.id} />
                  <select name="outcome" aria-label={dict.detail.decisions} className={styles.select}>
                    {["APPROVED", "REJECTED", "DEFERRED"].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={styles.button}>
                    {dict.detail.resolve}
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {can(employee.role, "decision.propose") ? (
          <form action={decisionProposeAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="caseId" value={c.id} />
            <input name="title" placeholder="title" required className={styles.input} />
            <select name="decisionType" aria-label={dict.detail.propose} className={styles.select}>
              {DECISION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button type="submit" className={styles.button}>
              {dict.detail.propose}
            </button>
          </form>
        ) : null}
      </Section>

      {/* Commitments */}
      <Section title={dict.detail.commitments}>
        <ul className={styles.info}>
          {c.commitments.map((m) => (
            <li key={m.id}>
              [{m.status}] {m.title}
              {can(employee.role, "commitment.manage") && m.status !== "COMPLETED" && m.status !== "CANCELLED" ? (
                <form action={commitmentUpdateAction.bind(null, locale)} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
                  <input type="hidden" name="caseId" value={c.id} />
                  <input type="hidden" name="commitmentId" value={m.id} />
                  <input type="hidden" name="version" value={m.recordVersion} />
                  <select name="status" aria-label={dict.detail.commitments} className={styles.select}>
                    {["IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={styles.button}>
                    {dict.detail.resolve}
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {can(employee.role, "commitment.manage") ? (
          <form action={commitmentCreateAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="caseId" value={c.id} />
            <input name="title" placeholder="title" required className={styles.input} />
            <button type="submit" className={styles.button}>
              {dict.detail.add}
            </button>
          </form>
        ) : null}
      </Section>

      {/* Audit summary */}
      {can(employee.role, "audit.view") ? (
        <Section title={dict.detail.auditSummary}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{dict.audit.when}</th>
                <th>{dict.audit.actor}</th>
                <th>{dict.audit.action}</th>
                <th>{dict.audit.summary}</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.slice(0, 20).map((a) => (
                <tr key={a.id}>
                  <td>{a.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td>{a.actor?.displayName ?? "system"}</td>
                  <td className={styles.mono}>{a.action}</td>
                  <td>{a.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ) : null}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      {children}
    </div>
  );
}
