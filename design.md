# Howlil Portfolio Design System

> Extracted from the current `main` implementation. This document describes the design that exists in code and should be treated as the visual/interaction contract for future work.

## 1. Design direction

Howlil is a **personal engineering index**, not a SaaS landing page or portfolio template.

The interface should feel:

- compact, calm, document-like, and technically credible;
- content-first, with one narrow reading shell;
- neutral by default, with color used selectively for project identity, brand marks, focus, and state;
- tactile through restrained hover/press/layout motion rather than decorative animation;
- consistent across Home, Projects, Writing, About, project detail, and article detail routes.

The primary scan path is:

`IDENTITY → EXPERIENCE → SELECTED PROJECTS → TECH STACK → CASE STUDY / WRITING`

Avoid generic dashboard composition, oversized marketing heroes, bento grids, fake metrics, ornamental glass cards, and decorative visual noise.

---

## 2. Source of truth

Implementation order of authority:

1. `src/styles/global.css` — global tokens, layout, typography, reusable surfaces, responsive rules;
2. route/page implementations — page-specific composition and project visual treatment;
3. interactive React components — motion, hover/focus behavior, navigation, theme controls;
4. this document — design contract and rationale.

If this document and shipped code diverge, update the document together with the intentional design change.

### Stack

- Astro 5
- React 19 islands for interactive UI
- Tailwind CSS 4
- Motion for React via `motion/react`
- Lucide for interface icons
- Simple Icons for technology marks
- Font Awesome 6 marks through `react-icons` for social brands

---

## 3. Foundations

### Layout

The site uses a single centered shell:

```css
--site-shell: 40rem;
--site-gutter: 1rem;
--reading-width: 66ch;
--intro-width: 60ch;
```

Principles:

- keep the primary document column narrow even on large screens;
- use whitespace and separators to create section hierarchy instead of nested containers;
- index and long-form routes stay aligned to the same shell;
- no desktop-only wide layout should make secondary routes feel like a different product.

Primary pages start with generous top clearance for the floating navigation (`~10rem` desktop, reduced on mobile).

### Color tokens

#### Light

| Token | Value | Role |
|---|---:|---|
| `--color-page` | `#fdfdfc` | page/paper background |
| `--color-surface` | `#ffffff` | cards and raised neutral surfaces |
| `--color-surface-muted` | `#f5f5f3` | subtle grouping/background |
| `--color-surface-hover` | `#ececea` | neutral hover |
| `--color-border` | `#e8e8e5` | default separators |
| `--color-border-strong` | `#c6c7c2` | stronger edge |
| `--color-text-heading` | `#252623` | primary text |
| `--color-text-body` | `#4d4f4a` | body text |
| `--color-text-secondary` | `#74766f` | supporting copy |
| `--color-text-muted` | `#9a9d95` | metadata |
| `--color-focus` / `--color-accent` | `#5f7895` | focus and restrained accent |
| `--color-accent-soft` | `#e4eaf0` | selection/soft accent |

#### Dark

Dark mode preserves the same neutral temperature instead of turning into blue-black SaaS chrome:

- page `#181917`;
- surface `#20211f`;
- muted surface `#242522`;
- heading `#f1f2ed`;
- body `#ced1c9`;
- accent/focus `#a8bad0`.

### Typography

- UI/body/headings: `Inter`, system sans fallback.
- Code/metadata: SFMono/Consolas/Liberation Mono/Menlo.
- Home identity name: Georgia / Times-style serif, italic, compact, slightly editorial.
- Body copy is approximately `1rem` with `1.7–1.72` line-height.
- Headings are intentionally modest; hierarchy comes from spacing, weight, and section boundaries rather than huge type.
- Eyebrows and compact metadata use mono, small size, and restrained tracking.

### Radius

```css
--radius-sm: .375rem;
--radius-md: .625rem;
--radius-lg: .9rem;
--radius-pill: 9999px;
```

