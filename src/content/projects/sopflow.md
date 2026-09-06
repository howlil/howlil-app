---
title: 'SOPFlow'
type: 'academic'
date: '2026-09-06'
excerpt: 'Role-scoped SOP lifecycle with review, approval, electronic signing, durable PDF artifacts, and idempotent notification delivery.'
summary: 'A thesis project for managing SOP documents as an explicit workflow from authoring through review, approval, signing, publication, and revocation.'
caseStudySummary:
  problem: 'Document workflow correctness depends on role permissions, transitions, signed artifacts, and asynchronous reminders staying consistent across client, API, database, and transport.'
  decision: 'Model workflow state explicitly, keep transition policy on the server, separate business state from delivery state, and isolate signing credentials behind dedicated security boundaries.'
  result: 'SOP creation, evaluation, approval, signed-PDF persistence, verification, revision/revocation, and WhatsApp reminders operate through explicit contracts.'
tags: ['React', 'Vite', 'TypeScript', 'NestJS', 'Prisma', 'MariaDB', 'Docker', 'Wago']
repository: 'https://github.com/howlil/sop-ta'
featured: true
featuredRank: 2
role: 'Full-stack engineer / system owner'
engineeringFocus: ['Workflow state', 'Electronic signing', 'Async delivery correctness']
verifiedEvidence:
  - 'Server policy projects internal SOP statuses into lifecycle stages including authoring, process review, and final approval.'
  - 'Personal PKCS#12 credentials are stored per user; passphrases are encrypted with a dedicated TTE secret and signed PDFs persist on a dedicated volume.'
  - 'Wago callbacks are HMAC-SHA256 verified, timestamp-bounded, durably deduplicated by webhook ID, and correlated with delivery attempts.'
---

## Context and ownership

SOPFlow is my thesis project for managing SOP documents through authoring, review, approval, signing, publication, revision, and revocation. I own the full-stack workflow model, authorization, editor orchestration, signing boundary, durable artifacts, verification, and WhatsApp reminder delivery.

The hard problem is deciding which subsystem owns each truth when several actors and asynchronous processes touch the same SOP.

## Workflow meaning belongs to the server

Persistence contains multiple internal statuses, but the backend projects them into a smaller user-facing lifecycle. A fresh draft and returned revision can belong to the same stage while preserving different internal semantics.

Pages consume that workflow policy rather than recreating it. Server-owned transition/authorization rules also prevent a client from advancing an SOP merely because it can render an action button.

## Delivery state is not business state

Wago transports reminder messages, but it does not own the SOP lifecycle.

Each logical reminder has delivery attempts. Outbound requests use idempotency keys; callbacks update delivery history separately. The webhook verifies HMAC-SHA256 signatures against the raw body, checks timestamp freshness, and durably deduplicates by webhook ID.

A `server_accepted` event means transport acceptance—not proof the recipient received or read the message.

## Signing has its own trust boundary

Credentials are personal per user rather than one global certificate. PINs are hashed; each signer owns a PKCS#12 credential; its passphrase is encrypted using user PIN material plus a dedicated `TTE_ENCRYPTION_SECRET`; signed PDFs persist on a dedicated volume.

The limitation is explicit: this thesis mechanism is not a replacement for official Indonesian PSrE/BSrE signing. A real government deployment should move final private-key trust to an approved provider.

## Editor concurrency

Naive autosave can overlap writes or let an older response finish after newer edits. The client therefore converged on one canonical editor model and a coalescing single-writer autosave path while separating data loading from workflow actions.

This makes client mutation ordering predictable without making the browser the owner of workflow truth.

## Result and limits

SOPFlow demonstrates a workflow where document state, transition policy, credentials, signed artifacts, and transport delivery have explicit owners.

The core lesson is: **workflow correctness comes from ownership boundaries, not from adding more status labels**.

Production government signing, retention/audit policy, and PSrE integration remain separate architecture decisions rather than incremental UI features.
