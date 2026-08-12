# Howlil Portfolio Static Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `howlil/howlil-app` into a production-quality, static-first Astro portfolio that is deployable to GitHub Pages, has correct routing/SEO/accessibility, minimizes client JavaScript, and preserves the current visual identity while improving consistency and mobile usability.

**Architecture:** Use Astro static output as the default architecture. Content remains in Astro Content Collections and is generated at build time. React islands are kept only where browser state or richer interaction materially benefits UX (search, image gallery/modal if retained); navigation, footer, simple badges, timeline content, filters, and most presentation should prefer Astro/HTML/CSS or small framework-free scripts.

**Tech Stack:** Astro 5, React 19 only for justified islands, Tailwind CSS 4, TypeScript strict mode, Astro Content Collections, Vitest for pure logic, Playwright for critical browser smoke/accessibility flows, GitHub Actions, GitHub Pages.

## Global Constraints

- Do not introduce a backend, database, server runtime, auth layer, state manager, or API service.
- Do not preserve Node SSR solely for deployment convenience.
- Prefer static HTML and build-time data over browser JavaScript.
- Preserve the current paper-like visual direction: warm light background, restrained dark mode, readable long-form typography, narrow primary reading column.
- Do not redesign the site into a dashboard/card-heavy portfolio.
- Do not add animation that does not communicate hierarchy or state.
- Respect `prefers-reduced-motion` everywhere.
- Internal routes and assets must work both at domain root and under a GitHub Pages base path such as `/howlil-app/`.
- No `any` in application code added or modified by this plan.
- Content errors that can be detected at build time must fail the build instead of degrading silently at runtime.
- All interactive controls must be keyboard-operable and expose semantic state.
- Keep dependencies minimal; remove dependencies that become unused.
- A task is complete only after its listed verification passes.

---

## Target User Experience and Design Rules

### Visual direction

Keep the portfolio understated and editorial rather than flashy. The content should remain the focal point.

- Main text column: approximately `650px` to `42rem`.
- Large-page shell: max width around `80rem` only when a right-side TOC/filter is present.
- Navigation height: current compact ~56px is appropriate.
- Body text: preserve a readable serif body if desired, but headings/actions should remain clean sans-serif.
- Use semantic design tokens instead of patching Tailwind utility colors globally with `!important`.
- Use one border scale, one muted surface scale, one focus color, and one link color per theme.
- Do not add gradients except where already subtle and justified.

### Responsive behavior

- Mobile must retain search, navigation, project filtering, article navigation, and gallery controls.
- Desktop-only sidebars may collapse into a compact horizontal/chip filter or disclosure on mobile.
- No feature should disappear on mobile merely because the desktop layout uses a sidebar.
- Touch targets for controls: minimum 44x44 CSS pixels where practical.

### Interaction rules

- Hover is enhancement, never the only affordance.
- Every clickable disclosure uses `<button>` or another native interactive element.
- Modal opens with focus moved inside, Escape closes it, focus returns to the opener.
- Search supports keyboard navigation and visible focus.
- Gallery arrows must remain discoverable on keyboard/touch, not only `group-hover`.

### Performance rules

- No multi-megabyte avatar or decorative image.
- Prefer AVIF/WebP where compatible; keep a sane fallback if needed.
- Avoid hydrating React for static footer/social links/badges.
- Google Fonts must not become a render-blocking dependency if an equivalent local/system stack is acceptable.
- Primary route should ship as little JavaScript as reasonably possible.

---

## File Structure Target

Expected additions or responsibility changes:

```text
.github/
  workflows/
    ci.yml
    deploy-pages.yml
src/
  config/
    site.ts                 # canonical site/base metadata
  data/
    about.ts                # typed work/education/award/org/skills data
  lib/
    paths.ts                # base-aware route/asset helpers
    filters.ts              # exact normalized tag/skill matching
    media.ts                # safe video embed URL parsing
  components/
    content/
    interactive/
    layout/
    ui/
  content/
    config.ts               # strict content validation
  pages/
  styles/
    global.css
tests/
  unit/
    paths.test.ts
    filters.test.ts
    media.test.ts
  e2e/
    smoke.spec.ts
    accessibility.spec.ts
public/
  og-image.png              # optimized social card
  profile.webp              # optimized profile image
astro.config.mjs
package.json
.gitignore
README.md
plan.md
```

