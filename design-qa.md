# Design QA — full-site reference system

## Scope

- Source: `https://personal-site-kit-v2.21st.app/`
- Implementation: `https://howlil.tech/`
- Reference viewport: 1363 × 936
- Routes checked: home, projects index, TEDx project detail, writing index, Kubernetes article
- States checked: Experience, Tech Stack, expanded route navigation, writing filter

## Visual comparison

- Every route now uses the same 640 px reading shell, compact icon-led headings, neutral palette, dashed section boundaries, and floating identity navigation.
- Experience follows the reference hierarchy: period, role/company, concise supporting context, circle bullets, and technology chips.
- Tech Stack uses real brand marks in a 6-column desktop / 3-column mobile grid, including the reference grayscale-on-group-hover interaction.
- Projects and Writing no longer use numbered editorial eyebrows, wide sidebars, or legacy split layouts.
- Project and article detail pages now use one uninterrupted document column; the competing desktop TOC rail was removed.

## Interaction verification

- Identity navigation opens and exposes Sections, Pages, and Theme groups.
- The active route is identified in the Pages group.
- Writing topic filters update pressed state, result visibility, and the `?tag=` URL.
- Project cards and index rows preserve direct navigation to case studies.
- No application-origin console errors were observed. Browser-extension metadata errors were excluded.

## Findings

- P0: none.
- P1: none.
- P2: none.
- P3: company logos and nested role history from the sample Experience are omitted because the repository does not contain verified equivalent assets or role-history data.

## Verification

- `astro check`: passed with 0 errors and existing deprecation hints only.
- `vitest run tests/unit`: passed, 18/18.
- `astro build`: passed, 15 pages.
- Production route checks: 640 px shell on all scoped routes, no horizontal overflow at 1363 px, no legacy numbered headings, no TOC rail.
- Tech brand source: Simple Icons via `@icons-pack/react-simple-icons`.

Final result: passed.
