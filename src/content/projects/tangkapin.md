---
title: 'Tangkapin (Weapon Detection & CCTV Reporting)'
type: 'hackathon'
date: '2024-11-01'
excerpt: 'CCTV incident workflow connecting a Python detection service with reporting, evidence, assignment, tracking, and realtime notifications.'
summary: 'A two-service incident system where model output is treated as evidence feeding a human-operated reporting workflow rather than as final operational truth.'
caseStudySummary:
  problem: 'Computer-vision output, incident reports, police verification, assignment, and tracking have different trust levels and failure modes but need one coherent lifecycle.'
  decision: 'Keep ML inference behind an explicit service contract, persist report/evidence state in the API, preserve manual reporting as a fallback, and make human verification own operational progression.'
  result: 'Detection can trigger a report without making model availability or confidence the sole authority for assignment and incident completion.'
tags: ['Flutter', 'Next.js', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Python', 'PyTorch', 'Pusher', 'Docker']
repository: 'https://github.com/howlil/tangkapin-server'
featured: false
role: 'Backend engineer / ML integration owner'
engineeringFocus: ['Service contracts', 'Incident workflow', 'Evidence boundaries']
---

## Context and ownership

Tangkapin was a hackathon system connecting CCTV weapon detection with an operational incident workflow: evidence is recorded, a report is reviewed, an officer can be assigned, and field progress can be tracked.

I owned the backend API and the integration boundary with the Python/PyTorch detection service. That included the relational model for CCTV owners, officers, reports, evidence, assignments, tracking, notifications, and audit history, plus the service contract and Docker deployment.

The core engineering problem was trust. A model prediction, a persisted report, a human verification decision, and a field officer’s state are not equivalent facts.

## ML output is evidence, not business truth

The Python service runs independently from the Node.js API and returns a bounded detection response such as whether an object was detected, incident classification, and confidence.

The backend consumes that response through an explicit HTTP contract rather than importing model internals into the application process. This keeps the API deployable independently and makes model failure observable as a dependency failure.

More importantly, a model result does not directly complete the incident workflow. It can create or enrich report evidence, while human-operated verification and assignment remain separate domain transitions.

That boundary prevents “model confidence” from silently becoming “incident confirmed.”

## The report lifecycle is the canonical workflow

Reports move through explicit operational states for intake, assignment, work in progress, verification, completion, or rejection. Audit data records who performed important actions.

The exact labels matter less than the invariant: every actor should observe one persisted report lifecycle, and transitions should be validated by the backend according to actor and current state.

Realtime Pusher events can notify clients that state changed, but the database/API remains authoritative. Missing a realtime event must be recoverable by reading current report state again.

## Service failure must degrade narrowly

Separating ML into its own process introduces an obvious failure mode: inference can become unavailable while the rest of the incident system is healthy.

The product therefore retains manual report creation. That means an ML outage removes automatic detection but does not need to disable evidence storage, verification, assignment, or tracking.

Timeouts and bounded retry policy are preferable to allowing an inference call to indefinitely block an operational API request.

## Tracking has a different data shape

Field tracking updates latitude, longitude, and operational status over time. Update frequency affects bandwidth, storage, privacy, and battery use, so “realtime GPS” is not free.

The project models tracking as incident-owned operational data; it does not claim a production-grade dispatch/ETA system. Any stronger location product would need explicit retention, authorization, accuracy, and update-frequency policies.

## Failure and correctness boundaries

The current design still has clear limits:

- model quality/drift was not instrumented as a production monitoring program;
- service-to-service retry does not replace durable queueing if frame ingestion becomes high volume;
- role middleware and transition authorization need regression coverage;
- Pusher is a delivery dependency, not guaranteed event persistence;
- CCTV stream ingestion and frame sampling require a separately defined throughput architecture for real deployment.

I also avoid claiming that the system measurably reduced response time because that outcome was not instrumented.

## Evidence and result

Tangkapin demonstrates a clean boundary between an ML capability and an operational backend: **inference proposes evidence; persisted workflow and authorized human actions own the incident lifecycle**.

That design also lets automatic detection fail without collapsing the manual reporting path.

## Known limits

The next hardening work is contract tests between API and ML, transition/role tests, explicit model-version and confidence provenance on evidence, health/latency telemetry for inference, and a durable ingestion strategy only if real CCTV throughput requires it.
