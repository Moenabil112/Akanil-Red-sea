# P4-C — Data Quality and Work Queue

## Deterministic data quality (§14)

Detection is **deterministic and explainable** — no AI, no fuzzy external
services. `DataQualityFinding` records are created by
`runDataQualityScan` (`operations.data_quality.manage`), de-duplicated by a
stable `signature`. Categories:

- CASE_WITHOUT_OWNER — open case with no current owner.
- CASE_WITHOUT_CLEAR_PURPOSE — open case with no request type.
- QUALIFIED_WITHOUT_REVIEWER — qualified case with no qualification review.
- INVALID_PLATFORM_CHAIN_COMBINATION / INVALID_FORUM_CONTEXT — stored taxonomy id
  is not valid.
- COMMITMENT_WITHOUT_OWNER / COMMITMENT_WITHOUT_DUE_DATE — open commitment gaps.
- CLOSED_CASE_WITH_OPEN_COMMITMENT — closed case with an open commitment.
- DECISION_WITHOUT_RATIONALE — approved decision with no rationale.
- MEETING_WITHOUT_OUTCOME — meeting record with no next steps.
- STALE_INFORMATION_GAP — gap open > 30 days.
- ARCHIVED_ORGANIZATION_WITH_ACTIVE_CASE — archived org with an open case.
- POSSIBLE_DUPLICATE_ORGANIZATION / POSSIBLE_DUPLICATE_CONTACT — normalized-name /
  email match. **Suggestion only — never auto-merged.**

Resolution is human-controlled: OPEN → UNDER_REVIEW → RESOLVED / WAIVED /
FALSE_POSITIVE. A waiver requires a rationale. Nothing is deleted or merged
automatically; findings and resolutions are audited; no external notification is
sent. Observations must not be used for automated employee performance scoring.

## Consolidated work queue (§15)

`getWorkQueueSummary` provides authorized counts for: new cases, unassigned
cases, qualification pending, specialist reviews, open information gaps, meeting
records requiring completion, decisions awaiting approval, open/overdue
commitments, overdue access reviews, open security events, open incidents,
failed exercises, open corrective actions, open data-quality findings,
procedures awaiting acknowledgement, and authorizations nearing expiry. There is
**no** email, SMS, push, Slack or external reminder.

## Lightweight reporting (§16)

`getOperationsSummary` provides simple counts and status summaries: cases by
status / owner / request type / platform / value chain / Forum track;
unassigned; open gaps; pending decisions; open/overdue commitments; completed
pilot scenarios; open data-quality findings; open corrective actions; overdue
access reviews; latest backup and restore result; latest audit-chain result.
**No** performance scores, rankings, public/investor metrics, financial
forecasts, BI dashboards, charts, analytics, or CSV/bulk export in this release.
