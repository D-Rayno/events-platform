#!/bin/bash
# fix-vite-build.sh - Fix missing Vite manifest issue

set -e

echo "🔧 Fixing Vite Build Issue"
echo "========================================"

# Stop containers
echo "⏸️  Stopping containers..."
docker compose down

# Remove old image to force rebuild
echo "🗑️  Removing old image..."
docker rmi zevent-app 2>/dev/null || echo "   (No old image found)"

# Rebuild with no cache
echo "🔨 Rebuilding Docker image..."
docker compose build --no-cache app

# Start services
echo "🚀 Starting services..."
docker compose up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 10

# Check if Vite manifest exists
echo "🔍 Checking Vite manifest..."
docker compose exec app ls -la public/assets/.vite/manifest.json && \
    echo "✅ Vite manifest found!" || \
    echo "❌ Vite manifest still missing!"

# Show logs
echo ""
echo "📋 Recent logs:"
docker compose logs --tail=20 app

echo ""
echo "========================================"
echo "✅ Rebuild complete!"
echo ""
echo "Try accessing: http://localhost:3333"