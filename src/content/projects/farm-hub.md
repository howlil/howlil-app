---
title: 'Farm Hub (Fish Farming Feasibility Analysis)'
type: 'hackathon'
date: '2024-12-15'
excerpt: 'Fish-farming feasibility workflow that combines structured project data with generated analysis and supplier context.'
summary: 'A hackathon backend that turns farming inputs into structured feasibility sections while keeping generated output separate from canonical user input.'
caseStudySummary:
  problem: 'Feasibility guidance mixes structured financial/technical facts with generated narrative, so unreliable model output can easily become indistinguishable from user-provided data.'
  decision: 'Persist project inputs and analysis sections separately, constrain Gemini output to expected structures, and treat generation failure as an explicit boundary rather than valid domain data.'
  result: 'The application can preserve canonical project inputs while generated summaries, financial analysis, technical information, roadmap, and supplier data remain independently inspectable.'
tags: ['React', 'TypeScript', 'Vite', 'FastAPI', 'Python', 'SQLModel', 'PostgreSQL', 'Google Gemini', 'Docker']
repository: 'https://github.com/kage-projects/farm-hub-client'
featured: false
role: 'Backend engineer / generation integration owner'
engineeringFocus: ['Structured AI output', 'Data modeling', 'Failure handling']
---

## Context and ownership

Farm Hub was a hackathon product for exploring fish-farming feasibility in West Sumatra. Users provide project inputs such as location, fish type, available capital, and operating assumptions; the system turns those inputs into structured analysis and supporting supplier context.

I owned the backend API, relational model, generation integration, and deployment path. The technically interesting part was not calling Gemini. It was keeping generated material from becoming an untyped blob that the rest of the product had to trust blindly.

## Data ownership before generation

The backend separates canonical project input from generated output. Project data is stored independently from analysis sections such as the initial summary, financial analysis, technical information, and roadmap.

That adds more tables than storing one large generated JSON document, but it creates clearer ownership:

- user-provided inputs remain recoverable even if generation fails;
- individual analysis sections can be validated, replaced, or regenerated independently;
- supplier/product data remains ordinary application data rather than model output;
- clients can render stable fields instead of parsing prose.

The model is therefore an analysis dependency, not the database schema.

## The hard problem: inconsistent model output

A generative API can return text that is semantically plausible while still violating the format expected by the application. Loose prompts produced inconsistent shapes, missing sections, or text that was difficult to map safely into persisted fields.

The backend constrained generation toward fixed sections and parseable output, then handled invalid or unavailable responses explicitly. The important rule is that parsing failure should not be silently converted into a valid feasibility result.

This is also why I avoid describing the generated recommendation as an authoritative “go/no-go” decision. Without a separately validated scoring model and domain dataset, the application can provide structured analysis, but it should not imply expert-level certainty.

## Why FastAPI and SQLModel were sufficient

FastAPI + SQLModel fit the team’s Python workflow and kept validation close to the HTTP/schema boundary. PostgreSQL owned relational state while the React client consumed a documented API.

A heavier framework would not have solved the main risk. The dominant correctness problem was generated-output validation and provenance, not framework capability.

## Failure boundaries

The design has several explicit limits:

- Gemini latency/quota can delay or prevent generation;
- generated content can be syntactically valid but factually weak;
- supplier coverage is only as reliable as the underlying dataset;
- feasibility logic is not trustworthy unless its rules and source data are documented separately.

A safe fallback is therefore to preserve the user’s project and report generation as unavailable or partial, rather than inventing a complete result.

## Evidence and result

The delivered system models project inputs, generated analysis sections, supplier/product information, and the client flow as separate concerns. That made it possible to iterate on generation without redefining the core project record.

The main engineering lesson was simple: **when AI output enters a product, structure and provenance matter more than how fluent the generated text looks**.

## Known limits

The next hardening work would be evidence-driven rather than feature-driven: schema-validated model responses, explicit source/provenance labels for computed values, a documented deterministic feasibility model where appropriate, and real supplier data before making stronger decision-support claims.
