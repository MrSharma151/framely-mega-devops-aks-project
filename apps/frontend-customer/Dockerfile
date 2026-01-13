# -----------------------------
# 1. Builder Stage
# -----------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only dependency files first (layer caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build Next.js app (standalone output)
RUN npm run build


# -----------------------------
# 2. Runner Stage (Production)
# -----------------------------
FROM node:20-alpine AS runner

# Create non-root user
RUN addgroup -g 1001 -S nextjs \
  && adduser -S nextjs -u 1001

WORKDIR /app

# Copy standalone output from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set ownership
RUN chown -R nextjs:nextjs /app

# Switch to non-root user
USER nextjs

# Expose Next.js port
EXPOSE 3000

# Start the Next.js server
CMD ["node", "server.js"]
