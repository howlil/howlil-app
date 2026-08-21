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

- root deployment defaults to `https://howlil.com` with `/` as the base path;
- Cloudflare Pages serves the generated `dist/` directory from the root path;
- `SITE_URL` and `BASE_PATH` remain available as explicit build overrides when a different production URL is required.

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

## CI/CD

`.github/workflows/ci.yml` is the single CI/CD pipeline for the repository.

For pushes and pull requests targeting `main`, the `verify` job performs:

1. frozen dependency installation;
2. `astro check`;
3. unit tests;
4. one production static build;
5. Chromium installation;
6. Playwright E2E tests.

On a push to `main`, the generated `dist/` directory is uploaded as a short-lived workflow artifact. The `deploy` job starts only after the entire `verify` job succeeds, downloads that already-verified artifact, and deploys it to Cloudflare Pages. This avoids rebuilding the site only for deployment.

Superseded CI runs for the same ref are cancelled through workflow concurrency so newer commits do not wait behind stale runs.

## Cloudflare Pages deployment

The workflow deploys `dist/` with Cloudflare Wrangler to the Pages project named `howlil-app`.

### One-time Cloudflare setup

Create or select a Cloudflare Pages project named `howlil-app`. For a new project using this repository-managed CI/CD workflow, use a Direct Upload Pages project rather than enabling a second automatic Git build pipeline.

Create a Cloudflare API token scoped as narrowly as possible to the target account. The token needs Cloudflare Pages edit/write access for deployment.

Then add these GitHub Actions repository secrets under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Do not commit either value to the repository.

After the secrets and Cloudflare project exist, merge a verified change to `main`. The flow is:

```text
push main
  -> Astro check
  -> unit tests
  -> production build
  -> E2E tests
  -> verified dist artifact
  -> Cloudflare Pages deploy
```

The GitHub deployment environment is named `cloudflare-pages`, and the workflow records the deployment URL returned by Wrangler.

### Custom domain

The Astro configuration defaults to `https://howlil.com`. If that is the production domain, attach it to the `howlil-app` Pages project in Cloudflare.

For a different production URL, build with explicit overrides when necessary:

```bash
SITE_URL=https://example.com BASE_PATH=/ pnpm build
```

If the production domain changes permanently, update the repository configuration instead of relying on an ad-hoc local override.

## Repository principles

Keep the portfolio small and portable. Prefer static Astro components for content and add client-side React only when interaction genuinely requires state. Do not introduce a backend, database, authentication layer, global state library, container runtime, or other infrastructure without a concrete requirement.
