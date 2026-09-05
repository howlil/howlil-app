# Portfolio Design Contract

## Purpose

This portfolio presents Mhd Ulil Abshar as a **Software Engineer focused on Backend & Infrastructure**.

Canonical direction:

> **Dove Engineering Index — one structural frame, compact identity, evidence-first content, floating bottom navigation.**

The product goal is fast technical evaluation. A recruiter, engineering manager, or technical peer should be able to understand identity, specialization, strongest systems, ownership, and implementation evidence without navigating decorative presentation layers.

## Primary journey

```text
IDENTITY
→ SELECTED ENGINEERING WORK
→ COMPARE PROJECTS
→ OPEN TECHNICAL CASE STUDY
→ INSPECT DECISIONS / FAILURE MODES / IMPLEMENTATION
→ EXPERIENCE / WRITING / ABOUT
```

## Global visual system

### Dove palette

Light mode uses a cool dove-paper canvas, graphite text, low-contrast gray dividers, and one muted blue-gray accent.

Dark mode uses the same temperature rather than a separate neon or high-contrast aesthetic.

Color hierarchy:

```text
page
→ surface only when bounded state is necessary
→ divider
→ graphite text
→ muted metadata
→ blue-gray interactive accent
```

Do not add gradients, glow, glass panels, arbitrary project colors, or decorative status colors.

### Structural frame invariant

The portfolio has one real layout frame with continuous left and right rails. The rails are **border geometry**, not painted background lines. They must run through the complete page, including the footer, without restarting per section.

Major horizontal section rules belong to the section border box and terminate directly on those outer rails. Content is inset with one shared frame padding token so text, media, and controls never touch the rails.

Required geometry:

```text
OUTER RAIL | FRAME PADDING | CONTENT | FRAME PADDING | OUTER RAIL
           ├──────────────── SECTION RULE ────────────┤
```

Internal dividers are allowed only when they express a real relationship:

- explorer list → preview;
- document body → table of contents;
- list row → next list row;
- true grouped metadata boundary.

Short decorative rails, partial rules attached to paragraphs, painted background grids, and independent line fragments are prohibited. If a line does not define a real container, row, section, or column relationship, remove it.

### Shell and reading measure

- Portfolio frame: approximately **66rem**.
- Frame inset: one shared responsive padding token.
- Long-form reading measure: approximately **68ch**.
- Major horizontal rules span the full frame.
- Long-form prose remains narrow even when the surrounding document frame is wide.

## Navigation

The site does **not** use a top navbar.

Primary navigation is a **floating island fixed at bottom-center** containing:

```text
Home · Work · Writing · About · Theme
```

Behavior:

- compact and always reachable;
- clear active state;
- text labels remain visible for discoverability;
- one subtle elevation shadow is allowed because the control floats above content;
- safe-area aware on mobile;
- no hidden desktop hamburger menu;
- no GitHub counters, decorative badges, or oversized branding inside the island.

The floating island is the only persistent navigation surface.

## Homepage

Homepage is not a marketing landing page.

Order:

```text
COMPACT IDENTITY
SELECTED WORK EXPLORER
EXPERIENCE CHRONOLOGY
WRITING INDEX
```

Identity contains:

- portrait;
- name;
- Software Engineer / Backend & Infrastructure;
- location;
- one concise engineering statement;
- GitHub / LinkedIn / Resume.

No giant hero, manifesto headline, fake architecture diagram, or decorative cover graphic.

### Project Explorer

Desktop:

```text
PROJECT LIST | ACTIVE PROJECT PREVIEW
```

The explorer is one closed rectangular grid. Its outer border, project-row separators, and list/preview divider must meet cleanly. Do not use floating or partial outcome rails inside it.

The list is optimized for comparison. Selecting, focusing, or hovering a project changes the preview without navigation. Opening the case study is an explicit second action.

Mobile falls back to a linear project list inside the same closed boundary. Do not compress the two-column explorer into a narrow viewport.

Preview exposes only:

- title / year;
- summary;
- ownership;
- engineering focus;
- implementation signal;
- one honest outcome;
- case study / repository links.

Detailed constraints and decisions belong in the case study.

