---
title: 'StunBy Cloud API (Bangkit Capstone)'
type: 'study-independent'
date: '2024-12-01'
excerpt: 'Cloud Run API with PostgreSQL, GCS, and Terraform-managed infrastructure.'
summary: 'Replaceable application compute with durable relational/object state and an explicit analysis-service boundary.'
caseStudySummary:
  problem: 'The backend needed durable relational and object state without making application instances stateful or coupling clients to analysis internals.'
  decision: 'Treat Cloud Run as replaceable compute, keep durable state in PostgreSQL/GCS, and isolate analysis behind one backend contract.'
  result: 'Compute can be replaced independently while data ownership and infrastructure boundaries remain explicit.'
tags: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Google Cloud Run', 'Terraform', 'Docker']
repository: 'https://github.com/StunBy-Bangkit-Capstone/cloud-api'
featured: false
role: 'Cloud/backend engineer'
engineeringFocus: ['Cloud architecture', 'Persistent state', 'Infrastructure as code']
verifiedEvidence:
  - 'Cloud Run owns replaceable HTTP compute while PostgreSQL and Google Cloud Storage own durable relational and object state.'
  - 'Infrastructure is represented in Terraform rather than only through console-managed resources.'
---

## Context and ownership

StunBy was a Bangkit capstone backend for accounts, child measurements, nutrition records, analysis results, article content, and uploaded assets. I owned the cloud/backend boundary, relational model, GCS integration, analysis contract, Terraform, and Cloud Run deployment.

The central question was: **what state is allowed to disappear when an application instance is replaced?**

## Replaceable compute, durable state

Cloud Run instances are treated as disposable HTTP compute. PostgreSQL owns relational records; Google Cloud Storage owns uploaded objects. The container filesystem is not canonical storage.

That separation means an instance restart or horizontal replacement does not redefine data ownership.

Cloud Run fit because the application did not need a stateful cluster. The trade-off is that startup, database connections, and external dependencies must tolerate instance replacement and multiple concurrent instances.

## Analysis behind one contract

Clients call the backend rather than depending directly on analysis/ML internals. The API validates inputs, invokes the analysis boundary, normalizes the result, and persists application-owned state.

This gives one place to version semantics or add contract tests without leaking model-specific response shapes into every client.

## Infrastructure is reviewable

Terraform represents intended cloud resources alongside code instead of relying entirely on manual console configuration. It does not remove operational risk, but it makes infrastructure changes inspectable and reproducible.

## Failure boundaries

- Cloud Run process/local disk can disappear → canonical state remains in PostgreSQL/GCS.
- Database migration/connectivity can fail → rollout and startup behavior need explicit handling.
- Object-storage IAM can expose assets → least privilege matters.
- Analysis can timeout or drift → the backend contract needs validation and bounded failure handling.

## Result and limits

StunBy demonstrates a clear ownership model: **compute, relational data, object data, and analysis each have a different replacement lifecycle**.

The next hardening work is contract tests around measurement → analysis → persistence, explicit storage-IAM review, and migration/rollback evidence. A larger orchestration platform is not justified without a workload that requires it.
