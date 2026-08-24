# Howlil Portfolio

Personal portfolio and engineering writing site built as a static Astro application.

## Stack

- Astro 5
- React 19 only for interactive islands such as search and media dialogs
- Tailwind CSS 4
- Framer Motion for selected interactive transitions
- Lucide icons
- Astro content collections / MDX
- TypeScript
- Vitest for unit tests
- Playwright for critical browser journeys

## Architecture

The site is statically generated at build time. Production does not require an application server, database, container runtime, or server-side API.

Content is stored in Astro content collections and rendered into static HTML during `pnpm build`. Browser JavaScript is intentionally limited to interactions that need client-side state; ordinary portfolio content, footer, social links, skills, and About disclosures render as static HTML.

Cloudflare is configured as a **Workers Static Assets** target through `wrangler.jsonc`:

```text
Astro source/content
       |
       | pnpm build
       v
     dist/
       |
       | Cloudflare deployment
       v
Workers Static Assets
```

`wrangler.jsonc` owns the Cloudflare deployment shape and points `assets.directory` at `./dist`. This repository is **not** configured as a Cloudflare Pages project; do not use `wrangler pages deploy` unless the hosting model is intentionally migrated back to Pages.

Deployment-specific URLs use Astro's `site` and `base` settings. `SITE_URL` and `BASE_PATH` remain available as explicit build overrides when a different production URL is required. Internal application links and public assets must use the shared `withBase()` helper rather than assuming the site is mounted at `/`.

## Requirements

- Node.js 22
- pnpm 11.18.0

Corepack can activate the repository-pinned package manager:

```bash
corepack enable
corepack prepare pnpm@11.18.0 --activate
pnpm install --frozen-lockfile
```

`pnpm-workspace.yaml` explicitly allows required install-time build scripts such as `esbuild` and `sharp` under pnpm's build-script policy.

## Development

```bash
pnpm dev
```

Astro starts the local development server and watches content/code changes.

## Quality gates

Run the same core checks used by CI:

```bash
pnpm check
pnpm test:unit
pnpm build
```

For browser tests, install Chromium once on a new machine and run the E2E suite:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm test:e2e` builds the static site, starts an Astro preview server, and executes the critical Chromium journeys in `tests/e2e/`.

## Preview the production build

```bash
pnpm build
pnpm preview
```

`astro preview` is for local inspection only. Production serves the generated `dist/` assets through Cloudflare.

## Content authoring

Portfolio content lives with the code and is validated at build time:

- blog posts: `src/content/blog/`
- projects: `src/content/projects/`
- About experience, education, awards, organizations, and skills: `src/data/about.ts`
- site-wide identity/SEO metadata: `src/config/site.ts`

Blog/project frontmatter is validated by `src/content/config.ts`. Dates use `YYYY-MM-DD`; external links must be valid URLs; project video sources are normalized through `src/lib/media.ts`.

Project metadata also distinguishes portfolio presentation from chronology:

- `featured` and `featuredRank` select the strongest engineering case studies;
- `role` records ownership;
- `engineeringFocus` describes the engineering problem rather than just the stack;
- `verifiedEvidence` must contain implemented/observed evidence, not planned work.

## CI

`.github/workflows/ci.yml` is intentionally a **verification pipeline**, not a deployment pipeline.

For pushes and pull requests targeting `main`, the `verify` job performs:

1. frozen dependency installation;
2. `astro check`;
3. unit tests;
4. production static build;
5. Chromium installation;
6. Playwright E2E tests.

Superseded CI runs for the same ref are cancelled through workflow concurrency so newer commits do not wait behind stale runs.

Keeping verification separate from hosting prevents the repository from carrying two competing deployment paths. The previous Cloudflare Pages Direct Upload workflow was intentionally removed when the project moved to Workers Static Assets.

## Cloudflare deployment

Production deployment is owned by the Cloudflare hosting configuration rather than GitHub Actions in this repository. A Cloudflare-side build/deploy integration can build the repository with:

```bash
pnpm install --frozen-lockfile
pnpm build
```

with `dist/` as the generated static output and `wrangler.jsonc` as the Workers Static Assets configuration.

For an explicit Wrangler deployment from an authenticated environment:

```bash
pnpm build
npx wrangler deploy
```

The relevant model is:

```text
GitHub Actions
  -> verify source/content/build/browser behavior

Cloudflare deployment
  -> consume the repository/build output
  -> deploy Workers Static Assets from wrangler.jsonc
```

Do not add a Pages-specific CI deploy job unless a real Cloudflare Pages project is created and the repository is deliberately migrated to that hosting model.

## Repository principles

Keep the portfolio small and portable. Prefer static Astro components for content and add client-side React only when interaction genuinely requires state. Do not introduce a backend, database, authentication layer, global state library, container runtime, or other infrastructure without a concrete requirement.

Technical claims in portfolio content should distinguish clearly between **implemented**, **validated**, **measured**, and **planned** work. Evidence is more important than technology count.
