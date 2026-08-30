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
featured: true
featuredRank: 3
role: 'Cloud/backend engineer'
engineeringFocus: ['Cloud architecture', 'Persistent state', 'Infrastructure as code']
diagrams:
  - kind: 'deployment'
    title: 'Cloud architecture'
    src: '/diagrams/stunby-cloud-api/architecture.svg'
    source: 'https://github.com/howlil/howlil-app/blob/main/diagrams/plantuml/stunby-cloud-api/architecture.puml'
    alt: 'Cloud architecture diagram showing clients, Cloud Run API, PostgreSQL, Google Cloud Storage, analysis boundary, and Terraform CI/CD.'
    caption: 'Application compute is replaceable; durable state lives in PostgreSQL or object storage, while Terraform describes the cloud boundary.'
---

## System boundary

StunBy needed one backend for accounts, nutrition records, child measurements, derived analysis results, article content, and uploaded assets. It also needed a clean integration point for a separate analysis or ML component.

I built the Cloud API and relational schema, integrated Google Cloud Storage, documented the API/analysis contract, and deployed the service to Google Cloud Run with Terraform and GitHub Actions.

## Where state lives

Cloud Run instances are treated as disposable compute. Relational records belong in PostgreSQL and uploaded files belong in Google Cloud Storage rather than the container filesystem.

That separation is simple but important:

- the API process can be replaced or scaled without becoming the owner of durable state;
- relational data keeps constraints, history, and queryability;
- object storage handles files without pretending a container disk is persistent infrastructure.

## Why Cloud Run fit the service

The API did not need a long-running stateful node. Cloud Run provided a small deployment boundary for stateless HTTP compute while keeping the operational surface lower than managing a cluster for the capstone.

The trade-off is that startup behavior, database connection management, and external dependencies still have to tolerate instance replacement and horizontal scaling.

## Keep analysis behind a contract

Clients call one stable backend contract rather than depending directly on an analysis implementation. The API can normalize input/output while the implementation behind that boundary evolves from deterministic rules to a separate model service.

This keeps model-specific concerns from leaking into every client and creates one place to version or contract-test the integration.

## Failure boundaries

| Boundary | Main risk | Engineering response |
| --- | --- | --- |
| Cloud Run instance | Local process/files disappear | Keep durable state in PostgreSQL/GCS |
| Database schema | Contract changes break old code | Reviewed migrations and compatible rollout |
| Object storage | IAM mistakes expose private assets | Least privilege and explicit delivery policy |
| API ↔ analysis | Result semantics drift | Versioned contract and integration tests |

## What this architecture enabled

Infrastructure configuration lived in Terraform instead of only in a cloud console, so the deployment boundary could be reviewed and reproduced alongside application changes. The application itself stayed small: HTTP compute, relational state, object storage, and analysis each had a clear owner.

That separation mattered more than using any individual Google Cloud product.

## What I'd change today

1. Add stricter domain validation and integration tests around measurement → analysis → persisted result flows.
2. Use a storage-provider abstraction so local and integration tests do not depend directly on GCS.
3. Version and contract-test the analysis boundary and review public/private bucket policy explicitly.