Do not create a directory merely to match this tree if a task ends up not requiring it. The structure describes intended ownership boundaries.

---

### Task 1: Establish Quality Gates Before Refactoring

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `tests/unit/paths.test.ts`
- Create later in this task only if needed: `vitest.config.ts`

**Interfaces:**
- Produces scripts used by every later task: `check`, `test`, `test:unit`, `build`.
- Testing framework: Vitest for deterministic pure-function tests.

- [ ] **Step 1: Stop ignoring test source files**

Remove these patterns from `.gitignore`:

```gitignore
tests/
*.test.ts
```

Keep generated artifacts ignored:

```gitignore
coverage/
playwright-report/
test-results/
.playwright/
```

- [ ] **Step 2: Add quality tooling**

Add development dependencies for `@astrojs/check`, `vitest`, and `typescript` if not already present. Do not add ESLint yet unless a later concrete lint requirement justifies it.

Add scripts:

```json
{
  "scripts": {
    "check": "astro check",
    "test": "vitest run",
    "test:unit": "vitest run tests/unit",
    "build": "astro build"
  }
}
```

Preserve existing `dev`, `preview`, and `astro` commands as appropriate.

- [ ] **Step 3: Add the first intentionally failing test for the future path helper**

Create `tests/unit/paths.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { withBase } from '../../src/lib/paths';

describe('withBase', () => {
  it('prefixes a non-root base exactly once', () => {
    expect(withBase('/projects', '/howlil-app/')).toBe('/howlil-app/projects');
  });

  it('keeps root deployment clean', () => {
    expect(withBase('/projects', '/')).toBe('/projects');
  });
});
```

- [ ] **Step 4: Run the unit test to prove the harness is active**

Run:

```bash
pnpm test:unit
```

Expected: FAIL because `src/lib/paths.ts` does not exist yet.

- [ ] **Step 5: Run static type checking baseline**

Run:

```bash
pnpm check
```

Record existing errors before refactor. Do not mask them with `// @ts-ignore` or new `any`.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .gitignore tests/unit/paths.test.ts
 git commit -m "test: establish portfolio quality gates"
```

---

### Task 2: Convert the App from Node SSR to Static Astro

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`
- Modify or delete after verification: `Dockerfile`
- Modify: `README.md`

**Interfaces:**
- Produces static `dist/` suitable for GitHub Pages.
- Removes runtime dependency on `@astrojs/node`.

- [ ] **Step 1: Change Astro config to static output**

Target shape:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const repoName = 'howlil-app';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://howlil.com',
  base: isGitHubPages ? `/${repoName}` : '/',
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

If the final deployment uses a custom domain on GitHub Pages, change the base rule accordingly rather than hardcoding the repository prefix forever.

- [ ] **Step 2: Remove `@astrojs/node`**

```bash
pnpm remove @astrojs/node
```

- [ ] **Step 3: Make `start` semantics honest**

Do not pretend there is a production Node server. Keep:

```json
"preview": "astro preview --host 0.0.0.0"
```

Remove or rename `start` if it only aliases preview and is no longer used by deployment.

- [ ] **Step 4: Build**

Run:

```bash
pnpm build
```

Expected: exit 0 and static HTML/assets generated in `dist/`; no `dist/server/entry.mjs` runtime requirement.

- [ ] **Step 5: Decide Dockerfile fate based on actual deployment requirement**

Preferred for this repository: delete `Dockerfile` if GitHub Pages becomes the canonical deployment target.

If Docker is intentionally retained as an optional static-serving target, replace Node runtime with a minimal static web server image; do not retain Astro Node SSR.

- [ ] **Step 6: Update README architecture statement**

