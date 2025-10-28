# ============================================
# Multi-stage Dockerfile for Production
# FIXED: Proper dependency handling for AdonisJS + Vite
# ============================================

# ============================================
# Stage 1: Base
# ============================================
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    python3 \
    make \
    g++ \
    curl

WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS dependencies

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including dev) for build
RUN npm ci --legacy-peer-deps

# ============================================
# Stage 3: Build
# ============================================
FROM dependencies AS build

# Copy source code
COPY . .

# Generate theme configuration FIRST (before AdonisJS build)
RUN node scripts/generate-theme.cjs

# Build AdonisJS (this triggers Vite build via build hook)
RUN node ace build --ignore-ts-errors

# Verify build artifacts
RUN ls -la build/public/assets/.vite/manifest.json || echo "⚠️ Vite manifest not found"

# ============================================
# Stage 4: Production Dependencies
# ============================================
FROM base AS prod-deps

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# ============================================
# Stage 5: Production Runtime
# ============================================
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    curl

# Set production environment
ENV NODE_ENV=production
ENV PORT=10000
ENV HOST=0.0.0.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Create necessary directories with correct permissions
RUN mkdir -p logs tmp public/uploads public/assets && \
    chown -R nodejs:nodejs /app

# Copy production dependencies from prod-deps stage
COPY --from=prod-deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /app/build ./

# Copy public assets (images, uploads, etc.)
COPY --from=build --chown=nodejs:nodejs /app/public ./public

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:10000/', (r) => process.exit(r.statusCode === 200 || r.statusCode === 302 ? 0 : 1))"

# Start application with proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "bin/server.js"]