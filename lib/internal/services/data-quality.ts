import { prisma } from "../db";
import { audit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";
import { validPublicId } from "../taxonomy";

/**
 * P4-C data-quality service (§14). Detection is DETERMINISTIC and explainable —
 * no AI, no fuzzy external services. Duplicate detection is a suggestion only:
 * organizations and contacts are never automatically merged, and data is never
 * deleted. Resolution is human-controlled; a waiver requires a rationale.
 * Findings and resolutions are audited; no external notification is sent.
 */

export class DataQualityError extends Error {}

const STALE_GAP_DAYS = 30;

function norm(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

interface Candidate {
  entityType: string;
  entityId: string;
  caseId?: string | null;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  explanation: string;
  signature: string;
}

/** Deterministically detect data-quality candidates across the internal data. */
async function detect(): Promise<Candidate[]> {
  const now = Date.now();
  const out: Candidate[] = [];

  const [cases, commitments, decisions, meetings, gaps, orgs, contacts] = await Promise.all([
    prisma.case.findMany({
      select: { id: true, status: true, currentOwnerId: true, requestType: true, qualificationStatus: true, primaryPlatformId: true, primaryValueChainId: true, forumParticipationPathId: true, forumSectorTrackId: true, organizationId: true },
    }),
    prisma.commitment.findMany({ select: { id: true, caseId: true, status: true, internalOwnerId: true, dueDate: true } }),
    prisma.decision.findMany({ select: { id: true, caseId: true, status: true, rationale: true } }),
    prisma.meetingRecord.findMany({ select: { id: true, caseId: true, proposedNextSteps: true } }),
    prisma.informationGap.findMany({ where: { status: "OPEN" }, select: { id: true, caseId: true, createdAt: true } }),
    prisma.organization.findMany({ select: { id: true, workingName: true, verificationStatus: true } }),
    prisma.contact.findMany({ select: { id: true, organizationId: true, fullName: true, professionalEmail: true } }),
  ]);

  const qualReviewCaseIds = new Set(
    (await prisma.qualificationReview.findMany({ select: { caseId: true } })).map((q) => q.caseId),
  );

  for (const c of cases) {
    if (c.status !== "CLOSED" && !c.currentOwnerId) {
      out.push({ entityType: "Case", entityId: c.id, caseId: c.id, category: "CASE_WITHOUT_OWNER", severity: "HIGH", title: "Case has no owner", explanation: "An open case has no current owner assigned.", signature: `CASE_WITHOUT_OWNER:${c.id}` });
    }
    if (c.status !== "CLOSED" && !c.requestType) {
      out.push({ entityType: "Case", entityId: c.id, caseId: c.id, category: "CASE_WITHOUT_CLEAR_PURPOSE", severity: "MEDIUM", title: "Case has no request type", explanation: "An open case has no request type recorded.", signature: `CASE_WITHOUT_CLEAR_PURPOSE:${c.id}` });
    }
    if ((c.qualificationStatus === "QUALIFIED" || c.qualificationStatus === "CONDITIONALLY_QUALIFIED") && !qualReviewCaseIds.has(c.id)) {
      out.push({ entityType: "Case", entityId: c.id, caseId: c.id, category: "QUALIFIED_WITHOUT_REVIEWER", severity: "HIGH", title: "Qualified without a review record", explanation: "The case is qualified but has no qualification review.", signature: `QUALIFIED_WITHOUT_REVIEWER:${c.id}` });
    }
    if (c.primaryPlatformId && !validPublicId("platform", c.primaryPlatformId)) {
      out.push({ entityType: "Case", entityId: c.id, caseId: c.id, category: "INVALID_PLATFORM_CHAIN_COMBINATION", severity: "MEDIUM", title: "Invalid platform id", explanation: "The stored platform id is not a valid taxonomy id.", signature: `INVALID_PLATFORM_CHAIN_COMBINATION:platform:${c.id}` });
    }
    if (c.primaryValueChainId && !validPublicId("chain", c.primaryValueChainId)) {
      out.push({ entityType: "Case", entityId: c.id, caseId: c.id, category: "INVALID_PLATFORM_CHAIN_COMBINATION", severity: "MEDIUM", title: "Invalid value-chain id", explanation: "The stored value-chain id is not a valid taxonomy id.", signature: `INVALID_PLATFORM_CHAIN_COMBINATION:chain:${c.id}` });
    }
    if (c.forumParticipationPathId && !validPublicId("participant", c.forumParticipationPathId)) {
      out.push({ entityType: "Case", entityId: c.id, caseId: c.id, category: "INVALID_FORUM_CONTEXT", severity: "MEDIUM", title: "Invalid Forum participation id", explanation: "The stored Forum participation id is not valid.", signature: `INVALID_FORUM_CONTEXT:participant:${c.id}` });
    }
    if (c.forumSectorTrackId && !validPublicId("track", c.forumSectorTrackId)) {
      out.push({ entityType: "Case", entityId: c.id, caseId: c.id, category: "INVALID_FORUM_CONTEXT", severity: "MEDIUM", title: "Invalid Forum track id", explanation: "The stored Forum track id is not valid.", signature: `INVALID_FORUM_CONTEXT:track:${c.id}` });
    }
  }

  const openByCase = new Map<string, number>();
  for (const m of commitments) {
    const open = m.status !== "COMPLETED" && m.status !== "CANCELLED";
    if (open && !m.internalOwnerId) {
      out.push({ entityType: "Commitment", entityId: m.id, caseId: m.caseId, category: "COMMITMENT_WITHOUT_OWNER", severity: "MEDIUM", title: "Commitment has no owner", explanation: "An open commitment has no internal owner.", signature: `COMMITMENT_WITHOUT_OWNER:${m.id}` });
    }
    if (open && !m.dueDate) {
      out.push({ entityType: "Commitment", entityId: m.id, caseId: m.caseId, category: "COMMITMENT_WITHOUT_DUE_DATE", severity: "LOW", title: "Commitment has no due date", explanation: "An open commitment has no due date.", signature: `COMMITMENT_WITHOUT_DUE_DATE:${m.id}` });
    }
    if (open) openByCase.set(m.caseId, (openByCase.get(m.caseId) ?? 0) + 1);
  }
  for (const c of cases) {
    if (c.status === "CLOSED" && (openByCase.get(c.id) ?? 0) > 0) {
      out.push({ entityType: "Case", entityId: c.id, caseId: c.id, category: "CLOSED_CASE_WITH_OPEN_COMMITMENT", severity: "HIGH", title: "Closed case has an open commitment", explanation: "A closed case still has an open commitment.", signature: `CLOSED_CASE_WITH_OPEN_COMMITMENT:${c.id}` });
    }
  }
  for (const d of decisions) {
    if (d.status === "APPROVED" && !norm(d.rationale)) {
      out.push({ entityType: "Decision", entityId: d.id, caseId: d.caseId, category: "DECISION_WITHOUT_RATIONALE", severity: "MEDIUM", title: "Approved decision without rationale", explanation: "An approved decision has no rationale.", signature: `DECISION_WITHOUT_RATIONALE:${d.id}` });
    }
  }
  for (const mr of meetings) {
    if (!norm(mr.proposedNextSteps)) {
      out.push({ entityType: "MeetingRecord", entityId: mr.id, caseId: mr.caseId, category: "MEETING_WITHOUT_OUTCOME", severity: "LOW", title: "Meeting record without next steps", explanation: "A meeting record has no proposed next steps.", signature: `MEETING_WITHOUT_OUTCOME:${mr.id}` });
    }
  }
  for (const g of gaps) {
    if (now - g.createdAt.getTime() > STALE_GAP_DAYS * 86_400_000) {
      out.push({ entityType: "InformationGap", entityId: g.id, caseId: g.caseId, category: "STALE_INFORMATION_GAP", severity: "LOW", title: "Stale open information gap", explanation: `An information gap has been open for more than ${STALE_GAP_DAYS} days.`, signature: `STALE_INFORMATION_GAP:${g.id}` });
    }
  }
  const activeCaseOrgIds = new Set(cases.filter((c) => c.status !== "CLOSED" && c.organizationId).map((c) => c.organizationId));
  for (const o of orgs) {
    if (o.verificationStatus === "ARCHIVED" && activeCaseOrgIds.has(o.id)) {
      out.push({ entityType: "Organization", entityId: o.id, category: "ARCHIVED_ORGANIZATION_WITH_ACTIVE_CASE", severity: "MEDIUM", title: "Archived organization has an active case", explanation: "An archived organization still has an open case.", signature: `ARCHIVED_ORGANIZATION_WITH_ACTIVE_CASE:${o.id}` });
    }
  }

  // Deterministic duplicate suggestions (never merged).
  const orgByName = new Map<string, string[]>();
  for (const o of orgs) {
    const k = norm(o.workingName);
    if (!k) continue;
    orgByName.set(k, [...(orgByName.get(k) ?? []), o.id]);
  }
  for (const [, ids] of orgByName) {
    if (ids.length > 1) {
      const sig = `POSSIBLE_DUPLICATE_ORGANIZATION:${[...ids].sort().join("+")}`;
      out.push({ entityType: "Organization", entityId: ids[0]!, category: "POSSIBLE_DUPLICATE_ORGANIZATION", severity: "LOW", title: "Possible duplicate organizations", explanation: `Organizations share a normalized working name: ${ids.join(", ")}. Suggestion only — never auto-merged.`, signature: sig });
    }
  }
  const contactByKey = new Map<string, string[]>();
  for (const c of contacts) {
    const email = norm(c.professionalEmail);
    const k = email ? `email:${email}` : `name:${c.organizationId}:${norm(c.fullName)}`;
    if (!norm(c.fullName) && !email) continue;
    contactByKey.set(k, [...(contactByKey.get(k) ?? []), c.id]);
  }
  for (const [, ids] of contactByKey) {
    if (ids.length > 1) {
      const sig = `POSSIBLE_DUPLICATE_CONTACT:${[...ids].sort().join("+")}`;
      out.push({ entityType: "Contact", entityId: ids[0]!, category: "POSSIBLE_DUPLICATE_CONTACT", severity: "LOW", title: "Possible duplicate contacts", explanation: `Contacts share a normalized identifier: ${ids.join(", ")}. Suggestion only — never auto-merged.`, signature: sig });
    }
  }

  return out;
}

/** Run the deterministic scan, upserting new findings by signature. */
export async function runDataQualityScan(actor: CurrentEmployee): Promise<number> {
  assertCan(actor, "operations.data_quality.manage");
  const candidates = await detect();
  let created = 0;
  for (const c of candidates) {
    const existing = await prisma.dataQualityFinding.findUnique({ where: { signature: c.signature } });
    if (existing) continue; // never duplicate; keeps human resolution state
    await prisma.dataQualityFinding.create({
      data: {
        entityType: c.entityType,
        entityId: c.entityId,
        caseId: c.caseId ?? null,
        category: c.category as never,
        severity: c.severity as never,
        title: c.title,
        explanation: c.explanation,
        signature: c.signature,
      },
    });
    created += 1;
  }
  await audit({
    actorEmployeeId: actor.id,
    action: "DATA_QUALITY_SCAN",
    entityType: "DataQualityFinding",
    entityId: null,
    summary: `Data-quality scan created ${created} new finding(s)`,
  });
  return created;
}

export async function resolveDataQualityFinding(
  actor: CurrentEmployee,
  id: string,
  input: { status: "RESOLVED" | "FALSE_POSITIVE" | "WAIVED"; resolution?: string; waiverRationale?: string },
): Promise<void> {
  assertCan(actor, "operations.data_quality.manage");
  const finding = await prisma.dataQualityFinding.findUnique({ where: { id } });
  if (!finding) throw new DataQualityError("Finding not found.");
  if (input.status === "WAIVED" && !input.waiverRationale?.trim()) {
    throw new DataQualityError("A waiver requires a rationale.");
  }
  await prisma.dataQualityFinding.update({
    where: { id },
    data: {
      status: input.status,
      resolution: input.resolution?.trim() ?? finding.resolution,
      resolvedAt: input.status === "RESOLVED" || input.status === "FALSE_POSITIVE" ? new Date() : finding.resolvedAt,
      waivedById: input.status === "WAIVED" ? actor.id : finding.waivedById,
      waiverRationale: input.status === "WAIVED" ? input.waiverRationale!.trim() : finding.waiverRationale,
    },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "DATA_QUALITY_RESOLVED",
    entityType: "DataQualityFinding",
    entityId: id,
    summary: `Data-quality finding ${input.status.toLowerCase()}`,
  });
}

export async function listDataQualityFindings(actor: CurrentEmployee, openOnly = false) {
  assertCan(actor, "operations.data_quality.view");
  return prisma.dataQualityFinding.findMany({
    where: openOnly ? { status: { in: ["OPEN", "UNDER_REVIEW"] } } : {},
    orderBy: [{ severity: "desc" }, { detectedAt: "desc" }],
    take: 300,
  });
}
