FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/dist ./dist

RUN pnpm add serve

EXPOSE 3000

CMD ["pnpm", "serve", "-s", "dist", "-l", "3000", "--listen", "0.0.0.0"]
