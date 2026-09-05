# Portfolio Design Contract

## Purpose

This portfolio presents Mhd Ulil Abshar as a **Software Engineer focused on Backend & Infrastructure**.

Canonical direction:

> **Dove Engineering Index — one structural frame, compact identity, readable evidence, floating bottom navigation.**

The product goal is fast technical evaluation. Recruiters, engineering managers, and technical peers should be able to understand identity, specialization, projects, ownership, and implementation evidence without navigating decorative presentation layers.

## Primary journey

```text
IDENTITY
→ SELECTED PROJECTS
→ COMPARE PROJECTS
→ OPEN PROJECT CASE STUDY
→ INSPECT DECISIONS / FAILURE MODES / IMPLEMENTATION
→ EXPERIENCE / WRITING / ABOUT
```

## Global visual system

### Dove palette

Light mode uses a cool dove-paper canvas, graphite text, low-contrast gray dividers, and one muted blue-gray accent. Dark mode keeps the same temperature rather than becoming neon or high-contrast.

Do not add gradients, glow, glass panels, arbitrary project colors, or decorative status colors.

### Structural frame invariant

The portfolio has one real layout frame with continuous left and right rails. Rails are border geometry, not painted background lines. Major horizontal rules terminate on those rails. Content is inset with one shared responsive frame-padding token.

Internal dividers are allowed only when they express a real relationship:

- project list → active preview;
- document body → table of contents;
- list row → next list row;
- true grouped metadata boundary.

Short decorative rails, partial rules attached to paragraphs, painted background grids, and independent line fragments are prohibited.

## Type and readability

Readability is a product requirement, not a finishing detail.

- Running body text: **16px minimum**.
- Long-form reading measure: target approximately **66ch**.
- Long-form line-height: **1.5 minimum**, preferred around **1.7** for this system font stack.
- Intro/lede copy: approximately **60ch** or shorter.
- Page titles: approximately **32–40px**, not oversized display typography.
- Metadata may be 10–14px when it is genuinely secondary and short.
- Paragraphs should carry one main idea and be visually separated; do not publish walls of text.
- Prefer left-aligned copy and stable line starts.

The 66rem portfolio frame is a composition boundary, not a license to stretch paragraph text across the frame.

## Responsive structure

Do not choose breakpoints because Tailwind exposes them. Choose them when the content still has enough usable width.

- Mobile and tablet layouts remain primarily linear.
- Structural side-by-side layouts such as Writing filter/content and article body/TOC begin at **1024px (`lg`)** unless a surface proves it can remain readable earlier.
- The Project Explorer is two-column only at `lg`; below that it becomes a linear project list.
- No route may introduce horizontal page overflow at common 360px, 768px, or desktop viewports.
- The floating navigation must remain fully inside the viewport and respect safe-area insets.

## Navigation

The site does **not** use a top navbar.

Primary navigation is a floating island fixed at bottom-center:

```text
Home · Projects · Writing · About · Theme
```

It is compact, always reachable, has a clear active state, preserves visible labels for discoverability, and is the only persistent navigation surface.

## Homepage

Homepage is not a marketing landing page.

```text
COMPACT IDENTITY
SELECTED PROJECTS EXPLORER
EXPERIENCE CHRONOLOGY
WRITING INDEX
```

Identity contains portrait, name, role, location, one engineering statement, and GitHub / LinkedIn / Resume links. No giant hero, manifesto headline, fake architecture diagram, or decorative cover graphic.

### Portrait

The portrait is identity evidence, not a hero image.

- square crop;
- minimal radius (approximately 4px);
- consistent crop position;
- approximately 96–112px on Home;
- approximately 96–112px on narrow About layouts and up to approximately 144px on desktop About;
- never large enough to compete with the engineering narrative.

## Project Explorer

Desktop:

```text
PROJECT LIST | ACTIVE PROJECT PREVIEW
```

The explorer is one closed rectangular grid. Selecting, focusing, or hovering a project changes the preview without navigation. Opening the project detail is an explicit second action.

Below `lg`, use a linear project list. Do not compress the two-column explorer into tablet widths.

Preview exposes only title/year, summary, ownership, engineering focus, implementation signal, one honest outcome, and project/repository links. Constraints and reasoning belong in the project detail.

## Projects index

The visible product term is **Projects**, not Work. Internal content taxonomy may still use `type: work`; taxonomy is not UI copy.

Projects is an engineering index, not a gallery. Featured projects use larger evidence rows; additional projects use compact rows. Avoid screenshot cards when the visual does not add evaluation value.

## Writing index

Writing uses a chronological document index, not a card gallery.

Preferred anatomy:

```text
DATE | TITLE
       EXCERPT
       CATEGORY
```

Filters stay horizontal through tablet widths and become a quiet left rail only at `lg`. They must not squeeze article rows into narrow columns.

## Technical documents and project case studies

Writing articles and project case studies share one document system.

```text
BACK LINK
RECORD TYPE / DATE / READING TIME
TITLE
SUMMARY / ACTIONS / TAGS
────────────────────────────────
DOCUMENT BODY            | TOC
```

The body and TOC split only at `lg`. Long-form content remains around 66ch even when the outer frame is wide.

### Prose hierarchy

- Body: 16px, approximately 1.7 line-height.
- H2: approximately 24px and separated by spacing rather than decorative rules.
- H3: approximately 18px.
- Inline code uses a subtle neutral background.
- Code blocks may use a dark bounded surface with restrained radius.
- Blockquotes use a simple semantic left rule.
- Tables use flat row separators and must scroll inside their own region on narrow viewports rather than widening the page.
- Real media uses restrained radius and one visible border.

## About

About is a narrative engineering profile, not an interactive CV database.

```text
ABOUT / IDENTITY + COMPACT PORTRAIT
ENGINEERING FOCUS
EXPERIENCE
EDUCATION
RECOGNITION
COMMUNITY
```

The opening narrative uses short paragraphs with one idea each. Experience, education, and community evidence are visible as flat chronology; do not hide ordinary reading content behind accordions. Avoid dense three-column CV grids.

## Footer

There is no promotional footer CTA, repeated navigation, or social icon wall. Footer contains only compact ownership/context. Primary navigation remains in the floating island.

## Interaction and motion

Motion exists only for state comprehension: Project Explorer selection, link/focus response, floating navigation active state, theme transition, and image/media controls. Respect `prefers-reduced-motion`.

## Accessibility

- visible keyboard focus;
- semantic headings and landmarks;
- Project Explorer keyboard navigation;
- active navigation exposes `aria-current`;
- usable contrast in dove light and graphite dark modes;
- no important information conveyed by color alone;
- no horizontal page overflow at supported responsive widths.

## Anti-slop rules

Do not use as default grammar: generic SaaS hero, meaningless bento, cards for ordinary rows, decorative pills, arbitrary metrics, glassmorphism, glow, fake terminal UI, fake architecture diagrams, synthetic project screenshots, oversized headings, disconnected grid fragments, repeated CTA blocks, or cards-inside-cards.

## Decision standard

Every visual or interaction choice must answer:

> What evaluation, reading, or navigation problem does this solve?

```text
USER NEED
→ REQUIRED INFORMATION
→ REQUIRED ACTION
→ REQUIRED STATE
→ SIMPLEST INTERACTION
→ VISUAL HIERARCHY
```

The intended impression is:

> “This is a precise engineering portfolio. I can understand the person, compare projects quickly, and read technical evidence without fighting the interface.”
