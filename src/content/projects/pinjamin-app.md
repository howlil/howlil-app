---
title: 'Pinjamin App (Campus Room Booking)'
type: 'academic'
date: '2024-09-01'
excerpt: 'Campus room-booking workflow with approval, Xendit payment callbacks, realtime status updates, and downloadable proof.'
summary: 'A booking application where business state, payment state, and realtime notification delivery are kept as separate concerns.'
caseStudySummary:
  problem: 'A room booking can be approved before payment completes, while payment callbacks and realtime events arrive asynchronously and may be delivered more than once.'
  decision: 'Model booking and payment separately, let server-side callback handling own payment transitions, and treat Pusher as notification transport rather than booking truth.'
  result: 'Booking approval, payment status, refund handling, and user-facing updates can evolve independently instead of collapsing into one overloaded status field.'
tags: ['React', 'Vite', 'Chakra UI', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Pusher', 'Docker']
repository: 'https://github.com/howlil/pinjamin-app'
featured: false
role: 'Full-stack engineer / booking workflow owner'
engineeringFocus: ['Payment callbacks', 'Booking state', 'Realtime delivery']
---

## Context and ownership

Pinjamin replaces a manual campus room-borrowing flow with one application for room discovery, booking requests, administrative approval, online payment, status updates, and downloadable proof.

I owned the backend and frontend flows, the relational model for buildings, facilities, bookings, and payments, the Xendit integration, Pusher-based realtime updates, PDF proof generation, and deployment automation.

The hard part was not creating an invoice. It was keeping booking state correct when payment completion happens outside the original request and provider callbacks can be delayed or repeated.

## Booking state and payment state are different

The implementation keeps `Booking` and `Payment` as separate records. A booking describes the campus resource workflow; a payment describes the provider/payment lifecycle.

Those records are related, but they are not interchangeable. A provider callback should update payment state first and only apply a booking transition that is valid from the persisted business state.

This avoids a common failure mode where one generic `status` field tries to represent approval, invoice creation, payment completion, cancellation, and refund at the same time.

## Webhooks are independent deliveries

Xendit callbacks do not continue the checkout HTTP request. They are separate requests that may arrive later or more than once.

The handler therefore reads current state before applying a transition and treats an already-finalized callback as a repeatable no-op. Callback authenticity also needs to be verified using the provider’s supported verification mechanism.

Application-level state checks make duplicate delivery safer, but they are not the strongest possible guarantee. Persisting a provider event identifier with a database uniqueness constraint would make replay handling more explicit under concurrency.

## Realtime is presentation, not authority

Pusher sends booking/payment updates to borrowers and administrators without polling. That improves immediacy, but a missed realtime event must not mean the booking is lost or inconsistent.

The database/API remains authoritative. A reconnect or page refresh can recover current state even if a realtime notification was not delivered.

That distinction also makes Pusher replaceable: it is a delivery channel over persisted state rather than a dependency that defines the state machine.

## The unresolved booking invariant

The current project does not implement a full transactional reservation system for time slots. That matters because checking availability and then inserting a booking in separate unprotected operations can race under simultaneous requests.

A production-hardening path would define a canonical room/time overlap invariant and protect the check-and-create operation with an appropriate transaction/locking or reservation model. I do not claim the current booking path is concurrency-safe without that evidence.

## Evidence and result

The delivered flow separates room approval from asynchronous payment completion and keeps realtime updates recoverable from persisted API state. It also makes duplicate webhook delivery an expected condition instead of assuming exactly-once callbacks.

The useful engineering lesson was that **booking, payment, and notification are three related state machines with different owners**.

## Known limits

The next hardening work is transactional slot conflict protection, provider-event deduplication at the database level, transition-table tests for payment/refund callbacks, and a fallback/reconciliation path when realtime delivery is unavailable. Those changes strengthen correctness without changing the product’s core architecture.
