# Howlil Portfolio

Personal portfolio and engineering writing site built as a static Astro application.

## Stack

- Astro 5
- React 19 only for interactive islands such as media dialogs and navigation state
- Tailwind CSS 4
- Framer Motion for selected interactive transitions
- Lucide icons
- Astro content collections / MDX
- TypeScript
- Vitest for unit tests

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
       | wrangler deploy
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

`pnpm-workspace.yaml` explicitly allows required install-time build scripts such as `esbuild`, `sharp`, and Cloudflare's `workerd` under pnpm's build-script policy.

## Development

```bash
pnpm dev
```

Astro starts the local development server and watches content/code changes.

## Quality gates

Run the same core automated checks used by CI:

```bash
pnpm check
pnpm test:unit
pnpm build
```

Manual acceptance testing, browser black-box/E2E testing, and manual visual-review steps are not required merge or deployment gates. Use deterministic component/unit/static/build evidence for repository-owned behavior; record environment-specific residual risk instead of adding a human acceptance requirement.

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

## CI/CD

`.github/workflows/ci.yml` owns automated verification and production deployment so a successful push to `main` cannot leave production on an older build.

For pull requests targeting `main`, the workflow performs:

1. frozen dependency installation;
2. `astro check`;
3. unit tests;
4. production static build.

For pushes to `main`, the same verified job then runs `wrangler deploy`, publishing the already-built `dist/` directory to the Cloudflare Worker defined by `wrangler.jsonc`.

Superseded CI runs for the same ref are cancelled through workflow concurrency so newer commits do not wait behind stale runs.

## Cloudflare deployment

GitHub Actions requires these repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The API token should be scoped as narrowly as possible to the target Cloudflare account with permission to deploy the `howlil-app` Worker.

The production flow is:

```text
push main
  -> Astro check
  -> unit tests
  -> production build
  -> wrangler deploy
  -> Workers Static Assets
  -> howlil.tech
```

For an explicit deployment from another authenticated environment:

```bash
pnpm build
npx wrangler deploy
```

Do not add a Pages-specific deployment path unless the project is deliberately migrated back to Cloudflare Pages.

## Repository principles

Keep the portfolio small and portable. Prefer static Astro components for content and add client-side React only when interaction genuinely requires state. Do not introduce a backend, database, authentication layer, global state library, container runtime, or other infrastructure without a concrete requirement.

Technical claims in portfolio content should distinguish clearly between **implemented**, **validated**, **measured**, and **planned** work. Evidence is more important than technology count.