Document that the site is static-generated and does not require database/environment secrets/server runtime.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs package.json pnpm-lock.yaml README.md Dockerfile
 git commit -m "refactor: convert portfolio to static Astro"
```

---

### Task 3: Introduce One Base-Aware URL Strategy

**Files:**
- Create: `src/lib/paths.ts`
- Modify: `src/constants/navigation.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/[slug].astro`
- Modify: `src/pages/api/search.json.ts`
- Modify: `src/hooks/useSearch.ts`
- Modify: `src/components/about/SkillsMotion.tsx` or replace it in Task 8
- Modify: any component containing root-relative internal URLs.
- Test: `tests/unit/paths.test.ts`

**Interfaces:**

Create:

```ts
export function normalizeBase(base: string): string;
export function withBase(path: string, base?: string): string;
```

Behavior:
- `withBase('/projects', '/')` => `/projects`
- `withBase('/projects', '/howlil-app/')` => `/howlil-app/projects`
- no double slash and no double prefix.

- [ ] **Step 1: Implement the minimal helper to satisfy existing failing tests**

Use `import.meta.env.BASE_URL` as the default base in browser/build code.

- [ ] **Step 2: Run unit tests**

```bash
pnpm test:unit
```

Expected: path tests pass.

- [ ] **Step 3: Replace root-relative internal links**

Replace patterns like:

```ts
'/about'
`/projects/${slug}`
'/api/search.json'
'/profile.jpg'
```

with one base-aware strategy. For Astro templates, `import.meta.env.BASE_URL` is acceptable directly when simpler than importing a helper.

- [ ] **Step 4: Make the generated search index base-aware**

Search JSON URLs must point to the deployable route, not assume domain root.

- [ ] **Step 5: Make search fetch base-aware**

Do not use:

```ts
fetch('/api/search.json')
```

Use a generated/base-aware URL.

- [ ] **Step 6: Add regression cases**

Add tests for root, subpath, trailing slash, and already-rooted route.

- [ ] **Step 7: Build in both conceptual modes**

Run normal build and GitHub Actions-like build:

```bash
pnpm build
GITHUB_ACTIONS=true pnpm build
```

Inspect generated links to confirm `/howlil-app/` is present only in the Pages build.

- [ ] **Step 8: Commit**

```bash
git add src tests/unit
 git commit -m "fix: make internal paths deployment-base aware"
```

---

### Task 4: Fix SEO, Canonical URLs, Social Cards, and Structured Data

**Files:**
- Create: `src/config/site.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/pages/projects/[slug].astro`
- Create: `public/og-image.png`

**Interfaces:**

Create a typed site config:

```ts
export const SITE = {
  name: 'Mhd Ulil Abshar',
  shortName: 'Ulil',
  title: 'Mhd Ulil Abshar - Software Engineer',
  description: 'Backend-focused software engineer building reliable APIs, automation, and production systems.',
  url: 'https://howlil.com',
} as const;
```

- [ ] **Step 1: Centralize identity/domain metadata**

Remove repeated `https://howlil.com`, author name, and default description strings where they represent the same site-level concept.

- [ ] **Step 2: Generate absolute canonical and OG image URLs**

`BaseLayout` must create absolute URLs using `Astro.site`/site config and current path.

- [ ] **Step 3: Add a real optimized OG image**

Create `public/og-image.png` around 1200x630, compressed to a reasonable file size. Keep design restrained: name, role, short descriptor, no visual clutter.

- [ ] **Step 4: Pass content-specific metadata**

Blog detail:

```astro
<ArticleLayout
  title={`${post.data.title} - Blog`}
  description={post.data.excerpt}
  image={post.data.coverImage}
  ...
/>
```

Project detail should use `project.data.excerpt` and first cover image where available.

- [ ] **Step 5: Improve Article JSON-LD**

Use absolute image URL and `mainEntityOfPage`. Omit undefined fields rather than serializing weak metadata.

- [ ] **Step 6: Verify generated HTML**

