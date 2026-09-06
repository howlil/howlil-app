---
title: 'Meets (Mentoring Platform)'
type: 'work'
date: '2024-07-01'
excerpt: 'Mentoring backend with approval-based scheduling, realtime session chat, asynchronous jobs, reminders, and payroll workflows.'
summary: 'A mentoring platform backend where scheduling, session state, realtime communication, and recurring operational jobs share explicit lifecycle boundaries.'
caseStudySummary:
  problem: 'Mentoring operations combine user-driven scheduling with reminders, realtime sessions, recurring payroll, and background delivery that can execute more than once.'
  decision: 'Keep the core mentoring lifecycle in the API and database, isolate asynchronous work behind Kafka/cron boundaries, and make repeatable handlers depend on persisted state rather than timing assumptions.'
  result: 'Booking, session, reminder, chat, and payroll workflows are separated by responsibility, while retry and scheduling risks remain explicit instead of being hidden behind synchronous requests.'
tags: ['React', 'Vite', 'Node.js', 'Express', 'Sequelize', 'MySQL', 'Socket.io', 'Kafka', 'VideoSDK', 'Firebase']
featured: false
role: 'Backend engineer / workflow owner'
engineeringFocus: ['Workflow state', 'Async job boundaries', 'Realtime sessions']
---

## Context and ownership

Meets coordinates a mentoring journey that crosses several different kinds of state: a mentee requests a session, a mentor accepts or reschedules it, the session happens through video and realtime chat, reminders run in the background, and mentor payroll is processed on a recurring schedule.

I owned the backend data model and API flows for scheduling, subscriptions, transactions, session status, attendance, rescheduling, Socket.io chat rooms, Kafka-backed jobs, recurring cron work, and deployment automation.

The main engineering problem was not exposing more endpoints. It was deciding which work belongs to the request path and which work can happen later without corrupting the mentoring lifecycle.

## System constraints

Several invariants shape the backend:

- a session has one authoritative lifecycle even when multiple actors update it;
- retries must not send the same logical reminder or apply the same status transition repeatedly;
- background failures must not invalidate already-persisted mentoring state;
- realtime chat is part of a session context, not a separate source of booking truth;
- calendar dates used by recurring jobs need one explicit timezone convention.

These constraints matter because cron schedules and message consumers are timing mechanisms, not business-state authorities.

## Separating synchronous and asynchronous work

The HTTP API owns user-facing state changes such as scheduling, approval, rescheduling, attendance, and transaction updates. Email, notifications, periodic status work, and recurring operational jobs can run outside the original request.

Kafka was used to move suitable work away from the request path. That reduces coupling between a user action and slower delivery work, but it also introduces another failure boundary: a consumer can retry, restart, or process later than expected.

For that reason, handlers need to inspect persisted state before applying work. A reminder job should ask whether that logical reminder is still actionable; a status job should not blindly reapply a transition because its schedule fired again.

## Realtime sessions are a different scaling boundary

Socket.io provides room-based communication for a mentoring session without polling. It fits the interaction model, but it has different operational constraints from the stateless HTTP API.

In the current architecture, realtime and ordinary API traffic share an application boundary. Horizontal scaling would therefore require connection-aware routing or a shared Socket.io adapter such as Redis. I treat that as a known deployment limit rather than claiming the current topology is horizontally scalable by default.

## Recurring work and idempotency

Meets has recurring jobs for reminders, status updates, payroll, exports, and retries. Splitting those jobs keeps their schedules and failure modes understandable, but scheduling alone does not make them safe.

The important correctness rule is repeatability: if a job runs twice, the second execution should observe that the relevant logical work has already happened or is no longer valid. Persisted flags/state checks and progress logging are therefore more important than the exact cron expression.

## Evidence and result

The delivered backend connects scheduling, approval/reschedule state, attendance, realtime chat, asynchronous processing, reminders, and payroll without forcing all of those concerns into the same synchronous request path.

The project demonstrates a useful boundary: **background infrastructure can move work, but persisted domain state still decides whether that work is valid**.

I do not claim that Kafka by itself made the system scalable or that reminders measurably reduced no-shows; those outcomes were not instrumented in the project.

## Known limits

The current version still has clear hardening work:

- consumer retry/dead-letter policy should be explicit and observable;
- every recurring handler should have a documented idempotency key or state predicate;
- recurring job duration and failure metrics should be collected;
- horizontal Socket.io deployment needs a shared adapter or equivalent connection strategy;
- timezone handling should be centralized and tested around date boundaries.

Those are operational limits of the current design, not reasons to introduce more infrastructure before the workload requires it.
