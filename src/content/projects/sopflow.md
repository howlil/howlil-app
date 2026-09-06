---
title: 'SOPFlow'
type: 'academic'
date: '2026-09-06'
excerpt: 'Role-scoped SOP lifecycle with review, approval, electronic signing, durable PDF artifacts, and idempotent notification delivery.'
summary: 'A thesis project for managing SOP documents as an explicit workflow from authoring through review, approval, signing, publication, and revocation.'
caseStudySummary:
  problem: 'Document workflow correctness depends on role permissions, state transitions, approval evidence, signed artifacts, and asynchronous reminders staying consistent across the client, API, database, and external notification transport.'
  decision: 'Model workflow state explicitly, keep authorization and transition policy on the server, separate business state from notification delivery state, and isolate signing credentials behind dedicated security boundaries.'
  result: 'SOP creation, evaluation, approval, signed-PDF persistence, public verification, revision/revocation, and WhatsApp reminder delivery operate through explicit contracts rather than UI-only state.'
tags: ['React', 'Vite', 'TypeScript', 'NestJS', 'Prisma', 'MariaDB', 'Docker', 'Wago']
repository: 'https://github.com/howlil/sop-ta'
featured: true
featuredRank: 3
role: 'Full-stack engineer / system owner'
engineeringFocus: ['Workflow state', 'Electronic signing', 'Async delivery correctness']
verifiedEvidence:
  - 'Server policy projects internal SOP statuses into lifecycle stages including authoring, process review, and final approval.'
  - 'Personal PKCS#12 signing credentials are stored per user; P12 passphrases are encrypted with a dedicated TTE encryption secret and signed PDFs persist on a dedicated volume.'
  - 'Wago delivery callbacks are HMAC-SHA256 verified, timestamp-bounded, durably deduplicated by webhook ID, and correlated with reminder delivery attempts.'
---

## The problem

A document approval system is easy to underestimate because the visible UI is mostly forms, tables, and signatures. The difficult part is making every actor see the same lifecycle while permissions, autosave, review, approval, signing, reminders, and published artifacts remain consistent across asynchronous boundaries.

SOPFlow is my thesis project for managing Standard Operating Procedure documents through that full lifecycle. The current repository used for the portfolio is `howlil/sop-ta`; the later placeholder SOPFlow repositories are not the source of this case study.

## Workflow is server policy

The client does not own the meaning of an SOP status. Internal persistence states are projected by server-side policy into user-facing workflow stages such as authoring, process review, and final approval.

That distinction matters because several internal states can mean the same product stage while still carrying different operational semantics. For example, a returned revision belongs back in authoring even though its persistence status differs from a fresh draft.

Keeping the policy on the server prevents each page from independently interpreting the same state machine.

## Separate business state from transport state

Reminder delivery uses a self-hosted Wago gateway, but WhatsApp transport is not allowed to become the SOP business state machine.

Each logical reminder occurrence has delivery attempts. Outbound requests use an idempotency key, and asynchronous Wago callbacks are stored and correlated separately from the reminder lifecycle.

The webhook boundary verifies the callback signature with HMAC-SHA256, validates webhook ID/timestamp/signature headers against the raw request body, rejects stale timestamps outside the accepted window, and durably deduplicates by webhook ID.

A server-accepted WhatsApp event means the transport accepted the message. It is not represented as proof that the recipient device received or read it.

That language is intentionally strict because distributed systems become unreliable when transport acknowledgement is silently promoted into business truth.

## Electronic signing boundary

SOPFlow includes an internal electronic-signing implementation for the application/thesis context. Signing credentials are personal per user rather than one global server certificate.

The design keeps several concerns separate:

- the TTE PIN is hashed;
- each user owns a PKCS#12/P12 credential;
- the P12 passphrase is encrypted using the user PIN plus a dedicated `TTE_ENCRYPTION_SECRET`;
- signed PDF artifacts persist on a dedicated Docker volume;
- public verification endpoints are rate-limited and operate on explicit signing metadata/artifacts.

The project also documents the production boundary clearly: the internal CA/P12 mechanism is not a substitute for an official Indonesian PSrE/BSrE integration. A real government deployment should move the private-key trust boundary to an approved signing provider instead of making the application the final certificate authority.

## Autosave and client orchestration

The editor contains enough state that naive autosave can create concurrency bugs: multiple edits can overlap, a slow request can finish after a newer one, and UI state can accidentally diverge from persisted state.

Recent refactoring converged the editor around one canonical model and a coalescing single-writer autosave path while preserving the external API and workflow semantics. The client also isolates data loading from workflow actions rather than concentrating page behavior in one large orchestration hook.

Those changes are mostly invisible in screenshots, but they reduce the number of places that can independently mutate the same document lifecycle.

## Runtime boundary

The deployed topology is deliberately conventional:

```text
public ingress
  -> frontend Nginx
  -> NestJS API
  -> MariaDB
```

The backend also owns a persistent PDF volume and optional outbound Wago integration. Database migrations run before the production NestJS process starts.

Only the frontend needs to be public in the normal Compose deployment; backend and database ports remain internal service boundaries.

## Result

SOPFlow evolved from a CRUD-style document application into a workflow system with explicit lifecycle projection, role-based authorization, review/approval state, signed artifacts, recovery-aware autosave, and asynchronous notification delivery.

The main engineering lesson was that document workflow correctness does not come from adding more status labels. It comes from deciding which subsystem owns each truth: workflow policy, persisted document state, signing credentials, artifacts, transport delivery, and user-facing projection.