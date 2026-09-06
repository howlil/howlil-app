---
title: 'CodeFlow'
type: 'side-project'
date: '2026-09-06'
excerpt: 'Interactive semantic code graph for tracing entry points, calls, dependencies, types, evidence, and pull-request change impact.'
summary: 'A graph-first codebase explorer that turns deterministic static analysis into one navigable semantic model instead of disconnected architecture dashboards.'
caseStudySummary:
  problem: 'Understanding an unfamiliar repository requires reconstructing call paths, dependencies, type relationships, and change impact across many files.'
  decision: 'Make one source-backed semantic graph the product truth, then project architecture, impact, evidence, and pull-request changes over that graph.'
  result: 'Developers can traverse supported relationships while missing or inferred evidence remains explicit instead of being visually fabricated.'
tags: ['TypeScript', 'React', 'Vite', 'Fastify', 'Static Analysis', 'GitHub']
repository: 'https://github.com/howlil/codeflow'
featured: true
featuredRank: 1
role: 'Product engineer / analysis architecture owner'
engineeringFocus: ['Semantic graph', 'Static analysis evidence', 'Change impact']
verifiedEvidence:
  - 'The TypeScript path discovers entry points and projects functions, methods, classes, interfaces, types, imports, references, inheritance, implementations, and supported cross-file calls.'
  - 'Evidence provenance is retained with explicit complete, partial, unsupported, and error states.'
  - 'Public pull requests are analyzed against exact BASE and HEAD revisions with bounded semantic impact traversal.'
---

## Context and ownership

CodeFlow helps developers build a mental model of an unfamiliar repository without reconstructing it file by file. I own the product model and analysis architecture: repository acquisition, deterministic TypeScript analysis, semantic identity, graph projection, evidence inspection, and pull-request change analysis.

The product is organized around four questions: where execution starts, where it can go, what a symbol depends on, and what depends on it.

## One semantic graph

Instead of separate dashboards for packages, calls, dependencies, impact, and pull requests, CodeFlow keeps one canonical semantic graph.

Packages/files/functions are abstraction levels; calls/references/imports/inheritance are relationship lenses; impact is bounded traversal; PR analysis overlays change state on frozen BASE/HEAD graphs.

The important decision is not “use a graph UI.” It is **preserve semantic identity across every view**.

## Hard problem: incomplete evidence

Static-analysis tools become misleading when visual completeness is treated as correctness. CodeFlow therefore distinguishes verified, partial, inferred/unsupported, and error states instead of inventing relationships.

The TypeScript path analyzes source without executing arbitrary repository code. Where supported it derives cross-file calls, imports, references, definitions, inheritance, implementations, and deterministic data-flow facts.

But static analysis cannot truthfully claim that a runtime branch executed, a concrete runtime value occurred, or an empty impact traversal proves safety. Those limits are reflected in both the model and UI language.

## Progressive exploration

Rendering every repository node/edge at once hurts comprehension and browser cost. CodeFlow starts from an entry point or searched symbol and expands bounded neighborhoods. Search changes graph focus rather than opening a detached workspace.

This keeps both analysis and rendering proportional to the current question instead of graph completeness.

## Pull-request revision identity

PR analysis preserves exact BASE and HEAD revisions and maps added/modified/removed semantic entities onto the same identity model.

A relationship derived from HEAD is not silently shown as if it existed in BASE, and source-location movement alone is not automatically treated as behavior change. Impact remains traversal evidence, not a risk score.

## Result and limits

The implemented TypeScript path already supports the graph material needed for architecture, dependency, source, impact, and PR exploration while retaining evidence provenance.

The core lesson is: **a code visualization is only trustworthy when it never implies more certainty than the analyzer can prove**.

CodeFlow does not claim universal language coverage, runtime behavior, private-repo support, arbitrary code execution, or risk scoring. Those are separate product/architecture decisions, not missing polish.
