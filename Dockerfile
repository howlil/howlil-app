# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

# Jika build kamu BUTUH secret untuk mode remote, gunakan ARG, jangan simpan sebagai ENV layer.
ARG ASTRO_DB_REMOTE_URL
ARG ASTRO_DB_APP_TOKEN

# Inject hanya saat command build dieksekusi (lebih aman daripada ENV permanen)
RUN ASTRO_DB_REMOTE_URL="$ASTRO_DB_REMOTE_URL" \
    ASTRO_DB_APP_TOKEN="$ASTRO_DB_APP_TOKEN" \
    pnpm run build

# ---- Runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

# Non-root user NUMERIC supaya Kubernetes bisa verifikasi runAsNonRoot
RUN addgroup -S -g 10001 app \
    && adduser  -S -D -H -u 10001 -G app app \
    && chown -R 10001:10001 /app

USER 10001:10001

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]