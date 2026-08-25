---
title: 'TEDx Payment Service'
type: 'work'
date: '2024-12-01'
excerpt: 'Payment service for TEDx ticketing: ticket windows, orders, Xendit invoices, duplicate-safe webhook state updates, and confirmation flow.'
summary: 'Ticket ordering and payment processing with asynchronous Xendit callbacks and duplicate-safe state transitions.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Nodemailer', 'Docker']
featured: true
featuredRank: 1
role: 'Backend engineer / service owner'
engineeringFocus: ['Payment state', 'Idempotency', 'Webhooks', 'Failure handling']
verifiedEvidence:
  - 'Duplicate webhook delivery guarded by existing payment/order state'
  - 'Order and payment modeled as separate state machines'
  - 'Request IDs included in production-oriented logging/error responses'
diagrams:
  - kind: 'architecture'
    title: 'Architecture'
    src: '/diagrams/tedx-payment/architecture.svg'
    source: 'https://github.com/howlil/howlil-app/blob/main/diagrams/plantuml/tedx-payment/architecture.puml'
    alt: 'Architecture diagram showing the client, Payment API, MySQL, Xendit, webhook handler, and notification boundary.'
    caption: 'The service keeps payment integration behind a small API boundary; Xendit callbacks re-enter the system independently through the webhook handler.'
  - kind: 'sequence'
    title: 'Payment and webhook flow'
    src: '/diagrams/tedx-payment/sequence.svg'
    source: 'https://github.com/howlil/howlil-app/blob/main/diagrams/plantuml/tedx-payment/sequence.puml'
    alt: 'Sequence diagram showing order creation, invoice creation, asynchronous Xendit callback, state lookup, and duplicate-safe update.'
    caption: 'The callback is modeled as at-least-once delivery: the handler loads current state before deciding whether a transition is still valid.'
  - kind: 'state'
    title: 'Order and payment state model'
    src: '/diagrams/tedx-payment/state.svg'
    source: 'https://github.com/howlil/howlil-app/blob/main/diagrams/plantuml/tedx-payment/state.puml'
    alt: 'State diagram separating order lifecycle from payment-provider lifecycle and showing duplicate callbacks as no-op transitions.'
    caption: 'Order state and payment state remain separate so provider lifecycle does not become the business-domain state model.'
  - kind: 'domain'
    title: 'Core domain model'
    src: '/diagrams/tedx-payment/domain.svg'
    source: 'https://github.com/howlil/howlil-app/blob/main/diagrams/plantuml/tedx-payment/domain.puml'
    alt: 'Domain model showing relationships among Order, Payment, Ticket, OrderItem, and WebhookEvent.'
    caption: 'The model makes the order/payment boundary explicit. WebhookEvent represents the stronger database-backed idempotency boundary planned for production hardening.'
---

## Problem

TEDx ticket sales needed more than a checkout endpoint. Payment completion is asynchronous, callbacks may be delivered repeatedly, and the application must not fulfill the same order twice.

The service exposes a small contract: list tickets, create an order, receive an invoice URL, then let the payment provider drive the payment transition through a callback.

## Ownership

I designed and implemented the data model, order and invoice flow, Xendit integration, callback handling, duplicate-delivery guards, request-scoped logging, error handling, Docker packaging, and deployment workflow.

Provider callback authenticity verification, authenticated order creation, transactional stock reservation, and durable notification delivery are not presented as completed work.

## Correctness

The implementation is organized around four invariants:

1. **A finalized payment must not be fulfilled twice.** Repeated callbacks converge on the same final state.
2. **Order and payment state are related but distinct.** Provider lifecycle does not replace the business-domain lifecycle.
3. **Final state must not silently regress.** A later duplicate or expired callback cannot overwrite a previously final state without a valid transition.
4. **Ticket inventory must never become negative.** This is a known gap until reservation/decrement becomes transactional.

## Engineering decisions

### Separate order and payment state

Keeping `OrderStatus` and `PaymentStatus` separate is more verbose, but it prevents the order domain from being coupled directly to provider-specific events.

### Treat callbacks as at-least-once delivery

The handler checks existing payment/order state before applying an update and returns early for already-finalized delivery. This protects duplicate status updates at the application-state boundary.

A stronger version should also persist a provider event identifier and enforce uniqueness in the database.

### Request-scoped logging

Each request receives a request ID included in logs and error responses so one failed request can be traced across multiple log entries.

## Failure modes

| Failure | Current protection | Remaining gap |
| --- | --- | --- |
| Duplicate callback | Final state checked before update | Persist event ID + unique constraint |
| Late callback | Final-state guard prevents simple regression | Formal transition table |
| Spoofed callback | Not claimed as solved | Provider authenticity verification |
| Race for last ticket | Not fully solved | Transactional reservation / atomic decrement |
| SMTP failure after payment | Payment state remains persisted | Durable outbox / job queue |
| Process crash mid-request | Persistent DB state survives | Stronger atomic side-effect design |

## Evidence

- duplicate callbacks are handled as a normal delivery condition rather than assumed impossible;
- payment and order states are modeled separately;
- request IDs make failing requests traceable in logs;
- payment logic is isolated behind a small integration surface.

No throughput or latency claim is published because this version was not benchmarked under a controlled load test.

## Next improvements

1. Transactional ticket reservation with restore-on-expiry/cancellation.
2. Provider callback authenticity verification.
3. Database-backed event idempotency with a unique constraint.
4. Authenticated order creation and rate limiting.
5. Durable notification delivery through an outbox or job queue.
6. Integration tests covering create order → callback → duplicate callback → final-state assertions.

## Trade-off

This remains a small stateless service rather than a broad payments platform. The smaller boundary keeps deployment and integration understandable, while inventory reservation, event durability, identity, and side-effect orchestration must be added explicitly as requirements grow.
