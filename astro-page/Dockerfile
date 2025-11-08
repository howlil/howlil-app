FROM node:18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm serve

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG MODE=development
ENV NODE_ENV=$MODE

EXPOSE 4321

CMD if [ "$MODE" = "production" ]; then \
      pnpm build && serve dist; \
    else \
      pnpm dev; \
    fi
