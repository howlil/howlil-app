# Portfolio Design Contract

## Purpose

This portfolio presents Mhd Ulil Abshar as a **Software Engineer focused on Backend & Infrastructure**.

Canonical direction:

> **Engineering Evidence First**

The interface should help a recruiter, engineering manager, or technical peer quickly understand:

1. who the owner is;
2. what engineering problems he works on;
3. what he personally owned;
4. which technical decisions mattered;
5. what evidence exists;
6. where to inspect the implementation in more depth.

The site is not a developer dashboard, product-designer portfolio, agency landing page, or visual experiment.

## Product problem

A software-engineering portfolio fails when technical credibility is hidden behind presentation chrome, vague project summaries, decorative screenshots, or excessive process storytelling.

The primary job is therefore:

> Let a visitor evaluate engineering scope, ownership, judgment, and implementation evidence with low cognitive friction.

Primary journey:

```text
IDENTITY
→ SPECIALIZATION
→ SELECTED ENGINEERING WORK
→ OWNERSHIP / DECISIONS / OUTCOME
→ DEEP TECHNICAL EVIDENCE
→ EXPERIENCE / WRITING / CONTACT
```

## Design principles

### 1. Evidence before decoration

Prefer real engineering evidence:

- system constraints;
- ownership;
- state and data decisions;
- failure handling;
- reliability boundaries;
- architecture decisions;
- repositories;
- deployed systems;
- implementation notes;
- honest outcomes and limitations.

Do not invent screenshots, architecture diagrams, metrics, users, incidents, benchmarks, research, or business impact.

### 2. Scan first, depth second

The first viewport and project index should be easy to scan. Long-form project pages may go deep technically.

Use hierarchy in this order:

```text
TYPOGRAPHY
→ ALIGNMENT
→ SPACING
→ GROUPING
→ DIVIDERS
→ STATE
→ CONTAINER ONLY WHEN NEEDED
```

### 3. Flat by default

Do not wrap every piece of information in a card.

Prefer:

- chronological rows;
- metadata rails;
- separators;
- compact evidence blocks;
- readable prose;
- restrained interactive surfaces.

Cards are valid only when they create a meaningful bounded surface, such as media, dense technical data, or a true interactive control.

### 4. Software-engineering language

Prefer labels such as:

- Selected engineering work
- Ownership
- Engineering focus
- Constraint
- Decision
- Outcome
- Evidence
- Repository
- System
- Implementation
- Failure modes

Avoid turning every project into a product-design case study.

## Global frame

- Desktop shell: approximately **54–56rem**.
- Long-form reading measure: approximately **66ch**.
- Project/media evidence may use the full shell.
- Body prose stays constrained for readability.
- Mobile preserves the same content priority without horizontal overflow.

## Typography

Primary family: native system sans-serif.

Monospace is limited to compact metadata and technical labels.

Suggested hierarchy:

- Home hero: 40–48px desktop.
- Page title: 36–44px.
- Featured project title: 22–26px.
- Section title: 24–28px.
- Body: 14–16px.
- Metadata: 10–12px.

Do not use giant manifesto typography or magazine-scale whitespace.

## Color

Use the existing semantic color system.

Light mode:

- warm neutral canvas;
- near-white bounded surfaces;
- graphite text;
- muted secondary text;
- one indigo accent.

Dark mode uses the equivalent warm near-black system.

Accent color is reserved for links, focus, selected state, and limited emphasis.

Project identity must not depend on arbitrary per-project color palettes.

## Shape and depth

Default radius should stay restrained.

- controls / small surfaces: 6–10px;
- bounded content surfaces: 10–14px;
- major media only: up to 16px when useful.

Avoid:

- rounded-everything UI;
- card-inside-card layouts;
- glassmorphism;
- glow;
- decorative gradients;
- heavy shadows;
- floating surfaces without hierarchy reason.

## Homepage

The first viewport must answer:

```text
WHO
Mhd Ulil Abshar

ROLE
Software Engineer — Backend & Infrastructure

WHAT
Reliable backend services, payment workflows, stateful systems, and infrastructure

PROOF
Selected engineering work

NEXT ACTION
Project / GitHub / Resume / LinkedIn
```

Portrait is not required on the homepage. Personal imagery belongs primarily on About.

Recommended order:

```text
Identity + positioning + primary links

Selected engineering work
  project
    summary
    ownership
    engineering focus
    constraint / decision / outcome
    repository / detail

Experience
  compact chronological rows

Writing
  compact editorial index
```

## Selected engineering work

Featured projects should expose, when supported by real data:

- title;
- year;
- concise system summary;
- role / ownership;
- engineering focus;
- core constraint;
- key decision;
- outcome;
- repository / live evidence.

Do not generate decorative pseudo-product screenshots.

When no real media exists, use a neutral **Engineering Evidence** surface that clearly represents textual project evidence rather than pretending to be an application screen.

## Project detail

Project detail should read like a technical engineering case study.

Recommended order:

1. back navigation;
2. title + concise system summary;
3. repository/live/video links;
4. role / focus / stack;
5. constraint / decision / outcome;
6. technical narrative;
7. architecture/state/failure-mode details when present;
8. observed result;
9. limitations / what would change today.

Existing technical prose is the primary evidence. Presentation should support it rather than compete with it.

## Experience

Experience should be a compact chronology rather than a collection of large cards.

Each entry should prioritize:

- company;
- role;
- period;
- one high-signal responsibility or result.

## Writing

Writing is supporting technical credibility.

Prefer a compact editorial index containing:

- title;
- date;
- category where available;
- clear navigation.

Do not allocate large card surfaces when a row communicates the same information more efficiently.

## About

About is the correct place for:

- portrait;
- personal engineering statement;
- technical scope;
- full experience;
- education;
- recognition;
- leadership/community context.

Capability presentation should remain factual and implementation-grounded.

## Motion

Motion is used only when it improves state comprehension or feedback:

- link state;
- row hover;
- menu expansion;
- theme transition;
- media controls.

All motion must respect `prefers-reduced-motion`.

Avoid:

- page-intro theatrics;
- scroll hijacking;
- parallax;
- cursor followers;
- decorative reveal sequences;
- terminal typing effects;
- motion on every interaction.

## Anti AI-slop rules

Do not use the following as default design grammar:

- generic SaaS hero sections;
- bento layouts without information need;
- arbitrary metrics;
- decorative pills;
- excessive badges;
- nested cards;
- random gradients;
- glow;
- glassmorphism;
- fake terminal UI;
- fake architecture diagrams;
- oversized headings without functional hierarchy;
- excessive whitespace;
- decorative dashboards.

## Decision standard

Every major visual or interaction decision must answer:

> What user problem does this solve for someone evaluating the engineer?

Use:

```text
USER NEED
→ REQUIRED INFORMATION
→ REQUIRED ACTION
→ REQUIRED STATE
→ SIMPLEST APPROPRIATE INTERACTION
→ VISUAL HIERARCHY
```

If a container, animation, badge, tab, modal, illustration, or effect has no functional reason, remove it.

## Quality bar

The intended impression is:

> “I can quickly understand what this engineer builds, what he owned, why the technical decisions matter, and where the evidence is. The interface is polished because the information and interaction are precise.”

Success means the visitor can evaluate the work **more clearly, faster, more predictably, and with less cognitive friction**.
