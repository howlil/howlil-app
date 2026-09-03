# Portfolio Design Contract

## Purpose

The portfolio is an **engineering index**, not a dashboard, SaaS landing page, magazine, or decorative developer theme.

Canonical visual direction:

> **Technical Swiss / Engineering Index**

The interface should feel like a precise engineering record: compact, typographic, evidence-led, easy to scan, and deliberately structured. Developer credibility must come from real project information, technical decisions, writing, and work history—not fake terminals or imitation product chrome.

## Design lineage

The system combines four durable ideas:

1. **International Typographic Style** — strict alignment, asymmetric but rational grids, clear type hierarchy, whitespace used as structure, and rules instead of decoration.
2. **Engineering documentation** — concise labels, predictable information order, readable line length, technical metadata, and evidence close to claims.
3. **Open-source maintainer sites** — content-first identity, direct links, work as an index rather than marketing case-study cards.
4. **Modern developer-tool polish** — precise interaction states, strong accessibility, restrained motion, and excellent dark mode without copying a specific product brand.

Do not reproduce the branding or component grammar of GitHub, Linear, Vercel, Supabase, or any other product.

## Global frame

- Primary desktop shell: approximately **54rem**.
- Long-form reading measure: approximately **66ch**.
- Wide technical evidence may use the full 54rem shell when screenshots, code, tables, or media genuinely benefit.
- Do not expand content merely because viewport space is available.
- The shell is intentionally intimate; readability and scanability take priority over filling a desktop display.

## Grid

The primary page grammar uses a stable two-part structure:

```text
8rem information rail | flexible content column
```

The rail carries section indices and labels such as:

```text
00 / INDEX
01 / WORK
02 / EXPERIENCE
03 / NOTES
```

Rules:

- align major sections to the same rail;
- prefer one strong grid over nested card layouts;
- dates and years appear early in rows when they help chronological scanning;
- metadata should align consistently across related rows;
- on mobile, preserve information order and collapse the rail above content rather than forcing narrow columns.

## Typography

Primary family:

```text
Helvetica Neue → Helvetica → Arial → system sans
```

Monospace is reserved for:

- dates and years;
- stack and technology metadata;
- section indices;
- compact labels;
- code;
- filter state.

Approximate hierarchy:

- identity / top-level title: 28–34px;
- project title: 16–18px;
- role / body: 14–15px;
- section / metadata labels: 10–11px;
- body line height: ~1.65;

Avoid display typography. No title should exist mainly to occupy visual space.

## Color

Default palette is neutral paper / graphite, not generic pure-white SaaS UI.

Use:

- neutral page and surface values;
- near-black primary text;
- restrained gray hierarchy;
- one signal blue for navigation emphasis, index markers, focus, and meaningful links;
- dark mode as the same information system inverted, not a separate visual concept.

Do not introduce secondary decorative accents without a semantic reason.

## Shape and depth

- cards are not the default container;
- borders and alignment establish hierarchy;
- radius should be zero or nearly zero;
- shadows are reserved for true overlays;
- controls should feel typographic and structural, not soft or pill-like;
- chips are allowed only for actual compact metadata or filtering.

## Page composition

### Home — engineering index

```text
00 / INDEX
identity
role
technical summary
focus / systems / stack
links

01 / WORK
chronological selected project rows

02 / EXPERIENCE
chronological professional rows

03 / NOTES
recent technical writing
```

The homepage should read as a useful record in the first viewport. It must not behave like a hero landing page.

### Work

```text
00 / WORK
literal title + scope

01 / SELECTED
high-signal engineering work

02 / ARCHIVE
remaining work
```

Each project row prioritizes:

1. year;
2. project name;
3. role when relevant;
4. concise engineering summary;
5. focus + stack;
6. case study / repository evidence.

### About

```text
00 / PROFILE
01 / OVERVIEW
02 / EXPERIENCE
03 / SCOPE
04 / EDUCATION
05 / RECOGNITION
06 / LEADERSHIP
```

About behaves like a professional record, not a biography landing page.

### Writing

Writing is a technical note index. Rows prioritize date, title, category, and excerpt. Filters remain utility controls and must not dominate the page.

### Project and article detail

Detail pages behave like engineering records / technical documents:

1. back navigation;
2. record metadata;
3. compact title;
4. summary / role / focus / stack;
5. evidence;
6. narrative and implementation trade-offs;
7. table of contents when useful.

Long-form content remains within ~66ch. Tables, code, and media may use wider evidence space only when necessary.

## Rules for technical prose

- H2 sections use a structural top rule rather than oversized type.
- Tables prefer horizontal rules over boxed spreadsheet styling.
- Code blocks are flat, square, high-contrast technical surfaces.
- Blockquotes use the signal color only as a semantic edge marker.
- Avoid zebra striping unless a dense table genuinely needs it.

## Interaction

Motion is functional only:

- menu expansion;
- theme state;
- image transitions;
- focus / hover feedback.

No scroll theatrics, decorative entrance animation, parallax, cursor effects, or motion whose only purpose is to make the site feel dynamic.

## Avoid by default

- developer dashboard imitation;
- fake terminal / CLI decoration;
- GitHub clone styling;
- Vercel-style giant monochrome marketing composition;
- magazine/editorial asymmetry;
- giant manifesto headlines;
- oversized whitespace;
- bento cards;
- glass / glow / gradients;
- decorative architecture diagrams;
- decorative metrics;
- logo clouds;
- excessive badges or pills;
- floating panels;
- 3D/WebGL decoration;
- decorative animation.

## Decision rule

A visual treatment is valid only when it materially improves at least one of:

- scanning speed;
- information hierarchy;
- comprehension;
- navigation;
- interaction feedback;
- technical evidence.

If it does not, remove it.

## Quality bar

The intended impression is:

> “This is a serious engineer’s personal record. I can identify what he builds, what he owned, what technologies and constraints mattered, and where to inspect deeper evidence without fighting the interface.”
