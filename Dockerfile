# ---------- Stage 1: Build ----------
FROM node:22-slim AS builder

WORKDIR /app

# ติดตั้ง openssl ใน builder ด้วย!
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
COPY prisma ./prisma

RUN npx prisma generate
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:22-slim
WORKDIR /app

# runtime มี tzdata + openssl (คุณทำไว้แล้ว ดีแล้ว)
RUN apt-get update -y && apt-get install -y tzdata openssl && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Bangkok
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000
CMD ["npm", "run", "start"]
