---
title: 'Tracer Survey (Alumni & Supervisor)'
type: 'academic'
date: '2024-08-01'
excerpt: 'Tracer-study platform with dynamic surveys, conditional question flow, faculty-scoped RBAC, respondent management, blast email, and Excel export. The main engineering challenge is keeping a configurable survey graph understandable and safe.'
tags: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Docker']
repository: 'https://github.com/howlil/tracer-survey-api'
featured: true
featuredRank: 2
role: 'Backend engineer / API architecture owner'
engineeringFocus: ['Dynamic schemas', 'RBAC', 'Graph validation', 'Data export']
verifiedEvidence:
  - 'Survey flow stored as data instead of hard-coded client logic'
  - 'Faculty-scoped role and permission model'
  - 'Separate API/client architecture with documented contract'
---

## Problem Worth Solving

University tracer studies are often assembled from forms, spreadsheets, manual email outreach, and ad-hoc reporting. The requirement here was broader: administrators needed configurable surveys, multiple respondent types, conditional question flow, faculty-scoped access, blast email, and structured export.

The core engineering problem was not the CRUD surface. It was deciding **where the survey rules live** so multiple clients cannot silently disagree about what a valid questionnaire looks like.

## My Role & Ownership

I built the backend API and data model for surveys, questions, respondent access, faculty-scoped RBAC, email blast status, and Excel export. I also introduced dependency injection with Awilix and organized the service around domain-oriented modules.

The project stores conditional survey flow in the database. An important gap remains: complete graph validation for circular paths and unreachable required questions is a production-hardening item, not something I claim as fully enforced today.

## System Model

```text
                    +------------------+
Admin UI ---------->|                  |
                    |   Express API    |------> Email provider
Respondent UI ----->|                  |
                    +---------+--------+
                              |
                              v
                         +---------+
                         |  MySQL  |
                         +----+----+
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
      Surveys             Respondents          RBAC
          |
          v
   Question graph
(trigger + pointer)
```

The API is the intended source of truth for survey structure. Clients render the configuration; they should not invent separate branching rules.

## Data Flow: Conditional Questions

```text
load survey
   |
   v
fetch ordered questions + branch metadata
   |
   v
render current question
   |
   v
submit answer
   |
   +--> no branch match ------> next ordered question
   |
   +--> branch match ---------> pointed question
                                  |
                                  v
                              continue flow
```

Representing branching as data allows survey administrators to change flows without deploying frontend code. The trade-off is that the stored graph itself becomes something the backend must validate.

## Key Engineering Decisions

### API and client are separate artifacts

The React/Vite client and Express API can evolve independently. This makes the API reusable for another client, but it also creates a contract/versioning responsibility between deployments.

### Domain-per-feature structure with Awilix

Controllers and services are wired through dependency injection rather than constructing dependencies ad hoc. This improves testability and keeps domain boundaries clearer, at the cost of an additional abstraction developers need to understand.

### Question flow stored in the database

Conditional flow uses trigger/pointer relationships instead of hard-coded `if` statements in the frontend. That gives administrators configuration power and keeps branching rules consistent across clients.

The missing invariant is equally important: arbitrary graph data can contain cycles or make required questions unreachable. The current portfolio now states that limitation explicitly rather than implying complete validation exists.

### Faculty-scoped RBAC

Administrators are constrained by faculty and permission rather than one global admin role. This maps authorization closer to the real organizational boundary and reduces accidental cross-faculty access.

## Correctness Invariants

A mature version of this system should enforce these rules centrally:

1. A survey graph must not contain a cycle that traps a respondent indefinitely.
2. Required questions that are applicable to a respondent must remain reachable.
3. A respondent must not submit answers for a survey/question outside the allowed scope.
4. An administrator must not read or mutate resources outside the authorized faculty unless explicitly granted cross-faculty access.
5. Exported results must represent the same persisted answers visible through the API.

The RBAC/data-boundary rules are part of the implemented model. Full graph reachability/cycle validation is listed as a next step.

## Failure Modes

| Failure | Current design | Hardening path |
| --- | --- | --- |
| Invalid branching configuration | Flow is data-driven and centrally stored | Validate DAG/reachability before publishing survey |
| Large blast email | Send/status handled in application process | Move delivery to durable queue/worker |
| Large Excel export | Generated by API | Stream rows / impose export limits |
| Client tampers with flow | API owns persisted survey schema | Validate submitted question/answer against server-side schema |
| Cross-faculty access | Faculty-scoped role/permission model | Add authorization regression tests for every resource |
| API/client drift | Separate deployable artifacts | Version/document contract and run integration tests |

## Evidence & Impact

- Conditional questions are represented as persisted configuration rather than duplicated frontend branching logic.
- Faculty-scoped RBAC maps authorization to the institution structure.
- Export and blast-email workflows reduce recurring manual processing around survey operations.
- The API/client split provides a reusable contract for another respondent interface.

I do not attach synthetic scale claims to this project because it was not load-tested under a controlled production-like dataset.

## What I'd Improve Next

1. Add publish-time graph validation: cycle detection, pointer existence, and reachability for required questions.
2. Add integration tests for survey creation → branch traversal → answer persistence → export.
3. Move blast email into a durable job queue with retry and per-recipient delivery state.
4. Stream large exports rather than constructing the full workbook in process memory.
5. Add explicit API contract/versioning tests between frontend and backend.
6. Abstract email delivery behind a provider interface so SMTP/vendor changes do not leak into survey logic.

## Architectural Takeaway

The transferable lesson from this project is that **configurability moves complexity from code into data**. Once business logic becomes data-driven, schema validation is no longer enough; the system must validate structural properties of that data too. That is the main engineering boundary I would strengthen next.
