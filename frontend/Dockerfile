# ---------- Build Stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci  # ใช้ ci แทน install เพื่อความเร็วและแม่นยำ
COPY . .
RUN npm run build 

# ---------- Production Stage ----------
FROM node:20-alpine AS runner
WORKDIR /app

# กำหนดสภาพแวดล้อมเป็น production
ENV NODE_ENV=production

# คัดลอกไฟล์จากขั้นตอน builder (ใช้ standalone folder)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# รันไฟล์ server.js ที่ Next.js สร้างให้ใน standalone mode
# (ไม่ต้องใช้ npm start แล้ว ซึ่งประหยัด RAM และพื้นที่กว่ามาก)
CMD ["node", "server.js"]