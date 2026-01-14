# =========================
# 1️ Builder Stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build Next.js (standalone output)
RUN npm run build


# =========================
# 2️ Runtime Stage (SLIM)
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=Production

# Copy ONLY standalone output (key optimization)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# If you had public/, copy it (optional)
# COPY --from=builder /app/public ./public

EXPOSE 3000

# Standalone server entry
CMD ["node", "server.js"]
