#!/bin/bash
# scripts/render-build.sh - Render.com build script
# Runs during deployment build phase

set -e

echo "🚀 Starting Render Build..."
echo "========================================"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --omit=dev --ignore-scripts

# Generate theme configuration
echo "🎨 Generating theme..."
node scripts/generate-theme.cjs

# Build application
echo "🔨 Building application..."
node ace build --ignore-ts-errors

# Install production dependencies in build folder
echo "📦 Installing production dependencies in build..."
cd build && npm ci --omit=dev

echo ""
echo "✅ Build completed successfully!"
echo "========================================"