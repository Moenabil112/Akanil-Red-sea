# ADR-009 — Digital Reception Lite transport and privacy model

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

The Gateway needs a real but deliberately limited reception experience (Phase 3). No backend, database, email API, CRM, analytics or storage service is authorized.

## Decision

**Transport.** The UI talks only to a `ReceptionTransport` interface. The default (and only) implementation prepares a localized, fully URL-encoded `mailto:` handoff addressed to `akanil.consulting@proton.me`. An approved secure backend can later implement the same interface without redesigning the flow. `tel:+212663177864` remains a separate direct channel, server-rendered so it works without JavaScript.

**Flow and honesty.** Explicit states: entry (with audience preselection) → structured form → validation → review (structured summary + "what happens next") → email client opened. The interface never claims submission: after activating the mailto link it states that sending happens in the visitor's own email application and repeats the direct channels. No case numbers are generated.

**Data minimization.** Required fields are the minimum for review (request type, organization, country, sector, contact name, role, professional email, summary, consent); phone/website/language/value-chain are optional. Prohibited data (passwords, payments, IDs, banking, legal records, attachments) is not requested and no upload exists. Form state lives only in component memory: no localStorage, sessionStorage, cookies, analytics or persistence of any kind (test-enforced). Consent is an explicit unchecked-by-default checkbox required before review.

**Arabic email bodies** isolate LTR runs (emails, phone numbers, URLs) with Unicode LRI/PDI so mixed-direction text stays readable.

## Consequences

Requests reach the reception inbox through infrastructure the visitor already trusts; the site holds zero personal data. The trade-off — the user must press Send in their mail client — is stated honestly in the UI.

## Reversibility

High by design: swap the transport implementation once a backend is authorized.
