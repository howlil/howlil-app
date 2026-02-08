---
title: 'TEDx Payment Service'
type: 'work'
date: '2024-12-01'
excerpt: 'Payment microservice for TEDx events: ticket catalog (validFrom/validUntil), orders (user + ticket items), Xendit invoice (VA, e-wallet), idempotent webhook for status sync, confirmation email. Replaces manual ticket sales and payment verification.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Nodemailer', 'Docker']
---

<!-- @format -->

## Problem Worth Solving

TEDx events need managed ticket sales (price, quota, early bird/close period) and integrated online payment. Existing solutions are often monolithic and hard to integrate with different clients. We needed a separate service focused on payment: ticket catalog, order, invoice, webhook. So the event frontend and finance team can track transactions without tight coupling.

## My Role & Ownership

I built the payment microservice: database (User, Ticket, Order, OrderItem, Payment), Xendit (invoice, webhook), idempotent webhook handler and signature verification, requestId logging, error handling (uncaughtException, unhandledRejection), and Docker + CI/CD deployment. Architecture and tech decisions were mine.

## Key Engineering Decision

- **Model: User, Ticket, Order, OrderItem, Payment.** Order has many OrderItems (ticket + quantity + price). One Order, one Payment (1:1). Clear relations for invoice and history. Order with User stored for TEDx. User only lives here. No SSO or sync with event user system. Could duplicate if the event has its own users.

- **Ticket with validFrom/validUntil.** Tickets only sellable in a time window. Early bird or close period. Easier to manage phases. Stock without period is less flexible.

- **OrderStatus and PaymentStatus separate.** Order: PENDING, PAID, CANCELLED, EXPIRED. Payment: PENDING, PAID, EXPIRED, FAILED. Order status follows payment but can handle cancel/expire flows. More flexible. Single combined status would be simpler but less flexible.

- **Webhook endpoint with idempotent handler and signature verification.** Xendit calls on payment complete/expired. Idempotent so duplicates do not double-update. Verify so only valid requests run. Follow Xendit docs. Keep header/signature verification consistent.

- **Logging with requestId. Global error handling.** Winston + daily rotate. Every request has requestId for debugging. Error response returns requestId. uncaughtException and unhandledRejection so we do not silently fail. Without requestId, errors are hard to trace in production. Without global handler, process can zombie.

## One Hard Engineering Problem

Xendit can resend webhook callbacks. The handler must be idempotent so payment/order status is not double-updated. Updating status without checking state can corrupt data (e.g. paid overwritten to expired). I designed an idempotent handler: check payment/order status before update. If already PAID/EXPIRED, return early. Verify Xendit signature/token so only valid requests run. Log requestId for debugging. Retries stay safe, status stays consistent. Error response returns requestId so clients can find it in logs.

## Metrics & Impact

- One service for catalog, order, invoice, webhook. Idempotent webhook keeps status consistent even when callbacks repeat.
- Logging with requestId makes production errors easier to trace.
- Separate service makes integration with different clients straightforward.

## What I'd Improve Next

- Reduce ticket stock on order: decrement Ticket.amount (or use reserved stock) to avoid oversell. Restore if order expires/cancelled.
- Webhook verification: validate header/signature in callback handler so only valid requests run.
- Auth or API key: for production, add API key or JWT for POST orders.
- Integration tests: create order, get invoice URL, simulate webhook paid, check order and payment status.

## Architecture

Stateless microservice. Three main endpoints: GET tickets (catalog), POST orders (create order, return invoice URL), POST payment-callback (Xendit webhook). Minimal API for easy integration. Logging with requestId. Error response returns requestId. Winston + daily rotate for logs. Docker for deploy. CI/CD via GitHub Actions.

## Failure & Risk Considerations

- Webhook duplicate: Xendit can resend. Mitigate with idempotent handler, status check before update, signature verification.
- User only here: no SSO. Duplication if event has its own users. Mitigate with mapping or integration later.
- No auth on endpoints: GET tickets and POST orders callable by anyone. Mitigate with API key or rate limit at gateway.
- Ticket quota: amount decrement on order needs to be implemented to avoid oversell. Restore if order expired/cancelled.
- Email: Nodemailer depends on SMTP. "Send email after paid" can be added to webhook handler.
