# Portfolio Design Contract

## Purpose

This portfolio presents Mhd Ulil Abshar as a **Software Engineer focused on Backend & Infrastructure**.

Canonical direction:

> **Project Explorer + Casefile Detail**

The site should let a recruiter, engineering manager, or technical peer understand who the engineer is, compare the strongest systems quickly, and choose where to inspect technical depth.

The portfolio is not a SaaS landing page, developer dashboard, terminal simulator, product-designer case-study site, or documentation portal.

## Product job

The primary visitor journey is:

```text
IDENTITY
→ COMPARE SELECTED WORK
→ CHOOSE A PROJECT
→ INSPECT ENGINEERING JUDGMENT
→ EXPERIENCE / WRITING
→ RESUME / GITHUB / CONTACT
```

The homepage should optimize **comparison before commitment**. A visitor should not need to open and back out of several project pages just to understand which project is relevant.

## Core interaction model

### Desktop

Selected Work uses an explorer pattern:

```text
PROJECT LIST          LIVE PREVIEW
────────────          ────────────
Project A             Summary
Project B             Ownership
Project C             Engineering focus
                      Implementation
                      Outcome
                      Case study / Repository
```

- First project is active by default.
- Hover, focus, click, and arrow-key navigation may change the active preview.
- Selection changes only the preview; it does not navigate automatically.
- Explicit links open the full case study or repository.

### Mobile

Do not force the desktop explorer into a narrow viewport.

Use a linear project list containing enough evidence to decide whether to open each project.

## Progressive disclosure

Homepage / explorer scan layer:

```text
project identity
year
summary
ownership
engineering focus
implementation signal
outcome
links
```

Full project detail layer:

```text
constraints
decisions
state / architecture reasoning
failure modes
implementation detail
limitations
what would change today
```

Do not repeat the same technical explanation at multiple levels.

## Homepage composition

Recommended order:

```text
Simple navigation

Compact identity
  portrait
  name
  role
  one-sentence positioning
  GitHub / LinkedIn / Resume

Selected Work
  interactive explorer on desktop
  linear evidence list on mobile

Experience
  compact chronology

Writing
  compact editorial index
```

There is no traditional marketing hero. Real engineering work should appear early.

## Identity

Identity is context, not the main content surface.

Keep it compact:

- portrait around 96–128px on desktop;
- name around 34–40px;
- role clearly visible;
- one concise positioning sentence;
- primary profile links.

Do not add availability claims, metrics, or personal facts unless they are explicitly supported by source data.

## Navigation

Navigation should visually disappear into the page structure.

Desktop:

```text
howlil                         Work  Writing  About  Theme
```

Rules:

- flat fixed bar;
- one bottom divider;
- no floating capsule;
- no shadow;
- no segmented navigation chrome;
- no Resume item when Resume is already exposed in identity;
- active state through typography, not decorative indicators.

Mobile may use a minimal Menu / Close control.

## Selected Work

Selected Work is the dominant homepage surface.

The explorer list should prioritize:

- sequence;
- title;
- year;
- one or two engineering-focus signals.

The preview should prioritize:

- concise system summary;
- ownership;
- engineering focus;
- compact implementation stack;
- one real outcome;
- case study and repository links.

Do not use decorative screenshots, invented diagrams, fake terminals, arbitrary project colors, or cards around every field.

## Experience

Experience is supporting credibility.

Use chronology rather than cards:

```text
PERIOD        COMPANY / ROLE
              one high-signal contribution
```

Do not give Experience the same visual prominence as Selected Work.

## Writing

Writing should be a quiet index:

```text
DATE         TITLE                                      →
```

Keep it denser than Selected Work.

## Project detail

Full project pages remain focused technical case studies.

Recommended order:

1. back navigation;
2. title + system summary;
3. repository / live / video links;
4. ownership / focus / implementation brief;
5. real media when available;
6. technical narrative;
7. constraints, decisions, state, architecture, or failure modes as supported by the narrative;
8. observed result;
9. limitations / what would change today.

Never create synthetic project media simply to fill a cover region.

## Visual language

### Dove palette

Light mode is a cool dove-paper system, not warm cream:

- page: cool dove gray;
- bounded surface: slightly lighter dove;
- text: graphite;
- secondary text: cool neutral gray;
- divider: low-contrast stone gray;
- accent: restrained blue-gray.

Dark mode is the equivalent graphite / cool-neutral system.

Accent color is reserved for navigation, focus, selected explorer state, and links.

### Structure

Use:

```text
TYPOGRAPHY
→ ALIGNMENT
→ SPACING
→ DIVIDERS
→ SELECTION STATE
→ CONTAINER ONLY WHEN REQUIRED
```

Avoid background grid wallpaper. Precision should come from alignment and rules rather than decorative graph-paper treatment.

### Shape

- portrait / media may use restrained 10–14px radius;
- controls use minimal radius only where functionally useful;
- explorer itself is a bordered structural region, not a floating card;
- no shadows for ordinary content.

## Typography

- native system sans for primary reading and headings;
- monospace only for dates, sequence numbers, compact metadata, and technical labels;
- no giant manifesto typography;
- no deliberately tiny body copy.

Suggested desktop hierarchy:

- name: 34–40px;
- explorer project title: 28–32px;
- section title: 23–27px;
- body: 14–16px;
- metadata: 10–12px.

## Motion

Only use motion for state comprehension:

- explorer selection;
- link state;
- mobile menu;
- theme transition;
- real media controls.

No page-intro reveal, parallax, cursor follower, typing animation, scroll hijacking, or decorative motion.

Respect `prefers-reduced-motion`.

## Accessibility

The explorer must remain operable without a pointer.

Desktop selection behavior should support:

- Tab focus;
- Arrow Left / Right;
- Arrow Up / Down;
- Home / End;
- visible focus state;
- explicit semantic tab / panel relationships.

Mobile must not depend on hover or hidden preview state.

## Anti-slop rules

Do not introduce:

- generic SaaS hero composition;
- decorative bento layouts;
- excessive pills or badges;
- arbitrary metrics;
- nested cards;
- glow or glassmorphism;
- random gradients;
- fake terminal UI;
- fake architecture diagrams;
- decorative dashboards;
- invented screenshots;
- repeated evidence blocks;
- whitespace without information-hierarchy purpose.

## Decision standard

Every UI decision should answer:

> Does this help someone evaluate the engineer or choose what evidence to inspect next?

Use:

```text
USER NEED
→ REQUIRED INFORMATION
→ REQUIRED ACTION
→ SIMPLEST INTERACTION
→ CLEAR STATE
→ VISUAL HIERARCHY
```

If a visual element does not materially improve comprehension, comparison, navigation, or evidence, remove it.

## Quality bar

Target impression:

> “I immediately understand this engineer, can compare the strongest work without friction, and can inspect technical depth only where I need it.”

The interface should feel distinctive because the browsing model is precise—not because decoration was added.
