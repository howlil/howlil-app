---
title: 'StunBy Cloud API (Bangkit Capstone)'
type: 'study-independent'
date: '2024-12-01'
excerpt: 'Cloud Run API with PostgreSQL, GCS, and Terraform-managed infrastructure.'
summary: 'Replaceable application compute with durable relational/object state and an explicit analysis-service boundary.'
caseStudySummary:
  problem: 'The backend needed durable relational and object state without making application instances stateful or coupling clients to the analysis implementation.'
  decision: 'Treat Cloud Run as replaceable compute, keep durable state in PostgreSQL/GCS, and isolate analysis behind one backend contract.'
  result: 'Compute can be replaced independently while data ownership and infrastructure boundaries remain explicit and reproducible.'
tags: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Google Cloud Run', 'Terraform', 'Docker']
repository: 'https://github.com/StunBy-Bangkit-Capstone/cloud-api'
featured: false
role: 'Cloud/backend engineer'
engineeringFocus: ['Cloud architecture', 'Persistent state', 'Infrastructure as code']
verifiedEvidence:
  - 'The application deploys as replaceable Cloud Run compute while PostgreSQL and Google Cloud Storage own durable relational and object state.'
  - 'Infrastructure configuration is represented in Terraform rather than only through console-managed resources.'
  - 'The API keeps the analysis/ML capability behind a backend contract instead of exposing model-specific integration directly to clients.'
---

## Context and ownership

StunBy was a Bangkit capstone backend for accounts, child measurements, nutrition records, analysis results, article content, and uploaded assets.

I owned the cloud/backend boundary: relational modeling, Google Cloud Storage integration, the contract to the separate analysis capability, container deployment, Terraform configuration, and GitHub Actions delivery to Cloud Run.

The central design question was simple: **what state is allowed to disappear when an application instance is replaced?**

## Replaceable compute, durable state

Cloud Run instances are treated as disposable HTTP compute. Application instances do not own durable files or canonical relational data.

State is separated by responsibility:

- PostgreSQL owns relational records, constraints, and history;
- Google Cloud Storage owns uploaded object data;
- Cloud Run owns request execution and can be replaced independently;
- the analysis capability sits behind an API contract instead of being a client dependency.

This means instance restart or horizontal replacement should not redefine data ownership.

## Why Cloud Run was enough

The service did not need a stateful cluster or long-running application node. A managed container boundary provided the required deployment model with less operational surface than managing Kubernetes for a capstone workload.

That choice still has consequences. New instances need valid configuration, database connectivity, and bounded startup behavior. Connection management must tolerate multiple instances, and local filesystem writes cannot be treated as persistent application data.

The point is not that Cloud Run is automatically “scalable”; it is that the compute lifecycle matches a stateless HTTP service.

## Analysis behind one contract

Clients call the backend rather than depending directly on the implementation details of the analysis/ML component.

The API can validate and normalize inputs, invoke the analysis boundary, and persist the returned result under one application-owned contract. That gives the system one place to version semantics or add contract tests if the implementation changes.

This also prevents model-specific response shapes from leaking into every client.

## Infrastructure is reviewable state

Terraform represents the intended cloud infrastructure alongside application changes instead of relying entirely on manual console configuration.

Infrastructure-as-code does not remove operational risk, but it makes the deployment boundary inspectable: reviewers can see which resources and relationships are intended to exist, and environment recreation is less dependent on undocumented clicking.

Secrets and runtime credentials remain deployment configuration rather than Terraform literals or repository data.

## Failure boundaries

The architecture has explicit failure domains:

| Boundary | Risk | Design response |
| --- | --- | --- |
| Cloud Run instance | process/local files disappear | keep canonical state in PostgreSQL/GCS |
| Database | migration or connectivity failure | reviewed migrations and startup/runtime error handling |
| Object storage | bad IAM can expose assets | least privilege and explicit access policy |
| Analysis service | timeout or semantic drift | bounded backend contract and integration validation |

These are separate concerns; adding more cloud products would not make them disappear.

## Evidence and result

The delivered system keeps application compute replaceable while relational records and uploaded objects live in dedicated durable stores. Infrastructure configuration is expressed in Terraform, and analysis remains behind an application-owned integration point.

The useful lesson from the project is not “used Google Cloud.” It is that **compute, relational data, object data, and analysis should each have an explicit owner and replacement lifecycle**.

## Known limits

The next hardening work is stronger contract testing around measurement → analysis → persistence, explicit storage IAM review, and environment-level migration/rollback evidence. A more complex orchestration platform would only be justified by workload or operational requirements the current project does not have.