For `/`, one blog article, and one project, inspect output for:
- one canonical URL;
- absolute `og:url`;
- absolute valid `og:image`;
- description present;
- valid JSON-LD syntax.

- [ ] **Step 7: Commit**

```bash
git add src/config src/layouts src/pages public/og-image.png
 git commit -m "fix: harden portfolio SEO metadata"
```

---

### Task 5: Optimize Images and Media Delivery

**Files:**
- Replace: `public/profile.jpg` with optimized `public/profile.webp` or an Astro-managed source image.
- Modify: `src/pages/index.astro`
- Modify: project/blog image rendering where appropriate.

**Interfaces:**
- Homepage avatar should not require a multi-megabyte download.

- [ ] **Step 1: Produce an appropriately sized avatar**

Target source dimensions: roughly 384-512px square; target compressed file size preferably below 100 KB, with visual quality checked manually.

- [ ] **Step 2: Render explicit dimensions**

Use width/height to avoid layout shift.

- [ ] **Step 3: Use eager loading only for the above-the-fold avatar if justified**

Do not lazy-load an immediately visible hero avatar if that delays LCP; other project/article images may remain lazy.

- [ ] **Step 4: Validate no stale `/profile.jpg` references remain**

Search repository for `profile.jpg`.

- [ ] **Step 5: Compare generated asset weight**

Document old ~5.8 MB versus new asset size in the commit/PR notes.

- [ ] **Step 6: Commit**

```bash
git add public src/pages/index.astro
 git commit -m "perf: optimize portfolio image delivery"
```

---

### Task 6: Strengthen Content Schemas and Remove `any`

**Files:**
- Modify: `src/content/config.ts`
- Modify: `src/utils/collectionHelpers.ts`
- Modify: collection consumers in `src/pages/**/*.astro`

**Interfaces:**
- Dates validated at build time.
- External URLs validated at build time.
- Collection entry types inferred from Astro rather than cast to `any`.

- [ ] **Step 1: Tighten date schema**

Use a schema that rejects invalid date values. If preserving strings for display, validate ISO `YYYY-MM-DD` explicitly.

- [ ] **Step 2: Validate URL fields**

Use URL validation for `liveSite`, `repository`, `videoDemo`, and applicable media URLs when they are external.

- [ ] **Step 3: Remove `any` from `getStaticPaths` and mapping callbacks**

Use Astro content collection types/inference.

- [ ] **Step 4: Remove unused destructuring**

Delete unused `remarkPluginFrontmatter` and similar leftovers.

- [ ] **Step 5: Run checks**

```bash
pnpm check
pnpm build
```

Expected: no new TypeScript diagnostics and invalid content fails at build time.

- [ ] **Step 6: Commit**

```bash
git add src/content src/pages src/utils
 git commit -m "refactor: enforce typed portfolio content"
```

---

### Task 7: Replace Fuzzy Tag/Skill Matching with Canonical Exact Matching

**Files:**
- Create: `src/lib/filters.ts`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/components/content/TagFilterWrapper.astro`
- Test: `tests/unit/filters.test.ts`

**Interfaces:**

```ts
export function normalizeTag(value: string): string;
export function matchesTag(candidate: string, selected: string): boolean;
```

Exact normalized semantics only.

- [ ] **Step 1: Write regression tests first**

Include:

```ts
expect(matchesTag('Go', 'Go')).toBe(true);
expect(matchesTag('Google OAuth', 'Go')).toBe(false);
expect(matchesTag('JavaScript', 'Java')).toBe(false);
expect(matchesTag('React.js', 'react.js')).toBe(true);
```

- [ ] **Step 2: Run tests and confirm current intended helper is missing/failing**

```bash
pnpm test:unit
```

- [ ] **Step 3: Implement exact normalization**

Normalize case and surrounding whitespace. Do not remove arbitrary substrings in a way that collapses distinct technologies.

- [ ] **Step 4: Use the same matcher everywhere**

Project counts on About, query-string filtering, and sidebar filtering must share identical semantics.

- [ ] **Step 5: Remove unused `visible` calculation unless used to display an empty state**

Preferred UX: if no projects match, show an explicit empty message rather than silently rendering an empty list.

- [ ] **Step 6: Run unit tests/build**

```bash
pnpm test:unit
pnpm build
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/filters.ts src/pages src/components/content tests/unit/filters.test.ts
 git commit -m "fix: make portfolio filtering deterministic"
