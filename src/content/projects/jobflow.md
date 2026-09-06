---
title: 'Job Flow'
type: 'side-project'
date: '2026-09-06'
excerpt: 'Local-first Chromium extension for deterministic job-form autofill, document attachment, application tracking, and encrypted sensitive data.'
summary: 'A browser extension that analyzes career forms locally and fills only approved fields after explicit user action.'
caseStudySummary:
  problem: 'Repeated applications reuse the same data across inconsistent forms, but autofill becomes unsafe when field intent, sensitive values, documents, and submission boundaries are ambiguous.'
  decision: 'Keep profile data local, classify fields deterministically, require explicit fill/attach actions, and isolate sensitive values in an encrypted vault with per-site approval.'
  result: 'Supported forms can be filled without a backend or AI dependency while unknown and sensitive fields remain reviewable instead of guessed.'
tags: ['TypeScript', 'React', 'WXT', 'Chromium Extension', 'IndexedDB', 'Web Crypto', 'Zod']
repository: 'https://github.com/howlil/jobflow'
featured: false
role: 'Product engineer / extension architecture owner'
engineeringFocus: ['Form interpretation', 'Local privacy boundary', 'Safe autofill']
verifiedEvidence:
  - 'Normal profile data stays local, document binaries live in extension-origin IndexedDB, and core autofill has no backend/cloud-sync dependency.'
  - 'Sensitive values use PBKDF2-HMAC-SHA-256 and AES-256-GCM; the vault passphrase is not persisted.'
  - 'Autofill, sensitive fill, and document attachment require explicit actions; the extension never auto-submits or clicks Next/Apply.'
---

## Context and ownership

Jobflow reduces repetitive job-application input without turning a browser extension into an autonomous applicant. I own the local profile model, Application Profiles, deterministic form analysis, fill planning, document storage, sensitive-data vault, answer memory, and application pipeline.

The hard part is not writing to an `<input>`. It is deciding whether the extension knows what a field means and is authorized to disclose the corresponding data.

## Analysis does not authorize mutation

Jobflow first extracts and classifies fields. Matching evidence can mark a field ready, ambiguous, sensitive, or unknown, but analysis alone never writes to the page.

A separate fill plan contains fields approved for the current user-triggered action. Unknown/low-confidence fields stay untouched. The extension also never automatically clicks `Next`, `Apply`, or `Submit` because those can cross an irreversible boundary.

## Deterministic matching before AI

The core matcher uses local field/label context and previously approved mappings. It does not require an LLM or remote backend.

Autofill Memory reuses user-approved corrections and stable non-sensitive answers, but similarity is not treated as authorization to answer a semantically different screening question.

## Sensitive data is a separate trust boundary

Sensitive values do not share ordinary profile storage. The vault derives encryption material with PBKDF2-HMAC-SHA-256 and encrypts data with AES-256-GCM through Web Crypto.

Unlocking the vault is not blanket disclosure permission. Sensitive fill still requires approval for the current site/action, and content scripts receive only the approved values needed for that operation.

The invariant is stronger than “encrypted at rest”: **decryption capability and disclosure authorization are separate decisions**.

## Documents are explicit disclosure

Resume/document binaries live locally in extension-owned IndexedDB. CV import creates a review draft before mutating canonical profile data.

A detected file input does not receive a document during normal form fill. Attachment is a separate action for that field, with the native picker as fallback when direct assignment is unsupported.

## Generic engine before ATS branches

Jobflow prefers one extraction/matching/filling path over vendor-specific production branches. ATS adapters are justified only after a reproducible failure cannot be solved cleanly in the generic engine.

## Result and limits

Jobflow can analyze supported forms, plan deterministic autofill, protect sensitive values behind a separate vault, store documents locally, and track applications without remote infrastructure.

The core lesson is: **safe autofill is a classification-and-authorization problem before it is DOM automation**.

It does not claim universal ATS compatibility, autonomous submission, cloud sync, or AI understanding of arbitrary screening questions; those would materially change trust and data-ownership boundaries.