Large rounded rectangles are reserved for meaningful cards/popovers. Do not round every content block.

---

## 4. Navigation

The persistent navigation is a **floating identity surface centered at the top**.

### Closed state

- compact width around `20rem`;
- avatar + name + rotating secondary status;
- `⌘ K` / `Ctrl K` keyboard hint;
- translucent neutral surface with strong backdrop blur;
- subtle border, no colored outline.

The top viewport also has a soft page-colored haze:

- vertical transparent gradient;
- `blur(18px)` plus mild saturation;
- mask fades the blur naturally into content.

This prevents content beneath the navbar from becoming visually noisy while keeping the floating surface lightweight.

### Open state

- expands to around `25rem`;
- sections and routes are icon-led rows;
- active route/section is stateful and accessible;
- includes Light / Dark / System theme controls;
- opens on pointer hover, button click, or `⌘/Ctrl K`;
- closes on pointer exit when focus is outside, outside pointer interaction, Escape, or navigation.

### Status line

The secondary identity line rotates between:

1. availability;
2. Jakarta / remote location;
3. local Jakarta time;
4. backend & infrastructure role.

The green availability dot is the deliberate exception to the otherwise neutral nav: it softly pulses with scale, opacity, and a small green halo. It should read as **live status**, not decorative neon.

---

## 5. Page composition

### Home

Home is a vertical engineering profile, in this order:

1. identity + concise positioning copy;
2. contact/social actions;
3. GitHub activity link;
4. Experience;
5. Selected Projects;
6. Tech Stack.

Major sections are separated by **1px dashed neutral rules**. Section titles are small, icon-led, and have large whitespace before content.

### Experience

Experience is a flat chronological list, not a boxed card timeline.

Each role contains:

- period;
- role + company;
- company description;
- concise achievement bullets;
- technology badges.

Company logos live in small tonal logo wells:

- light logos: white → warm-gray tonal gradient;
- dark logos: black → charcoal tonal gradient;
- only subtle inset highlight;
- no logo-colored glow or surrounding aura;
- preserve the original mark using `object-fit: contain`.

The logo container supports the mark; it must not compete with the role title.

### Projects

Projects are the most chromatic surface in the site.

Desktop uses a two-column grid; cards collapse for narrow screens.

Each card has:

- year / archive metadata;
- case-study action affordance;
- large central icon tile;
- title + short summary.

Current project palette:

| Tone | Glow | Gradient start | Gradient end |
|---|---:|---:|---:|
| Violet | `#7c3aed` | `#9b5cff` | `#6d28d9` |
| Cyan | `#0ea5e9` | `#38bdf8` | `#0284c7` |
| Rose | `#f43f5e` | `#fb7185` | `#e11d48` |

Treatment:

- card background uses a restrained radial color field blended into the neutral muted surface;
- icon tile uses a saturated diagonal gradient;
- glow belongs to the **project artwork**, not to unrelated UI;
- icon stays white for strong contrast;
- hover lifts card `~3px` and slightly scales the artwork;
- non-hovered project artwork may desaturate when another card is targeted.

Do not replace these with pale pastel cards. Project color should feel vivid and intentional while the surrounding site remains neutral.

### Tech stack

Technology marks use their recognizable brand colors.

Interaction model:

- default: full brand color;
- when the grid is being explored, non-target marks become grayscale and lower-opacity;
- hovered mark returns to full color and scales slightly.

This creates focus without adding card chrome around every logo.

### Projects / Writing index routes

Index routes remain document-like:

- compact route header;
- dashed section boundary;
- flat rows or the same project-card language;
- date/metadata in mono;
- hover via neutral background change, not raised generic cards.

### About

About uses the same shell and typography system. Structured records (education, awards, organizations, work) use simple rows with borders rather than dashboard panels.

### Long-form project and article routes

- one uninterrupted reading column;
- compact metadata above the document;
- technical content remains readable before ornamental composition;
- tables can scroll horizontally on narrow screens;
- route chrome must not compete with the article/case study.

