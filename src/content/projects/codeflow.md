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

## The problem

Reading an unfamiliar codebase file by file is a poor way to build a system model. The developer is usually trying to answer a smaller set of questions: where execution can start, where it can go, what a symbol depends on, and what depends on it.

CodeFlow turns those questions into one interactive semantic graph. The graph is not a diagram generated after analysis; it is the primary product surface and the projection of the repository model itself.

## One semantic model instead of many dashboards

A common architecture-tool pattern is to create separate screens for call hierarchy, packages, dependencies, impact, and pull requests. That fragments the mental model because every screen invents another navigation context.

CodeFlow keeps one canonical repository graph and changes the projection instead:

- package and workspace topology are zoomed-out views;
- files, classes, functions, methods, interfaces, and types are progressively deeper semantic levels;
- calls, references, imports/dependencies, inheritance, and implementation relationships are lenses over the same model;
- impact is inverse or transitive traversal over existing relationships;
- pull-request analysis is a change overlay over frozen BASE and HEAD semantic graphs.

The benefit is not fewer screens by itself. It is that navigation, evidence, and change analysis share the same identity model.

## Evidence before explanation

Static-analysis UIs become misleading when visual completeness is treated as correctness. CodeFlow keeps verified, inferred, configured, observed-runtime, and user-asserted evidence distinguishable.

If the analyzer cannot prove a relationship, the UI should not invent one to make the graph look complete. Missing evidence stays partial or unsupported.

That rule also constrains language. Static analysis cannot truthfully claim that a runtime branch was taken, that a value had a concrete runtime value, or that a change is safe merely because bounded impact traversal returned no nodes.

## Bounded analysis and progressive exploration

Large repositories cannot be useful if the product renders every node and edge at once. CodeFlow starts from an entry point or searched symbol and expands neighborhoods progressively.

Search therefore navigates the graph instead of opening a detached results page. Incoming, outgoing, and both-direction expansion are graph-native operations, and the user can move focus as the mental model develops.

Repository acquisition is intentionally setup. Once analysis succeeds, the graph owns the work surface.

## TypeScript analysis path

The implemented TypeScript path performs request-scoped multi-file analysis without executing arbitrary repository code. It can project supported cross-file calls plus repository/module/file architecture, imports, references, definitions, inheritance, implementation relationships, parameters, return paths, reads, writes, mutations, transforms, and static value-flow steps where evidence exists.

A Fastify API owns repository-input validation and orchestration. The React/Vite client owns graph exploration and evidence inspection. Analysis logic stays in dedicated packages rather than leaking into presentation components.

## Pull-request change overlays

PR analysis preserves exact BASE and HEAD revision identity. Added, modified, removed, and unchanged semantic entities are mapped onto the same graph model used for ordinary exploration.

This matters because a textual diff says which lines changed, while a semantic overlay can show where those changed entities sit relative to callers, dependencies, and downstream relationships. The impact view remains bounded and evidence-based; it is not a risk score and it does not claim safety.

## Result

CodeFlow now treats architecture, dependency analysis, source inspection, impact exploration, and pull-request change visualization as operations over one semantic graph.

The core design constraint is deliberate: evidence must survive every projection. That keeps the product useful for navigation without letting the visualization imply runtime facts the analyzer never observed.
