# Design QA — personal-site-kit reference match

## Scope

- Source: `https://personal-site-kit-v2.21st.app/`
- Implementation: `https://howlil.tech/`
- Reference viewport: 1363 × 936
- States compared: light home, dark home, expanded navigation, Experience, Selected Projects, Tech Stack

## Visual comparison

- Reading column: 640 px in source and implementation.
- Primary divider positions: source 612 / 1357 / 2309 px; implementation 611 / 1355 / 2310 px.
- Experience heading: 700 px in both source and implementation.
- Floating navigation: 400 px expanded width in both source and implementation.
- Light and dark palettes, compact italic name, body scale, project grid, icon stack, and centered copyright follow the source composition.

## Interaction verification

- Identity pill opens and closes the navigation.
- `Ctrl/⌘ K` opens the navigation; `Escape` closes it.
- Section links smooth-scroll and collapse the navigation.
- Light, Dark, and System controls update the theme and selected state.
- Status text rotates between availability, location, local time, and role.
- Copy action exposes its success state; external profile and case-study links remain functional.
- No application-origin console errors were observed in the production check.

## Findings

- P0: none.
- P1: none.
- P2: none.
- P3: project artwork uses the existing Lucide icon dependency with the portfolio's real projects rather than copying the reference's branded sample artwork.
- P3: the source zig-zag separator is represented by a restrained dashed rule.
- P3: the primary copy action uses the public GitHub profile because no public email is defined in the repository.

## Verification

- `pnpm check`: passed (0 errors, 0 warnings; existing hints only).
- `pnpm test:unit`: passed (18/18).
- `pnpm build`: passed (15 pages).

Final result: passed.
