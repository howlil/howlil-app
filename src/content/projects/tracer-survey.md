---
title: 'Tracer Survey (Alumni & Supervisor)'
type: 'academic'
date: '2024-08-01'
excerpt: 'Full tracer study system for universities: dynamic surveys (multiple question types, skip/conditional logic), alumni and supervisor respondents, RBAC admin per faculty, blast email, Excel export. Replaces manual paper forms and data processing.'
tags: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Docker']
repository: 'https://github.com/howlil/tracer-survey-api'
---

<!-- @format -->

## Problem Worth Solving

Tracer study is required for accreditation. Surveys are often manual: paper forms, Excel processing. Existing tools rarely combine dynamic surveys (multiple question types, skip/conditional logic), respondent management (alumni by NIM, period, major, supervisor by company), RBAC per faculty, blast email, and data export. We needed one platform that handles dynamic surveys, alumni and supervisor respondents, access rules per faculty, and Excel export.

## My Role & Ownership

I built the backend API: dynamic survey schema (questions with multiple choice, essay, matrix, combo box, skip/conditional logic via question tree), respondent auth (alumni PIN, supervisor identity), RBAC for admins (per faculty, per permission), blast email, Excel export, dependency injection (Awilix), and Docker deployment. Architecture and tech decisions were mine.

## Key Engineering Decision

- **API (Express + Prisma) and Client (React + Vite) separate.** Clear separation. Client could be swapped (e.g. mobile) without changing API. API reusable for other integrations. Trade-off: versioning and deploy for two artifacts. Team can focus per layer.

- **Awilix for dependency injection. Domain-per-feature structure.** Controller/service injected. Better testing and maintainability. gen:domain script keeps structure tidy. Without DI you would wire things manually in each file. Awilix has a learning curve.

- **Question tree (trigger, pointer) for skip logic.** Questions shown conditionally from previous answers. Stored in DB. Long surveys feel lighter. Flexible without code changes. Validation in one place. Schema gets complex. Migrations and validation need care. Changing question type can affect existing answers.

- **RBAC: Admin, Role, Permission. Role per Faculty.** Admins scoped per faculty. Permission per resource/action. Fits multi-faculty setup. Single global role would be simpler but does not fit multi-faculty.

- **Blast email: schedule send, template, status sent/failed.** Scheduled invites and reminders. Status can be monitored. Blast runs in-process. Large respondent lists can be slow. Could move to job queue later.

## One Hard Engineering Problem

Survey schema is complex (question tree, groups, sort order, placeholders) with many edge cases. Validation must avoid circular flows or required questions becoming unreachable. Keeping skip logic only on the frontend could cause inconsistency if clients differ (mobile vs web) or data is tampered with. I designed the question tree in DB with trigger (answer that triggers) and pointer (next question). API validation: tree must not be circular, required questions must be reachable. Frontend renders components by question type and follows the tree. Single source of truth in API. Prisma + question tree enables skip logic without code changes.

## Metrics & Impact

- Dynamic surveys with skip logic let long surveys run without one long linear page. Respondents skip irrelevant questions.
- RBAC per faculty keeps admins within their faculty's surveys and respondents.
- Excel export and blast email simplify reporting and evaluation. Tracer study ready for accreditation.

## What I'd Improve Next

- Email abstraction: "email sender" interface so switching SMTP to SendGrid etc. does not rewrite the blast module.
- Survey schema validation: add API checks (question tree must not be circular, required questions must be reachable).
- Integration tests: create survey, add questions, respondent fills, answers saved, export.
- Client: lazy load survey pages for long surveys to keep performance smooth.

## Architecture

API (Express + Prisma) and client (React + Vite) separate. Stateless API. Domain-per-feature structure with Awilix DI. Survey schema with question tree (trigger, pointer) for skip logic. Stored in DB. Blast email scheduled. Excel export in API. Docker for API and DB. Client can be built static or hosted separately.

## Failure & Risk Considerations

- Blast in-process: large respondent lists can be slow. Mitigate by moving to job queue later. Status sent/failed for monitoring.
- Excel export in API: large files can use lots of memory. Mitigate with streaming or row limit for very large exports.
- Complex survey schema: migrations and validation need care. Mitigate with circular and required-question validation in API.
- reCAPTCHA on client: must align with API validation to avoid bypass.
- Two repos (API + client): versioning and deploy for two artifacts. API docs (Swagger) help keep contract clear.