---

## 6. Surfaces and depth

Default depth is created by **border + tone**, not shadow.

Use shadow when the element is genuinely floating:

- floating navbar;
- social hover preview;
- vivid project artwork.

### Social preview

Social links expose compact hover/focus profile previews:

- translucent neutral surface;
- `backdrop-filter: blur(16px)`;
- soft deep shadow;
- avatar + profile metadata + action;
- GitHub may include a contribution-calendar preview.

This is contextual information, so the popover can be richer than ordinary page content.

---

## 7. Motion grammar

Motion should communicate **state, hierarchy, focus, or direct manipulation**.

Current patterns:

- navbar layout expansion: spring (`stiffness ~420`, `damping ~38`);
- menu reveal: height + opacity over roughly `240ms` with an ease-out curve;
- buttons/cards: `~160–200ms` translation/scale feedback;
- project hover: lift + icon scale;
- stack hover: desaturation/focus;
- social previews: compact enter/exit motion;
- availability dot: continuous `1.8s` soft pulse.

Rules:

- no ambient motion that does not convey meaning;
- avoid exaggerated bounce, parallax, cursor-following glow, and decorative particles;
- respect `prefers-reduced-motion` for all motion paths;
- reduced-motion mode should effectively collapse animation/transition durations and use instant scrolling.

---

## 8. Interaction and accessibility

Required behavior:

- semantic heading hierarchy and landmarks;
- skip link to main content;
- visible `:focus-visible` ring using `--color-focus`;
- `aria-current` for active navigation state;
- `aria-expanded` and `aria-controls` for the floating menu;
- theme controls expose pressed state;
- hover-only information must also be reachable through keyboard focus;
- all image links and controls keyboard reachable;
- important state is never conveyed by color alone;
- theme respects explicit user selection and System preference.

Minimum focus treatment is a `2px` focus outline with `3px` offset.

---

## 9. Responsive contract

Primary breakpoint: `700px`, with additional compact adjustments around `420px`.

Rules:

- maintain the same content hierarchy on mobile; do not invent a separate mobile product;
- reduce top whitespace while retaining clearance for floating navigation;
- project grid collapses from two columns to one;
- lists/records collapse cleanly instead of forcing narrow multi-column metadata;
- action groups wrap without horizontal overflow;
- tables in technical writing become horizontally scrollable when needed;
- navigation stays within `calc(100vw - 2rem)`;
- respect safe-area inset at the top;
- no route should introduce horizontal overflow at phone, tablet, or desktop widths.

---

## 10. Implementation rules

When extending the design:

1. Reuse existing tokens before introducing raw colors.
2. Reuse the `40rem` site shell unless the content genuinely requires a wider technical surface.
3. Prefer flat rows + separators for information-dense content.
4. Use neutral surfaces for utility UI; reserve vivid gradients for project identity/artwork.
5. Company/brand marks keep natural brand identity; their container stays tonal and restrained.
6. Prefer Lucide for UI semantics, Simple Icons for technology brands, and maintained social brand icons.
7. Interactive behavior belongs in focused React islands; static content stays Astro-first.
8. Use Motion only when CSS state transitions are insufficient or layout/enter/exit behavior benefits from it.
9. Preserve Light / Dark / System behavior.
10. Validate reduced motion, keyboard navigation, and responsive overflow whenever shared layout or interaction primitives change.

### Anti-regression checklist

Do not introduce:

- generic SaaS hero composition;
- bento dashboard layouts;
- oversized headings that destroy the reading rhythm;
- pastel/desaturated project art in place of the vivid current palette;
- glow that follows company logos or ordinary UI;
- permanent glassmorphism across content surfaces;
- deep shadows on non-floating content;
- inconsistent wide layouts on secondary routes;
- decorative motion without interaction/state value;
- duplicate component styling that bypasses the global design tokens.
