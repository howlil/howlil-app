---
title: 'Fixolution App (Workshop & Parts Platform)'
type: 'work'
date: '2024-10-01'
excerpt: 'Multi-actor workshop platform covering service booking, spare-part checkout, payment-proof handling, and on-call service requests.'
summary: 'A workshop marketplace where user, workshop, and administrator actions share one backend while authorization and transaction state stay explicit.'
caseStudySummary:
  problem: 'Booking, commerce, and on-call service flows involve different actors and state transitions, making authorization mistakes and inconsistent transaction state easy to introduce.'
  decision: 'Keep actor context explicit at the API boundary, validate prices and transaction state on the server, and model booking, cart, payment proof, and service requests as separate domain records.'
  result: 'The backend supports the three actor workflows without relying on frontend-only permissions or client-supplied transaction truth.'
tags: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Vercel', 'Docker']
featured: false
role: 'Full-stack engineer / application owner'
engineeringFocus: ['Authorization boundaries', 'Transaction state', 'Booking workflow']
---

## Context and ownership

Fixolution combines several workshop workflows that are often handled separately: discovering a workshop, booking a service, buying spare parts, submitting payment evidence, and requesting an on-call visit.

I owned the backend and frontend implementation, including the relational model for workshops, services, spare parts, carts, transactions, bookings, and `Service to Go` requests. The engineering challenge was keeping actor permissions and transaction state understandable while those workflows shared one API and database.

## Actor boundaries are server concerns

The system serves users, workshops, and a super-admin context. Those actors are not interchangeable: a customer can create a booking or order, a workshop can manage its services and respond to requests, and an administrator can manage global data.

The implementation carries actor identity in the authenticated token context and validates the expected actor at protected routes. That is more important than hiding buttons in the client; authorization has to be enforced where data is read or mutated.

The current token shape is intentionally acknowledged as a trade-off. Multiple identity fields in one token make the active actor explicit, but every protected path must consistently validate the correct context. A future identity redesign would only be justified if the current separation became harder to reason about than a unified principal/role model.

## Transaction truth stays on the server

The spare-parts path separates cart state from persisted transaction/order state. Prices used for checkout are validated against server-owned product data instead of trusting client totals.

This creates a straightforward invariant: the browser can propose quantities, but it cannot define authoritative price or payment state.

Payment remains manually verified in this version through uploaded proof. That is a product limitation, but it is preferable to pretending a bank transfer is automatically confirmed. A payment-provider integration would change the source of payment truth and require its own webhook/idempotency boundary.

## Booking and on-call service are different workflows

A normal service booking and a `Service to Go` request share workshop ownership but have different data requirements. On-call requests include location and problem context; ordinary bookings represent a planned service interaction.

Keeping them as separate records avoids a single overloaded status object. The cost is more domain code, but each workflow can evolve without turning every optional field into conditional state.

## Failure and correctness boundaries

The current implementation has explicit limits:

- booking availability is not a fully transactional slot-reservation system, so concurrent time conflicts require stronger server-side protection;
- local file storage can exhaust or disappear with the deployment environment and is not a durable object-storage design;
- manual payment proof requires human verification and does not provide provider-confirmed payment state;
- actor middleware is a security boundary and needs regression coverage for cross-role access.

These are more important to document than claiming the platform is production-scale.

## Evidence and result

Fixolution demonstrates one full application boundary spanning commerce, booking, and service operations while keeping price validation and actor authorization on the server. It also makes the unresolved boundaries visible rather than hiding them behind frontend state.

The main lesson was that a multi-feature marketplace stays understandable only when **identity, money, booking state, and uploaded evidence each have a clear owner**.

## Known limits

The next hardening work would prioritize transactional booking conflict checks, integration tests across role boundaries and checkout state, and an upload abstraction before moving assets to S3/R2. Payment-provider integration would come after the payment state machine is explicit enough to receive asynchronous callbacks safely.
