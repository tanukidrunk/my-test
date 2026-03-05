# Stage 1: Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# ติดตั้ง dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile 

# Copy ไฟล์ทั้งหมดและ Generate Prisma Client
COPY . .

ENV DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

RUN bunx prisma generate

# Stage 2: Runtime (เน้นเบา)
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# กำหนดให้ Prisma ใช้เฉพาะ binary ที่จำเป็น
ENV NODE_ENV=production

# 1. คัดลอกเฉพาะ node_modules (ที่มี prisma client) และไฟล์ที่จำเป็น
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# 2. ลบ Prisma Engines ที่ไม่ได้ใช้ (ตัวลดน้ำหนักชั้นดี)
# Prisma มักจะเก็บ Query Engine ไว้หลายตัวใน stage build
RUN rm -rf node_modules/.cache/prisma

EXPOSE 3001

# ใช้ "bun run" ตรงๆ แทนการใช้ bunx ใน CMD เพื่อความเร็ว
CMD ["sh", "-c", "bun prisma migrate deploy && bun src/index.ts"]