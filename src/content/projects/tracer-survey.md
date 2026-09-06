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
---

## The product constraint

The tracer-study workflow needed more than a fixed form. Administrators had to configure questions, branch respondents through different paths, scope access by faculty, send blast email, and export structured results.

The main architectural decision was where those survey rules should live. If branching stayed as client-side `if` statements, every interface could drift into a slightly different interpretation of the same survey.

## Make survey rules data

Questions, triggers, and next-question relationships are stored as persisted configuration. The client renders that configuration instead of owning a separate copy of the branching logic.

That buys flexibility: administrators can change a survey path without deploying a new client. It also changes the backend problem. Once flow becomes data, correctness is no longer just schema validation; the system eventually needs graph validation as well.

## Authorization belongs to the backend

Administrative access is scoped by faculty. The API owns the authorization boundary rather than trusting the frontend to hide data or controls.

This matters because the same survey engine can serve multiple organizational scopes. The backend has to validate that an administrator, respondent, question, and submitted answer all belong to an allowed scope before persistence or export.

## Complexity moved, not disappeared

Data-driven configuration removes hard-coded flow from the UI, but it creates new failure modes:

- a pointer can reference a missing question;
- a cycle can trap a respondent indefinitely;
- a required question can become unreachable;
- a client can attempt to submit an answer outside the server-approved path.

The implemented version centralizes the survey structure and faculty RBAC. Complete cycle/reachability validation is the next correctness boundary rather than something I claim as already solved.

## Operational edges

Blast email and Excel export are useful because they remove recurring manual work, but they should not scale indefinitely inside one request/process.

For larger datasets I would move email delivery to a durable queue with per-recipient state and stream large exports instead of building the entire workbook in memory.

## What shipped

The backend provided one source of truth for configurable survey structure, faculty-scoped authorization, respondent answers, blast-email status, and export data. The React client and API remained independently deployable behind an explicit contract.

The interesting lesson from this project was not “dynamic forms.” It was that moving business rules from code into data changes which invariants the backend must enforce.

## Next hardening

1. Validate cycles, pointer existence, and required-question reachability before publishing a survey.
2. Add authorization regression tests across faculty boundaries and survey traversal.
3. Move blast email to a durable worker and stream large exports.
