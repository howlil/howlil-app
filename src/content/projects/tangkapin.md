---
title: 'Tangkapin (Weapon Detection & CCTV Reporting)'
type: 'hackathon'
date: '2024-11-01'
excerpt: 'CCTV incident workflow connecting a Python detection service with reporting, evidence, assignment, tracking, and realtime notifications.'
summary: 'A two-service incident system where model output is evidence feeding a human-operated reporting workflow rather than final operational truth.'
caseStudySummary:
  problem: 'Model output, incident reports, police verification, assignment, and tracking have different trust levels but need one coherent lifecycle.'
  decision: 'Keep inference behind a service contract, persist report/evidence state in the API, preserve manual reporting, and let authorized workflow transitions own incident progression.'
  result: 'Detection can trigger evidence without making model availability or confidence the sole authority for assignment and completion.'
tags: ['Flutter', 'Next.js', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Python', 'PyTorch', 'Pusher', 'Docker']
repository: 'https://github.com/howlil/tangkapin-server'
featured: false
role: 'Backend engineer / ML integration owner'
engineeringFocus: ['Service contracts', 'Incident workflow', 'Evidence boundaries']
---

## Context and ownership

Tangkapin connects CCTV weapon detection with reporting, evidence, verification, officer assignment, and field tracking. I owned the backend API and integration contract with the Python/PyTorch detection service.

The central engineering issue was trust: a model prediction, persisted report, human verification, and officer status are not equivalent facts.

## Inference is evidence, not business truth

The Python service returns a bounded detection response through HTTP. The Node.js API consumes that output and can create/enrich report evidence, but model confidence does not directly complete the incident workflow.

Authorized human verification and persisted report transitions remain the operational authority. This prevents “model detected something” from silently becoming “incident confirmed.”

## Service failure degrades narrowly

Inference runs in a separate process/container. If it is unavailable, automatic detection stops, but manual reporting and the rest of the incident lifecycle can remain available.

Timeouts and bounded retry are preferable to allowing an ML request to block operational API work indefinitely.

## Realtime is delivery, not state

Pusher notifies Owner/Officer/Police clients of changes. The database/API remains canonical, so clients can recover current report state after a missed realtime event.

Tracking data has its own boundary: latitude/longitude update frequency affects privacy, bandwidth, storage, and battery. The project does not claim a production-grade dispatch or ETA system without those policies.

## Result and limits

Tangkapin demonstrates a clear ML/product boundary: **inference proposes evidence; persisted workflow and authorized actions own incident state**.

Known limits are model-version/confidence provenance, role/transition regression tests, inference latency/drift telemetry, and a separately designed frame-ingestion pipeline if real CCTV throughput ever requires it. I do not claim the system measurably reduced response time because that was not instrumented.
