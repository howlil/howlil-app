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
---

## Context

TEDx ticket sales needed an online ordering flow where payment completion happened asynchronously through Xendit. Creating an invoice was straightforward; keeping order state correct when callbacks arrived later or more than once was the part that mattered.

I owned the order and payment data model, invoice integration, callback handling, request-scoped logging, error handling, Docker packaging, and deployment workflow.

## The payment path

The service keeps the synchronous checkout path small:

1. the client submits an order;
2. the API validates the request and creates pending order/payment state;
3. Xendit returns an invoice URL;
4. payment completes outside the request lifecycle;
5. Xendit calls the webhook endpoint;
6. the handler loads the current state and applies a valid transition;
7. confirmation is sent after the persisted state reflects the payment result.

The important consequence is that the webhook is not a continuation of the original HTTP request. It is a separate delivery that can be delayed, repeated, or arrive after another state change.

## Why order and payment stay separate

`OrderStatus` represents the business lifecycle. `PaymentStatus` represents the provider/payment lifecycle. They move together, but they are not the same state machine.

Keeping them separate adds a little schema and transition code, but it prevents provider-specific events from becoming the business domain. It also makes states such as “payment failed but order still exists” explicit instead of forcing everything into one overloaded status field.

## Duplicate callbacks are a normal case

The handler reads existing state before applying a callback. If the order/payment is already finalized, the repeated delivery becomes a no-op instead of executing fulfillment again.

That is the core idempotency boundary in this version: duplicate delivery is expected behavior, not an exceptional path.

A stronger implementation would persist the provider event identifier and enforce uniqueness in the database so the idempotency guarantee does not depend only on application-state checks.

## Failure cases

| Failure | Current behavior | Better boundary |
| --- | --- | --- |
| Duplicate callback | Finalized state is checked before update | Persist provider event ID with a unique constraint |
| Late callback | Final state does not simply regress | Explicit transition table |
| Race for last ticket | Application logic alone is insufficient | Transactional reservation / atomic decrement |
| Notification failure | Payment state remains persisted | Durable outbox or job queue |

## Result

The delivered flow separated order creation from payment completion and treated repeated callbacks as a normal delivery condition. Request IDs also made a failing request traceable across application logs instead of relying on ad-hoc log messages.

During the delivered event flow, no oversell incident was observed. I treat that as an observed outcome, not as proof that the inventory path is race-safe under arbitrary concurrency.

## What I'd change today

1. Make ticket reservation transactional and restore inventory on expiry/cancellation.
2. Persist provider event IDs with a unique constraint and verify callback authenticity.
3. Move email/confirmation delivery behind an outbox or durable worker.
