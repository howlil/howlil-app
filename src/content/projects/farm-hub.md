---
title: 'Farm Hub (Fish Farming Feasibility Analysis)'
type: 'hackathon'
date: '2024-12-15'
excerpt: 'Fish-farming feasibility workflow that combines structured project data with generated analysis and supplier context.'
summary: 'A hackathon backend that keeps canonical farming inputs separate from generated feasibility sections.'
caseStudySummary:
  problem: 'Generated feasibility guidance can become misleading if model output is stored as if it were canonical user or domain data.'
  decision: 'Persist project inputs and generated analysis separately, constrain Gemini output to expected sections, and make generation failure explicit.'
  result: 'User inputs survive independently of generation while analysis sections remain inspectable and replaceable.'
tags: ['React', 'TypeScript', 'Vite', 'FastAPI', 'Python', 'SQLModel', 'PostgreSQL', 'Google Gemini', 'Docker']
repository: 'https://github.com/kage-projects/farm-hub-client'
featured: false
role: 'Backend engineer / generation integration owner'
engineeringFocus: ['Structured AI output', 'Data modeling', 'Failure handling']
---

## Context and ownership

Farm Hub was a hackathon product for exploring fish-farming feasibility in West Sumatra. I owned the backend API, relational model, Gemini integration, and deployment path.

The technically important part was not calling an LLM. It was deciding which data the application could trust.

## Separate canonical input from generated output

Project inputs are stored independently from generated sections such as summary, financial analysis, technical information, and roadmap. Supplier/product data also remains ordinary application data.

That separation creates three useful invariants:

- generation failure does not destroy the user’s project;
- generated sections can be validated or regenerated independently;
- clients consume stable fields instead of parsing one large prose response.

The model is an analysis dependency, not the database schema.

## Hard problem: inconsistent model output

Loose prompts produced inconsistent response shapes and missing sections. The backend constrained generation toward fixed, parseable structures and treated invalid output as failure instead of silently persisting it as a valid feasibility result.

I also avoid describing the output as an authoritative “go/no-go” recommendation. Without a separately validated scoring model and domain dataset, the product can structure analysis but should not imply expert certainty.

## Failure boundaries

Gemini can be slow, unavailable, or factually weak. Supplier quality depends on the underlying dataset. Any feasibility score is only defensible if its rules and source data are documented.

The safe behavior is therefore to preserve canonical input and expose generation as partial/unavailable rather than fabricate a complete answer.

## Result and limit

Farm Hub demonstrates a practical AI-product boundary: **generated text stays downstream of explicit application data and validation**.

The next hardening work would be schema-validated model responses, provenance for computed/generated values, and real supplier data before stronger decision-support claims.
