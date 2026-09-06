---
title: 'CodeFlow'
type: 'side-project'
date: '2026-09-06'
excerpt: 'Interactive semantic code graph for tracing entry points, calls, dependencies, types, evidence, and pull-request change impact.'
summary: 'A graph-first codebase explorer that turns deterministic static analysis into one navigable semantic model instead of a collection of disconnected architecture dashboards.'
caseStudySummary:
  problem: 'Understanding an unfamiliar repository requires reconstructing call paths, dependencies, type relationships, and change impact across many files.'
  decision: 'Make one source-backed semantic graph the product truth, then project architecture, impact, source evidence, and pull-request changes as views over that graph.'
  result: 'Developers can start from an entry point or symbol and progressively traverse supported relationships while missing or inferred evidence remains explicit instead of being visually fabricated.'
tags: ['TypeScript', 'React', 'Vite', 'Fastify', 'Static Analysis', 'GitHub']
repository: 'https://github.com/howlil/codeflow'
featured: true
featuredRank: 1
role: 'Product engineer / analysis architecture owner'
engineeringFocus: ['Semantic graph', 'Static analysis evidence', 'Change impact']
verifiedEvidence:
  - 'The TypeScript analysis path discovers entry points and projects functions, methods, classes, interfaces, types, imports, references, inheritance, implementations, and supported cross-file calls.'
  - 'Source and evidence provenance are retained for projected semantic relationships, with explicit complete, partial, unsupported, and error states.'
  - 'Public GitHub pull requests are analyzed against exact BASE and HEAD revisions and projected as semantic change overlays with bounded impact traversal.'
---

## Context and ownership

CodeFlow helps a developer build a mental model of an unfamiliar repository without reconstructing the system file by file.

I own the product model and analysis architecture: repository acquisition, deterministic TypeScript analysis, semantic identity, graph projection, source/evidence inspection, and pull-request change analysis.

The product is intentionally organized around four questions:

```text
Where does execution start?
Where can it go?
What does this depend on?
What depends on this?
```

Everything else is a projection or operation over the same repository model.

## Core invariant: one semantic graph

A common code-intelligence design is to expose separate dashboards for packages, call hierarchy, dependencies, impact, and pull requests. That fragments identity: the same function or file becomes a different object depending on the current screen.

CodeFlow instead keeps one canonical semantic graph. Different tasks change the projection:

- packages/workspaces are a zoomed-out view;
- files, classes, interfaces, types, functions, and methods are deeper semantic levels;
- calls, references, imports, inheritance, and implementations are relationship lenses;
- impact is bounded traversal over existing relationships;
- pull-request analysis overlays change state on frozen BASE/HEAD graphs.

The important decision is not “use a graph UI.” It is **preserve semantic identity across every view**.

## Hard problem: evidence can be incomplete

Static-analysis tools become misleading when visual completeness is treated as correctness. CodeFlow therefore distinguishes evidence states instead of inventing missing relationships.

The TypeScript path analyzes repository source without executing arbitrary project code. Where supported, it can derive cross-file calls, imports, references, definitions, inheritance, implementation relationships, parameters, return paths, reads, writes, mutations, transforms, and deterministic static value-flow steps.

But static analysis cannot truthfully claim that a runtime branch executed, a concrete runtime value occurred, or an empty impact traversal proves a change is safe.

That limitation is part of the data model and UI language. Unsupported or partial evidence stays unsupported or partial.

## Progressive exploration instead of graph explosion

Rendering every node and edge of a large repository would optimize for completeness at the expense of comprehension and browser cost.

CodeFlow starts from an entry point or searched symbol and expands bounded neighborhoods. Incoming, outgoing, and bidirectional traversal are graph-native operations; search moves graph focus instead of opening a detached search workspace.

This is both a UX and systems decision: the product only asks the analyzer and renderer for the semantic context needed for the current exploration step.

## Pull-request analysis preserves revision identity

A textual diff explains which lines changed. CodeFlow adds semantic context by analyzing exact BASE and HEAD revisions, mapping added/modified/removed entities onto the same semantic model, and allowing bounded traversal around those changes.

Revision identity is non-negotiable. A relationship derived from HEAD must not be silently presented as if it existed in BASE, and source-location movement alone must not automatically become a semantic behavior change.

Impact remains an evidence-based traversal, not a probability or risk score.

## Architecture boundary

The Fastify API owns repository-input validation and analysis orchestration. Analysis logic lives in dedicated packages. The React/Vite client owns graph exploration and evidence inspection.

That separation keeps parser/analyzer semantics out of presentation components and prevents the UI from becoming a second implementation of repository truth.

The system also keeps ordinary analysis request-scoped/in-memory; persistence, private repository authentication, runtime execution, and collaboration are not smuggled in as default infrastructure.

## Evidence and result

The implemented TypeScript path already supports the semantic material required by the graph-first product, and public PR analysis preserves BASE/HEAD identity. Evidence provenance survives into the projected relationships rather than disappearing after parsing.

The result is a code explorer where architecture, dependencies, source inspection, impact, and change analysis are different ways of interrogating one model.

The engineering lesson is the constraint itself: **a visualization is only trustworthy when it never implies more certainty than the analyzer can prove**.

## Known limits

CodeFlow does not claim universal language coverage, runtime behavior, risk scoring, or arbitrary-repository execution. Framework-specific semantics, additional language adapters, runtime traces, private repository authentication, and durable saved analyses are separate product/architecture decisions that should only be added when a real user journey justifies them.
