---
title: 'Tangkapin (Weapon Detection & CCTV Reporting)'
type: 'hackathon'
date: '2024-11-01'
excerpt: 'Weapon detection from CCTV with ML (PyTorch): auto detection, report and evidence, realtime notification to CCTV owner and police. Verification, officer assignment, GPS tracking. Replaces manual monitoring and coordination.'
tags: ['Flutter', 'Next.js', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Python', 'PyTorch', 'Pusher', 'Docker']
repository: 'https://github.com/howlil/tangkapin-server'
---

<!-- @format -->

## Problem Worth Solving

Manual CCTV monitoring does not scale. Coordination with police is slow. Existing solutions rarely combine computer vision (weapon detection), reporting backend, and realtime notifications. We needed one ecosystem: auto detection from CCTV (ML PyTorch), reporting and assignment backend, realtime multi-role notifications, and clear flow from detection to report to verification to assignment to tracking.

## My Role & Ownership

I built the backend API and coordinated the ML service: database schema (Owner, Officer, Police, CCTV, Report, Evidence, Assignment, Tracking, Notification, AuditLog), Pusher (realtime), detection API contract, status flow (new, assigned, in_progress, verified, completed/rejected), and Docker deployment (API + ML). Architecture and tech decisions were mine.

## Key Engineering Decision

- **Three roles: Owner, Officer, Police. Separate Prisma models.** Owner is CCTV owner and notification recipient. Officer is police admin (verify, assign). Police is field officer (tracking). Permission split is clear. One User plus role table would be simpler but less explicit. Separate models make permissions easier.

- **ML service separate (Python/Flask). PyTorch model runs in its own process.** Express API calls detection endpoint. Different stack (Node vs Python). Two processes/containers to run. If ML is down, auto detection stops. Manual report still works. Need health check and restart policy.

- **Pusher for realtime multi-role notifications.** Owner, Officer, Police get updates without polling. Integration is simple. Depends on provider. Paid plan for production. Mock for development.

- **Clear report status flow.** new, assigned, in_progress, verified, completed/rejected. Audit log for who did what. Status gets complex. Need consistency between frontend and API.

- **Tracking with lat, lng, status.** Officers send location and status (on_the_way, arrived, completed). Owner/police see distance and ETA. GPS sync. Update rate affects bandwidth.

## One Hard Engineering Problem

API and ML had to stay in sync. The detection contract (cctv_id, report_image base64, incident_type) had to be clear so ML and API stayed consistent. Calling ML without a fixed format could cause mismatches (e.g. different image format, incident_type not matching). I designed the detection API contract documented in apispek.md: request format (base64 image, metadata), response format (detected, incident_type, confidence), error handling. ML and API stay aligned. Docker Compose runs both in one env. HTTP communication with timeout and retry.

## Metrics & Impact

- Auto detection from ML triggers reports. Realtime notifications to Owner and police cut coordination time.
- GPS tracking gives distance and ETA until help arrives.
- ML failure does not break the flow. Manual report still works. Isolation via two services.

## What I'd Improve Next

- Notification abstraction: "RealtimeChannel" interface so switching from Pusher to Socket.io does not touch every module.
- Robust detection pipeline: frame queue, retry on ML failure, fallback to manual report if detection is not available.
- Integration tests: detection, create report, notification, verify, assign, update tracking. Ensure roles and permissions stay consistent.
- ML monitoring: log latency and detection results so model drift is visible.

## Architecture

Two services: API (Node.js, Express, Prisma, PostgreSQL) and ML (Python/Flask, PyTorch). API receives detection result from ML or manual report from Owner. Stores Report, Evidence, Assignment, Tracking. Sends realtime notifications via Pusher. Docker Compose runs API and ML. HTTP between them. Web client (Next.js) for Officer/Police. Mobile (Flutter) for Owner.

## Failure & Risk Considerations

- Two services (API + ML): if ML is down, auto detection stops. Mitigate with manual report. Health check and restart policy.
- Pusher: provider dependency. Mitigate with mock for dev. Paid plan for production.
- CCTV feed to ML: stream format and how frames reach ML must be agreed. Latency and network load matter.
- Token and role auth: middleware must consistently check role.
- Three repos: API changes must sync with client and mobile. apispek.md helps keep contract clear.
