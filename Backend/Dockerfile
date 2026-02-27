FROM oven/bun:1-alpine
WORKDIR /app

# The asterisk allows for bun.lock, bun.lockb, or nothing at all
COPY package.json bun.lock* ./ 

RUN bun install
COPY . .
RUN bunx prisma generate

EXPOSE 3001
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run devs"] 