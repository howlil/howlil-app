---
title: 'Fixolution App (Workshop & Parts Platform)'
type: 'work'
date: '2024-10-01'
excerpt: 'Two-sided platform connecting users with workshops: directory, service booking, spare parts e-commerce, and on-call service (Service to Go). Replaces manual search, booking, payment, and service requests.'
tags: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Vercel', 'Docker']
---

<!-- @format -->

## Problem Worth Solving

Finding a workshop, booking a service, buying spare parts, or requesting a home visit still often means phone calls, bank transfers with no clear proof, and messy schedule coordination. Booking status is unclear, payment receipts get lost. Existing tools are usually split: booking-only or e-commerce-only. We needed one system that ties together workshop directory, service booking, spare parts, and on-call service with clear status flow.

## My Role & Ownership

I designed and built the full backend and frontend: database schema (workshops, users, services, spare parts, brands, cart, transactions, bookings, servicetogo_request), main flows (cart to checkout, spare parts orders, service booking, Service to Go requests), photo upload and payment proof handling, and frontend deployment to Vercel. Architecture and tech decisions in this area were mine.

## Key Engineering Decision

- **Three actors, three token contexts.** Users buy and book. Workshops manage services and accept requests. Superadmin manages brands and global data. A single user table with roles mixes permissions and complicates middleware. I kept separate login contexts (user_id, bengkel_id, admin_id) in the JWT and wrote middleware that checks the right context per route. Downside: one polymorphic token, middleware must always check who is logged in.

- **Cart, Transaction, transaksi_sukucadang.** This chain keeps history and stock valid. Server-side price validation prevents client tampering. Need to sync cart with stock before checkout.

- **Service to Go with gmaps_link and status.** On-call service needs location and two-way communication. Users send location and description. Workshops accept or reject and can reply. Actual scheduling (when the technician comes) could stay outside the system or be a future feature.

- **Upload photos on server without object storage.** Keeps things simple for now, enough for early scale. For heavy image usage, plan a move to S3 or CDN later.

## One Hard Engineering Problem

Serving users, workshops, and superadmin from one database meant designing tokens and routes that do not clash. A single user table with roles made permissions messy and middleware confusing. I split login context (user_id, bengkel_id, admin_id) in the JWT and wrote middleware that picks the right context per route. One API serves all three actors without permission conflicts.

## Metrics & Impact

- One platform replaces manual flows: workshop directory, service booking, spare parts purchase, on-call requests.
- Central workshop dashboard. Payment proof and shipping address upload cut miscommunication.
- Transaction history is structured. Frontend on Vercel makes iteration fast.

## What I'd Improve Next

- Add payment gateway (Midtrans/Xendit) so transaction status updates automatically instead of manual verification.
- Validate booking slots: check date/time conflicts per workshop service before confirming.
- Abstract the upload layer (local vs S3/R2) so moving to object storage does not touch every controller.
- Add integration tests for cart to checkout to transaction and booking to workshop confirmation.

## Architecture

Stateless API with React frontend consuming it. Express + Prisma backend. Static frontend build deployed to Vercel. Photos stored on server (public/images/), URLs used in API and frontend.

## Failure & Risk Considerations

- Without a payment gateway, transaction status is not real-time. Mitigation: upload proof and manual verification by workshop/admin.
- File upload on server: risk of full disk if not monitored. Migration to S3/R2 later.
- Booking without granular slots: time conflicts possible. Slot validation can be added later.
- Polymorphic token: middleware must always check context. Wrong context could access wrong resources.
