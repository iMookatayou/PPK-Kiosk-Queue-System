# ------------------------------
# Stage 1: Build
# ------------------------------
FROM node:22-alpine AS builder

# เพิ่ม ARG และ ENV สำหรับ DATABASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# คัดลอกไฟล์ทั้งหมด
COPY . .
COPY prisma ./prisma

# สร้าง Prisma Client
RUN npx prisma generate

# Build Next.js (ตอนนี้จะมองเห็น DATABASE_URL แล้ว)
RUN npm run build

# ------------------------------
# Stage 2: Runtime
# ------------------------------
FROM node:22-alpine

RUN apk add --no-cache tzdata

ENV TZ=Asia/Bangkok
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY --from=builder /app/node_modules/.prisma              ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma             ./node_modules/@prisma
COPY --from=builder /app/.next                            ./.next
COPY --from=builder /app/public                           ./public
COPY --from=builder /app/next.config.js                   ./next.config.js
COPY --from=builder /app/prisma                           ./prisma

# ตอน runtime ก็ยังคงต้องมี DATABASE_URL ด้วย
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

EXPOSE 4000
CMD ["npm", "start"]
