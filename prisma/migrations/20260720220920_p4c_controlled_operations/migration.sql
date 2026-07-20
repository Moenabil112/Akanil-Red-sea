-- CreateEnum
CREATE TYPE "LimitedOpsStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'SUPERSEDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LimitedOpsDecision" AS ENUM ('GO_LIMITED_INTERNAL_OPERATIONS', 'CONDITIONAL_GO', 'EXTEND_CONTROLLED_PILOT', 'SUSPEND_PILOT', 'NO_GO');

-- CreateEnum
CREATE TYPE "PilotRunStatus" AS ENUM ('PLANNED', 'READY', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PilotRunOutcome" AS ENUM ('CONTINUE_PILOT', 'CONTINUE_WITH_CONDITIONS', 'READY_FOR_LIMITED_INTERNAL_OPERATIONS', 'EXTEND_PILOT', 'SUSPEND', 'NOT_READY');

-- CreateEnum
CREATE TYPE "PilotMemberStatus" AS ENUM ('PROPOSED', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'REMOVED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PilotCaseScenario" AS ENUM ('MOROCCAN_COMPANY_REQUEST', 'SUDANESE_PROJECT_OR_OPPORTUNITY', 'FORUM_QUALIFICATION', 'VALUE_CHAIN_REQUEST', 'SPECIALIST_REVIEW_REQUIRED', 'NO_PROGRESSION', 'MEETING_DECISION_AND_COMMITMENT', 'OTHER_CONTROLLED_SCENARIO');

-- CreateEnum
CREATE TYPE "PilotCaseStatus" AS ENUM ('SELECTED', 'IN_PROGRESS', 'COMPLETED', 'REMOVED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ProcedureStatus" AS ENUM ('DRAFT', 'APPROVED', 'EFFECTIVE', 'SUPERSEDED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "AcknowledgementType" AS ENUM ('READ_AND_UNDERSTOOD', 'BRIEFED', 'PRACTICAL_EXERCISE_COMPLETED');

-- CreateEnum
CREATE TYPE "DataQualityCategory" AS ENUM ('POSSIBLE_DUPLICATE_ORGANIZATION', 'POSSIBLE_DUPLICATE_CONTACT', 'CASE_WITHOUT_OWNER', 'CASE_WITHOUT_CLEAR_PURPOSE', 'INVALID_PLATFORM_CHAIN_COMBINATION', 'INVALID_FORUM_CONTEXT', 'QUALIFIED_WITHOUT_REVIEWER', 'MEETING_WITHOUT_OUTCOME', 'DECISION_WITHOUT_RATIONALE', 'COMMITMENT_WITHOUT_OWNER', 'COMMITMENT_WITHOUT_DUE_DATE', 'CLOSED_CASE_WITH_OPEN_COMMITMENT', 'STALE_INFORMATION_GAP', 'ARCHIVED_ORGANIZATION_WITH_ACTIVE_CASE', 'OTHER_DATA_QUALITY_ISSUE');

-- CreateEnum
CREATE TYPE "DataQualityStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'WAIVED', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "ObservationCategory" AS ENUM ('PROCESS_FRICTION', 'USER_EXPERIENCE', 'DATA_QUALITY', 'ACCESS_CONTROL', 'WORKFLOW_GAP', 'TRAINING_GAP', 'DOCUMENTATION_GAP', 'PERFORMANCE', 'SECURITY', 'OTHER');

-- CreateEnum
CREATE TYPE "ObservationStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'CORRECTIVE_ACTION_OPENED', 'RESOLVED', 'ACCEPTED_OBSERVATION');

-- CreateEnum
CREATE TYPE "ReleaseCandidateStatus" AS ENUM ('DRAFT', 'VALIDATED', 'READY_FOR_DECISION', 'REJECTED', 'SUPERSEDED');

-- CreateTable
CREATE TABLE "LimitedOperationsAuthorization" (
    "id" TEXT NOT NULL,
    "status" "LimitedOpsStatus" NOT NULL DEFAULT 'DRAFT',
    "decision" "LimitedOpsDecision",
    "title" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "evidenceSummary" TEXT,
    "conditions" TEXT,
    "approvedEmployeeLimit" INTEGER NOT NULL,
    "approvedCaseLimit" INTEGER NOT NULL,
    "allowedDataCategories" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "proposedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "approvedById" TEXT,
    "proposedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "supersedesAuthorizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LimitedOperationsAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalPilotRun" (
    "id" TEXT NOT NULL,
    "internalReference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "status" "PilotRunStatus" NOT NULL DEFAULT 'PLANNED',
    "plannedStart" TIMESTAMP(3),
    "plannedEnd" TIMESTAMP(3),
    "actualStart" TIMESTAMP(3),
    "actualEnd" TIMESTAMP(3),
    "maximumEmployees" INTEGER NOT NULL,
    "maximumCases" INTEGER NOT NULL,
    "allowedDataCategories" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "approvedById" TEXT,
    "readinessGateId" TEXT,
    "finalOutcome" "PilotRunOutcome",
    "observationsSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OperationalPilotRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalPilotMember" (
    "id" TEXT NOT NULL,
    "pilotRunId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "operationalRole" TEXT NOT NULL,
    "status" "PilotMemberStatus" NOT NULL DEFAULT 'PROPOSED',
    "accessReviewId" TEXT,
    "pilotAccessId" TEXT,
    "addedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationalPilotMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalPilotCase" (
    "id" TEXT NOT NULL,
    "pilotRunId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "scenarioType" "PilotCaseScenario" NOT NULL,
    "dataCategory" "PilotDataCategory" NOT NULL DEFAULT 'SYNTHETIC',
    "expectedPath" TEXT,
    "actualPath" TEXT,
    "status" "PilotCaseStatus" NOT NULL DEFAULT 'SELECTED',
    "includedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "completedAt" TIMESTAMP(3),
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationalPilotCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatingProcedure" (
    "id" TEXT NOT NULL,
    "procedureKey" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "ownerId" TEXT,
    "status" "ProcedureStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedById" TEXT,
    "effectiveFrom" TIMESTAMP(3),
    "supersededAt" TIMESTAMP(3),
    "requiresAcknowledgement" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatingProcedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureAcknowledgement" (
    "id" TEXT NOT NULL,
    "procedureKey" TEXT NOT NULL,
    "procedureVersion" INTEGER NOT NULL,
    "employeeId" TEXT NOT NULL,
    "acknowledgedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgementType" "AcknowledgementType" NOT NULL DEFAULT 'READ_AND_UNDERSTOOD',
    "recordedById" TEXT NOT NULL,

    CONSTRAINT "ProcedureAcknowledgement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataQualityFinding" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "caseId" TEXT,
    "category" "DataQualityCategory" NOT NULL,
    "severity" "SecuritySeverity" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "status" "DataQualityStatus" NOT NULL DEFAULT 'OPEN',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detectedBy" TEXT NOT NULL DEFAULT 'system',
    "assignedToId" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "waivedById" TEXT,
    "waiverRationale" TEXT,
    "signature" TEXT NOT NULL,

    CONSTRAINT "DataQualityFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalObservation" (
    "id" TEXT NOT NULL,
    "pilotRunId" TEXT,
    "caseId" TEXT,
    "category" "ObservationCategory" NOT NULL,
    "severity" "SecuritySeverity" NOT NULL DEFAULT 'LOW',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "observedById" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ObservationStatus" NOT NULL DEFAULT 'OPEN',
    "linkedCorrectiveActionId" TEXT,
    "resolutionSummary" TEXT,
    "reviewedById" TEXT,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "OperationalObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalReleaseCandidate" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "migrationBaseline" TEXT,
    "buildResult" TEXT NOT NULL DEFAULT 'NOT_TESTED',
    "testResult" TEXT NOT NULL DEFAULT 'NOT_TESTED',
    "accessibilityResult" TEXT NOT NULL DEFAULT 'NOT_TESTED',
    "auditVerificationResult" TEXT NOT NULL DEFAULT 'NOT_TESTED',
    "backupRestoreResult" TEXT NOT NULL DEFAULT 'NOT_TESTED',
    "secretScanResult" TEXT NOT NULL DEFAULT 'NOT_TESTED',
    "prohibitedFeatureScanResult" TEXT NOT NULL DEFAULT 'NOT_TESTED',
    "publicRegressionResult" TEXT NOT NULL DEFAULT 'NOT_TESTED',
    "rollbackPlanVersion" TEXT,
    "status" "ReleaseCandidateStatus" NOT NULL DEFAULT 'DRAFT',
    "preparedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InternalReleaseCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LimitedOperationsAuthorization_status_idx" ON "LimitedOperationsAuthorization"("status");

-- CreateIndex
CREATE UNIQUE INDEX "OperationalPilotRun_internalReference_key" ON "OperationalPilotRun"("internalReference");

-- CreateIndex
CREATE INDEX "OperationalPilotRun_status_idx" ON "OperationalPilotRun"("status");

-- CreateIndex
CREATE INDEX "OperationalPilotMember_pilotRunId_idx" ON "OperationalPilotMember"("pilotRunId");

-- CreateIndex
CREATE INDEX "OperationalPilotMember_employeeId_idx" ON "OperationalPilotMember"("employeeId");

-- CreateIndex
CREATE INDEX "OperationalPilotCase_pilotRunId_idx" ON "OperationalPilotCase"("pilotRunId");

-- CreateIndex
CREATE INDEX "OperationalPilotCase_caseId_idx" ON "OperationalPilotCase"("caseId");

-- CreateIndex
CREATE INDEX "OperatingProcedure_procedureKey_idx" ON "OperatingProcedure"("procedureKey");

-- CreateIndex
CREATE INDEX "OperatingProcedure_status_idx" ON "OperatingProcedure"("status");

-- CreateIndex
CREATE UNIQUE INDEX "OperatingProcedure_procedureKey_version_key" ON "OperatingProcedure"("procedureKey", "version");

-- CreateIndex
CREATE INDEX "ProcedureAcknowledgement_procedureKey_procedureVersion_idx" ON "ProcedureAcknowledgement"("procedureKey", "procedureVersion");

-- CreateIndex
CREATE INDEX "ProcedureAcknowledgement_employeeId_idx" ON "ProcedureAcknowledgement"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "DataQualityFinding_signature_key" ON "DataQualityFinding"("signature");

-- CreateIndex
CREATE INDEX "DataQualityFinding_status_idx" ON "DataQualityFinding"("status");

-- CreateIndex
CREATE INDEX "DataQualityFinding_category_idx" ON "DataQualityFinding"("category");

-- CreateIndex
CREATE INDEX "DataQualityFinding_caseId_idx" ON "DataQualityFinding"("caseId");

-- CreateIndex
CREATE INDEX "OperationalObservation_status_idx" ON "OperationalObservation"("status");

-- CreateIndex
CREATE INDEX "OperationalObservation_pilotRunId_idx" ON "OperationalObservation"("pilotRunId");

-- CreateIndex
CREATE INDEX "InternalReleaseCandidate_status_idx" ON "InternalReleaseCandidate"("status");

-- AddForeignKey
ALTER TABLE "OperationalPilotMember" ADD CONSTRAINT "OperationalPilotMember_pilotRunId_fkey" FOREIGN KEY ("pilotRunId") REFERENCES "OperationalPilotRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationalPilotCase" ADD CONSTRAINT "OperationalPilotCase_pilotRunId_fkey" FOREIGN KEY ("pilotRunId") REFERENCES "OperationalPilotRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationalObservation" ADD CONSTRAINT "OperationalObservation_pilotRunId_fkey" FOREIGN KEY ("pilotRunId") REFERENCES "OperationalPilotRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

