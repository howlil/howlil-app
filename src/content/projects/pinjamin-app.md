---
title: 'Pinjamin App (Campus Room Booking)'
type: 'academic'
date: '2024-09-01'
excerpt: 'Campus room booking: book room, wait for approval, pay online (Xendit), get realtime notifications (Pusher) and download proof PDF. Replaces manual paper forms and bank transfers.'
tags: ['React', 'Vite', 'Chakra UI', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Pusher', 'Docker']
repository: 'https://github.com/howlil/pinjamin-app'
---

<!-- @format -->

## Problem Worth Solving

Campus room booking was manual: paper forms, bank transfers with no clear proof, booking status unclear. Borrowers and building admins kept refreshing for updates. We needed one app that manages buildings/rooms, booking status, integrated payment (Xendit), and realtime notifications (Pusher) without polling. Full flow: list buildings, submit booking, admin approval, pay online, get notified, download PDF proof.

## My Role & Ownership

I built backend and frontend: database (Building, Facility, FacilityBuilding, Booking, Payment), booking and approval flows, Xendit (invoice, Snap, refund, webhook), Pusher (realtime), PDF generation on client (@react-pdf/renderer), and Docker + GitHub Actions deployment. Architecture and tech decisions were mine.

## Key Engineering Decision

- **Xendit for payment and refund.** One provider for invoice and refunds. Snap/checkout URL for invoice. Webhook for status sync. Webhook must be idempotent. Verify signature. In dev you need a tunnel (ngrok) for callbacks.

- **Payment separate from Booking (1:1).** One booking, one payment. Refund needs the payment relation. Flow is clear. Payment and booking status must stay in sync. Webhook updates both.

- **Pusher for realtime notifications.** Borrowers and admins get updates without polling. Integration is simple. Depends on provider. Paid plan for production. Can fall back to polling if key/network fails.

- **Building + Facility + FacilityBuilding (many-to-many).** Facilities can be shared. Flexible query to filter buildings (e.g. projector). More complex relations than a JSON blob on building.

- **PDF generation on client.** Does not load the server. Proof can be downloaded in browser. Fine for single-page proof. Heavy docs might be slow on weak devices.

## One Hard Engineering Problem

Xendit webhooks can retry. Callback might arrive twice. Updating status without checking state can corrupt data (e.g. paid overwritten to expired). I designed an idempotent handler: check payment status before update. If already paid/expired, return early. Verify Xendit signature/token so only valid requests run. Log requestId for debugging. Retries stay safe, status stays consistent.

## Metrics & Impact

- One app for buildings, booking, payment, realtime notifications (Pusher), and PDF proof.
- Xendit handles invoice and refund. Payment status syncs via webhook.
- Docker and GitHub Actions simplify build and deploy. Swagger documents endpoints.

## What I'd Improve Next

- Model room availability: "slot" or "blocked schedule" so booking conflicts are checked automatically.
- Payment abstraction: "PaymentProvider" interface so switching from Xendit does not rewrite the whole module.
- Integration tests for booking, approve, pay, webhook, notification, refund.
- Fallback if Pusher fails: polling or check when page loads.

## Architecture

Monorepo with fe/ (React + Vite) and server/ (Express + Prisma). Stateless API. Frontend consumes API and Pusher for realtime. Xendit webhook receives callbacks. Handler is idempotent and verifies signature. PDF generated on client. Docker deploy. CI/CD via GitHub Actions.

## Failure & Risk Considerations

- Xendit webhook duplicate: mitigate with idempotent handler, status check before update, signature verification.
- Pusher failure: fallback to polling or check on page load.
- Booking without granular slots: conflicts checked in-app. Slot model can be added later.
- Client PDF: fine for single-page proof.
