# ============================================
# Multi-stage Dockerfile for AdonisJS + Inertia
# Optimized for Render.com free tier
# ============================================

# ============================================
# Stage 1: Base Image
# ============================================
FROM node:20-alpine AS base

# Install necessary dependencies including Python for native modules
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS dependencies

# Install all dependencies (including dev dependencies)
RUN if [ -f package-lock.json ]; then \
        npm ci; \
    else \
        npm install; \
    fi

# Copy source code
COPY . .

# ============================================
# Stage 3: Build
# ============================================
FROM dependencies AS build

# Generate theme configuration
RUN node scripts/generate-theme.cjs

# Build the application (IGNORE TEST ERRORS)
RUN node ace build --ignore-ts-errors

# Change to build directory and install production dependencies only
RUN cd build && npm ci --omit=dev

# ============================================
# Stage 4: Production
# ============================================
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    dumb-init

# Set production environment
ENV NODE_ENV=production
ENV PORT=10000
ENV HOST=0.0.0.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Create necessary directories with proper permissions
RUN mkdir -p logs tmp public/uploads public/assets && \
    chown -R nodejs:nodejs /app

# Copy built application from build stage
# The 'build' folder contains the compiled application
COPY --from=build --chown=nodejs:nodejs /app/build /app

# Debug: List files to verify structure (remove after debugging)
RUN ls -la /app && ls -la /app/bin || echo "No bin directory found"

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:10000/ || exit 1

# Start application with dumb-init (proper signal handling)
# Try both possible entry points
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "ls -la && ls -la bin && node bin/server.js"]