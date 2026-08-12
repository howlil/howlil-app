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

The site is statically generated at build time. Production does not require a Node.js server, database, container, runtime application secret, or server-side API.

Content is stored in Astro content collections and rendered into static HTML during `pnpm build`. Browser JavaScript is intentionally limited to interactions that need client-side state; ordinary portfolio content, footer, social links, skills, and About disclosures render as static HTML.

Deployment-specific URLs use Astro's `site` and `base` settings:

- normal/root deployment defaults to `https://howlil.com` with `/` as the base path;
- CI can validate the GitHub project-site fallback at `https://howlil.github.io/howlil-app/`;
- the Pages deployment workflow reads the actual Pages origin and base path from GitHub, so switching to a configured custom domain does not require hard-coded route changes;
- `SITE_URL` and `BASE_PATH` remain available as explicit build overrides.

Internal application links and public assets must use the shared `withBase()` helper rather than assuming the site is mounted at `/`.

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

`astro preview` is for local inspection only. Production hosting serves the generated `dist/` directory as static files.

## Content authoring

Portfolio content lives with the code and is validated at build time:

- blog posts: `src/content/blog/`
- projects: `src/content/projects/`
- About experience, education, awards, organizations, and skills: `src/data/about.ts`
- site-wide identity/SEO metadata: `src/config/site.ts`

Blog/project frontmatter is validated by `src/content/config.ts`. Dates use `YYYY-MM-DD`; external links must be valid URLs; project video sources are normalized through `src/lib/media.ts`.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`. The gate currently performs:

1. frozen dependency installation;
2. `astro check`;
3. unit tests;
4. root static build;
5. Chromium installation and Playwright E2E tests;
6. GitHub Pages-mode static build.

A failed gate blocks the automatic Pages workflow because deployment is triggered only after the `CI` workflow reports success for `main`.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` deploys the verified `main` revision using GitHub's official Pages actions. It builds `dist/`, uploads only that static artifact, and deploys it to the `github-pages` environment. Superseded deployments are cancelled through workflow concurrency.

GitHub Pages must be enabled once at repository level:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Run **Deploy GitHub Pages** manually once, or push a new verified commit to `main`.

This repository currently uses no `gh-pages` branch and does not commit generated `dist/` files.

### Default GitHub Pages URL

Without a custom domain, the project-site URL is:

```text
https://howlil.github.io/howlil-app/
```

Astro therefore needs the `/howlil-app` base path. The deployment workflow obtains that value from GitHub Pages metadata at build time.

### Custom domain

Configure the custom domain in **Settings → Pages**. Do not add a `CNAME` file as a substitute for repository Pages configuration. Once GitHub reports the custom domain, the deployment workflow receives the corresponding origin/base-path metadata and builds the same codebase for it.

For an explicit non-Pages static host, build with overrides when necessary:

```bash
SITE_URL=https://example.com BASE_PATH=/ pnpm build
```

## Repository principles

Keep the portfolio small and portable. Prefer static Astro components for content and add client-side React only when interaction genuinely requires state. Do not introduce a backend, database, authentication layer, global state library, container runtime, or other infrastructure without a concrete requirement.
