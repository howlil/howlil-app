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
featuredRank: 2
role: 'Full-stack engineer / system owner'
engineeringFocus: ['Workflow state', 'Electronic signing', 'Async delivery correctness']
verifiedEvidence:
  - 'Server policy projects internal SOP statuses into lifecycle stages including authoring, process review, and final approval.'
  - 'Personal PKCS#12 signing credentials are stored per user; P12 passphrases are encrypted with a dedicated TTE encryption secret and signed PDFs persist on a dedicated volume.'
  - 'Wago delivery callbacks are HMAC-SHA256 verified, timestamp-bounded, durably deduplicated by webhook ID, and correlated with reminder delivery attempts.'
---

## Context and ownership

SOPFlow is my thesis project for managing Standard Operating Procedure documents through authoring, process review, final approval, electronic signing, publication, revision, and revocation.

I own the full-stack workflow model: server-side lifecycle policy, authorization, editor orchestration, signing boundary, persisted PDF artifacts, public verification, and asynchronous WhatsApp reminder delivery.

The visible product is mostly forms, queues, and documents. The harder problem is deciding which subsystem owns each truth when the same SOP is touched by different actors and asynchronous processes.

## Workflow meaning belongs to the server

Persistence contains several internal statuses, but the client should not independently decide what each one means to the user.

The backend projects internal state into a smaller lifecycle such as authoring, process review, and final approval. A fresh draft and a returned revision can therefore belong to the same user-facing stage while retaining different internal semantics.

This creates an important invariant: **pages consume workflow policy; they do not recreate it**.

Server-owned transition and authorization rules also prevent a client from advancing an SOP merely because it can render an action button.

## Business state and delivery state are separate

Reminder delivery goes through a self-hosted Wago gateway. That transport is not allowed to become the SOP state machine.

A logical reminder occurrence has delivery attempts. Outbound requests use an idempotency key, while callbacks update delivery history separately from the underlying workflow.

The webhook boundary verifies HMAC-SHA256 signatures against the raw body, validates the timestamp window, and durably deduplicates by webhook ID. Late callbacks are correlated to their delivery attempt and are not allowed to resurrect or mutate a newer reminder occurrence arbitrarily.

A `server_accepted` event means the WhatsApp transport accepted the message. It is not represented as proof that a recipient device received or read it.

That distinction is small in UI terms but fundamental in distributed-system correctness.

## Electronic signing has its own trust boundary

Signing credentials are personal per user rather than one global application certificate.

The current thesis implementation keeps concerns separate:

- TTE PIN is stored as a hash;
- each signer has a PKCS#12/P12 credential;
- the P12 passphrase is encrypted using user PIN material plus a dedicated `TTE_ENCRYPTION_SECRET`;
- signed PDF artifacts persist on a dedicated volume;
- public verification operates on explicit signing metadata/artifacts.

The boundary is also documented honestly: this internal mechanism is not a substitute for an official Indonesian PSrE/BSrE integration. A real government deployment should move the final private-key trust boundary to an approved signing provider.

## Hard problem: editor concurrency

The editor has autosave, mutable document state, and workflow actions. A naive implementation can send overlapping writes, allow an older response to finish after a newer edit, or let several hooks independently mutate the same model.

The client converged on one canonical editor model and a coalescing single-writer autosave path. Data loading and workflow actions are isolated behind separate controllers while the public facade remains stable.

This does not make the browser the owner of workflow truth; it makes client-side mutation ordering predictable before requests reach the server.

## Runtime boundary

The deployment remains conventional:

```text
public ingress
  -> frontend Nginx
  -> NestJS API
  -> MariaDB
```

The backend also owns the persistent signed-PDF volume and optional Wago integration. Only the frontend needs public ingress in the normal Compose topology; backend and database remain internal service boundaries.

That architecture is intentionally simpler than introducing queues, service meshes, or separate workflow services without an observed requirement.

## Evidence and result

The current system supports server-projected workflow stages, role-scoped transitions, review and approval, personal signing credentials, durable signed artifacts, recovery-aware autosave, and signed/idempotent webhook handling.

The strongest lesson from the project is not “document management.” It is that **workflow correctness comes from assigning one owner to each truth: document state, transition policy, credentials, artifacts, and transport delivery**.

## Known limits

The internal CA/P12 design is a thesis boundary, not production government PKI. External notification delivery still depends on Wago availability. Production-scale signing, retention, audit policy, and PSrE integration would be separate architecture decisions rather than incremental UI features.
