---
title: 'GoHealth (Health & Nutrition Tracking)'
type: 'academic'
date: '2024-11-01'
excerpt: 'Health and nutrition API for meals, activity, weight, targets, authentication, and push-notification delivery.'
summary: 'A health-tracking backend that keeps nutrition calculations, user targets, authentication, and notification state behind one API contract.'
caseStudySummary:
  problem: 'Meal, activity, target, and notification data become inconsistent if clients independently calculate nutrition state or treat push delivery as the source of truth.'
  decision: 'Keep nutrition calculations and target evaluation on the server, persist notification state separately from FCM delivery, and expose one authenticated API for multiple clients.'
  result: 'Meal/activity history, daily targets, BMI/weight records, and notification intent share one backend-owned model while provider delivery remains a separate concern.'
tags: ['Flutter', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Firebase', 'FCM', 'Google OAuth']
repository: 'https://github.com/howlil/gohealth-api'
featured: false
role: 'Backend engineer / API owner'
engineeringFocus: ['Domain calculations', 'Notification state', 'Authentication']
---

## Context and ownership

GoHealth is an academic health-tracking application for recording meals, activity, weight, BMI, nutrition targets, and notifications across a Flutter client and a shared backend API.

I owned the backend model and API for users, foods, meal logs, activities, BMI records, weight goals, daily nutrition targets, authentication, and Firebase Cloud Messaging integration.

The useful engineering question was where derived health state should live. If every client calculates calories, activity totals, and target progress independently, the same user data can produce different results across devices.

## Server-owned derived state

Daily nutrition is derived from persisted meal records and server-owned food data. Activity calculations and target evaluation also belong at the API boundary rather than being trusted from a client payload.

That creates a simple invariant: clients submit events and inputs; the server owns the calculation used for persisted summaries or notification decisions.

The original food catalog comes from a local dataset rather than an external nutrition API. That removes a runtime dependency and rate-limit risk, but it also means the catalog is only as current and accurate as the maintained dataset. I treat that as a data-quality boundary, not a backend scalability problem.

## Notification intent is not delivery truth

The application stores notification records separately from Firebase delivery. FCM is a transport mechanism: a valid send request does not prove the user saw the message, and a stale device token can fail independently from the underlying health state.

Tokens can be updated or removed as devices change. The backend can decide that a calorie-target notification should exist, persist that intent, and then attempt push delivery without making FCM the owner of the nutrition lifecycle.

The 90–110% calorie range is therefore a domain rule evaluated against the daily target, not a client-side UI threshold.

## Authentication boundary

The API supports password/JWT authentication and Google OAuth. Regardless of login method, protected domain reads and writes converge on the same backend identity boundary.

Firebase service-account credentials and OAuth secrets are deployment configuration, not repository data. This matters because authentication correctness depends as much on secret ownership and callback configuration as on route middleware.

## Failure and correctness boundaries

The current system has several limits that matter more than adding features:

- scheduled reminders need an explicit scheduler/worker policy rather than relying on user-triggered requests;
- one stored FCM token does not model multiple active devices well;
- failed or invalid device tokens need cleanup and retry policy;
- nutrition results inherit the accuracy limitations of the source food dataset;
- notification delivery should not be described as proof of user engagement.

I also avoid claiming that reminders improve adherence because the project did not measure that outcome.

## Evidence and result

The backend centralizes meal/activity records, target calculations, BMI/weight history, authentication, and notification intent behind one API that can serve multiple clients.

The main engineering lesson was that **derived health state and delivery state are different domains**. Keeping those boundaries explicit makes the system easier to reason about than letting each client calculate and notify independently.

## Known limits

The next hardening work is multi-device token modeling, scheduled-job observability, cleanup of failed push tokens, deterministic tests for calculation boundaries, and stronger provenance/versioning for nutrition data. Those changes improve correctness without requiring a larger architecture.
