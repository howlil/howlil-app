FROM node:18-alpine AS base
WORKDIR /srv/app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG MODE=development
ENV NODE_ENV=$MODE

EXPOSE 1337

# Jalankan sesuai mode
CMD if [ "$MODE" = "production" ]; then \
      pnpm build && pnpm start; \
    else \
      pnpm develop; \
    fi
