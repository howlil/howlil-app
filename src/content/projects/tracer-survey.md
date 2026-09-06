---
title: 'Tracer Survey (Alumni & Supervisor)'
type: 'academic'
date: '2024-08-01'
excerpt: 'Configurable survey branching with faculty-scoped RBAC and structured export.'
summary: 'Survey rules live as persisted data, so branching and access control stay consistent across clients.'
caseStudySummary:
  problem: 'Configurable survey branching and faculty-scoped administration would drift if each client owned its own rules.'
  decision: 'Persist survey structure as data and keep authorization plus traversal checks behind the backend contract.'
  result: 'Survey flow and faculty access share one source of truth while graph validation remains an explicit hardening boundary.'
tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Docker']
repository: 'https://github.com/howlil/tracer-survey-api'
featured: false
role: 'Backend engineer / API architecture owner'
engineeringFocus: ['Survey graph', 'RBAC', 'Export workflow']
verifiedEvidence:
  - 'Questions, triggers, and next-question relationships are persisted instead of duplicated as client branching code.'
  - 'Faculty-scoped administrative access is enforced at the API boundary.'
---

## Context and ownership

Tracer Survey supports configurable alumni/supervisor questionnaires, faculty-scoped administration, email workflows, and structured export. I owned the backend API architecture, relational survey model, branching configuration, and authorization boundary.

The main question was where survey rules should live. Hard-coding them in each client would let the same published survey drift across interfaces.

## Survey flow is data

Questions, triggers, and next-question relationships are persisted. Clients render that configuration instead of maintaining a second copy of the branching logic.

That creates backend graph invariants: referenced questions must exist, cycles should not trap respondents, required paths should remain reachable, and submitted answers should belong to an allowed traversal.

The current system centralizes the structure; complete cycle/reachability validation remains a known hardening boundary rather than a claimed feature.

## Authorization stays on the server

Administrative access is faculty-scoped. The API validates the authenticated principal and organizational scope before read, mutation, or export. Frontend visibility is not authorization.

This makes cross-faculty regression tests more important than testing whether a button is hidden.

## Operational limits

Blast email and spreadsheet export are useful but should not grow indefinitely inside one synchronous request. Durable per-recipient delivery or background export is justified only when volume requires it.

## Result and limits

The backend provides one source of truth for survey structure, faculty authorization, respondent answers, and export data.

The key lesson is: **moving rules from code into data changes the invariants the backend must enforce; it does not remove them**.

Next hardening is pre-publication graph validation, authorization regression tests, and durable delivery/export only when real workload justifies it.
