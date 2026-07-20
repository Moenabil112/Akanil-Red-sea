import { prisma } from "../db";
import { audit } from "../audit";
import { assertCan, type CurrentEmployee } from "../authz";

/**
 * P4-C internal release-candidate evidence (§20). Records the validation
 * evidence for a reviewed commit. NO deployment action is ever taken. The
 * commit SHA must match the reviewed branch commit. Approved/reviewed evidence
 * is immutable — new evidence creates a superseding candidate. Review requires a
 * recent step-up (enforced at the action layer). No production URL or secret is
 * stored (rejected on input).
 */

export class ReleaseCandidateError extends Error {}

const SHA_RE = /^[0-9a-f]{7,40}$/i;
// Reject anything that looks like a secret or a URL sneaking into evidence.
const FORBIDDEN_VALUE = /(https?:\/\/|postgres(ql)?:\/\/|AUTH_SECRET|BEGIN [A-Z ]*PRIVATE KEY|[A-Za-z0-9+/]{40,})/;

function assertClean(fields: Record<string, string | null | undefined>): void {
  for (const [key, value] of Object.entries(fields)) {
    if (value && FORBIDDEN_VALUE.test(value)) {
      throw new ReleaseCandidateError(`Release evidence field "${key}" must not contain a URL or secret.`);
    }
  }
}

export async function prepareReleaseCandidate(
  actor: CurrentEmployee,
  input: {
    version: string;
    commitSha: string;
    migrationBaseline?: string;
    buildResult?: string;
    testResult?: string;
    accessibilityResult?: string;
    auditVerificationResult?: string;
    backupRestoreResult?: string;
    secretScanResult?: string;
    prohibitedFeatureScanResult?: string;
    publicRegressionResult?: string;
    rollbackPlanVersion?: string;
  },
): Promise<string> {
  assertCan(actor, "operations.release.prepare");
  if (!input.version?.trim()) throw new ReleaseCandidateError("A version label is required.");
  if (!SHA_RE.test(input.commitSha.trim())) {
    throw new ReleaseCandidateError("A valid commit SHA is required.");
  }
  assertClean({
    version: input.version, migrationBaseline: input.migrationBaseline, rollbackPlanVersion: input.rollbackPlanVersion,
    buildResult: input.buildResult, testResult: input.testResult, accessibilityResult: input.accessibilityResult,
    auditVerificationResult: input.auditVerificationResult, backupRestoreResult: input.backupRestoreResult,
    secretScanResult: input.secretScanResult, prohibitedFeatureScanResult: input.prohibitedFeatureScanResult,
    publicRegressionResult: input.publicRegressionResult,
  });

  const created = await prisma.internalReleaseCandidate.create({
    data: {
      version: input.version.trim(),
      commitSha: input.commitSha.trim(),
      migrationBaseline: input.migrationBaseline?.trim() || null,
      buildResult: input.buildResult ?? "NOT_TESTED",
      testResult: input.testResult ?? "NOT_TESTED",
      accessibilityResult: input.accessibilityResult ?? "NOT_TESTED",
      auditVerificationResult: input.auditVerificationResult ?? "NOT_TESTED",
      backupRestoreResult: input.backupRestoreResult ?? "NOT_TESTED",
      secretScanResult: input.secretScanResult ?? "NOT_TESTED",
      prohibitedFeatureScanResult: input.prohibitedFeatureScanResult ?? "NOT_TESTED",
      publicRegressionResult: input.publicRegressionResult ?? "NOT_TESTED",
      rollbackPlanVersion: input.rollbackPlanVersion?.trim() || null,
      preparedById: actor.id,
      status: "DRAFT",
    },
    select: { id: true },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "RELEASE_CANDIDATE_PREPARED",
    entityType: "InternalReleaseCandidate",
    entityId: created.id,
    summary: `Release candidate ${input.version.trim()} prepared for ${input.commitSha.trim().slice(0, 12)}`,
  });
  return created.id;
}

/**
 * Review a candidate (step-up enforced at the action layer). The reviewer must
 * differ from the preparer. The provided commit SHA must match the record.
 * Marks it READY_FOR_DECISION. Reviewed evidence becomes immutable.
 */
export async function reviewReleaseCandidate(
  actor: CurrentEmployee,
  id: string,
  confirmCommitSha: string,
): Promise<void> {
  assertCan(actor, "operations.release.prepare");
  const rc = await prisma.internalReleaseCandidate.findUnique({ where: { id } });
  if (!rc) throw new ReleaseCandidateError("Release candidate not found.");
  if (rc.status !== "DRAFT" && rc.status !== "VALIDATED") {
    throw new ReleaseCandidateError("Only a draft/validated candidate can be reviewed.");
  }
  if (actor.id === rc.preparedById) {
    throw new ReleaseCandidateError("The preparer cannot review their own release candidate.");
  }
  if (confirmCommitSha.trim() !== rc.commitSha) {
    throw new ReleaseCandidateError("The confirmed commit SHA does not match the reviewed branch commit.");
  }
  await prisma.internalReleaseCandidate.update({
    where: { id },
    data: { status: "READY_FOR_DECISION", reviewedById: actor.id, reviewedAt: new Date(), recordVersion: { increment: 1 } },
  });
  await audit({
    actorEmployeeId: actor.id,
    action: "RELEASE_CANDIDATE_REVIEWED",
    entityType: "InternalReleaseCandidate",
    entityId: id,
    summary: "Release candidate reviewed (ready for decision)",
  });
}

export async function listReleaseCandidates(actor: CurrentEmployee) {
  assertCan(actor, "operations.release.view");
  return prisma.internalReleaseCandidate.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}