```

---

### Task 8: Redesign Filtering for Mobile Without Adding Heavy JavaScript

**Files:**
- Modify: `src/layouts/ThreeColumnLayout.astro`
- Modify: `src/components/content/TagFilterWrapper.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/blog/index.astro`

**Design:**
- Desktop: retain right-hand compact filter sidebar.
- Mobile/tablet: render a horizontally scrollable compact filter row or native disclosure above results.
- Active filter must be visually obvious without relying only on color.
- Preserve query parameter in URL when filter comes from `/projects?tag=...` so links are shareable.

- [ ] **Step 1: Remove duplicate `hidden lg:block` responsibility**

Only the layout or component should own responsive placement, not both.

- [ ] **Step 2: Render mobile controls**

Recommended markup pattern:

```html
<div class="lg:hidden overflow-x-auto">
  <div class="flex min-w-max gap-2" role="group" aria-label="Filter projects">
    <!-- filter buttons -->
  </div>
</div>
```

- [ ] **Step 3: Keep desktop sidebar**

Desktop filter should remain compact and sticky.

- [ ] **Step 4: Synchronize active state from query parameter**

On initial load, `?tag=TypeScript` should visibly activate the matching control.

- [ ] **Step 5: Provide empty state**

Example copy:

```text
No projects match this filter.
```

- [ ] **Step 6: Verify at 375px, 768px, 1024px, and desktop width**

Check no clipped controls, no inaccessible horizontal content, and no missing filters.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ThreeColumnLayout.astro src/components/content src/pages/blog src/pages/projects
 git commit -m "fix: make content filters responsive"
```

---

### Task 9: Fix Search Lifecycle and Accessibility

**Files:**
- Modify: `src/hooks/useSearch.ts`
- Modify: `src/components/interactive/SearchModal.tsx`
- Modify: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Fetch cancellation owned by effect lifecycle.
- Modal focus is contained/restored sufficiently for keyboard use.

- [ ] **Step 1: Replace ineffective `cancelled` return pattern with `AbortController`**

Do not return a cleanup function from an async callback that the React effect never consumes.

- [ ] **Step 2: Keep one cached search index load per mounted search controller**

Avoid refetching on each keystroke.

- [ ] **Step 3: Add visible loading/error state semantics**

Use a small status region such as `aria-live="polite"`; do not expose raw fetch errors to users.

- [ ] **Step 4: Improve modal keyboard semantics**

Ensure:
- Escape closes;
- initial focus goes to input;
- focus returns to search trigger;
- arrow navigation keeps the selected option understandable;
- Enter opens selected result.

- [ ] **Step 5: Remove unused `prefersReducedMotion` from Navbar if still unused**

- [ ] **Step 6: Verify manually with keyboard only**

Sequence: Tab to Search -> Enter -> type -> ArrowDown -> Enter -> back -> reopen -> Escape.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useSearch.ts src/components/interactive/SearchModal.tsx src/components/layout/Navbar.tsx
 git commit -m "fix: harden portfolio search interaction"
```

---

### Task 10: Fix Core Accessibility Defects

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/components/ui/Timeline/TimelineItem.tsx` or replace with Astro disclosure.
- Modify: `src/components/interactive/ImageSlider.tsx`
- Modify: `src/components/interactive/ImageModal.tsx`
- Modify: `src/layouts/ArticleLayout.astro`
- Test later: `tests/e2e/accessibility.spec.ts`

- [ ] **Step 1: Add `id="main-content"` to About main element**

Every page using `BaseLayout` skip link must expose the target.

- [ ] **Step 2: Replace clickable timeline container with a semantic trigger**

Use a real `<button>` with:

