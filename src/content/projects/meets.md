---
title: 'Meets (Mentoring Platform)'
type: 'work'
date: '2024-07-01'
excerpt: 'Full mentoring platform: mentee picks mentor, subscribes, schedules sessions, pays. Sessions via video call (VideoSDK) and realtime chat (Socket.io). Mentor manages schedule, approve/reject/reschedule, and gets payroll. Heavy jobs via Kafka so the API stays responsive.'
tags: ['React', 'Vite', 'Node.js', 'Express', 'Sequelize', 'MySQL', 'Socket.io', 'Kafka', 'VideoSDK', 'Firebase']
---

<!-- @format -->

## Problem Worth Solving

Mentor–mentee coordination is usually manual: WhatsApp, email, transfers with no clear status. Schedules clash, reminders get forgotten, payroll is manual. Existing tools rarely combine mentor directory, approval-based booking, video call, realtime chat, and ops (payroll, exports) in one place. We needed one app that covers registration to payroll. Heavy jobs (email, notifications, status updates) offloaded to Kafka so the API stays responsive.

## My Role & Ownership

I built the backend (api/): database schema (Sequelize + MySQL), mentoring flows (schedule, subscription, transactions, session status, reschedule, attendance), Socket.io chat rooms, Kafka producer/consumer for async jobs, cron for reminders and payroll, and deployment via GitHub Actions to staging and production. Architecture and tech decisions were mine.

## Key Engineering Decision

- **Kafka for async job queue.** Email, notifications, and status updates go to consumers so they do not block the API. Clear decoupling. Downside: extra infra (broker). For small scale it might be overkill, but it makes adding consumers easy.

- **Socket.io for chat room per session.** Two-way realtime without polling. Simple integration in backend and frontend. Scaling horizontally needs sticky session or Redis adapter. Realtime and HTTP share the same process.

- **Mentoring flow with status, reschedule, attendance.** Flow: request, approve/reject, schedule, mentor/mentee present, testimonial. Fields: is_reschedule, cancelation_reason, is_reminded. Schema gets complex. Handlers must be idempotent.

- **Separate cron per job.** Reminder (every minute), status update (hourly), payroll (26th), mentee journey (1st), transaction export (daily), email retry (every 5–6 hours). One heavy cron can timeout. Splitting helps with monitoring. All handlers must be idempotent.

## One Hard Engineering Problem

Cron and Kafka consumers need clear error handling and retries. Without idempotency, reminders can send twice and status can update repeatedly. I designed idempotent handlers: check state before processing (e.g. "reminder sent", "status updated"), log progress, keep operations repeatable. Retries stay safe, data stays consistent. Timezone and "day" (date) for cron (1st, 26th) must be consistent on the server.

## Metrics & Impact

- API stays responsive even when heavy jobs run async via Kafka.
- Automatic session reminders cut no-shows. Mentor payroll is automated.
- One job failing does not affect the main flow. Isolation via Kafka consumers.

## What I'd Improve Next

- Notification abstraction: one "NotificationChannel" interface (email, SMS, push) so adding channels or changing providers does not spread across files.
- Ensure all cron and consumer handlers are idempotent and log progress for safe retries.
- Integration tests for request, approve, reminder, attendance, testimonial.
- Cron monitoring: log or metric per job duration so slow jobs show up.

## Architecture

Stateless API with heavy work separated via Kafka. Realtime chat via Socket.io (room per session). Separate cron per job. Video call on client via VideoSDK.

## Failure & Risk Considerations

- Cron overlap: mitigate by splitting per job, idempotent handlers, log duration for monitoring.
- Kafka consumer failure: needs retry and dead-letter. Idempotent design and progress logging.
- Socket.io + monolithic API: horizontal scaling needs sticky session or Redis adapter.
- Timezone: cron must use consistent server timezone (UTC or explicit).
