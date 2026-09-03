# Portfolio Design Contract

## Purpose

The portfolio should feel like an engineer's working surface, not a magazine spread, landing-page template, or decorative developer theme. The visual identity is **developer workspace**: compact, structured, technical, readable, and evidence-led.

## Hierarchy

1. Identity is literal and compact: name, role, engineering domain, and a short technical summary.
2. Work is presented as a scan-friendly engineering index, not a sequence of promotional feature sections.
3. Project rows expose real metadata: scope, stack, ownership, date, repository, and case study.
4. Experience and notes behave like reference lists.
5. Project detail reads like technical documentation; blog prose may remain more editorial for long-form readability.
6. Prefer alignment, column structure, density, and metadata over oversized typography or decorative composition.

## Visual vocabulary

Use:
- neutral developer-tool surfaces in light and dark mode;
- system sans-serif for navigation, product surfaces, project pages, and metadata labels;
- monospace for real technical metadata such as dates, stack, indices, code, and compact labels;
- serif only for long-form editorial prose where it improves reading;
- compact toolbar-like navigation;
- thin structural borders and stable columns;
- restrained radius and almost no shadow;
- real screenshots or media only when they provide evidence;
- functional motion only for interaction feedback.

Avoid by default:
- giant manifesto headlines;
- magazine-style asymmetry and oversized whitespace;
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

## Homepage composition

The homepage is an engineering index:

1. compact profile and engineering domain;
2. real technical metadata;
3. selected work rows;
4. professional experience rows;
5. notes index.

No homepage section should behave like a poster or campaign hero. The first viewport should be useful even when scanned rather than read linearly.

## Project composition

Project detail prioritizes:

1. project identity and summary;
2. role / focus / stack;
3. constraint / engineering decision / outcome;
4. technical narrative and implementation trade-offs;
5. repository or live evidence where available.

Technical project prose uses the UI sans-serif language. Long-form blog writing may use the dedicated prose serif.

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
