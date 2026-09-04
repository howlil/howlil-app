# Portfolio Design Contract

## Purpose

The portfolio should demonstrate the craft of a strong **product designer** while preserving the owner's real identity as a software engineer.

Canonical visual direction:

> **Product Craft / Outcome-led Case Studies**

The site is not a design-role costume. Do not relabel the owner as a Product Designer or invent research, metrics, screens, users, experiments, or outcomes. Product-design credibility comes from how real engineering work is framed: problem clarity, decision quality, system behavior, outcome evidence, visual hierarchy, and interaction craft.

## Design lineage

Use durable principles from high-quality product-design portfolios:

1. **Curated work over exhaustive archives** — lead with 2–4 high-signal case studies.
2. **Decision trail over process theater** — explain the constraint, decision, and result.
3. **Visual storytelling with truthful evidence** — real screenshots when available; otherwise art-directed diagrams or case-study maps built only from verified project content.
4. **Strong personal positioning** — concise hero statement and clear scope.
5. **Editorial pacing + product UI discipline** — more spatial and visual than documentation, but still precise and usable.

Do not clone a specific designer, Dribbble shot, agency, Framer template, Vercel site, or portfolio directory example.

## Identity rule

The portfolio may look like it was designed by an experienced product designer, but factual identity must remain accurate.

Use language such as:

- Software Engineer
- Backend & Infrastructure
- Product systems
- Product thinking grounded in implementation
- System behavior, reliability, and clarity

Do not claim:

- Product Designer as a job title unless supported by source data;
- user research that did not happen;
- conversion / retention / revenue metrics without evidence;
- fictional customers, personas, experiments, or UI screens.

## Global frame

- Desktop shell: approximately **58rem**.
- Long-form reading measure: approximately **66ch**.
- Hero and case-study visual surfaces may use the full shell.
- Body copy should not stretch merely because the viewport is wide.
- Mobile preserves the same content priority with stacked visual/text surfaces.

The shell is intentionally broader than the previous engineering index because case-study visuals need room, but it remains far below a marketing landing-page width.

## Typography

Primary family: native system sans-serif.

Use the display hierarchy deliberately:

- Home hero: ~42–52px desktop, never viewport-dominating.
- Page title: ~38–48px.
- Featured project title: ~24–30px.
- Section title: ~25–32px.
- Body: 14–16px.
- Metadata / eyebrow: 10–11px, monospace allowed where appropriate.

Headlines may be expressive through scale, line breaks, and tight tracking, but should remain concise. Avoid giant manifesto typography and magazine-scale empty space.

## Color

Light mode:

- warm neutral canvas;
- cream / near-white surfaces;
- graphite text;
- muted brown-gray hierarchy;
- one indigo/cobalt accent.

Dark mode uses the same semantic system with warm near-black surfaces and a lighter indigo accent.

Accent color is for:

- important links;
- selected filter state;
- focus indication;
- limited emphasis inside project visuals.

Do not create a rainbow design system. Project visual surfaces may use a small set of muted art-direction palettes, but text and interaction semantics remain consistent.

## Shape and depth

Cards are allowed when they create a meaningful product-design surface.

Use:

- 8–12px radius for controls and small surfaces;
- ~18px radius for content cards;
- ~22–24px radius for major visual case-study canvases;
- subtle borders;
- shallow, interaction-only elevation.

Avoid:

- rounded-everything UI;
- nested cards for every metadata field;
- glassmorphism as decoration;
- heavy shadows;
- glow;
- gradients without a content reason.

## Home

The homepage must answer within the first viewport:

1. who the owner is;
2. what kind of problems they work on;
3. why their work matters;
4. where to inspect case studies.

Recommended composition:

```text
Concise positioning + portrait

Selected work
  large case-study visual + title + summary + role + focus
  large case-study visual + title + summary + role + focus
  large case-study visual + title + summary + role + focus

Experience
  compact curated professional history

Writing
  editorial note cards
```

The portrait is supporting identity, not a giant lifestyle hero.

## Work

Featured work is the main product-design surface.

Each featured case study should expose:

- project name;
- concise summary;
- role;
- year;
- product/system focus;
- problem;
- key decision;
- outcome;
- link to deeper case study;
- repository/live evidence when available.

When no real screenshot exists, use an explicit **Decision Trail / Case Study Map** generated from existing project metadata. This surface must never impersonate a real application screen.

Secondary work may use smaller cards and should not compete visually with featured work.

## Project detail

Project detail is an outcome-led case study, not a raw technical document.

Order:

1. back navigation;
2. case-study label + date;
3. title + concise summary;
4. truthful visual evidence or decision-trail visual;
5. Role / Focus / Stack context;
6. Problem / Decision / Outcome summary;
7. deeper technical narrative;
8. repository / live / video evidence when available.

Long technical sections remain readable and can preserve code, tables, and implementation detail.

## About

About should communicate a product mindset without rewriting career history.

Use:

- concise personal statement;
- portrait;
- verified overview;
- capability cards from actual technical scope;
- professional experience;
- education, recognition, and leadership as supporting context.

Avoid personality-copy filler and invented design methodology.

## Writing

Writing is an editorial extension of the portfolio.

Use:

- clear positioning header;
- horizontal topic filters;
- two-column article cards on desktop when content density supports it;
- date, category, title, excerpt, and clear navigation.

Filters may use pills because they are true stateful controls. Pills should not spread to unrelated metadata by default.

## Long-form content

- reading measure ~66ch;
- H2 around 24px with generous spacing;
- H3 around 17px;
- paragraphs ~15px with ~1.7 line height;
- blockquotes may use an accent-soft background and semantic edge;
- code blocks use restrained radius and high contrast;
- tables can use a contained card/table surface when dense information benefits;
- images and media receive consistent rounded framing.

## Navigation

Navigation should feel like a polished personal portfolio, not docs or developer tooling.

- simple labels: Work / Writing / About / Resume;
- active state through weight / subtle background, not numbered indices;
- contained navigation surface is allowed;
- mobile menu should preserve the same labels;
- theme control is compact and accessible.

## Motion

Functional micro-interaction is encouraged when it improves perceived craft:

- card hover elevation / 1–2px translation;
- menu expansion;
- image transitions;
- active/focus states.

All motion must respect `prefers-reduced-motion`.

Avoid scroll hijacking, cursor followers, parallax, auto-playing decorative motion, page intro theatrics, and interaction that delays navigation.

## Avoid by default

- fake UI screenshots;
- fake metrics;
- fake research artifacts;
- fake personas;
- Dribbble-style beauty shots without context;
- design-process diagrams with invented steps;
- giant agency manifesto copy;
- decorative bento grids;
- glass / glow / gradient AI slop;
- excessive pills;
- terminal / code decoration;
- Swiss numbered rails as the main page grammar;
- dashboard imitation;
- visual complexity that hides the work.

## Decision rule

A visual treatment is valid only when it improves one or more of:

- comprehension of the problem;
- clarity of the decision;
- visibility of the outcome;
- evidence quality;
- navigation;
- hierarchy;
- personality without factual distortion;
- interaction feedback.

If it merely makes the page look more designed, remove it.

## Quality bar

The intended impression is:

> “This engineer has unusually strong product judgment and visual craft. I can understand the problem, the decision, and the result quickly, then go deep into the technical evidence if I want.”