```tsx
aria-expanded={isExpanded}
aria-controls={panelId}
```

The content panel uses the same `panelId`.

- [ ] **Step 3: Preserve visual design**

The disclosure button should visually remain editorial—not become a large bordered UI widget.

- [ ] **Step 4: Make multi-image gallery opening keyboard-operable**

Do not make only the single-image case keyboard accessible.

- [ ] **Step 5: Keep gallery controls visible on focus/touch**

Use `focus-within` and mobile-visible controls instead of hover-only visibility.

- [ ] **Step 6: Consolidate image modal implementations**

Choose one accessible implementation. Remove the manual `innerHTML` modal from `ArticleLayout` if the shared React modal can own the behavior without excessive hydration; otherwise implement one small framework-free reusable dialog pattern, but not two systems.

- [ ] **Step 7: Ensure modal focus restoration and Escape close**

- [ ] **Step 8: Add iframe titles in project media**

YouTube/Drive embeds require descriptive `title` and should use `loading="lazy"`.

- [ ] **Step 9: Commit**

```bash
git add src/pages/about.astro src/components src/layouts/ArticleLayout.astro
 git commit -m "fix: improve portfolio keyboard accessibility"
```

---

### Task 11: Reduce Unnecessary React Islands and Framer Motion

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Convert as justified: `src/components/layout/Footer.tsx` -> `Footer.astro`
- Convert as justified: `src/components/about/SocialLinks.tsx` -> `SocialLinks.astro`
- Convert as justified: `src/components/about/SkillsMotion.tsx` -> `Skills.astro`
- Review: About item components and timeline.
- Modify: component index exports.

**Decision rule:** A component that only renders links/text and hover styles does not justify a React island.

- [ ] **Step 1: Convert footer to Astro**

Current year can be generated at build time. Social links require no browser state.

- [ ] **Step 2: Convert static social links to Astro**

Use CSS hover/focus transitions and `prefers-reduced-motion` media query.

- [ ] **Step 3: Convert skills badges to Astro**

Use ordinary anchor tags with CSS hover. Project count is build-time data.

- [ ] **Step 4: Reassess About timeline**

If disclosure can be implemented with `<details>/<summary>` while meeting desired design and accessibility, prefer that over React. If custom animation/state is genuinely required, retain one small island rather than many separate islands.

- [ ] **Step 5: Remove no-longer-used Framer Motion imports**

If Framer Motion remains used only by search/gallery and still provides material value, keep it. If all remaining motion can be CSS, remove the dependency entirely.

- [ ] **Step 6: Remove unused `@vitejs/plugin-react` if no direct config uses it**

React integration should be owned by `@astrojs/react`.

- [ ] **Step 7: Build and compare client JS output**

Use generated `dist/_astro` files to confirm the homepage/about page ship less JavaScript than before.

- [ ] **Step 8: Commit**

```bash
git add src package.json pnpm-lock.yaml
 git commit -m "perf: reduce unnecessary client hydration"
```

---

### Task 12: Consolidate Design Tokens and Remove Theme Overrides

**Files:**
- Modify: `src/styles/global.css`
- Modify touched components using gray utility overrides.
- Modify: `src/components/shared/ThemeScript.astro` if necessary.

**Design system target:** Semantic variables are the source of truth.

Example:

```css
:root {
  --page-bg: #faf8f5;
  --surface: #ffffff;
  --surface-muted: #f5f5f4;
  --text-heading: #1c1917;
  --text-body: #44403c;
  --text-muted: #78716c;
  --border: #e7e5e4;
  --link: #2563eb;
  --focus: #2563eb;
}

html.dark {
  --page-bg: #1c1917;
  --surface: #1c1917;
  --surface-muted: #292524;
  --text-heading: #f5f5f4;
  --text-body: #d6d3d1;
  --text-muted: #a8a29e;
  --border: #44403c;
  --link: #93c5fd;
  --focus: #93c5fd;
}
```

- [ ] **Step 1: Remove duplicate declarations**

