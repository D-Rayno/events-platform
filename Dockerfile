# ============================================
# Production-Ready Dockerfile for AdonisJS + Inertia + React
# ============================================

# ============================================
# Stage 1: Base Image
# ============================================
FROM node:22.16.0-alpine3.22 AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    dumb-init \
    curl \
    bash \
    git

WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS dependencies

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (needed for build)
RUN npm ci --legacy-peer-deps --no-audit --no-fund && \
    npm cache clean --force

# ============================================
# Stage 3: Build
# ============================================
FROM dependencies AS build

# Copy configuration files
COPY adonisrc.ts tsconfig.json vite.config.ts ./
COPY eslint.config.js theme.config.json ./

# Copy source code
COPY app/ ./app/
COPY config/ ./config/
COPY database/ ./database/
COPY start/ ./start/
COPY commands/ ./commands/
COPY resources/ ./resources/
COPY inertia/ ./inertia/
COPY public/ ./public/
COPY bin/ ./bin/
COPY ace.js ./
COPY package.json ./
COPY package-lock.json ./

# Copy scripts directory
COPY scripts/ ./scripts/


# Make scripts executable
RUN chmod +x scripts/*.sh 2>/dev/null || true
RUN chmod +x scripts/*.cjs 2>/dev/null || true

# Set build environment
ENV NODE_ENV=production

# Generate theme
RUN echo "🎨 Generating theme..." && \
    node scripts/generate-theme.cjs

# Build application
RUN echo "🔨 Building application..." && \
    node ace build --ignore-ts-errors

# Verify critical build artifacts
RUN echo "🔍 Verifying build..." && \
    test -f "build/bin/server.js" || (echo "❌ Server build failed" && exit 1) && \
    test -f "build/package.json" || (echo "❌ Package.json missing" && exit 1) && \
    test -d "build/public/assets" || (echo "❌ Assets missing" && exit 1) && \
    echo "✅ Build verification passed"

# Copy scripts to build directory (IMPORTANT!)
RUN cp -r scripts build/ && \
    chmod +x build/scripts/*.sh 2>/dev/null || true

# Copy public uploads to build directory
RUN mkdir -p build/public/uploads && \
    cp -r public/uploads/* build/public/uploads/ 2>/dev/null || true

# ============================================
# Stage 4: Production Dependencies
# ============================================
FROM base AS production-deps

WORKDIR /app

# Copy package.json from build
COPY --from=build /app/build/package.json ./
COPY --from=build /app/build/package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev --legacy-peer-deps --no-audit --no-fund && \
    npm cache clean --force

# ============================================
# Stage 5: Production Runtime
# ============================================
FROM node:22.16.0-alpine3.22 AS production

# Install minimal runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    curl \
    bash

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Create necessary directories
RUN mkdir -p \
    logs \
    tmp \
    public/uploads/avatars \
    public/uploads/events \
    public/assets && \
    chown -R nodejs:nodejs /app

# Copy production dependencies
COPY --from=production-deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=nodejs:nodejs /app/build ./

# Ensure scripts are executable
RUN chmod +x scripts/*.sh 2>/dev/null || true

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:10000/health || exit 1

# Use entrypoint for initialization
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "bin/server.js"]