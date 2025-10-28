# ============================================
# Multi-stage Dockerfile for Production
# Works with or without package-lock.json
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
COPY package.json ./
COPY package-lock.json* ./

# Install ALL dependencies (including devDependencies for build)
# Use install instead of ci to avoid lock file requirement
RUN npm install --legacy-peer-deps

# ============================================
# Stage 3: Build
# ============================================
FROM dependencies AS build

# Copy source code
COPY . .

# Generate theme configuration FIRST
RUN node scripts/generate-theme.cjs

# Build AdonisJS (includes Vite via build hook)
RUN node ace build --ignore-ts-errors

# Verify manifest was created
RUN ls -la public/assets/.vite/manifest.json || echo "⚠️  Warning: Vite manifest not found"

# Install production dependencies in build folder
WORKDIR /app/build
RUN npm install --omit=dev --legacy-peer-deps

# ============================================
# Stage 4: Production
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

# Create necessary directories
RUN mkdir -p logs tmp public/uploads public/assets && \
    chown -R nodejs:nodejs /app

# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /app/build /app

# Copy health check script
COPY --chown=nodejs:nodejs scripts/health-check.sh /app/scripts/

# Make scripts executable
RUN chmod +x /app/scripts/health-check.sh

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