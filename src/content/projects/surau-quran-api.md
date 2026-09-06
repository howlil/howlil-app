---
title: 'Surau Quran API'
type: 'work'
date: '2024-06-15'
excerpt: 'Multi-role backend for student operations, tuition payments, attendance, and teacher payroll with Xendit integration.'
summary: 'A monolithic operational API that keeps identity, finance, attendance, and payroll state in one explicit domain boundary.'
caseStudySummary:
  problem: 'Student administration and finance share identities and lifecycle events, while payment and payout providers introduce asynchronous callbacks that cannot be trusted as ordinary user requests.'
  decision: 'Keep the deployment monolithic, centralize identity and role authorization, separate finance records from provider transport, and make webhook processing idempotent against persisted state.'
  result: 'Student, teacher, attendance, tuition, registration, and payroll workflows share one backend source of truth without requiring distributed services for the expected workload.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'JWT', 'PM2']
featured: false
role: 'Backend engineer / API owner'
engineeringFocus: ['RBAC', 'Payment lifecycle', 'Operational workflows']
---

## Context and ownership

Surau Quran API supports the operational side of a surau/TPA: student and teacher records, program registration, tuition, attendance, and teacher payroll.

I owned the backend schema, multi-role authentication, finance flows, Xendit invoice/disbursement integration, scheduled jobs, and production process lifecycle with PM2.

The main design constraint was keeping ordinary organizational state separate from external payment-provider events while still serving several roles from one application.

## A monolith was the deliberate choice

The system runs as one API and one relational database. For this workload, splitting student, finance, attendance, and payroll into separate services would add network, deployment, and consistency boundaries without solving an observed product problem.

A monolith still requires internal ownership boundaries. Authentication, student administration, finance, attendance, and payroll should not become one collection of route handlers that mutate each other’s tables arbitrarily.

The relevant trade-off is maintainability inside one process, not theoretical horizontal scale.

## Identity and authorization

A central user identity maps to role-specific records such as student, teacher, or administrator context. Protected endpoints enforce role access on the server through JWT-authenticated middleware.

The important invariant is that frontend visibility does not grant permission. A teacher, student, or administrator must only be able to read or mutate records allowed by the backend authorization policy.

That boundary deserves regression tests because authorization bugs are data-access bugs, not UI defects.

## Finance state is not provider state

Xendit handles invoice/payment and teacher disbursement transport, but provider callbacks are not treated as arbitrary updates to the application domain.

Callbacks are verified using the provider-supported token/signature mechanism, current persisted state is loaded before applying a transition, and repeated delivery should not create the same logical payment effect twice.

This is an application-level idempotency boundary. A stronger version would also persist provider event identifiers and enforce uniqueness where the provider contract exposes a stable event key.

## Scheduled work

Recurring jobs handle operational tasks such as reminders or payment reconciliation. In-process cron is sufficient for a small deployment, but it has clear semantics: if the process restarts, scheduling and retry behavior depend on the application runtime.

That makes cron appropriate only while jobs are bounded and repeatable. Heavy or durable work would justify a queue/worker boundary once there is an observed need—not merely because queues are common in larger systems.

## Failure boundaries

The current design explicitly accepts several limits:

- provider availability and callback delivery are external dependencies;
- in-process cron does not provide durable distributed scheduling;
- local uploads, if used, inherit server-disk durability limits;
- role middleware is a critical security boundary;
- one monolith means a process-level failure affects all API domains.

PM2 restart and graceful SIGTERM/SIGINT handling improve process recovery, but they do not erase those domain risks.

## Evidence and result

The delivered API centralizes student operations and finance while keeping role authorization and external payment transport behind explicit backend boundaries.

The strongest engineering decision was also the simplest one: **use one deployable service because the problem did not justify distributed infrastructure, then make the internal trust and state boundaries explicit**.

## Known limits

The next hardening work is authorization regression coverage, database-level payment-event deduplication where possible, integration tests for registration → payment → activation and payroll → disbursement, and moving only genuinely durable/heavy scheduled work out of process if runtime evidence requires it.
