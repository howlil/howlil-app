# Howlil Portfolio

Portfolio website built with Astro, React, Tailwind CSS, and Framer Motion.

## Stack

- Astro 5
- React 19
- Tailwind CSS 4
- Framer Motion
- Lucide React
- MDX content collections

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Deploy to Easypanel

Use the included `Dockerfile`.

- Build context: repository root
- Exposed port: `3000`
- Domain/service destination port: `3000`
- Runtime command: `HOST=0.0.0.0 PORT=3000 node ./dist/server/entry.mjs`
- Package manager: pnpm `11.18.0`

No database environment variables are required.

The `pnpm-workspace.yaml` file is required for pnpm 11 supply-chain policy.
It explicitly allows the install-time build scripts needed by `esbuild` and
`sharp`; without it, Docker builds fail with `ERR_PNPM_IGNORED_BUILDS`.