Examples to remove: duplicate heading `font-family`, duplicate focus outline color declarations.

- [ ] **Step 2: Replace global `.text-gray-* !important` theme patching**

Move touched components toward semantic classes/tokens.

- [ ] **Step 3: Keep theme initialization before paint**

The inline ThemeScript pattern is valid to avoid flash; preserve it unless a simpler equivalent is proven.

- [ ] **Step 4: Verify contrast and focus in both themes**

Check body, muted text, links, focus ring, chip/filter state, nav border, code blocks.

- [ ] **Step 5: Verify reduced motion**

No long CSS transitions under `prefers-reduced-motion: reduce`.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/components src/layouts
 git commit -m "refactor: consolidate portfolio design tokens"
```

---

### Task 13: Move About Content Out of the Page Component

**Files:**
- Create: `src/data/about.ts`
- Modify: `src/pages/about.astro`
- Modify types/components as required.

**Interfaces:**

Export typed collections for:
- work experiences;
- education;
- awards;
- organizations;
- skills.

- [ ] **Step 1: Define explicit TypeScript interfaces**

Do not use a generic untyped object bag.

- [ ] **Step 2: Move data without changing visible copy except obvious typo fixes**

Examples worth correcting during move: `Achived` -> `Achieved`, grammar inconsistencies that clearly reduce portfolio credibility.

- [ ] **Step 3: Remove fake certificate links**

Do not set `certificateUrl: '#'`. Omit the field until a real URL exists; the UI must not render a fake action.

- [ ] **Step 4: Keep `about.astro` focused on composition**

The page should read as layout + mapping, not hundreds of lines of resume data.

- [ ] **Step 5: Run check/build**

```bash
pnpm check
pnpm build
```

- [ ] **Step 6: Commit**

```bash
git add src/data/about.ts src/pages/about.astro src/components/about
 git commit -m "refactor: separate portfolio data from presentation"
```

---

### Task 14: Harden Project Media URL Parsing

**Files:**
- Create: `src/lib/media.ts`
- Modify: `src/pages/projects/[slug].astro`
- Test: `tests/unit/media.test.ts`

**Interfaces:**

```ts
export type Embed =
  | { kind: 'youtube'; url: string }
  | { kind: 'google-drive'; url: string }
  | { kind: 'video'; url: string };

export function resolveProjectMediaUrl(input: string): Embed;
```

- [ ] **Step 1: Write tests for supported YouTube forms**

Cover:
- `https://www.youtube.com/watch?v=abc123`
- `https://youtu.be/abc123`
- `https://www.youtube.com/embed/abc123`

- [ ] **Step 2: Write tests for Google Drive preview conversion**

- [ ] **Step 3: Write invalid URL test**

Invalid input must fail clearly rather than create malformed iframe URLs.

- [ ] **Step 4: Implement using the standard `URL` API**

Do not use chained `split()` parsing.

- [ ] **Step 5: Replace inline parsing in project page**

- [ ] **Step 6: Run tests/build**

```bash
pnpm test:unit
pnpm build
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/media.ts src/pages/projects/[slug].astro tests/unit/media.test.ts
 git commit -m "fix: validate project media embeds"
```

---

### Task 15: Add Browser Smoke Tests for Critical Portfolio Journeys

**Files:**
- Modify: `package.json`
- Create: `playwright.config.ts`
- Create: `tests/e2e/smoke.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`

**Scope:** Keep browser tests small. This portfolio does not need a huge E2E suite.

- [ ] **Step 1: Add Playwright**

Add `@playwright/test` as a dev dependency.

- [ ] **Step 2: Add script**

```json
"test:e2e": "playwright test"
```

- [ ] **Step 3: Add critical smoke tests**

Test:
- home loads;
- About opens;
- Projects opens;
- one project detail opens;
- Blog opens;
- search can open and navigate;
- no primary internal link escapes GitHub Pages base path in Pages-mode test configuration.

- [ ] **Step 4: Add accessibility interaction tests**

