---
title: 'Tracer Survey (Alumni & Supervisor)'
type: 'academic'
date: '2024-08-01'
excerpt: 'Configurable survey branching with faculty-scoped RBAC and structured export.'
summary: 'Survey rules live as persisted data, so branching and access control stay consistent across clients.'
caseStudySummary:
  problem: 'Configurable survey branching and faculty-scoped administration would drift if each client owned its own rules.'
  decision: 'Persist survey structure as data and keep authorization plus traversal checks behind the backend contract.'
  result: 'Survey flow and faculty access share one source of truth, while graph validation remains an explicit hardening boundary.'
tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Docker']
repository: 'https://github.com/howlil/tracer-survey-api'
featured: false
role: 'Backend engineer / API architecture owner'
engineeringFocus: ['Survey graph', 'RBAC', 'Export workflow']
verifiedEvidence:
  - 'Questions, triggers, and next-question relationships are persisted as survey configuration rather than duplicated as client-side branching code.'
  - 'Administrative access is scoped by faculty at the API boundary rather than relying on frontend visibility.'
  - 'The case study explicitly separates implemented configurable traversal from still-unimplemented complete cycle/reachability validation.'
---

## Context and ownership

Tracer Survey supports alumni/supervisor questionnaires whose path can change based on previous answers. Administrators also need faculty-scoped access, respondent data, blast email, and structured export.

I owned the backend API architecture, relational survey model, faculty authorization boundary, branching configuration, and export/delivery workflows.

The central design question was where survey rules should live. If every client hard-codes its own branching logic, the same published survey can have multiple interpretations.

## Survey flow is persisted data

Questions, triggers, and next-question relationships are stored as configuration. The client renders that structure instead of owning another copy of the business rules.

That moves complexity rather than removing it. A data-driven survey can change without a client deployment, but the backend now owns graph-like invariants:

- every referenced next question should exist;
- a published path should not trap respondents in an unintended cycle;
- required questions should remain reachable under the intended conditions;
- submitted answers should belong to the currently valid server-approved survey path.

The implemented version centralizes the structure. Complete cycle/reachability validation remains an explicit hardening boundary rather than something I claim is already solved.

## Authorization belongs to the API

Administrative access is scoped by faculty. The frontend can hide controls for usability, but it is not the authority for which survey data an administrator can read, modify, or export.

The backend must validate the relationship between the authenticated principal, faculty, survey, respondent, and requested operation.

This makes cross-faculty authorization tests higher value than testing whether a menu item is visible.

## Configurability creates a publishing boundary

Once survey logic is data, editing and executing that data should be treated as different lifecycle states.

A stronger version of the system would validate the graph before publication and prevent an invalid draft from becoming the active respondent flow. That is a better correctness boundary than trying to recover after a respondent encounters a broken pointer.

The important lesson is that “dynamic forms” are effectively a small rules engine. Persisting rules makes them configurable, but it also means they deserve validation and lifecycle semantics.

## Operational work should not dominate request handling

Blast email and Excel export remove recurring manual work, but both have scaling limits inside an ordinary request/process.

For a small dataset, synchronous generation may be sufficient. As volume grows, email delivery should move behind durable per-recipient state and large exports should stream or run as bounded background jobs rather than holding the entire workbook and request open indefinitely.

This is a workload-triggered boundary, not a reason to add a queue pre-emptively.

## Evidence and result

The delivered backend provides one source of truth for configurable survey structure, faculty-scoped authorization, respondent answers, email workflow state, and export data.

The strongest engineering lesson is that **moving business rules from source code into data changes the invariants the backend must enforce; it does not make those rules disappear**.

## Known limits

The next hardening work is pre-publication graph validation for missing pointers, cycles, and reachability; authorization regression tests across faculty boundaries; and durable delivery/streaming only when email or export volume justifies it.
