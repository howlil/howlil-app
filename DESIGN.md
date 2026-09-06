# Portfolio Design Contract

## Direction

**Personal engineering index** — a narrow, calm, document-like portfolio that makes identity, shipped work, and engineering judgment easy to scan.

The reference direction uses a compact identity pill, a single reading column, quiet separators, light project tiles, and a small command-style navigation surface. We use those interaction and composition patterns while keeping the portfolio's own content, evidence, and muted steel-blue accent.

## Product outcome

A recruiter, engineering manager, or technical peer should be able to understand who Mhd Ulil Abshar is, what systems he has worked on, and how he thinks about correctness and operations within a few minutes.

## Primary journey

`IDENTITY → EXPERIENCE → SELECTED PROJECTS → TOOLKIT → CASE STUDY`

## Visual system

- Paper-like light surface and graphite text.
- Dark mode preserves the same neutral temperature.
- Steel-blue is reserved for links, focus, and active states.
- Borders express grouping; shadows are reserved for the floating identity/navigation surface.
- Project tiles may use restrained semantic tints for scanability. No gradients, glow, glass panels, fake metrics, or synthetic screenshots.
- Typography stays compact and readable: 16px body text, approximately 1.65–1.75 line-height, and a 40rem maximum reading frame.

## Navigation

The persistent navigation is a compact identity pill at the top center. Clicking it expands the section menu and theme controls. `Ctrl/⌘ K` toggles the menu. Its secondary line rotates between availability, location, local time, and role.

## Homepage

The homepage is a personal engineering index:

1. identity and short positioning;
2. production experience as a flat timeline;
3. selected projects as visual tiles that open real case studies;
4. toolkit as a compact text grid;

The page must not become a generic marketing landing page, oversized hero, or bento dashboard.

## Route system

- Projects, Writing, About, project details, and article details use the same 40rem shell and floating identity navigation as the homepage.
- Route headers remain compact and icon-led; numbered eyebrows, oversized titles, wide sidebars, and desktop-only TOC rails are not part of the current system.
- Index routes use dashed section separators, compact metadata, flat list rows, and the same project tiles used on the homepage.
- Long-form routes use one uninterrupted reading column so the document rhythm remains consistent at every breakpoint.

## Icons

- Interface icons come from Lucide.
- Technology brand marks come from the Simple Icons catalog via `@icons-pack/react-simple-icons`; do not approximate brand marks with generic interface icons.

## Responsive behavior

- Keep one reading column at mobile and desktop.
- Project tiles become one column below 700px.
- Timeline metadata remains above each role at every width.
- No route may introduce horizontal overflow at 360px, 768px, or desktop widths.
- Respect safe-area insets and reduced-motion preferences.

## Accessibility

- Semantic headings, landmarks, and skip link.
- Navigation exposes \`aria-current\`; menu and theme controls expose state.
- All image links and buttons are keyboard reachable.
- Focus remains visible in both themes.
- Important information is not conveyed by color alone.
