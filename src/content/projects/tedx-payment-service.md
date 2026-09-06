---
title: 'TEDx Payment Service'
type: 'work'
date: '2024-12-01'
excerpt: 'Duplicate-safe Xendit payment flow for ticket ordering and confirmation.'
summary: 'Ticket ordering and Xendit payment flow designed around asynchronous and repeated callback delivery.'
caseStudySummary:
  problem: 'Payment completes outside checkout, and provider callbacks can arrive late or more than once.'
  decision: 'Keep order/payment state explicit and make webhook processing converge on persisted state before fulfillment.'
  result: 'Repeated delivery becomes a safe no-op after finalization while confirmation follows persisted payment truth.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Docker']
featured: false
role: 'Backend engineer / service owner'
engineeringFocus: ['Payment state', 'Webhook handling', 'Idempotency']
verifiedEvidence:
  - 'Order creation persists pending business/payment state before external payment completes.'
  - 'Webhook handling reloads persisted state and avoids re-applying finalization after repeated delivery.'
  - 'The inventory race remains an explicit limitation rather than a claimed concurrency guarantee.'
---

## Context and ownership

TEDx ticket sales needed an order flow where Xendit payment completes after the original checkout request. I owned the order/payment model, invoice integration, webhook handling, request logging, packaging, and deployment workflow.

Creating an invoice was straightforward. Correctness depended on what happened when callbacks arrived later or more than once.

## Checkout and payment are separate lifecycles

The API persists pending order/payment state before returning an invoice URL. Payment then completes outside that HTTP request, and the provider later calls a webhook.

`OrderStatus` represents business state; `PaymentStatus` represents provider/payment state. Keeping them separate avoids turning provider events into the entire order domain.

## Duplicate callbacks are normal

The webhook loads current persisted state before applying a transition. If finalization already happened, repeated delivery becomes a no-op instead of executing fulfillment again.

That is application-state idempotency. A stronger concurrent guarantee would persist a stable provider event/idempotency key with database uniqueness where the provider contract permits it.

## Idempotent payment does not solve inventory races

Two checkouts can still race for the final ticket if availability is checked separately from reservation. The production-hardening boundary is transactional reservation or atomic inventory mutation with expiry/cancellation release.

No oversell incident was observed in the delivered event flow, but I do not treat that as proof of race safety.

## Result and limits

The service separates order creation from asynchronous payment completion and treats repeated callbacks as expected delivery behavior.

The core lesson is: **payment correctness comes from state convergence and idempotency, not from assuming one callback arrives exactly once**.

Next hardening: transactional ticket reservation, database-level callback deduplication, explicit callback authenticity verification, and durable confirmation delivery/outbox semantics.
