-- CreateEnum
CREATE TYPE "EmployeeLifecycleStage" AS ENUM ('PROVISIONING', 'ACTIVE', 'SUSPENDED', 'OFFBOARDING', 'DISABLED');

-- CreateEnum
CREATE TYPE "PilotDataCategory" AS ENUM ('SYNTHETIC', 'DE_IDENTIFIED');

-- CreateEnum
CREATE TYPE "PilotAccessStatus" AS ENUM ('REQUESTED', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AccessChangeType" AS ENUM ('CREATE_EMPLOYEE_ACCESS', 'CHANGE_ROLE', 'ENABLE_ACCOUNT', 'DISABLE_ACCOUNT', 'GRANT_PILOT_ACCESS', 'SUSPEND_PILOT_ACCESS', 'REVOKE_PILOT_ACCESS', 'RESET_PASSWORD', 'REVOKE_SESSIONS');

-- CreateEnum
CREATE TYPE "AccessChangeStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'APPLIED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AccessReviewOutcome" AS ENUM ('RETAIN', 'MODIFY', 'SUSPEND', 'REVOKE', 'FURTHER_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "SecurityEventCategory" AS ENUM ('LOGIN_FAILURE_THRESHOLD', 'ACCOUNT_LOCKED', 'REAUTHENTICATION_FAILURE', 'UNAUTHORIZED_ROUTE_ATTEMPT', 'OBJECT_ACCESS_DENIED', 'INVALID_STATE_TRANSITION', 'CONCURRENCY_CONFLICT', 'SESSION_REVOKED', 'PILOT_ACCESS_SUSPENDED', 'AUDIT_INTEGRITY_FAILURE', 'BACKUP_VALIDATION_FAILURE', 'SECRET_SCAN_FAILURE', 'OTHER_SECURITY_EVENT');

-- CreateEnum
CREATE TYPE "SecuritySeverity" AS ENUM ('INFORMATIONAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SecurityEventStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'UNDER_REVIEW', 'RESOLVED', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'TRIAGE', 'CONTAINMENT', 'INVESTIGATION', 'RECOVERY', 'CLOSED');

-- CreateEnum
CREATE TYPE "IncidentCategory" AS ENUM ('AUTHENTICATION', 'AUTHORIZATION', 'DATA_EXPOSURE', 'AUDIT_INTEGRITY', 'DATABASE', 'BACKUP_RESTORE', 'AVAILABILITY', 'SECRET_HANDLING', 'OPERATIONAL_ERROR', 'OTHER');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('EMPLOYEE_ONBOARDING', 'EMPLOYEE_OFFBOARDING', 'ROLE_CHANGE', 'MANUAL_CASE_CREATION', 'CASE_ASSIGNMENT', 'QUALIFICATION_REVIEW', 'INFORMATION_GAP', 'MEETING_PREPARATION', 'DECISION_APPROVAL', 'COMMITMENT_FOLLOW_UP', 'CASE_CLOSURE_AND_REOPEN', 'SESSION_REVOCATION', 'ACCOUNT_LOCKOUT', 'OBJECT_ACCESS_DENIAL', 'CONCURRENCY_CONFLICT', 'AUDIT_CHAIN_VERIFICATION', 'BACKUP_AND_RESTORE', 'INCIDENT_RESPONSE', 'PUBLIC_INTERNAL_BOUNDARY', 'INTERNAL_FEATURE_SHUTDOWN');

-- CreateEnum
CREATE TYPE "ExerciseStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'PASSED', 'PASSED_WITH_OBSERVATIONS', 'FAILED', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CorrectiveActionSource" AS ENUM ('PILOT_EXERCISE', 'SECURITY_INCIDENT', 'ACCESS_REVIEW', 'AUDIT_INTEGRITY', 'BACKUP_TEST', 'SECURITY_REVIEW', 'OPERATIONAL_OBSERVATION');

-- CreateEnum
CREATE TYPE "CorrectiveActionStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'READY_FOR_VERIFICATION', 'VERIFIED', 'ACCEPTED_RISK', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReadinessGateState" AS ENUM ('NOT_READY', 'READY_FOR_LIMITED_INTERNAL_PILOT', 'LIMITED_INTERNAL_PILOT_ACTIVE', 'PILOT_SUSPENDED', 'PILOT_COMPLETED_PENDING_REVIEW');

-- CreateEnum
CREATE TYPE "ReadinessAreaStatus" AS ENUM ('NOT_TESTED', 'PASS', 'PASS_WITH_OBSERVATIONS', 'FAIL', 'BLOCKED', 'EXPIRED');

-- AlterTable
ALTER TABLE "AuditEvent" ADD COLUMN     "eventHash" TEXT,
ADD COLUMN     "hashVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "previousEventHash" TEXT,
ADD COLUMN     "sequenceNumber" INTEGER;

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "pilotDataCategory" "PilotDataCategory" NOT NULL DEFAULT 'SYNTHETIC';

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "accessPurpose" TEXT,
ADD COLUMN     "accessReviewDueAt" TIMESTAMP(3),
ADD COLUMN     "accessStartsAt" TIMESTAMP(3),
ADD COLUMN     "approvingManagerId" TEXT,
ADD COLUMN     "casesReassignedConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "lastAccessReviewAt" TIMESTAMP(3),
ADD COLUMN     "lifecycleStage" "EmployeeLifecycleStage" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "offboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "offboardingReason" TEXT,
ADD COLUMN     "offboardingStartedAt" TIMESTAMP(3),
ADD COLUMN     "roleJustification" TEXT,
ADD COLUMN     "sessionsRevokedConfirmedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "deviceLabel" TEXT,
ADD COLUMN     "lastActivityAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stepUpVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PilotAccess" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "status" "PilotAccessStatus" NOT NULL DEFAULT 'REQUESTED',
    "approvedRole" "EmployeeRole" NOT NULL,
    "requestedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "justification" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PilotAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessChangeRequest" (
    "id" TEXT NOT NULL,
    "targetEmployeeId" TEXT NOT NULL,
    "changeType" "AccessChangeType" NOT NULL,
    "currentRole" "EmployeeRole",
    "proposedRole" "EmployeeRole",
    "requestedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "justification" TEXT NOT NULL,
    "status" "AccessChangeStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AccessChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessReview" (
    "id" TEXT NOT NULL,
    "reviewPeriodStart" TIMESTAMP(3) NOT NULL,
    "reviewPeriodEnd" TIMESTAMP(3) NOT NULL,
    "employeeId" TEXT NOT NULL,
    "currentRole" "EmployeeRole" NOT NULL,
    "pilotAccessStatus" "PilotAccessStatus",
    "activeSessionCount" INTEGER NOT NULL DEFAULT 0,
    "openCaseCount" INTEGER NOT NULL DEFAULT 0,
    "openCommitmentCount" INTEGER NOT NULL DEFAULT 0,
    "reviewerId" TEXT,
    "outcome" "AccessReviewOutcome",
    "rationale" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "nextReviewDueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL,
    "category" "SecurityEventCategory" NOT NULL,
    "severity" "SecuritySeverity" NOT NULL DEFAULT 'LOW',
    "status" "SecurityEventStatus" NOT NULL DEFAULT 'OPEN',
    "actorEmployeeId" TEXT,
    "subjectType" TEXT,
    "subjectId" TEXT,
    "summary" TEXT NOT NULL,
    "detail" JSONB,
    "correlationId" TEXT,
    "acknowledgedById" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityIncident" (
    "id" TEXT NOT NULL,
    "internalReference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "IncidentCategory" NOT NULL,
    "severity" "SecuritySeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detectedById" TEXT,
    "summary" TEXT NOT NULL,
    "affectedAreas" TEXT,
    "containmentActions" TEXT,
    "evidenceNotes" TEXT,
    "recoveryActions" TEXT,
    "lessonsLearned" TEXT,
    "ownerId" TEXT,
    "approvedClosureById" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SecurityIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PilotExercise" (
    "id" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ExerciseStatus" NOT NULL DEFAULT 'PLANNED',
    "plannedById" TEXT,
    "executedById" TEXT,
    "observedById" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expectedResult" TEXT NOT NULL,
    "actualResult" TEXT,
    "evidenceSummary" TEXT,
    "deviation" TEXT,
    "correctiveActionId" TEXT,
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PilotExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectiveAction" (
    "id" TEXT NOT NULL,
    "sourceType" "CorrectiveActionSource" NOT NULL,
    "sourceId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "SecuritySeverity" NOT NULL DEFAULT 'MEDIUM',
    "ownerId" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "CorrectiveActionStatus" NOT NULL DEFAULT 'OPEN',
    "resolutionEvidence" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "acceptedRiskById" TEXT,
    "acceptedRiskRationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectiveAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadinessGate" (
    "id" TEXT NOT NULL,
    "state" "ReadinessGateState" NOT NULL DEFAULT 'NOT_READY',
    "rationale" TEXT NOT NULL,
    "decidedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadinessGate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadinessSignal" (
    "id" TEXT NOT NULL,
    "status" "ReadinessAreaStatus" NOT NULL DEFAULT 'NOT_TESTED',
    "detail" TEXT,
    "evidenceRef" TEXT,
    "recordedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ReadinessSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PilotAccess_employeeId_idx" ON "PilotAccess"("employeeId");

-- CreateIndex
CREATE INDEX "PilotAccess_status_idx" ON "PilotAccess"("status");

-- CreateIndex
CREATE INDEX "AccessChangeRequest_targetEmployeeId_idx" ON "AccessChangeRequest"("targetEmployeeId");

-- CreateIndex
CREATE INDEX "AccessChangeRequest_status_idx" ON "AccessChangeRequest"("status");

-- CreateIndex
CREATE INDEX "AccessChangeRequest_changeType_idx" ON "AccessChangeRequest"("changeType");

-- CreateIndex
CREATE INDEX "AccessReview_employeeId_idx" ON "AccessReview"("employeeId");

-- CreateIndex
CREATE INDEX "AccessReview_reviewerId_idx" ON "AccessReview"("reviewerId");

-- CreateIndex
CREATE INDEX "SecurityEvent_category_idx" ON "SecurityEvent"("category");

-- CreateIndex
CREATE INDEX "SecurityEvent_severity_idx" ON "SecurityEvent"("severity");

-- CreateIndex
CREATE INDEX "SecurityEvent_status_idx" ON "SecurityEvent"("status");

-- CreateIndex
CREATE INDEX "SecurityEvent_createdAt_idx" ON "SecurityEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SecurityIncident_internalReference_key" ON "SecurityIncident"("internalReference");

-- CreateIndex
CREATE INDEX "SecurityIncident_status_idx" ON "SecurityIncident"("status");

-- CreateIndex
CREATE INDEX "SecurityIncident_severity_idx" ON "SecurityIncident"("severity");

-- CreateIndex
CREATE INDEX "SecurityIncident_category_idx" ON "SecurityIncident"("category");

-- CreateIndex
CREATE INDEX "PilotExercise_type_idx" ON "PilotExercise"("type");

-- CreateIndex
CREATE INDEX "PilotExercise_status_idx" ON "PilotExercise"("status");

-- CreateIndex
CREATE INDEX "CorrectiveAction_status_idx" ON "CorrectiveAction"("status");

-- CreateIndex
CREATE INDEX "CorrectiveAction_sourceType_idx" ON "CorrectiveAction"("sourceType");

-- CreateIndex
CREATE INDEX "ReadinessGate_createdAt_idx" ON "ReadinessGate"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuditEvent_sequenceNumber_key" ON "AuditEvent"("sequenceNumber");

-- CreateIndex
CREATE INDEX "AuditEvent_sequenceNumber_idx" ON "AuditEvent"("sequenceNumber");

-- CreateIndex
CREATE INDEX "Employee_lifecycleStage_idx" ON "Employee"("lifecycleStage");

-- AddForeignKey
ALTER TABLE "PilotAccess" ADD CONSTRAINT "PilotAccess_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilotAccess" ADD CONSTRAINT "PilotAccess_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilotAccess" ADD CONSTRAINT "PilotAccess_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessChangeRequest" ADD CONSTRAINT "AccessChangeRequest_targetEmployeeId_fkey" FOREIGN KEY ("targetEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessChangeRequest" ADD CONSTRAINT "AccessChangeRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessChangeRequest" ADD CONSTRAINT "AccessChangeRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessReview" ADD CONSTRAINT "AccessReview_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessReview" ADD CONSTRAINT "AccessReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityEvent" ADD CONSTRAINT "SecurityEvent_actorEmployeeId_fkey" FOREIGN KEY ("actorEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityIncident" ADD CONSTRAINT "SecurityIncident_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectiveAction" ADD CONSTRAINT "CorrectiveAction_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

