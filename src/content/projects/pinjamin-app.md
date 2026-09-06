---
title: 'Pinjamin App (Campus Room Booking)'
type: 'academic'
date: '2024-09-01'
excerpt: 'Campus room-booking workflow with approval, Xendit payment callbacks, realtime status updates, and downloadable proof.'
summary: 'A booking application where business state, payment state, and realtime delivery remain separate concerns.'
caseStudySummary:
  problem: 'A booking can be approved before payment completes, while payment callbacks and realtime events arrive asynchronously and may repeat.'
  decision: 'Model booking and payment separately, let server-side callbacks own payment transitions, and keep Pusher as notification transport.'
  result: 'Approval, payment, refund, and user-facing updates can evolve without collapsing into one overloaded status field.'
tags: ['React', 'Vite', 'Chakra UI', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Pusher', 'Docker']
repository: 'https://github.com/howlil/pinjamin-app'
featured: false
role: 'Full-stack engineer / booking workflow owner'
engineeringFocus: ['Payment callbacks', 'Booking state', 'Realtime delivery']
---

## Context and ownership

Pinjamin digitizes campus room borrowing from request and approval through online payment, realtime status updates, and proof generation. I owned the backend/frontend flows, relational model, Xendit integration, Pusher updates, and deployment automation.

The hard part was keeping booking state correct after the original HTTP request ended and payment completion arrived later through a provider callback.

## Booking and payment have different authority

`Booking` represents the campus resource lifecycle; `Payment` represents provider/payment state. They are related but not interchangeable.

A webhook loads current persisted state before applying a valid transition. Repeated callbacks after finalization should become no-ops rather than rerunning fulfillment. Provider authenticity also needs verification at the callback boundary.

Application-state checks help with duplicate delivery, but database-level provider-event uniqueness would be a stronger concurrency guarantee when a stable event identifier is available.

## Realtime is not business truth

Pusher notifies borrowers/admins without polling. The API/database remains authoritative, so a missed event can be recovered by re-reading current booking state.

This keeps realtime delivery replaceable rather than making Pusher part of the booking state machine.

## Unresolved booking invariant

The project does not claim a fully transactional slot-reservation system. A check-then-insert availability path can race under simultaneous requests.

A production-hardening path would define the room/time overlap invariant and protect check-and-create with suitable transaction/locking or reservation semantics.

## Result and limits

Pinjamin separates approval, asynchronous payment, and realtime delivery into explicit boundaries. The core lesson is that **booking, payment, and notification are related state machines with different owners**.

The next hardening work is transactional conflict protection, database-level callback deduplication, transition tests, and reconciliation when realtime delivery is unavailable.
