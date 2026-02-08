---
title: 'StunBy Cloud API (Bangkit Capstone)'
type: 'study-independent'
date: '2024-12-01'
excerpt: 'Backend for stunting detection and prevention: parents log nutrition and baby measurements. System computes nutrition needs, BMI, z-score, and nutrition status (normal/stunting/obesity). Deployed on Google Cloud Run with Terraform.'
tags: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Google Cloud Run', 'Terraform', 'Docker']
repository: 'https://github.com/StunBy-Bangkit-Capstone/cloud-api'
---

<!-- @format -->

## Problem Worth Solving

Stunting needs structured nutrition and growth tracking. Parents often lack tools to log and see analysis (BMI, z-score, nutrition status). Manual process does not scale. One Cloud API handles users, nutrition and measurement logging, analysis results, education articles, and assets (photos). Ready for mobile/web clients and (via docs) ML services.

## My Role & Ownership

I built the Cloud API: database schema (User, Nutrition, Nutrition_Result, Measurement, Measurement_Result, IMT_Result, Articles), Cloud Storage (GCS) for profile photos, baby photos, article images, public vs private routes, and deploy to Cloud Run with Terraform and GitHub Actions. Architecture and tech decisions were mine.

## Key Engineering Decision

- **Prisma + PostgreSQL for User, Nutrition, Measurement, Results.** Relational schema is clear. Migrations are clean. Nutrition status (NORMAL, STUNTING, OBESITAS) as enum. MySQL would have been fine. We used PostgreSQL for Bangkit/GCP stack.

- **Measurement + IMT_Result + Measurement_Result as separate models.** One measurement has nutrition-need results and BMI results (z-score, nutrition status). Fits the flow: input measurement, compute, store result. More tables vs one "result" JSON. Structured is easier to query and validate.

- **Cloud Storage (GCS) for photos.** Backend on Cloud Run, assets in bucket. Scales, survives replicas. Needs IAM and bucket setup. In dev you can mock or use a separate bucket.

- **Public vs private routes.** Login/register and health are public. User, nutrition, measurement, article routes use auth. Clear split. Auth middleware on private routes.

- **Terraform for infra.** Project, bucket, Cloud Run, IAM as code. Reproducible and reviewable. Team needs to know Terraform. Secrets/env in GitHub.

## One Hard Engineering Problem

BMI and z-score can be computed in the API (rule-based) or by a separate ML service. The request/response format must be aligned. Assuming one source of truth without a contract can cause inconsistencies when ML is integrated. I documented the integration contract in api-ml.md: measurement input format, result output format, and endpoints. The API can run rule-based first and ML can plug in later without breaking changes. Input validation (weight, baby_length, date_measure) stays consistent at app or ML level.

## Metrics & Impact

- One API for auth, nutrition and measurement logging, analysis (BMI, z-score), and articles. Cloud Storage for photos.
- Deploy to Cloud Run with Terraform. CI/CD automatic. api-ml.md documents ML integration contract.

## What I'd Improve Next

- Fix Articles schema: rename `constent` to `content` via Prisma migration.
- Validate measurement input: bounds for weight, baby_length, date_measure per IMT/z-score logic.
- Storage abstraction: "StorageProvider" layer (local vs GCS) so dev does not require a bucket.
- Integration tests: register, login, create measurement, get result. Upload photo, URL stored.

## Architecture

Stateless API. Deploy on Google Cloud Run. Prisma + PostgreSQL for data. Cloud Storage bucket for photos. Public routes (login/register, health) and private routes (user, nutrition, measurement, article) with auth middleware. CI/CD: push to main triggers build and deploy via GitHub Actions. Infra as code with Terraform.

## Failure & Risk Considerations

- BMI/z-score: can live in API or ML. Mitigate with api-ml.md contract. API rule-based first, ML later.
- GCS upload: needs IAM and bucket. Public vs signed URLs depend on policy.
- Terraform and CI/CD: infra changes via PR for documentation. Secrets/env in GitHub.
- Articles typo: field `constent` needs migration to `content`.
- ML integration: request/response format must match api-ml.md.
