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

## Context and ownership

Jobflow reduces repetitive data entry during job applications without turning a browser extension into an autonomous applicant.

I own the product and extension architecture: the local career profile, Application Profiles, deterministic form analysis, fill planning, document storage, sensitive-data vault, Autofill Memory, and application pipeline.

The hard part is not assigning a string to an `<input>`. It is deciding whether the extension actually knows what a field means and whether it is authorized to disclose the corresponding data.

## Core invariant: analysis does not authorize mutation

Jobflow separates understanding a page from changing it.

The extension first extracts form context and classifies fields. Matching evidence can produce states such as ready, needs review, sensitive, or unknown, but a match by itself does not write to the DOM.

A separate fill plan contains the fields that are eligible for the current explicit user action. Unknown or low-confidence fields remain untouched rather than being guessed.

This is also why the product never automatically clicks `Next`, `Apply`, or `Submit`. Those actions can cross a legal or irreversible product boundary that field matching cannot safely authorize.

## Deterministic matching before AI

The core matcher uses local field, label, role, seniority, domain, and previously approved mapping evidence. It does not require an LLM or backend service to operate.

That choice keeps normal autofill inspectable and makes uncertainty explicit. An AI model could eventually assist with a selected ambiguous question, but it should not become the hidden authority for every field mapping.

Autofill Memory stores user-approved corrections and stable non-sensitive answers for equivalent future questions. Reuse is evidence from prior user action, not a license to fill semantically different questions that merely look similar.

## Sensitive values have a separate trust boundary

Sensitive data does not live in the ordinary career profile.

The vault derives encryption material using PBKDF2-HMAC-SHA-256 and encrypts payloads with AES-256-GCM through Web Crypto. The passphrase is not persisted, and an unlocked vault is still not blanket disclosure permission.

Sensitive fill requires approval for the current site/action. Content scripts receive only the approved value paths needed for that operation rather than the whole decrypted vault.

Wrong passphrases or tampered ciphertext fail closed.

The key product invariant is stronger than “encrypted at rest”: **decryption capability and disclosure authorization are separate decisions**.

## Documents are not ordinary fields

Resume and other document binaries are stored locally in extension-owned IndexedDB. CV text extraction runs locally and produces a review draft before profile import.

A detected file input does not get a document during ordinary form fill. Attachment is a separate explicit action for the specific field, with the native file picker as a fallback when direct assignment is unsupported.

That keeps file disclosure observable and avoids silently uploading a resume because the extension happened to recognize an input.

## Generic engine before ATS-specific branches

Application pages vary widely, but adding one production parser per ATS would quickly turn the codebase into vendor-specific exceptions.

Jobflow prefers a generic extraction/matching/filling path and uses deterministic compatibility fixtures for native and ATS-shaped forms, English/Indonesian labels, dynamic fields, sensitive inputs, files, and ambiguity.

A vendor adapter is justified only when a reproducible failure cannot be fixed cleanly at the generic layer.

## Local data ownership

The current product has no account system, backend, cloud sync, or profile telemetry. Canonical profile data, variants, answer memory, applications, documents, and sensitive values remain inside extension-owned local storage boundaries.

That reduces remote trust surface but creates a different responsibility: versioned persistence, migration, backup/recovery, and browser-extension permission discipline have to be explicit.

## Evidence and result

The implemented extension can analyze supported application forms, plan deterministic autofill, store documents locally, protect sensitive values behind a separate encrypted vault, and track application work without remote infrastructure.

The main engineering lesson is that **safe autofill is a classification-and-authorization problem before it is a DOM automation problem**.

## Known limits

Jobflow does not claim universal ATS compatibility, autonomous application submission, cloud sync, or AI understanding of arbitrary screening questions. Those capabilities would change trust, permissions, and data ownership and should only be introduced when the product can preserve the same explicit approval boundaries.
