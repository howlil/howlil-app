---
title: 'StunBy Cloud API (Bangkit Capstone)'
type: 'study-independent'
date: '2024-12-01'
excerpt: 'Cloud backend for growth and nutrition tracking with authenticated APIs, relational analysis results, Google Cloud Storage assets, Cloud Run deployment, Terraform infrastructure, and CI/CD.'
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
---

## Problem Worth Solving

StunBy needed one backend boundary for parent accounts, nutrition records, baby measurements, computed results, article content, and uploaded assets. The system also needed a clean path for integrating a separate ML component without making the mobile/web client depend directly on model implementation details.

The interesting engineering question was therefore not just "where should the API run?" but **how should compute, relational state, object storage, and future ML integration be separated so each can evolve independently?**

## My Role & Ownership

I built the Cloud API and relational schema, implemented authenticated/public route boundaries, integrated Google Cloud Storage for images, documented the API/ML contract, and deployed the service to Google Cloud Run with Terraform and GitHub Actions.

## Architecture

```text
Mobile / Web client
        |
        v
+-------------------+
|   Cloud Run API   |
| Express + Prisma  |
+----+----------+---+
     |          |
     |          +--------------------+
     v                               v
PostgreSQL                    Google Cloud Storage
users                         profile photos
measurements                  baby photos
nutrition                     article images
results
     |
     | documented contract
     v
ML / analysis boundary
(rule-based first, replaceable later)
```

The API is stateless from the compute perspective: durable state belongs in PostgreSQL or object storage, so Cloud Run instances can be replaced without treating local disk or process memory as a source of truth.

## Key Engineering Decisions

### Relational results instead of one opaque JSON blob

Measurements, nutrition inputs, BMI results, and derived nutrition status are modeled as structured relational entities. This costs more schema/migration work than dumping a result object into JSON, but it makes validation, queries, history, and future reporting more explicit.

### Object storage outside application compute

Uploaded assets live in Google Cloud Storage rather than the container filesystem. That matches the stateless Cloud Run deployment model: replicas can come and go without losing uploaded files.

### Public and authenticated route boundaries

Login/register and health endpoints are public; user, nutrition, measurement, and article operations require authentication. The route split keeps the security boundary visible rather than relying on convention in every handler.

### Infrastructure as code

Terraform describes the cloud resources required by the service. The value is reproducibility and reviewability, not simply "using Terraform". Infrastructure changes can be reasoned about alongside application changes instead of living only as manual console state.

## API / ML Boundary

The project initially supports rule-based analysis while documenting a request/response contract for a future ML service.

```text
measurement input
      |
      v
Cloud API validates contract
      |
      +--> rule-based implementation
      |
      +--> future ML implementation
      |
      v
normalized analysis result
      |
      v
persisted result model
```

This keeps clients insulated from whether the analysis comes from deterministic rules or a model service. The API owns the stable external contract; the analysis implementation can change behind it.

## Correctness & Failure Considerations

| Boundary | Risk | Design / next hardening step |
| --- | --- | --- |
| Input measurements | Invalid weight/length/date creates meaningless results | Add explicit domain bounds and validation |
| Cloud Run instances | Local filesystem/process state disappears | Keep durable state in PostgreSQL/GCS |
| GCS access | Wrong IAM/public policy can expose private assets | Use least-privilege IAM and explicit signed/public URL policy |
| API ↔ ML | Contract drift changes result meaning | Version and test the documented contract |
| Schema migration | Result model evolves over time | Run reviewed Prisma migrations and backward-compatible rollout where needed |
| Secrets | CI/runtime credentials leak | Keep secrets out of repository and scope runtime identity narrowly |

## Evidence & Impact

- The backend is deployed as stateless compute on Cloud Run rather than relying on a long-lived VM process.
- Uploaded files live in object storage, matching horizontally replaceable application instances.
- Terraform makes cloud resource configuration reproducible and reviewable.
- The API/ML contract provides an integration seam so analysis implementation can change without forcing client changes.

I do not publish latency/throughput numbers because this capstone was not benchmarked under a controlled production-scale load test.

## What I'd Improve Next

1. Add strict domain validation for measurement inputs before analysis or persistence.
2. Fix the `constent` → `content` article-field typo through a reviewed Prisma migration.
3. Introduce a `StorageProvider` abstraction to make local/integration tests independent from a live GCS bucket.
4. Add integration tests for register → authenticate → create measurement → persist result and asset upload flows.
5. Version and contract-test the API/ML boundary before replacing rule-based analysis with a remote model service.
6. Review bucket access policy so public content and private user assets have intentionally different delivery semantics.

## Architectural Takeaway

This project taught me to separate **runtime compute** from **durable state** and to treat external integrations as contracts. Cloud Run, PostgreSQL, GCS, Terraform, and an ML service are not valuable because they are separate technologies; they are useful because each owns a different responsibility with a failure boundary that can be reasoned about independently.
