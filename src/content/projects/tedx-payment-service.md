---
title: 'TEDx Payment Service'
type: 'work'
date: '2024-12-01'
excerpt: 'Duplicate-safe Xendit payment flow for ticket ordering and confirmation.'
summary: 'Ticket ordering and Xendit payment flow designed around asynchronous and repeated callback delivery.'
caseStudySummary:
  problem: 'Payment completes outside the checkout request, and provider callbacks can arrive late or more than once.'
  decision: 'Keep order and payment state explicit, then make webhook processing converge on persisted state before fulfillment.'
  result: 'Repeated delivery becomes a safe no-op after finalization, while confirmation follows the persisted payment result.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Docker']
featured: false
role: 'Backend engineer / service owner'
engineeringFocus: ['Payment state', 'Webhook handling', 'Idempotency']
verifiedEvidence:
  - 'Order creation persists pending business/payment state before the external payment completes.'
  - 'Webhook handling reloads persisted state and avoids re-applying finalization when repeated callback delivery arrives.'
  - 'The case study keeps the inventory race limitation explicit instead of claiming the current path is concurrency-safe.'
---

## Context and ownership

TEDx ticket sales needed an online order flow where payment completion happens asynchronously through Xendit.

I owned the order/payment data model, invoice integration, webhook handling, request-scoped logging, error handling, Docker packaging, and deployment workflow.

Creating an invoice was the easy part. The engineering problem was making the system correct when the original checkout request is already over and the provider later sends a callback that may be delayed or repeated.

## The synchronous request ends before payment does

The checkout path is intentionally small:

1. validate the order request;
2. persist pending order/payment state;
3. create the provider invoice and return its URL;
4. let payment complete outside the HTTP request;
5. process provider callbacks against the current persisted state;
6. trigger confirmation only after the application has accepted the payment transition.

The webhook is therefore a new delivery, not a continuation of step three. That distinction determines the idempotency and failure model.

## Business state and provider state are separate

`OrderStatus` represents the ticket-order lifecycle. `PaymentStatus` represents what is known about the external payment.

They are related, but forcing both into one field would make provider semantics leak into the business domain. A failed or expired payment can exist while the order record remains useful for reconciliation or expiry handling.

The webhook reads both persisted states before applying a transition. Finalization logic should only run when the current state permits it.

## Duplicate callbacks are expected

Provider callbacks can be retried. The current implementation treats a repeated callback after finalization as a no-op rather than executing fulfillment again.

That is an application-state idempotency boundary. It is useful, but it is not the strongest possible guarantee under concurrent callback processing.

A stronger design would persist a stable provider event identifier and enforce uniqueness in the database. If the provider does not expose an event ID suitable for that purpose, the application needs another deterministic idempotency key tied to the logical payment event.

## The inventory race is a different problem

Webhook idempotency does not make ticket inventory race-safe.

If two checkout requests both observe the last available ticket before either reservation commits, application-level availability checks can oversell even when payment callbacks are perfectly idempotent.

The correct hardening boundary is transactional reservation or atomic inventory mutation, with an expiry/cancellation path that releases reserved capacity.

During the delivered event flow, no oversell incident was observed. I treat that as an observed outcome—not proof of correctness under arbitrary concurrency.

## Confirmation is downstream of persisted payment truth

Email or other confirmation work should never be the authority for payment completion. The database records the accepted payment transition first; delivery happens afterward.

If notification delivery fails, the payment should remain paid. A durable outbox/worker would strengthen that boundary by making confirmation retryable without rerunning payment logic.

## Evidence and result

The delivered service separates order creation from asynchronous payment completion and handles repeated callbacks against persisted state. Request IDs also make an individual failing request traceable through application logs.

The central engineering lesson is that **payment correctness depends on state convergence and idempotency, not on assuming one callback arrives once in order**.

## Known limits

The current design should be hardened with transactional ticket reservation, database-enforced callback deduplication where possible, explicit callback authenticity verification, and a durable outbox for confirmation delivery. Those are correctness boundaries; adding unrelated infrastructure would not improve the payment flow.
