-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('SYSTEM_ADMIN', 'OPERATIONS_MANAGER', 'CASE_MANAGER', 'SPECIALIST_REVIEWER', 'FORUM_COORDINATOR', 'READ_ONLY_AUDITOR');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'DISABLED', 'LOCKED');

-- CreateEnum
CREATE TYPE "OrgVerificationStatus" AS ENUM ('UNREVIEWED', 'DECLARED', 'PARTIALLY_VERIFIED', 'VERIFIED', 'CONFLICT_IDENTIFIED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AuthorityStatus" AS ENUM ('UNKNOWN', 'DECLARED', 'EVIDENCE_REQUESTED', 'VERIFIED', 'NOT_AUTHORIZED');

-- CreateEnum
CREATE TYPE "CaseSource" AS ENUM ('PUBLIC_RECEPTION_EMAIL', 'DIRECT_EMAIL', 'PHONE', 'FORUM', 'INTERNAL_REFERRAL', 'OTHER');

-- CreateEnum
CREATE TYPE "CasePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "Classification" AS ENUM ('INTERNAL', 'CONFIDENTIAL', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('NEW', 'TRIAGE', 'INFORMATION_REQUIRED', 'QUALIFIED', 'UNDER_REVIEW', 'MEETING_PREPARATION', 'DECISION_PENDING', 'FOLLOW_UP', 'ON_HOLD', 'CLOSED');

-- CreateEnum
CREATE TYPE "ClosureReason" AS ENUM ('PROGRESSED_OUTSIDE_MVP', 'NOT_PROGRESSED', 'WITHDRAWN', 'DUPLICATE', 'COMPLETED', 'OTHER');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('OWNER', 'REVIEWER', 'FORUM_COORDINATOR');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('GENERAL', 'REVIEW', 'RISK', 'LEGAL', 'FINANCIAL', 'TECHNICAL', 'MEETING', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "QualificationOutcome" AS ENUM ('PENDING', 'QUALIFIED', 'CONDITIONALLY_QUALIFIED', 'NOT_QUALIFIED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "CriterionState" AS ENUM ('NOT_REVIEWED', 'PASS', 'GAP', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "GapStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'WAIVED');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('DECLARED', 'RECEIVED_OUTSIDE_SYSTEM', 'UNDER_REVIEW', 'VERIFIED_FOR_INTERNAL_USE', 'GAP_IDENTIFIED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('INTERNAL_REVIEW', 'TECHNICAL_DISCUSSION', 'INSTITUTIONAL_DISCUSSION', 'B2B', 'B2G', 'PROJECT_REVIEW', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "MeetingPrepStatus" AS ENUM ('DRAFT', 'READY_FOR_INTERNAL_APPROVAL', 'APPROVED_FOR_COORDINATION', 'HELD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DecisionType" AS ENUM ('REQUEST_MORE_INFORMATION', 'PROGRESS_TO_SPECIALIST_REVIEW', 'PROGRESS_TO_MEETING', 'PROGRESS_TO_PROJECT_REVIEW', 'PROGRESS_TO_INSTITUTIONAL_DISCUSSION', 'PROGRESS_TO_FOLLOW_UP', 'PLACE_ON_HOLD', 'DO_NOT_PROGRESS', 'CLOSE_CASE');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'DEFERRED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "CommitmentStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "absoluteExpiry" TIMESTAMP(3) NOT NULL,
    "idleExpiry" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "workingName" TEXT NOT NULL,
    "legalName" TEXT,
    "organizationType" TEXT,
    "country" TEXT,
    "region" TEXT,
    "officialWebsite" TEXT,
    "officialEmail" TEXT,
    "officialPhone" TEXT,
    "verificationStatus" "OrgVerificationStatus" NOT NULL DEFAULT 'UNREVIEWED',
    "operationalNotes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "professionalRole" TEXT,
    "professionalEmail" TEXT,
    "professionalPhone" TEXT,
    "authorityStatus" "AuthorityStatus" NOT NULL DEFAULT 'UNKNOWN',
    "preferredLanguage" TEXT,
    "operationalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "internalReference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "source" "CaseSource" NOT NULL,
    "requestType" TEXT,
    "primaryPlatformId" TEXT,
    "primaryValueChainId" TEXT,
    "forumParticipationPathId" TEXT,
    "forumSectorTrackId" TEXT,
    "organizationId" TEXT,
    "primaryContactId" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'NEW',
    "qualificationStatus" "QualificationOutcome" NOT NULL DEFAULT 'PENDING',
    "priority" "CasePriority" NOT NULL DEFAULT 'NORMAL',
    "classification" "Classification" NOT NULL DEFAULT 'INTERNAL',
    "currentOwnerId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "closureReason" "ClosureReason",
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseAssignment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignmentType" "AssignmentType" NOT NULL,
    "assignedById" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "CaseAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalNote" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "noteType" "NoteType" NOT NULL DEFAULT 'GENERAL',
    "classification" "Classification" NOT NULL DEFAULT 'INTERNAL',
    "body" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "supersedesNoteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualificationReview" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "organizationIdentity" "CriterionState" NOT NULL DEFAULT 'NOT_REVIEWED',
    "representativeAuthority" "CriterionState" NOT NULL DEFAULT 'NOT_REVIEWED',
    "statedPurpose" "CriterionState" NOT NULL DEFAULT 'NOT_REVIEWED',
    "informationCompleteness" "CriterionState" NOT NULL DEFAULT 'NOT_REVIEWED',
    "evidenceAvailability" "CriterionState" NOT NULL DEFAULT 'NOT_REVIEWED',
    "regulatoryOrRiskConcern" "CriterionState" NOT NULL DEFAULT 'NOT_REVIEWED',
    "recommendation" TEXT,
    "finalOutcome" "QualificationOutcome" NOT NULL DEFAULT 'PENDING',
    "reviewerId" TEXT NOT NULL,
    "decisionOwnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "QualificationReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformationGap" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "GapStatus" NOT NULL DEFAULT 'OPEN',
    "internalOwnerId" TEXT,
    "dueDate" TIMESTAMP(3),
    "resolutionNote" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "InformationGap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceReference" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "evidenceType" TEXT,
    "sourceOrganization" TEXT,
    "sourceDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3),
    "verificationStatus" "EvidenceStatus" NOT NULL DEFAULT 'DECLARED',
    "classification" "Classification" NOT NULL DEFAULT 'INTERNAL',
    "locationNote" TEXT,
    "notes" TEXT,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingPreparation" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT,
    "meetingType" "MeetingType" NOT NULL DEFAULT 'INTERNAL_REVIEW',
    "proposedDate" TIMESTAMP(3),
    "participantCategories" TEXT,
    "keyQuestions" TEXT,
    "decisionsSought" TEXT,
    "expectedOutcome" TEXT,
    "status" "MeetingPrepStatus" NOT NULL DEFAULT 'DRAFT',
    "preparedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MeetingPreparation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingRecord" (
    "id" TEXT NOT NULL,
    "meetingPreparationId" TEXT,
    "caseId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3),
    "internalAttendees" TEXT,
    "externalParticipantCategories" TEXT,
    "summary" TEXT NOT NULL,
    "informationGaps" TEXT,
    "proposedNextSteps" TEXT,
    "supersedesRecordId" TEXT,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "decisionType" "DecisionType" NOT NULL,
    "status" "DecisionStatus" NOT NULL DEFAULT 'PROPOSED',
    "recommendation" TEXT,
    "rationale" TEXT,
    "proposedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "proposedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "supersedesDecisionId" TEXT,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commitment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "internalOwnerId" TEXT,
    "relatedOrganizationId" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "CommitmentStatus" NOT NULL DEFAULT 'OPEN',
    "completionNote" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Commitment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorEmployeeId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "caseId" TEXT,
    "summary" TEXT NOT NULL,
    "changedFields" JSONB,
    "correlationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_role_idx" ON "Employee"("role");

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_employeeId_idx" ON "Session"("employeeId");

-- CreateIndex
CREATE INDEX "Organization_verificationStatus_idx" ON "Organization"("verificationStatus");

-- CreateIndex
CREATE INDEX "Organization_workingName_idx" ON "Organization"("workingName");

-- CreateIndex
CREATE INDEX "Contact_organizationId_idx" ON "Contact"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Case_internalReference_key" ON "Case"("internalReference");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- CreateIndex
CREATE INDEX "Case_priority_idx" ON "Case"("priority");

-- CreateIndex
CREATE INDEX "Case_classification_idx" ON "Case"("classification");

-- CreateIndex
CREATE INDEX "Case_currentOwnerId_idx" ON "Case"("currentOwnerId");

-- CreateIndex
CREATE INDEX "Case_organizationId_idx" ON "Case"("organizationId");

-- CreateIndex
CREATE INDEX "CaseAssignment_caseId_idx" ON "CaseAssignment"("caseId");

-- CreateIndex
CREATE INDEX "CaseAssignment_employeeId_idx" ON "CaseAssignment"("employeeId");

-- CreateIndex
CREATE INDEX "InternalNote_caseId_idx" ON "InternalNote"("caseId");

-- CreateIndex
CREATE INDEX "QualificationReview_caseId_idx" ON "QualificationReview"("caseId");

-- CreateIndex
CREATE INDEX "InformationGap_caseId_idx" ON "InformationGap"("caseId");

-- CreateIndex
CREATE INDEX "InformationGap_status_idx" ON "InformationGap"("status");

-- CreateIndex
CREATE INDEX "EvidenceReference_caseId_idx" ON "EvidenceReference"("caseId");

-- CreateIndex
CREATE INDEX "MeetingPreparation_caseId_idx" ON "MeetingPreparation"("caseId");

-- CreateIndex
CREATE INDEX "MeetingRecord_caseId_idx" ON "MeetingRecord"("caseId");

-- CreateIndex
CREATE INDEX "Decision_caseId_idx" ON "Decision"("caseId");

-- CreateIndex
CREATE INDEX "Decision_status_idx" ON "Decision"("status");

-- CreateIndex
CREATE INDEX "Commitment_caseId_idx" ON "Commitment"("caseId");

-- CreateIndex
CREATE INDEX "Commitment_status_idx" ON "Commitment"("status");

-- CreateIndex
CREATE INDEX "AuditEvent_actorEmployeeId_idx" ON "AuditEvent"("actorEmployeeId");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_idx" ON "AuditEvent"("entityType");

-- CreateIndex
CREATE INDEX "AuditEvent_caseId_idx" ON "AuditEvent"("caseId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_primaryContactId_fkey" FOREIGN KEY ("primaryContactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_currentOwnerId_fkey" FOREIGN KEY ("currentOwnerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAssignment" ADD CONSTRAINT "CaseAssignment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAssignment" ADD CONSTRAINT "CaseAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAssignment" ADD CONSTRAINT "CaseAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualificationReview" ADD CONSTRAINT "QualificationReview_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationGap" ADD CONSTRAINT "InformationGap_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceReference" ADD CONSTRAINT "EvidenceReference_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingPreparation" ADD CONSTRAINT "MeetingPreparation_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingRecord" ADD CONSTRAINT "MeetingRecord_meetingPreparationId_fkey" FOREIGN KEY ("meetingPreparationId") REFERENCES "MeetingPreparation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingRecord" ADD CONSTRAINT "MeetingRecord_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commitment" ADD CONSTRAINT "Commitment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorEmployeeId_fkey" FOREIGN KEY ("actorEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
