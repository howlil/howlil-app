---
title: 'Notespace'
type: 'side-project'
date: '2026-09-06'
excerpt: 'Self-hosted knowledge workspace combining durable notes, spatial canvas, search, recovery, and deliberate study in one local data boundary.'
summary: 'A self-hosted knowledge workspace where fast editing, search, recovery, and portability share one explicit Go + SQLite data-ownership boundary.'
caseStudySummary:
  problem: 'A useful personal knowledge tool needs fast editing and retrieval without making user-owned content fragile, opaque, or dependent on a hosted service.'
  decision: 'Keep canonical notes, canvas state, history, assets, study sessions, trash, backup, and search projection inside one self-hosted ownership boundary with explicit conflict detection and transactional recovery.'
  result: 'Users can author, search, split, restore, export, import, and study from one self-hosted workspace while stale concurrent saves fail explicitly instead of silently overwriting newer content.'
tags: ['Go', 'React', 'TypeScript', 'TanStack Start', 'SQLite', 'Tiptap', 'Excalidraw', 'Docker']
repository: 'https://github.com/howlil/notespace'
featured: false
role: 'Product engineer / full-stack owner'
engineeringFocus: ['Local data ownership', 'Editor consistency', 'Recovery and portability']
verifiedEvidence:
  - 'Supports multiple Tiptap notes plus one Excalidraw canvas per workspace, multi-pane authoring, global FTS search, checkpoint history, trash, backup/restore, and Markdown vault import.'
  - 'Workspace saves are versioned and serialized; stale concurrent tabs receive HTTP 409 rather than overwriting newer persisted content.'
  - 'Production runs as one Go process serving the built web app and API with SQLite; no hosted service or external database is required for core editing.'
---

## Context and ownership

Notespace is a self-hosted knowledge workspace for structured notes, spatial thinking, retrieval, and deliberate study. It is intentionally single-owner and local-first rather than a collaboration SaaS.

I own the product and full-stack architecture: Category → Workspace → Notes/Canvas, Go + SQLite persistence, editor integration, search, durable assets, history, Trash, import/export, backup/restore, and manual study sessions.

The recurring engineering constraint is consistency. A fast editor is not useful if concurrent saves, deletion, restore, backup, or import can silently destroy user-owned state.

## The workspace is the ownership boundary

A workspace owns multiple notes, one canvas, authored history, assets, and study context. Tiptap and Excalidraw are adapters behind that model; their internal document shapes are not allowed to become the product’s top-level identity.

This gives the application one stable unit for lifecycle operations. Rename, delete, restore, export, checkpoint, and backup can reason about a workspace without redefining ownership every time the editor composition changes.

The same rule keeps search projection separate from canonical content: an index can be rebuilt; user-authored state cannot.

## Hard problem: autosave without silent overwrite

Immediate-feeling editing creates a concurrency edge when the same workspace is open in more than one tab.

Notespace serializes saves per workspace and carries a persisted workspace version. If another writer commits a newer version first, the stale request receives HTTP `409` and autosave stops rather than replacing newer data with an older snapshot.

That behavior is deliberately narrower than collaborative editing. There is no CRDT or automatic merge claim. The guarantee is explicit conflict detection: **stale writes fail visibly instead of silently winning last-write-wins**.

Network failure and version conflict are also different states. A transient request can be retried; a real conflict requires reload/recovery because retrying the same stale write would be incorrect.

## Recovery is a product capability

Deletion moves a complete recoverable workspace snapshot into Trash rather than immediately destroying it. Checkpoint history supports local restoration, and whole-library backup/restore is versioned and transactional.

Canonical backup data includes categories, active workspaces, Trash, history, durable image assets, and study sessions. Search/FTS projection rows are excluded because they are derived state.

Restore validates the artifact before replacing the active library. This keeps “backup” from becoming a JSON export that can only be trusted after it has already modified the database.

## Durable assets and portability

Referenced images are server-owned durable assets rather than browser-only state. Workspace ZIP/Markdown export and Markdown-vault import operate around that ownership model.

Browser IndexedDB may assist legacy migration/cache behavior, but it is not the canonical store for authored workspace assets.

That distinction makes restart, backup, Trash, and export semantics inspectable from the backend rather than dependent on one browser profile.

## Deliberately small deployment

The production path uses one Go process to serve the built frontend and API, with SQLite in a durable volume. WAL and synchronous settings support the expected single-owner workload without introducing an external database, queue, or hosted service.

This is a design choice, not a missing “scalable architecture.” The current product does not need distributed coordination, team identity, or cloud sync.

## Study state is explicit

Study sessions use explicit Start, Pause/Resume, and End actions. Browser visibility and idle heuristics do not mutate logical study time.

Multiple sessions can occur in one day, and aggregate activity derives from durable session records. A logical session may cross midnight while persistence splits accounting by local date without inventing an automatic user-visible End.

## Evidence and result

The current implementation supports multiple notes and canvas panes, optimistic version conflicts, FTS-backed retrieval, checkpoint history, Trash, transactional library recovery, durable assets, Markdown portability, and one-container self-hosting.

The core lesson is that **local-first UX only earns trust when ownership and recovery semantics are as explicit as the editor interactions**.

## Known limits

Notespace does not claim multiplayer collaboration, offline merge semantics, hosted sync, or multi-user security. Those capabilities would materially change identity, conflict resolution, and persistence contracts and should not be introduced as incremental feature additions.
