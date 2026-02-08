---
title: 'Surau Quran API'
type: 'work'
date: '2024-06-15'
excerpt: 'Backend for surau/TPA info system: students, teachers, programs, tuition payments (Xendit), attendance, and teacher payroll with fund disbursement. Single source of truth for data and finance.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'JWT', 'PM2']
---

<!-- @format -->

## Problem Worth Solving

Surau/TPA info systems are usually manual. Student data is separate from finance. Tuition paid via bank transfer with no automation. Teacher payroll is manual. We needed one API as the single source of truth for students, finance, and ops. Online payment (Xendit) for tuition and registration. Teacher payroll with disbursement. Deploy on-prem or shared hosting.

## My Role & Ownership

I built the backend API: database schema (User to Siswa/Guru/Admin, Program, Pendaftaran, SPP, Pembayaran, Absensi, Payroll), multi-role auth (Super Admin, Admin Surau, Admin, Guru, Siswa), Xendit (invoice for tuition and registration, payout for teacher salary), cron for scheduled jobs, and deploy with PM2 and clean shutdown (SIGTERM/SIGINT). Architecture and tech decisions were mine.

## Key Engineering Decision

- **Express + Prisma (MySQL). One monolithic API.** Fits Node ecosystem. Prisma gives type safety and clean migrations. Surau scale fits a monolith. Horizontal scaling would hit one app. Refactor to separate services only if really needed.

- **Xendit for payment and disbursement.** One provider for invoice (VA, e-wallet) and payout. Docs and SDK are clear. Locked into Xendit. Mitigate by abstracting the payment layer so switching provider is possible.

- **JWT-based multi-role auth.** Super Admin, Admin Surau, Admin, Guru, Siswa. Clear access boundaries. Token works for stateless API. Role sets permission per route.

- **User to Siswa/Guru/Admin schema.** Central login. One account has one role profile. Clear access control. Separate tables without User relation would duplicate login logic.

- **Cron for scheduled jobs. PM2 for production.** Reminders, cleanup, payment status sync. No external queue in v1. PM2 restarts on failure. Cron in-process can block on heavy jobs. Could move to job queue later.

## One Hard Engineering Problem

Xendit webhooks can retry. Callback might arrive twice. Accepting webhooks without verification risks spoofing. I designed the webhook handler with Xendit signature/token verification. Only valid requests are processed. Idempotency so duplicates do not double-update. Docs for ngrok setup in dev. Without a queue, heavy jobs can block. Not critical yet. Long-term plan: move heavy jobs to a queue.

## Metrics & Impact

- Online payment (VA, e-wallet) and disbursement integrated. One API as single source of truth for students and finance.
- Multi-role auth with clear access boundaries. PM2 and clean shutdown for on-prem deploy.

## What I'd Improve Next

- Payment abstraction: "PaymentProvider" interface from the start so switching from Xendit does not touch every controller.
- Domain-based folder structure: group routes/controllers by domain (auth, students, finance, payroll) for easier navigation.
- Object storage for uploads: plan S3/R2 early so production is not tied to server disk.
- Integration tests: critical flow registration, payment, activation for safe refactors.

## Architecture

Stateless monolithic API. One codebase, one database, one deployment. JWT-based auth with role. Token controls route access. Cron in-process for scheduled jobs. No external queue in v1. Deploy with PM2. Clean shutdown (SIGTERM/SIGINT) for graceful stop.

## Failure & Risk Considerations

- Monolith: horizontal scaling hits one app. Mitigate by refactoring to separate services only if needed.
- Cron in-process: heavy jobs can block. Mitigate by moving to job queue when traffic grows.
- Xendit webhook: public endpoint. Verify signature. Dev needs tunnel/ngrok. Mitigate with idempotent handler and logging.
- Xendit dependency: policy and cost lock-in. Mitigate with payment abstraction.
- Local upload: no object storage. Production at scale prefers S3/R2. For surau scale it is acceptable.
