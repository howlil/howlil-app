# Portfolio Design Contract

## Purpose

The portfolio should feel like an engineer's working surface, not a magazine spread, landing-page template, or decorative developer theme. The visual identity is **developer workspace**: compact, structured, technical, readable, and evidence-led.

## Global frame

- The primary site shell is intentionally narrow: approximately **56rem** on desktop.
- Long-form prose is constrained by **measure**, not viewport width: target approximately **68ch** so normal reading stays around the 60–70 character range.
- Wider evidence surfaces may expand to approximately **48rem** when screenshots, tables, or technical media benefit from it.
- Do not expand page width simply because viewport space is available.
- Do not make prose share the full width of metadata tables or evidence surfaces.
- Reading and scanning density take priority over dramatic whitespace.

## Hierarchy

1. Identity is literal and compact: name, role, engineering domain, and a short technical summary.
2. Work is presented as a scan-friendly engineering index, not a sequence of promotional feature sections.
3. Project rows expose real metadata: scope, stack, ownership, date, repository, and case study.
4. Experience and writing behave like reference lists.
5. Project and writing detail use the same technical reading language as the rest of the product.
6. Prefer alignment, column structure, density, and metadata over oversized typography or decorative composition.

## Visual vocabulary

Use:
- neutral developer-tool surfaces in light and dark mode;
- system sans-serif across navigation, page UI, project content, and long-form writing;
- monospace for real technical metadata such as dates, stack, indices, code, filters, and compact labels;
- compact toolbar-like navigation;
- thin structural borders and stable columns;
- restrained radius and almost no shadow;
- real screenshots or media only when they provide evidence;
- functional motion only for interaction feedback;
- page headings normally in the 24–30px range rather than display sizes.

Avoid by default:
- giant manifesto headlines;
- magazine-style asymmetry and oversized whitespace;
- serif-led editorial surfaces;
- dominant flagship compositions that consume a viewport;
- fake terminals, random code, code rain, or hacker decoration;
- architecture/workflow diagrams as portfolio decoration;
- decorative gradients, glow, glass, or floating panels;
- decorative bento layouts;
- logo clouds and decorative metric widgets;
- excessive pills/chips;
- repeated marketing-style Problem / Decision / Result grids;
- large rounded cards without a structural reason;
- 3D/WebGL decoration;
- animation added only to make the portfolio feel dynamic.

## Page composition

All top-level routes share the same workspace grammar.

### Home

1. compact profile and engineering domain;
2. real technical metadata;
3. selected work rows;
4. professional experience rows;
5. notes index.

### Work

1. literal page identity;
2. selected engineering rows;
3. archive rows;
4. no promotional flagship surface.

### About

1. compact profile summary;
2. experience rows;
3. technical scope;
4. education / recognition / leadership reference sections;
5. section labels behave like documentation metadata.

### Writing

1. compact page identity;
2. utility-like tag filters;
3. technical note rows;
4. article detail stays inside the same developer reading system rather than switching to editorial typography.

### Project detail

1. project identity and summary;
2. role / focus / stack;
3. constraint / engineering decision / outcome;
4. technical narrative and implementation trade-offs;
5. repository or live evidence where available.

## Decision rule

Before adding a visual treatment, it must materially improve at least one of:

- scanning speed;
- information hierarchy;
- comprehension;
- navigation or interaction feedback;
- technical evidence.

If it does not, do not add it.

## Responsive rule

Mobile keeps the same information order and compact scanning model. Metadata rows stack cleanly, links remain touch-safe, and no surface may create horizontal page overflow.
