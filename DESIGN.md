# Portfolio Design Contract

## Purpose

This portfolio presents Mhd Ulil Abshar as a **Software Engineer focused on Backend & Infrastructure**.

Canonical direction:

> **Curated Engineering Portfolio**

The interface should help a recruiter, engineering manager, or technical peer quickly understand:

1. who the owner is;
2. what engineering problems he works on;
3. which systems are most worth inspecting;
4. what he personally owned;
5. what technical outcome or evidence exists;
6. where to go deeper into implementation and decision detail.

The site is not a developer dashboard, product-designer portfolio, agency landing page, technical documentation portal, or visual experiment.

## Product problem

A software-engineering portfolio fails in two opposite ways:

- technical credibility is hidden behind presentation chrome and vague visual storytelling; or
- all available technical detail is exposed at once, turning the portfolio into documentation that is expensive to scan.

The primary job is therefore:

> Let a visitor evaluate engineering scope, ownership, judgment, and implementation evidence quickly, then choose where to go deeper.

Primary journey:

```text
IDENTITY
→ SPECIALIZATION
→ CURATED ENGINEERING WORK
→ OWNERSHIP / FOCUS / OUTCOME
→ CHOOSE A PROJECT
→ DEEP TECHNICAL EVIDENCE
→ EXPERIENCE / WRITING / CONTACT
```

## Design principles

### 1. Progressive disclosure is mandatory

Homepage and indexes expose only the information needed to decide whether a project is worth opening.

Use this split:

```text
SCAN LAYER
project identity
summary
ownership
engineering focus
outcome
links

DETAIL LAYER
constraints
decisions
failure modes
architecture/state reasoning
implementation detail
limitations
what would change today
```

Do not repeat the same Problem / Decision / Outcome block at multiple levels of the same journey.

### 2. Evidence before decoration

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

If a project has no real visual media, do not manufacture a visual cover simply to fill space.

### 3. Scan first, depth second

The first viewport, homepage work section, and work index should be easy to scan. Long-form project pages may go deep technically.

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

### 4. Flat by default

Do not wrap every piece of information in a card.

Prefer:

- chronological rows;
- compact metadata;
- separators;
- readable prose;
- real media when available;
- restrained interactive surfaces.

Cards are valid only when they create a meaningful bounded surface, such as media, dense technical data, or a true interactive control.

### 5. Different sections may use different composition

Consistency means shared tokens, hierarchy logic, and interaction behavior—not identical layout for every section.

Homepage prominence should be approximately:

```text
SELECTED WORK  ██████████
EXPERIENCE     ██████
WRITING        ████
```

Selected Work may use larger rows. Experience should read as chronology. Writing should read as a compact index.

## Global frame

Separate portfolio canvas from reading measure:

- Desktop portfolio shell: approximately **64–66rem**.
- Long-form reading measure: approximately **66ch**.
- Real project/media evidence may use the wider canvas where appropriate.
- Body prose stays constrained for readability.
- Mobile preserves the same information priority without horizontal overflow.

Do not combine a narrow shell with nested multi-column micro-layouts.

## Typography

Primary family: native system sans-serif.

Monospace is limited to compact metadata and technical labels.

Suggested hierarchy:

- Home name: 38–44px desktop.
- Home positioning statement: 23–30px.
- Page title: 36–42px.
- Featured project title: 22–24px.
- Section title: 23–27px.
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
- major real media only: up to 16px when useful.

Avoid:

- rounded-everything UI;
- card-inside-card layouts;
- glassmorphism;
- glow;
- decorative gradients;
- heavy shadows;
- floating surfaces without hierarchy reason.

Navigation should be structurally quiet: a flat sticky bar with divider is preferred over a floating capsule unless the floating treatment solves a real interaction problem.

## Homepage

The first viewport must answer:

```text
WHO
Mhd Ulil Abshar

ROLE
Software Engineer — Backend & Infrastructure

WHAT
Reliable backend systems for stateful and asynchronous product workflows

PROOF
Selected engineering work immediately below

NEXT ACTION
GitHub / Resume / LinkedIn / Project
```

Keep the hero compact enough that real work appears early in the browsing session.

Portrait is not required on the homepage. Personal imagery belongs primarily on About.

Recommended order:

```text
Identity + positioning + primary links

Selected work
  title
  summary
  ownership
  engineering focus / implementation signal
  outcome
  repository / detail

Experience
  chronological rows

Writing
  compact editorial index
```

Do not expose full constraint and decision reasoning on the homepage.

## Selected engineering work

Featured projects should expose, when supported by real data:

- sequence / title;
- year;
- concise system summary;
- role / ownership;
- engineering focus;
- compact implementation signal;
- one high-signal outcome;
- repository / detail link.

The work index should answer:

> Is this project relevant enough to inspect in depth?

It should not answer every technical question before the visitor opens the case study.

## Project detail

Project detail should read like a focused technical engineering case study, not a template-generated documentation page.

Recommended order:

1. back navigation;
2. title + concise system summary;
3. repository/live/video links;
4. ownership / focus / implementation brief;
5. real media when available;
6. technical narrative from the project content;
7. constraints, decisions, state, architecture, or failure modes as supported by that narrative;
8. observed result;
9. limitations / what would change today.

Do not render a synthetic visual cover when no real media exists.
Do not prepend a duplicate Problem / Decision / Outcome summary when the case-study content already explains those points.

## Experience

Experience should be a compact chronology rather than a collection of large cards.

Each entry should prioritize:

- period;
- company;
- role;
- one high-signal responsibility or result.

Experience should be visually subordinate to Selected Work.

## Writing

Writing is supporting technical credibility.

Prefer a compact editorial index containing:

- title;
- date;
- category where available;
- clear navigation.

Writing may use a denser two-column index on desktop when this improves scanning without reducing readability.

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
- interactive row hover;
- menu expansion;
- theme transition;
- media controls.

Non-interactive chronology rows should not gain hover treatment that implies clickability.

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
- synthetic project visuals without evidence;
- oversized headings without functional hierarchy;
- excessive whitespace;
- decorative dashboards;
- repeated information panels that add ceremony instead of evidence.

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

> “I can understand who this engineer is, see the strongest work immediately, decide what deserves deeper inspection, and then find the technical reasoning without wading through presentation ceremony.”

Success means the visitor can evaluate the work **more clearly, faster, more predictably, and with less cognitive friction**.