Test:
- skip link targets an existing element;
- timeline/disclosure is keyboard-operable;
- search closes on Escape;
- modal closes on Escape;
- gallery controls are focusable.

- [ ] **Step 5: Run**

```bash
pnpm build
pnpm test:e2e
```

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml playwright.config.ts tests/e2e
 git commit -m "test: cover critical portfolio journeys"
```

---

### Task 16: Add CI and GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

**Interfaces:**
- Pull requests/main changes are checked before deployment.
- Pages deploy uses static build artifact.

- [ ] **Step 1: Add CI workflow**

On pull request and push to `main`, run:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test:unit
pnpm build
```

Browser tests may run in a separate job to keep diagnostics clear.

- [ ] **Step 2: Add Pages workflow**

Use official GitHub Pages actions and deploy `dist/` only after a successful static build.

Required permissions should be minimal, typically:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

- [ ] **Step 3: Configure concurrency**

Cancel superseded Pages deployments when appropriate.

- [ ] **Step 4: Do not mix deployment concerns back into application code**

No Node server startup, port, or container logic should return for GitHub Pages.

- [ ] **Step 5: Update README**

Document:
- local install/dev/check/test/build;
- static architecture;
- GitHub Pages deployment;
- custom-domain/base-path behavior;
- content authoring location.

- [ ] **Step 6: Commit**

```bash
git add .github README.md
 git commit -m "ci: deploy static portfolio to GitHub Pages"
```

---

## Final Verification Gate

Do not merge until every item below is proven on the final branch state.

- [ ] `pnpm install --frozen-lockfile` succeeds.
- [ ] `pnpm check` exits 0.
- [ ] `pnpm test:unit` exits 0.
- [ ] `pnpm build` exits 0.
- [ ] GitHub Pages-mode build exits 0.
- [ ] `pnpm test:e2e` exits 0.
- [ ] No root-relative internal URL breaks under `/howlil-app/`.
- [ ] No `@astrojs/node` dependency remains.
- [ ] No production `dist/server/entry.mjs` assumption remains.
- [ ] `public/profile.jpg` multi-megabyte asset is gone.
- [ ] Default OG image exists and renders.
- [ ] Blog/project descriptions appear in generated metadata.
- [ ] All canonical URLs are correct for the deployment target.
- [ ] About skip link works.
- [ ] Disclosures are keyboard-operable.
- [ ] Project/mobile filters remain available below `lg` breakpoint.
- [ ] `Go` does not match `Google OAuth`; `Java` does not match `JavaScript`.
- [ ] Search uses base-aware URL and correct lifecycle cancellation.
- [ ] Fake `#` certificate actions are gone.
- [ ] iframe embeds have titles and validated URLs.
- [ ] No new `any`, `@ts-ignore`, or disabled checks were introduced.
- [ ] No unused dependency remains from the removed architecture.

## Recommended Execution Order

Execute tasks in this dependency order:

```text
1 Quality gates
  -> 2 Static architecture
  -> 3 Base-aware paths
  -> 4 SEO
  -> 5 Images
  -> 6 Content typing
  -> 7 Deterministic filters
  -> 8 Responsive filter UX
  -> 9 Search
  -> 10 Accessibility
  -> 11 Reduce hydration
  -> 12 Design tokens
  -> 13 About data extraction
  -> 14 Media parsing
  -> 15 E2E
  -> 16 CI/Pages deployment
  -> Final verification
```

Do not combine all tasks into one uncontrolled rewrite. Each task should leave the application buildable and reviewable.

## Deliberately Out of Scope

The following should **not** be added during this refactor unless a future concrete requirement appears:

- backend API;
- database;
- CMS;
- authentication;
- analytics platform migration;
- Redux/Zustand or other global state;
- server-side search;
- Kubernetes/Helm;
- microservices;
- service worker/PWA;
- complicated animation system;
- custom component framework;
- generic design-system package extracted from this one portfolio.

The engineering objective is not to make the portfolio technologically impressive through complexity. The objective is to make the implementation small, correct, fast, accessible, portable, and easy to maintain.
