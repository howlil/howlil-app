---
title: 'Fixolution App (Workshop & Parts Platform)'
type: 'work'
date: '2024-10-01'
excerpt: 'Multi-actor workshop platform covering service booking, spare-part checkout, payment-proof handling, and on-call service requests.'
summary: 'A workshop marketplace where user, workshop, and administrator actions share one backend while authorization and transaction state stay explicit.'
caseStudySummary:
  problem: 'Booking, commerce, and on-call service flows involve different actors and state transitions, making authorization and transaction-state errors easy to introduce.'
  decision: 'Keep actor context explicit at the API boundary, validate prices on the server, and model booking, transaction, and on-call service state separately.'
  result: 'Three actor workflows share one API without relying on frontend-only permissions or client-supplied transaction truth.'
tags: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Vercel', 'Docker']
featured: false
role: 'Full-stack engineer / application owner'
engineeringFocus: ['Authorization boundaries', 'Transaction state', 'Booking workflow']
---

## Context and ownership

Fixolution combines workshop discovery, service booking, spare-part checkout, payment-proof handling, and `Service to Go` requests. I owned the backend/frontend implementation and relational model across those flows.

The main engineering problem was keeping **identity, money, and booking state** understandable while three actor types shared one API.

## Authorization is a server boundary

Users, workshops, and super-admins have different allowed mutations. Actor context is carried in authentication and validated by protected routes; hiding a button in the client is never treated as authorization.

The token/context model is a trade-off: it keeps actor identity explicit, but every route must validate the correct principal consistently. Cross-role regression tests therefore matter more than UI permission tests.

## Transaction truth stays on the server

The spare-part flow separates cart state from persisted transaction state. Quantities may come from the browser, but authoritative price is re-read and validated from server-owned product data before checkout.

Payment proof is manually verified in this version. That is a limitation, but it is more honest than representing an uploaded receipt as confirmed payment. A payment gateway would introduce a separate asynchronous payment state and webhook/idempotency boundary.

## Booking and on-call requests are different domains

Ordinary bookings represent planned service; `Service to Go` carries location/problem context and a different response lifecycle. Keeping them separate avoids one overloaded record filled with conditional fields.

The current booking model is not a proven transactional slot-reservation system. Concurrent availability checks would need stronger server-side transaction/locking semantics before claiming race safety.

## Result and limits

Fixolution demonstrates a full application boundary where actor authorization and price/transaction truth remain server-owned.

Known limits are transactional booking conflicts, local-file durability, manual payment verification, and the need for authorization/integration tests. Those are higher-value hardening targets than adding more platform features.
