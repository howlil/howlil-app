---
title: 'Job Flow'
type: 'side-project'
date: '2026-09-06'
excerpt: 'Local-first Chromium extension for deterministic job-form autofill, document attachment, application tracking, and encrypted sensitive data.'
summary: 'A browser extension that analyzes career forms locally, recommends the right application profile, and fills only approved fields after explicit user action.'
caseStudySummary:
  problem: 'Repeated job applications require the same profile data across inconsistent forms, but automatic filling becomes unsafe when field intent, sensitive values, documents, and submission boundaries are ambiguous.'
  decision: 'Keep profile data local, classify fields deterministically, require explicit fill/attach actions, and isolate sensitive values in an encrypted vault with per-site approval.'
  result: 'Supported forms can be analyzed and filled without a backend or AI dependency while unknown, sensitive, and unresolved fields stay visible for review instead of being guessed.'
tags: ['TypeScript', 'React', 'WXT', 'Chromium Extension', 'IndexedDB', 'Web Crypto', 'Zod']
repository: 'https://github.com/howlil/jobflow'
featured: false
role: 'Product engineer / extension architecture owner'
engineeringFocus: ['Form interpretation', 'Local privacy boundary', 'Safe autofill']
verifiedEvidence:
  - 'The extension stores normal profile data locally, keeps document binaries in extension-origin IndexedDB, and has no backend or cloud-sync dependency.'
  - 'Sensitive values use a separate encrypted vault backed by PBKDF2-HMAC-SHA-256 and AES-256-GCM; the vault passphrase is not persisted.'
  - 'Autofill, sensitive fill, and document attachment require explicit user actions, and the extension never auto-submits or clicks Next/Apply.'
---

## The product problem

Career forms repeat the same information but rarely expose the same field structure. A name field is simple; custom screening questions, multi-step forms, sensitive identifiers, file uploads, and role-specific answers are not.

Job Flow is a local-first Chromium extension that reduces that repetition without giving the extension permission to guess its way through an application.

The design goal is controlled assistance: analyze the page, identify what can be filled safely, show what still needs review, and act only after the user explicitly asks.

## Local-first by default

The product has no backend, cloud sync, analytics service, or AI dependency.

Structured career data lives in extension storage. CV and document binaries are stored separately in extension-origin IndexedDB so large files do not become part of the normal profile record.

CV import for text-based PDF, DOCX, and TXT runs locally. Extraction creates a review draft first; it does not overwrite the canonical profile automatically. Image-only or scanned PDFs are rejected instead of being treated as text with unreliable guesses.

That boundary makes privacy and failure behavior easier to inspect because the core workflow does not require sending career documents to another service.

## Deterministic form interpretation

The extension re-analyzes application pages as forms change. Fields are classified into states such as Ready, Needs review, Sensitive, and Unknown.

A deterministic matcher uses local role, seniority, domain, skill, field, and page signals to recommend an Application Profile and map stored answers to the current form.

The important rule is that classification failure remains visible. An ambiguous question should become a review item, not a confidently filled but incorrect answer.

Per-site/form/field Autofill Memory can retain approved mappings for recurring questions, while stale mappings remain inspectable and deletable from the Workspace.

## Sensitive data is a separate trust boundary

Sensitive values do not share the same storage path as ordinary career-profile data.

The Sensitive Data Vault uses PBKDF2-HMAC-SHA-256 and AES-256-GCM through Web Crypto. The passphrase is not persisted, and the background runtime owns the unlocked session.

Content scripts do not receive the entire decrypted vault. A sensitive fill resolves only the approved current-page field paths after both vault unlock and current-site approval.

Wrong passphrases and tampered ciphertext fail closed.

This is more work than putting every field in one JSON object, but it keeps the highest-risk data behind a distinct authorization and cryptographic boundary.

## Documents require a separate action

Stored documents can be classified by intent such as resume, cover letter, portfolio, transcript, or certificate.

Even when a matching native file input is detected, Job Flow does not attach a document during ordinary form fill. The user must press **Attach** for that specific field. If direct assignment is unsupported, the extension falls back to the site's normal file picker.

Document selection and form submission therefore remain separate operations.

## No auto-submit

The extension never clicks Submit, Apply, or Next.

This is a deliberate product constraint rather than a missing automation feature. Job applications often contain employer-specific declarations and questions whose final answer should remain under direct user control.

The extension can mark an application as applied only after the user submits on the employer site and explicitly records that state.

## Compatibility strategy

Job Flow prefers a generic form engine over a growing list of vendor-specific production branches.

The repository keeps deterministic compatibility fixtures covering native and ATS-shaped forms, English and Indonesian labels, sensitive fields, file inputs, dynamic forms, and ambiguous questions. A vendor adapter is justified only after a reproducible failure cannot be solved cleanly at the generic extraction/matching/filling layer.

This keeps compatibility work evidence-driven instead of turning every site into a one-off parser.

## Result

Job Flow makes repeated application work faster while preserving explicit boundaries around ambiguity, sensitive data, documents, and submission.

The main engineering lesson is that safe autofill is not primarily a DOM-writing problem. It is a classification and trust problem: know what the field means, know which data is allowed to cross that boundary, and leave the final irreversible action to the user.