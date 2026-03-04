# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .
# build tanpa membawa secret ke image layer
RUN pnpm run build

# ---- Runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# install prod deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile --prod

# copy build output
COPY --from=builder /app/dist ./dist

# buat user non-root dan set permission
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app

USER app

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]