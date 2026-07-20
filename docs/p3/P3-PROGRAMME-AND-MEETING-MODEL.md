# P3 — Programme and Meeting Model

The proposed five-day programme, the meeting-preparation model and the
expected-outcome model. All proposed and subject to final confirmation; nothing
is scheduled, confirmed or tracked by the website.

## Five-day proposed programme

| Day | Id | Focus |
| --- | --- | --- |
| Day 1 | `institutional-framework` | Institutional framework and qualification |
| Day 2 | `sector-workshops` | Sector workshops (problems, opportunities, evidence gaps) |
| Day 3 | `b2b-b2g-meetings` | Prepared B2B and B2G meetings |
| Day 4 | `industrial-institutional-visits` | Categories of industrial and institutional visits |
| Day 5 | `decisions-follow-up` | Decisions and a follow-up plan |

Each day carries a purpose list and possible formats. The programme is rendered
as a semantic ordered list (`ProgrammeTimeline`) that remains readable with no
JavaScript or styling — verified to render all five days with JS disabled.

Restraint notices: Day 3 states the website does not schedule or confirm meetings
and there is no appointment booking; Day 4 shows only categories of potential
visits and publishes no facility or institution as a confirmed visit; Day 5
presents outcome categories only and implements no decision records or commitment
tracking.

## Meeting-preparation model

A Forum meeting is proposed only when it has: (1) a defined purpose, (2) qualified
participants, (3) a linked project/platform/value-chain/request, (4) minimum
preparation, (5) the questions or decisions sought, (6) a realistic expected
outcome, all under (7) human review. A visitor preparation checklist mirrors
these conditions. The reusable `MeetingPreparation` component states plainly that
the website neither schedules nor confirms meetings — a specialist decides.

## Expected-outcome model (9 categories)

`additional-information-required` · `specialist-review-recommended` ·
`technical-meeting-recommended` · `institutional-discussion-recommended` ·
`project-review-recommended` · `supply-offtake-discussion-recommended` ·
`industrial-cooperation-review-recommended` · `follow-up-after-forum` ·
`no-progression-at-this-stage`.

These are *possible* next-step categories a specialist review may reach. The
public interface states they are not decisions produced automatically by the
website, only authorized humans determine the outcome, and participation does not
guarantee a positive one. No commitment ownership, deadline or workflow state is
implemented — those belong to P4.

## Forum metrics (categories only)

Qualified organization files · documented needs and capabilities · prepared
meetings with a defined purpose · projects progressed to specialist review ·
information gaps identified · decisions or next steps recorded · commitments
requiring follow-up · post-Forum progress. No targets or achieved numbers are
published and there is no metrics dashboard.
