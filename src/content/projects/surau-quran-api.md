---
title: 'Surau Quran API'
type: 'work'
date: '2024-06-15'
excerpt: 'Multi-role backend for student operations, tuition payments, attendance, and teacher payroll with Xendit integration.'
summary: 'A monolithic operational API that keeps identity, finance, attendance, and payroll state in one explicit domain boundary.'
caseStudySummary:
  problem: 'Student administration and finance share identities and lifecycle events, while payment/payout providers introduce asynchronous callbacks.'
  decision: 'Keep one deployable service, centralize role authorization, separate finance records from provider transport, and make callbacks idempotent against persisted state.'
  result: 'Student, teacher, attendance, tuition, registration, and payroll workflows share one backend source of truth without unnecessary distributed services.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'JWT', 'PM2']
featured: false
role: 'Backend engineer / API owner'
engineeringFocus: ['RBAC', 'Payment lifecycle', 'Operational workflows']
---

## Context and ownership

Surau Quran API supports student/teacher records, program registration, tuition, attendance, and teacher payroll. I owned the schema, multi-role authentication, Xendit invoice/disbursement flows, recurring jobs, and PM2 deployment lifecycle.

The main constraint was keeping organizational state separate from external payment events while several roles shared one application.

## Monolith by design

The system runs as one API and relational database. The workload did not justify splitting auth, students, finance, attendance, and payroll into separate network services.

That keeps deployment simple, but internal boundaries still matter. Each domain should own its mutations rather than becoming a flat set of controllers sharing tables arbitrarily.

## Authorization is backend policy

A central identity maps to role-specific student, teacher, or administrator context. JWT middleware enforces access on protected endpoints; frontend visibility is never treated as permission.

Cross-role regression tests are therefore a critical security check.

## Provider callbacks do not own finance

Xendit handles payment/disbursement transport. Callback authenticity is verified, persisted state is loaded before a transition, and repeated delivery should not apply the same logical effect twice.

Application-state checks provide basic idempotency. Database-level uniqueness on a stable provider event key would strengthen the guarantee where the provider contract supports it.

## Scheduled work has a bounded role

In-process cron is sufficient while recurring jobs are small and repeatable. It does not provide durable distributed scheduling, so heavy or must-run jobs would justify a queue only when real workload requires it.

## Result and limits

The API keeps student operations and finance under one deployable boundary while making role authorization and payment transport explicit.

The core lesson is: **use the simplest deployment that fits the workload, then be precise about trust and state ownership inside it**.

Known limits are authorization regression coverage, stronger callback deduplication, finance integration tests, and the durability limits of in-process scheduling/local storage.
