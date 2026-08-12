# Howlil Portfolio

Personal portfolio and engineering writing site built as a static Astro application.

## Stack

- Astro 5
- React 19 for selected interactive islands
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Astro content collections / MDX
- TypeScript

## Architecture

The site is statically generated at build time. It does not require a Node.js server, database, runtime environment variables, or application secrets to serve production pages.

Content is stored in Astro content collections and rendered into static HTML during `pnpm build`. Browser JavaScript is reserved for interactions that actually need client-side state, such as search and richer media controls.

Deployment-specific URL handling is configured through Astro's `site` and `base` options:

- normal/root deployment defaults to `https://howlil.com` with `/` as the base path;
- GitHub Pages mode uses `https://howlil.github.io/howlil-app/`;
- `SITE_URL` and `BASE_PATH` can override those values when needed.

## Development

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm check
pnpm test:unit
pnpm build
```

## Preview the production build

```bash
pnpm build
pnpm preview
```

`astro preview` is intended only to inspect the generated site locally. Production hosting should serve the generated `dist/` directory as static files.

## Deployment

The canonical deployment target for this repository is static hosting, with GitHub Pages support being added as part of the repository refactor. No container or Node runtime is required for the generated site.

The `pnpm-workspace.yaml` file remains in the repository to explicitly allow install-time build scripts required by dependencies such as `esbuild` and `sharp` under pnpm 11's supply-chain policy.
