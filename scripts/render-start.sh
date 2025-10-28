#!/bin/bash
# scripts/render-start.sh - Render.com start script
# Runs when the service starts

set -e

echo "🐳 Starting Application..."
echo "========================================"

# Wait for database to be ready
echo "⏳ Waiting for database..."
timeout 60 bash -c 'until node ace db:check 2>/dev/null; do echo "   Database not ready, waiting..."; sleep 2; done' || {
    echo "⚠️  Database check timed out, proceeding anyway..."
}

# Run migrations
echo "🗄️  Running migrations..."
node ace migration:run --force || {
    echo "⚠️  Migrations failed, but continuing..."
}

# Setup Typesense (if enabled)
if [ "$TYPESENSE_ENABLED" = "true" ]; then
    echo "🔍 Setting up Typesense..."
    node ace setup:typesense --force || echo "⚠️  Typesense setup skipped"
    node ace index:all || echo "⚠️  Typesense indexing skipped"
fi

# Start application
echo "🚀 Starting server..."
echo "========================================"
exec node bin/server.js