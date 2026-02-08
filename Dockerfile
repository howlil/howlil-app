# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

ARG ASTRO_DB_REMOTE_URL
ARG ASTRO_DB_APP_TOKEN
ENV ASTRO_DB_REMOTE_URL=$ASTRO_DB_REMOTE_URL
ENV ASTRO_DB_APP_TOKEN=$ASTRO_DB_APP_TOKEN

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build --remote

# ---- Runtime (production deps only, no builder node_modules) ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Production deps only → smaller layer than copying full builder node_modules
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
