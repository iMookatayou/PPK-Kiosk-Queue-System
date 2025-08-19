# ---------- Stage 1: Build ----------
FROM node:22-slim AS builder

WORKDIR /app

# Prisma generate ต้องมี openssl
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# ===== ใส่ DATABASE_URL ให้ stage นี้ด้วย =====
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# แยก copy เพื่อ cache ดีขึ้น
COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
COPY . .

# สร้าง Prisma Client (ต้องมี DATABASE_URL ตอนนี้)
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:22-slim
WORKDIR /app

# timezone + openssl สำหรับ runtime
RUN apt-get update -y && apt-get install -y tzdata openssl && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Bangkok
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# ตั้งค่า PORT ให้ตรงกับ EXPOSE/compose ของคุณ
ENV PORT=4000

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# คัดลอกไฟล์ที่ build แล้ว
COPY --from=builder /app/.next                 ./.next
COPY --from=builder /app/public                ./public
COPY --from=builder /app/next.config.js        ./next.config.js
COPY --from=builder /app/prisma                ./prisma
COPY --from=builder /app/node_modules/.prisma  ./node_modules/.prisma

EXPOSE 4000
CMD ["npm", "run", "start"]
