---
title: 'GoHealth (Health & Nutrition Tracking)'
type: 'academic'
date: '2024-11-01'
excerpt: 'Health and nutrition API for meals, activity, weight, targets, authentication, and push-notification delivery.'
summary: 'A health-tracking backend that keeps nutrition calculations, user targets, authentication, and notification state behind one API contract.'
caseStudySummary:
  problem: 'Meal, activity, target, and notification data can drift if clients independently calculate nutrition state or treat push delivery as business truth.'
  decision: 'Keep calculations and target evaluation on the server, persist notification intent separately from FCM delivery, and expose one authenticated API.'
  result: 'Meal/activity history, daily targets, BMI/weight records, and notification intent share one backend-owned model.'
tags: ['Flutter', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Firebase', 'FCM', 'Google OAuth']
repository: 'https://github.com/howlil/gohealth-api'
featured: false
role: 'Backend engineer / API owner'
engineeringFocus: ['Domain calculations', 'Notification state', 'Authentication']
---

## Context and ownership

GoHealth is an academic health-tracking application for meals, activity, weight, BMI, nutrition targets, and push notifications. I owned the backend model/API, authentication, domain calculations, and Firebase Cloud Messaging integration.

The core question was where derived health state should live. If every client calculates calories and target progress independently, the same records can produce different results.

## Server-owned derived state

Clients submit meal/activity inputs; the server owns calculations used for daily summaries and target evaluation. Food data comes from a local dataset rather than a runtime third-party nutrition API.

That avoids rate-limit/provider dependency, but it makes data quality an explicit limitation: results are only as accurate as the maintained catalog.

## Notification intent is not delivery truth

Notification records are persisted separately from FCM delivery. The backend can decide that a target notification is due, store that intent, then attempt push delivery.

A successful provider request does not prove the user saw the message, and a stale device token can fail independently from nutrition state. Tokens can therefore be updated/removed without changing the underlying health record.

The 90–110% calorie range is evaluated as a server-side domain rule rather than a client UI threshold.

## Authentication boundary

Password/JWT and Google OAuth converge on the same backend identity used for protected health records. OAuth/Firebase credentials remain deployment configuration, not repository data.

## Result and limits

GoHealth centralizes meal/activity records, targets, BMI/weight history, authentication, and notification intent behind one API usable by multiple clients.

The engineering lesson is that **derived domain state and delivery state should not share the same authority**.

Known limits are scheduled-reminder durability, multi-device FCM token modeling, failed-token cleanup, and nutrition-dataset provenance. I do not claim reminders improved adherence because that outcome was not measured.
