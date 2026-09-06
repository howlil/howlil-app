---
title: 'Notespace'
type: 'side-project'
date: '2026-09-06'
excerpt: 'Self-hosted knowledge workspace combining durable notes, spatial canvas, search, recovery, and deliberate study in one local data boundary.'
summary: 'A self-hosted knowledge workspace where fast editing, search, recovery, and portability share one Go + SQLite ownership boundary.'
caseStudySummary:
  problem: 'A useful personal knowledge tool needs fast editing and retrieval without making user-owned content fragile or dependent on a hosted service.'
  decision: 'Keep notes, canvas state, history, assets, study sessions, trash, backup, and search projection inside one self-hosted boundary with explicit conflict detection and transactional recovery.'
  result: 'Users can author, search, restore, export, import, and study while stale concurrent saves fail explicitly instead of silently overwriting newer content.'
tags: ['Go', 'React', 'TypeScript', 'TanStack Start', 'SQLite', 'Tiptap', 'Excalidraw', 'Docker']
repository: 'https://github.com/howlil/notespace'
featured: false
role: 'Product engineer / full-stack owner'
engineeringFocus: ['Local data ownership', 'Editor consistency', 'Recovery and portability']
verifiedEvidence:
  - 'Supports multiple Tiptap notes, one Excalidraw canvas, multi-pane authoring, FTS search, checkpoint history, trash, backup/restore, and Markdown vault import.'
  - 'Workspace saves are versioned and serialized; stale concurrent tabs receive HTTP 409 instead of overwriting newer content.'
  - 'Production runs as one Go process serving the built app/API with SQLite; no hosted service or external database is required for core editing.'
---

## Context and ownership

Notespace is a self-hosted knowledge workspace for notes, spatial thinking, retrieval, and deliberate study. I own the product/full-stack architecture: Category → Workspace → Notes/Canvas, Go + SQLite persistence, editor integration, search, durable assets, history, Trash, import/export, recovery, and study sessions.

The recurring constraint is consistency: a fast editor is not useful if concurrent saves, deletion, restore, or backup can silently destroy user-owned state.

## Workspace as the ownership boundary

A workspace owns multiple notes, one canvas, authored history, assets, and study context. Tiptap and Excalidraw are adapters behind that model rather than top-level persistence identities.

Search projection is also derived state. It can be rebuilt; authored content cannot.

## Hard problem: autosave without silent overwrite

Saves are serialized per workspace and carry a persisted version. If another tab commits a newer version first, the stale write receives HTTP `409` and autosave stops rather than replacing newer data.

This is deliberately narrower than collaborative editing. Notespace does not claim CRDT/offline merge semantics; it guarantees explicit conflict detection instead of silent last-write-wins.

Network failure and version conflict are treated differently: a transient request can retry, while a stale version requires reload/recovery.

## Recovery is product behavior

Deleting a workspace moves recoverable authored state into Trash. Checkpoints support restore, while versioned full-library backup/restore covers categories, active workspaces, Trash, history, assets, and study sessions.

FTS/search rows are excluded because they are derived. Restore validates the artifact before replacing active library state.

Durable images are server-owned rather than browser-only state, so restart, Trash, backup, and export semantics do not depend on one browser profile.

## Small deployment by design

One Go process serves the built frontend and API; SQLite persists in a durable volume. This fits a single-owner, self-hosted product without adding an external database, queue, or hosted dependency.

That simplicity is a design decision, not a missing “scale” layer.

## Explicit study state

Study sessions use manual Start, Pause/Resume, and End. Browser visibility or idle heuristics do not mutate logical study time. Multiple sessions per day derive aggregates from durable session records.

## Result and limits

Notespace combines authoring, retrieval, recovery, portability, and study around one understandable data-ownership model.

The core lesson is: **local-first UX only earns trust when ownership and recovery semantics are as explicit as editor interactions**.

The product does not claim multiplayer collaboration, offline merge, hosted sync, or multi-user security; those would materially change identity and persistence contracts.