## Work index

Work is an engineering index, not a gallery.

Featured work may use larger evidence rows. Additional work should use compact rows. Avoid screenshot cards when the project has no useful visual evidence.

The index answers:

> Is this system technically relevant enough to inspect in depth?

## Writing index

Writing must use the same structural language as Work.

Do not use a 2-column card gallery.

Preferred anatomy:

```text
DATE | TITLE + EXCERPT | CATEGORY | →
```

Filters belong in the writing rail as quiet text controls. Do not create independent pill borders or decorative filter grids when the column boundary already provides enough structure.

The writing index optimizes browsing and chronology rather than visual promotion.

## Technical documents and case studies

Writing articles and project case studies share one document system.

Structure:

```text
BACK LINK
RECORD TYPE / DATE / READING TIME
TITLE
SUMMARY / ACTIONS / TAGS
────────────────────────────────
DOCUMENT BODY            | TOC
                         |
                         |
```

The body and TOC are separated by one continuous vertical divider on desktop. Both columns own their padding so content never sits on the divider.

### Prose hierarchy

- Body: 14–16px with approximately 1.7 line-height.
- H2 starts a new reasoning section through typography and spacing, not a default decorative rule.
- H3 is subordinate and should not resemble a card title.
- Inline code may use a subtle neutral background.
- Code blocks may use a dark bounded surface, but with restrained radius.
- Blockquotes use a simple left rule because quotation semantics justify it.
- Tables are flat documents: top/bottom rule + row separators, not rounded data cards.
- Real media uses restrained radius and a visible border.

Tags are textual metadata. Prefer compact mono links separated by dots over pill collections when interaction state is not required.

## Table of contents

TOC is a document rail, not a floating card and not a second grid.

- no rounded card container;
- no independent row rules by default;
- active section indicated through typography/color;
- sticky on desktop;
- omitted from narrow layouts when it would compete with reading space.

The body/TOC column divider provides the structural line; the TOC itself should remain typographic.

## About

About uses the same outer frame and section boundaries.

Sections:

```text
IDENTITY / PORTRAIT
ENGINEERING SCOPE
EXPERIENCE
EDUCATION / RECOGNITION / LEADERSHIP
```

Portrait is real identity evidence, not a decorative card.

Background groups use shared horizontal boundaries plus spacing. Do not add small independent vertical rails around each group.

## Footer

There is no promotional footer CTA.

Do not render:

- “Keep in touch” marketing block;
- repeated Work/Writing/About navigation;
- repeated social icon wall.

Footer contains only compact ownership/context such as copyright and role. Its top rule spans the full structural frame. Primary navigation remains in the floating island.

## Interaction and motion

Motion exists only for state comprehension:

- Project Explorer selection;
- link/focus response;
- floating navigation active state;
- theme transition;
- image preview/media controls.

Avoid page-intro animation, parallax, cursor followers, typing effects, animated gradients, or continuous decorative motion.

All interaction must respect `prefers-reduced-motion`.

## Accessibility

- visible keyboard focus;
- semantic headings and landmarks;
- Project Explorer keyboard navigation;
- active navigation exposes `aria-current`;
- mobile has no horizontal overflow;
- contrast must remain usable in both dove light and graphite dark modes;
- no important information conveyed by color alone.

## Anti-slop rules

Do not use as default grammar:

- generic SaaS hero;
- bento without information need;
- cards for ordinary rows;
- decorative pills;
- arbitrary metrics;
- glassmorphism;
- glow;
- fake terminal UI;
- fake architecture diagrams;
- synthetic project screenshots;
- oversized headings;
- disconnected grid fragments;
- repeated CTA blocks;
- card-inside-card layouts.

## Decision standard

Every visual or interaction choice must answer:

> What evaluation or navigation problem does this solve?

Use:

```text
USER NEED
→ REQUIRED INFORMATION
→ REQUIRED ACTION
→ REQUIRED STATE
→ SIMPLEST INTERACTION
→ VISUAL HIERARCHY
```

The intended impression is:

> “This is a precise engineering portfolio. I can compare the strongest systems quickly, understand ownership, and move into readable technical evidence without fighting the interface.”
