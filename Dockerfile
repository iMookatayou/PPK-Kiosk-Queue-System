# ---------- Stage 1: Build ----------
FROM node:22-slim AS builder
WORKDIR /app

# Prisma generate ต้องมี openssl
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# ให้ Prisma เห็น DATABASE_URL ตอน build
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# แยกชั้น cache
COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
COPY . .

# สร้าง Prisma Client + Build Next.js
RUN npx prisma generate
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:22-slim
WORKDIR /app

# timezone + openssl (เผื่อ runtime ต้องใช้)
RUN apt-get update -y && apt-get install -y tzdata openssl && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Bangkok
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000

# ติดตั้ง prod deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# สร้างโฟลเดอร์ dataqueue และกันสิทธิ์
RUN mkdir -p /app/data && chown -R node:node /app

# คัดลอกไฟล์ที่ build แล้ว
COPY --from=builder /app/.next                 ./.next
COPY --from=builder /app/public                ./public
COPY --from=builder /app/next.config.js        ./next.config.js
COPY --from=builder /app/prisma                ./prisma
COPY --from=builder /app/node_modules/.prisma  ./node_modules/.prisma

# รันด้วย user ปลอดภัย
USER node

EXPOSE 4000
CMD ["npm", "run", "start"]
