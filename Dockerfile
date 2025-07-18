# ------------------------------
# Stage 1: Build
# ------------------------------
FROM node:22-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
COPY prisma ./prisma

RUN npx prisma generate

# Build Next.js
RUN npm run build

# ------------------------------
# Stage 2: Runtime
# ------------------------------
FROM node:22-slim

RUN apt-get update -y && apt-get install -y tzdata openssl && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Bangkok
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma              ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma             ./node_modules/@prisma
COPY --from=builder /app/.next                            ./.next
COPY --from=builder /app/public                           ./public
COPY --from=builder /app/next.config.js                   ./next.config.js
COPY --from=builder /app/prisma                           ./prisma

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

EXPOSE 4000
CMD ["npm", "start"]
