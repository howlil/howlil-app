---
title: 'StunBy Cloud API (Bangkit Capstone)'
type: 'study-independent'
date: '2024-12-01'
excerpt: 'Cloud backend for growth and nutrition tracking with authenticated APIs, relational analysis results, Google Cloud Storage assets, Cloud Run deployment, Terraform infrastructure, and CI/CD.'
summary: 'Stateless Cloud Run API with relational state in PostgreSQL, assets in GCS, Terraform-managed infrastructure, and a stable analysis boundary.'
tags: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Google Cloud Run', 'Terraform', 'Docker']
repository: 'https://github.com/StunBy-Bangkit-Capstone/cloud-api'
featured: true
featuredRank: 3
role: 'Cloud/backend engineer'
engineeringFocus: ['Cloud architecture', 'Infrastructure as code', 'API boundaries', 'Persistent storage']
verifiedEvidence:
  - 'Stateless API deployed on Google Cloud Run'
  - 'Terraform-managed cloud infrastructure'
  - 'Object storage separated from application compute'
diagrams:
  - kind: 'deployment'
    title: 'Cloud architecture'
    src: '/diagrams/stunby-cloud-api/architecture.svg'
    source: 'https://github.com/howlil/howlil-app/blob/main/diagrams/plantuml/stunby-cloud-api/architecture.puml'
    alt: 'Cloud architecture diagram showing clients, Cloud Run API, PostgreSQL, Google Cloud Storage, analysis boundary, and Terraform CI/CD.'
    caption: 'Compute is replaceable; durable state belongs in PostgreSQL or object storage, while Terraform describes the cloud boundary reproducibly.'
  - kind: 'activity'
    title: 'API and analysis boundary'
    src: '/diagrams/stunby-cloud-api/analysis-boundary.svg'
    source: 'https://github.com/howlil/howlil-app/blob/main/diagrams/plantuml/stunby-cloud-api/analysis-boundary.puml'
    alt: 'Activity diagram showing measurement input validation, rule-based or ML analysis, normalized output, and persisted result.'
    caption: 'Clients depend on one stable API contract; the analysis implementation can move from deterministic rules to a model service behind that boundary.'
---

## Problem

StunBy needed one backend boundary for parent accounts, nutrition records, baby measurements, computed results, article content, and uploaded assets. It also needed a clean path for a separate analysis or ML component without coupling clients directly to model implementation details.

The key design question was how to separate compute, relational state, object storage, and analysis so each responsibility could evolve and fail independently.

## Ownership

I built the Cloud API and relational schema, implemented authenticated/public route boundaries, integrated Google Cloud Storage for images, documented the API/analysis contract, and deployed the service to Google Cloud Run with Terraform and GitHub Actions.

## Engineering decisions

### Keep durable state outside application compute

Cloud Run instances are treated as replaceable compute. Relational state belongs in PostgreSQL and uploaded assets belong in Google Cloud Storage rather than local container state.

### Model results relationally

Measurements, nutrition inputs, and derived results are structured relational entities rather than one opaque JSON blob. This costs more migration work but makes validation, history, and reporting explicit.

### Make security boundaries visible

Login/register and health endpoints are public; user, nutrition, measurement, and article operations require authentication. The route split keeps the access boundary visible instead of relying only on handler convention.

### Treat infrastructure as reviewed state

Terraform describes cloud resources so infrastructure changes can be reproduced and reviewed alongside application changes rather than existing only in manual console configuration.

## Correctness and failure boundaries

| Boundary | Risk | Design / hardening path |
| --- | --- | --- |
| Measurement input | Invalid values produce meaningless results | Domain bounds and validation |
| Cloud Run instance | Local process/filesystem state disappears | Durable state in PostgreSQL/GCS |
| GCS access | Wrong IAM policy exposes private assets | Least privilege + explicit delivery policy |
| API ↔ analysis | Contract drift changes result meaning | Version and contract-test boundary |
| Schema migration | Result model changes over time | Reviewed migrations and compatible rollout |
| Secrets | CI/runtime credentials leak | Scoped runtime identity and secret storage |

## Evidence

- backend compute is deployed statelessly on Cloud Run;
- uploaded files live in object storage instead of the application filesystem;
- Terraform captures cloud configuration as reproducible infrastructure state;
- the analysis contract provides an integration seam independent of the client.

No latency or throughput claim is published because the capstone was not benchmarked under a controlled production-scale load test.

## Next improvements

1. Strict domain validation for measurement inputs.
2. Fix the `constent` → `content` article-field typo through a reviewed migration.
3. Introduce a `StorageProvider` abstraction for local/integration tests.
4. Integration tests for register → authenticate → measurement → persisted result / asset flow.
5. Version and contract-test the API/analysis boundary.
6. Review bucket policies so public content and private user assets are intentionally separated.

## Takeaway

Cloud Run, PostgreSQL, GCS, Terraform, and an analysis service are useful because they own different responsibilities and failure boundaries. The design keeps runtime compute replaceable while durable state and integration contracts remain explicit.
