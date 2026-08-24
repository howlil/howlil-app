---
title: 'TEDx Payment Service'
type: 'work'
date: '2024-12-01'
excerpt: 'Payment service for TEDx ticketing: ticket windows, orders, Xendit invoices, duplicate-safe webhook state updates, and confirmation flow. The interesting part is preserving payment/order correctness across asynchronous callbacks.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Nodemailer', 'Docker']
featured: true
featuredRank: 1
role: 'Backend engineer / service owner'
engineeringFocus: ['Payment state', 'Idempotency', 'Webhooks', 'Failure handling']
verifiedEvidence:
  - 'Duplicate webhook delivery guarded by existing payment/order state'
  - 'Order and payment modeled as separate state machines'
  - 'Request IDs included in production-oriented logging/error responses'
---

## Problem Worth Solving

TEDx ticket sales needed more than a checkout endpoint. Ticket availability changes over time, payment completion is asynchronous, callbacks may be delivered more than once, and the application must not accidentally fulfill the same order twice.

I separated the payment concern from the event frontend so clients could work through a small contract: list tickets, create an order, receive an invoice URL, then let the payment provider drive the final state through a callback.

## My Role & Ownership

I designed and implemented the service data model, order/invoice flow, Xendit integration, callback handling, duplicate-delivery guards, request-scoped logging, error handling, Docker packaging, and deployment workflow.

A key rule for this case study is to separate **what exists** from **what production hardening is still missing**. Provider callback authenticity verification, authenticated order creation, and stock reservation are listed as gaps rather than presented as completed work.

## System Flow

```text
Client
  |
  | POST /orders
  v
Payment API
  |
  | create PENDING order + payment record
  v
MySQL
  |
  | create invoice
  v
Xendit
  |
  | invoice URL
  +-------------------------> Client
  |
  | asynchronous callback
  v
Webhook handler
  |
  | 1. locate payment/order
  | 2. inspect current state
  | 3. ignore already-finalized delivery
  | 4. apply valid transition
  v
MySQL
```

The important boundary is the callback: the request can be repeated independently of the original order request, so correctness cannot depend on "this callback only happens once".

## Correctness Model

The system is easier to reason about when the important invariants are explicit:

1. **A finalized payment must not be fulfilled twice.** Repeated callbacks should converge to the same final state.
2. **Order state and payment state are related but not identical.** Payment provider lifecycle should not collapse every business state into one enum.
3. **A final state should not silently regress.** A previously `PAID` record must not be overwritten by a later duplicate/expired callback without an explicitly valid transition.
4. **Ticket inventory must never become negative.** This invariant is *not fully protected yet* because proper reservation/decrement logic is still an improvement item.

## Key Engineering Decisions

### Separate `OrderStatus` and `PaymentStatus`

`Order` uses business-facing states such as `PENDING`, `PAID`, `CANCELLED`, and `EXPIRED`, while `Payment` tracks the provider-facing lifecycle. Keeping them separate is slightly more verbose, but it avoids coupling the entire order domain to a provider-specific event model.

### Idempotent callback handling

Xendit may retry callbacks. The handler checks the existing payment/order state before applying an update and returns early for an already-finalized delivery. That makes duplicate delivery safe at the application-state level.

A stronger production version would also persist a provider event identifier and enforce uniqueness at the database boundary. The current implementation primarily protects through state checks.

### Request-scoped logging

Each request gets a request ID that is included in logs and error responses. The intent is not "more logging"; it is making one failed request traceable through multiple log statements.

Fatal process errors are logged. In a mature runtime, an uncaught exception should generally cause the process to terminate and be restarted by a supervisor rather than continuing from potentially corrupted in-memory state.

## One Hard Engineering Problem

The hardest part is not creating an invoice; it is handling **at-least-once delivery semantics** from an external provider.

A naive handler does this:

```text
callback -> update order -> send confirmation
```

and assumes the callback is unique. Under retry, that can repeat side effects.

The safer mental model is:

```text
callback
  -> identify aggregate
  -> inspect current state
  -> decide whether transition is still valid
  -> apply transition once
  -> make downstream side effects retry-safe
```

The implemented state guard covers duplicate status updates. A production-grade next step is extending the same idempotency boundary to every downstream side effect such as inventory reservation and email/ticket fulfillment.

## Failure Modes

| Failure | Current behavior / protection | Remaining gap |
| --- | --- | --- |
| Duplicate callback | Existing final state is checked before updating | Persist provider event ID + DB uniqueness |
| Callback arrives late | Final state guard prevents simple regression | Formal transition table would be clearer |
| Invalid/spoofed callback | Not claimed as fully solved | Add provider-authenticity verification |
| Two users race for last ticket | Not fully solved | Transactional reservation / atomic stock decrement |
| SMTP failure after payment | Payment state can still be persisted | Durable outbox/queue for notification retry |
| Process crashes mid-request | Persistent DB state survives | Supervised restart + stronger atomic side-effect design |

## Evidence & Impact

The verified engineering value of this project is structural rather than a synthetic benchmark:

- duplicate payment callbacks are handled as a normal delivery condition instead of an exceptional assumption;
- payment and order states are modeled separately, making transitions easier to reason about;
- request IDs make a failing request traceable in logs;
- the service is isolated behind a small integration surface rather than embedding payment logic directly into a frontend.

I intentionally do not publish throughput or latency numbers here because this version was not benchmarked under a controlled load test.

## What I'd Improve Next

1. **Transactional ticket reservation.** Reserve/decrement inventory atomically and restore it when an order expires or is cancelled.
2. **Provider authenticity verification.** Validate the callback using the exact Xendit verification mechanism configured for the integration.
3. **Database-backed idempotency.** Persist callback/event IDs with a unique constraint instead of relying only on state guards.
4. **Authenticated order creation and rate limiting.** Protect write endpoints at the appropriate service/gateway boundary.
5. **Durable notification delivery.** Use an outbox/job queue so email/QR delivery can retry independently after payment is committed.
6. **Integration tests.** Exercise create-order → provider callback → duplicate callback → final-state assertions.

## Architecture Trade-off

This is deliberately a small stateless service rather than a broad "payments platform". That keeps deployment and integration simple, but it also means concerns such as inventory reservation, event durability, and identity boundaries must be added deliberately as requirements become real. The project is most useful as evidence of reasoning about asynchronous state—not as a claim that every payment-platform concern is already solved.
