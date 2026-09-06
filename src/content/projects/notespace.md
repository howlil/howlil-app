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

## Product boundary

Notespace is a self-hosted knowledge workspace for structured notes, spatial thinking, and deliberate study. It is intentionally narrower than a general collaboration suite: one owner, one durable library, no hosted dependency for core editing, and no attempt to turn every productivity feature into a separate product surface.

The user-facing hierarchy is small:

```text
Category
  -> Workspace
      -> Notes[]
      -> Canvas
      -> history
      -> assets
      -> study activity
```

That model gives the storage layer a clear ownership boundary. A workspace is not just a route in the UI; it is the unit whose authored state, history, assets, and recovery behavior must remain coherent.

## Editing without silent data loss

The editor updates immediately and autosaves after a short idle window, but the persistence path is not fire-and-forget.

Saves are serialized per workspace and carry a workspace version. If another tab writes a newer version first, the stale tab receives `409` and keeps its local edits instead of silently replacing newer stored content.

The product does not claim collaborative editing or offline merge semantics. It solves the narrower problem explicitly: detect stale writers and fail visibly rather than pretending last-write-wins is safe.

## One ownership boundary for durable state

The backend uses Go `net/http`, explicit SQL, and SQLite. Canonical authored state, checkpoint history, durable image assets, trash, study sessions, and search-related data live inside the same self-hosted boundary.

SQLite runs with WAL and FULL synchronous mode. Full-library backup reads from a consistent SQLite transaction, while restore replaces compatible library state transactionally.

Search projection rows are derived and therefore excluded from canonical backup data. That is an important distinction: the backup owns user-authored truth, not every cache or index needed to query it efficiently.

## Portability and recovery

Notespace treats recovery as a product capability rather than a database-admin task.

The library surface includes:

- recoverable workspace Trash;
- checkpoint history and restore;
- versioned full-library backup/restore;
- workspace ZIP/Markdown export;
- Markdown and Obsidian-vault folder import;
- durable image copying for referenced selected assets.

Moving a workspace to Trash captures its authored state, checkpoint history, and image assets in one transaction before removing it from the active library.

The goal is not only to support export. It is to make ownership observable: the user can recover, move, and inspect the data without relying on an opaque hosted account.

## Notes and canvas share the workspace, not the editor implementation

Tiptap and Excalidraw are adapters behind Notespace-owned snapshots. That keeps the domain model from becoming whatever shape an editor library happens to expose internally.

The workspace can show up to four panes with notes and one canvas pane. The UI can therefore evolve split/focus behavior without redefining persistence every time editor composition changes.

## Study is explicit

Study tracking uses explicit Start, Pause, Resume, and End sessions rather than trying to infer attention from browser activity.

Deliberate Recall follows the same principle. The user hides the source, writes from memory, then reveals the note for self-comparison. There is no generated score, XP system, or hidden engagement model.

That keeps learning behavior deterministic and user-controlled.

## Deployment boundary

The self-hosted production path is deliberately compact: one Go process serves the built web application and API, and SQLite persists inside a named Docker volume. No Node runtime or external database is required after the frontend is built.

An optional owner password can protect an instance exposed beyond a trusted private network. The documentation also makes the security limitation explicit: Basic authentication requires HTTPS termination at the reverse proxy because the scheme itself does not encrypt credentials.

## Result

Notespace combines authoring, spatial thinking, retrieval, study, and recovery without splitting user data across multiple hosted systems.

The main engineering constraint is consistency. Fast local-feeling editing is only useful if concurrent saves, deletion, restore, backup, import, and editor adapters all preserve one understandable data-ownership model.
