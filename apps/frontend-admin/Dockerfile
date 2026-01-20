# ----------------------------------------------------
# 1. Builder Stage
# ----------------------------------------------------
# Use pinned Node.js Alpine image for reproducibility
FROM node:20.11.1-alpine AS builder

# Set working directory
WORKDIR /app

# -----------------------------
# Build-time arguments
# Injected by Jenkins / local docker build
# -----------------------------
ARG NEXT_PUBLIC_BASE_PATH=""
ARG NEXT_PUBLIC_API_BASE_URL=""

# Make build-time args available to Next.js
ENV NEXT_PUBLIC_BASE_PATH=${NEXT_PUBLIC_BASE_PATH}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Copy dependency manifests first for better caching
COPY package.json package-lock.json ./

# Install dependencies deterministically
RUN npm ci --no-audit --no-fund

# Copy application source code
COPY . .

# Build Next.js application (standalone output)
RUN npm run build


# ----------------------------------------------------
# 2. Runtime Stage (Slim & Secure)
# ----------------------------------------------------
FROM node:20.11.1-alpine AS runner

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security hardening
RUN addgroup -S nextjs -g 1001 \
  && adduser -S nextjs -u 1001 -G nextjs

# Set working directory
WORKDIR /app

# Copy ONLY required runtime files from builder
# --chown avoids extra chown layer (image size optimization)
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# there is no public folder in this setup, so we skip copying it
# COPY --from=builder --chown=nextjs:nextjs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Start Next.js standalone server
# Exec form ensures proper signal handling
CMD ["node", "server.js"]
