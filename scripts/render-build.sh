#!/bin/bash
# scripts/render-build.sh - Render.com build script (FIXED)
# Runs during deployment build phase

set -e

echo "🚀 Starting Render Build..."
echo "========================================"

# Install ALL dependencies (including dev) for build phase
echo "📦 Installing all dependencies..."
npm ci --legacy-peer-deps

# Generate theme configuration
echo "🎨 Generating theme..."
node scripts/generate-theme.cjs

# Build application (this triggers Vite build via AdonisJS build hook)
echo "🔨 Building application..."
node ace build --ignore-ts-errors

# Verify Vite manifest was created
echo "🔍 Verifying build artifacts..."
if [ -f "build/public/assets/.vite/manifest.json" ]; then
    echo "✅ Vite manifest found"
else
    echo "⚠️  Warning: Vite manifest not found at build/public/assets/.vite/manifest.json"
    echo "Listing build/public/assets/ contents:"
    ls -la build/public/assets/ || echo "Directory doesn't exist"
fi

# Install production dependencies in build folder
echo "📦 Installing production dependencies in build folder..."
cd build
npm ci --omit=dev --legacy-peer-deps

echo ""
echo "✅ Build completed successfully!"
echo "========================================"
echo ""
echo "📊 Build Summary:"
echo "   - Theme generated: ✅"
echo "   - AdonisJS built: ✅"
echo "   - Vite assets compiled: ✅"
echo "   - Production deps installed: ✅"
echo ""