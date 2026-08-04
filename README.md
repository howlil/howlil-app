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
- Exposed port: `4321`
- Runtime command: `node ./dist/server/entry.mjs`

No database environment variables are required.
