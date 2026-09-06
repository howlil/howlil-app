---
title: 'Meets (Mentoring Platform)'
type: 'work'
date: '2024-07-01'
excerpt: 'Mentoring backend with approval-based scheduling, realtime session chat, asynchronous jobs, reminders, and payroll workflows.'
summary: 'A mentoring platform backend where scheduling, session state, realtime communication, and recurring operational jobs have explicit boundaries.'
caseStudySummary:
  problem: 'Mentoring operations combine user-driven scheduling with reminders, realtime sessions, payroll, and background work that may execute more than once.'
  decision: 'Keep the mentoring lifecycle in persisted API state, move suitable delivery work behind Kafka/cron, and make repeatable handlers validate current state.'
  result: 'Booking, session, reminder, chat, and payroll workflows are separated by responsibility instead of relying on request timing.'
tags: ['React', 'Vite', 'Node.js', 'Express', 'Sequelize', 'MySQL', 'Socket.io', 'Kafka', 'VideoSDK', 'Firebase']
featured: false
role: 'Backend engineer / workflow owner'
engineeringFocus: ['Workflow state', 'Async job boundaries', 'Realtime sessions']
---

## Context and ownership

Meets coordinates mentoring from scheduling and approval through session attendance, realtime chat, reminders, and mentor payroll. I owned the backend schema/API, Socket.io rooms, Kafka jobs, recurring cron work, and deployment automation.

The main engineering problem was deciding which state belongs to the request path and which work can happen later without corrupting the mentoring lifecycle.

## Persisted state owns the workflow

Scheduling, approval, rescheduling, attendance, and transaction changes are persisted through the API. Email, notifications, and recurring operational work can execute asynchronously.

Kafka moves suitable work away from the original request, but a consumer may retry or run late. Handlers therefore need to inspect persisted state before applying a reminder or transition. A schedule firing is not authority to mutate domain state blindly.

## Realtime has a separate boundary

Socket.io provides room-based session communication without polling. It does not own booking/session truth; clients can recover current state from the API if a realtime event is missed.

Because realtime and HTTP currently share an application boundary, horizontal scaling would require connection-aware routing or a shared adapter such as Redis. I treat that as a known limit rather than claiming the current topology scales horizontally by default.

## Recurring jobs must be repeatable

Reminder, status, payroll, export, and retry jobs run on schedules. Splitting jobs makes their failure scope clearer, but idempotency still depends on persisted predicates such as whether the logical work already happened or remains actionable.

Timezone handling is another correctness boundary because “day” drives payroll/reminder schedules.

## Result and limits

Meets demonstrates a useful backend rule: **background infrastructure moves work; persisted domain state decides whether that work is valid**.

I do not claim Kafka itself made the product scalable or that reminders measurably reduced no-shows; those outcomes were not instrumented.

The next hardening work is explicit retry/dead-letter policy, idempotency tests for recurring handlers, job metrics, centralized timezone rules, and a shared Socket.io strategy only if horizontal deployment is required.
