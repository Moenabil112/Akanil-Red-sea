/**
 * P3 Forum programme, qualification and stakeholder-engagement model
 * (ADR-019). Typed enums and content shapes for the Morocco–Sudan
 * Economic Forum: participation paths, sector tracks, the five-day
 * proposed programme, the meeting-preparation model, the expected-outcome
 * model and the Forum-aware qualification context.
 *
 * Structural relationships (path/track ids and the track↔platform,
 * track↔chain and path↔track mappings) live in `lib/forum.ts`; wording
 * lives in the locale records (`content/{ar,fr,en}/forum.ts`), so the two
 * cannot drift between languages (parity is test-enforced).
 *
 * The Forum is a proposed qualification and engagement programme —
 * participation is subject to review and invitation. No event date,
 * venue, speaker, participant, sponsor, ministry or visit is confirmed.
 */

import type { RequestTypeId } from "./ecosystem-types";

/* ---------------- Identity (ADR-019) ---------------- */

export type ForumParticipationPathId =
  | "moroccan-institutions"
  | "moroccan-companies-exporters"
  | "sudanese-institutions-decision-makers"
  | "sudanese-producers-project-sponsors"
  | "finance-investment-development"
  | "technology-logistics-knowledge";

export type ForumSectorTrackId =
  | "agriculture-food-industrialization"
  | "feed-livestock-animal-value"
  | "water-energy-agritech"
  | "mining-industrial-value"
  | "ports-logistics-finance-technology";

export type ForumProgrammeDayId =
  | "institutional-framework"
  | "sector-workshops"
  | "b2b-b2g-meetings"
  | "industrial-institutional-visits"
  | "decisions-follow-up";

/**
 * Public expected-outcome categories (P3 §11). These are *possible*
 * next-step categories a specialist review may reach — never decisions
 * produced automatically by the website. No commitment ownership,
 * deadline or workflow state is implied (those belong to P4).
 */
export type ForumOutcomeId =
  | "additional-information-required"
  | "specialist-review-recommended"
  | "technical-meeting-recommended"
  | "institutional-discussion-recommended"
  | "project-review-recommended"
  | "supply-offtake-discussion-recommended"
  | "industrial-cooperation-review-recommended"
  | "follow-up-after-forum"
  | "no-progression-at-this-stage";

/* ---------------- Content shapes ---------------- */

export interface ForumParticipationPath {
  id: ForumParticipationPathId;
  title: string;
  summary: string;
  whoItIncludes: string[];
  potentialObjectives: string[];
  preparationRequirements: string[];
  expectedOutcomes: ForumOutcomeId[];
  requestType: RequestTypeId;
  /** Mandatory non-guarantee notice (e.g. the finance path). */
  note?: string;
}

export interface ForumSectorTrack {
  id: ForumSectorTrackId;
  title: string;
  summary: string;
  potentialDiscussions: string[];
  /** Optional caveat (e.g. mining: IBRIZ/GAAS never active financing). */
  note?: string;
}

export interface ForumProgrammeDay {
  id: ForumProgrammeDayId;
  dayLabel: string;
  title: string;
  purpose: string[];
  formats: string[];
  /** Optional restraint notice (e.g. Day 4: no confirmed visits). */
  note?: string;
}

export interface ForumMeetingCriterion {
  title: string;
  text: string;
}

export interface ForumOutcomeItem {
  id: ForumOutcomeId;
  label: string;
}

/** Reusable Forum-qualification context (P3 §13), resolved from a query. */
export interface ForumQualificationContext {
  participationPath?: ForumParticipationPathId;
  sectorTrack?: ForumSectorTrackId;
}

export interface ForumContent {
  /* ---- Shared identity / positioning ---- */
  programmeName: string;
  publicStatus: string;
  positioningLead: string;
  gatewayRelationTitle: string;
  gatewayRelation: string;
  qualificationFirstTitle: string;
  qualificationFirst: string;

  /* ---- Contextual Forum navigation ---- */
  navLabel: string;
  nav: { href: string; label: string }[];

  /* ---- Hub sections ---- */
  hub: {
    eyebrow: string;
    title: string;
    lead: string;
    beforeDuringAfterTitle: string;
    phases: { title: string; items: string[] }[];
    participationOverviewTitle: string;
    participationOverviewLead: string;
    tracksOverviewTitle: string;
    tracksOverviewLead: string;
    programmeSummaryTitle: string;
    programmeSummaryLead: string;
    meetingLogicTitle: string;
    meetingLogicLead: string;
    outcomeTitle: string;
    outcomeLead: string;
    qualificationNoticeTitle: string;
    qualificationNotice: string[];
    ctaLabel: string;
    ctaExplanation: string;
  };

  /* ---- Participation ---- */
  participation: {
    eyebrow: string;
    title: string;
    lead: string;
    whoLabel: string;
    objectivesLabel: string;
    preparationLabel: string;
    tracksLabel: string;
    platformsLabel: string;
    chainsLabel: string;
    outcomesLabel: string;
    ctaLabel: string;
    paths: ForumParticipationPath[];
  };

  /* ---- Sector tracks ---- */
  tracks: {
    eyebrow: string;
    title: string;
    lead: string;
    discussionsLabel: string;
    platformsLabel: string;
    chainsLabel: string;
    ctaLabel: string;
    items: ForumSectorTrack[];
  };

  /* ---- Programme ---- */
  programme: {
    eyebrow: string;
    title: string;
    lead: string;
    statusNote: string;
    purposeLabel: string;
    formatsLabel: string;
    days: ForumProgrammeDay[];
  };

  /* ---- Meeting preparation ---- */
  meeting: {
    eyebrow: string;
    title: string;
    lead: string;
    criteria: ForumMeetingCriterion[];
    checklistTitle: string;
    checklist: string[];
    note: string;
  };

  /* ---- Expected outcomes ---- */
  outcomes: {
    eyebrow: string;
    title: string;
    lead: string;
    items: ForumOutcomeItem[];
    note: string;
  };

  /* ---- Prepare ---- */
  prepare: {
    eyebrow: string;
    title: string;
    lead: string;
    stepsTitle: string;
    steps: { title: string; text: string }[];
    evidenceTitle: string;
    evidenceLead: string;
    evidenceItems: string[];
    privacyTitle: string;
    privacy: string[];
    ctaLabel: string;
  };

  /* ---- Forum success metrics (categories only) ---- */
  metrics: {
    eyebrow: string;
    title: string;
    lead: string;
    items: string[];
    note: string;
  };

  /* ---- Cross-links from platform and value-chain profiles (P3 §16) ---- */
  crossLinks: {
    platformTitle: string;
    platformLead: string;
    chainTitle: string;
    chainLead: string;
    tracksLabel: string;
    stakeholdersLabel: string;
    ctaLabel: string;
    exploreLabel: string;
  };

  /* ---- Per-route metadata ---- */
  pages: {
    hub: { title: string; description: string };
    programme: { title: string; description: string };
    participation: { title: string; description: string };
    prepare: { title: string; description: string };
  };
}
