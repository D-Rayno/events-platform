#!/bin/sh
# ============================================
# Docker Entrypoint Script
# Runs migrations and setup before starting app
# ============================================

set -e

echo "🐳 Docker Container Starting..."
echo "========================================"

# Wait for database to be ready
echo "⏳ Waiting for database..."
until node ace db:check 2>/dev/null; do
  echo "   Database not ready, waiting..."
  sleep 2
done
echo "✅ Database is ready"

# Run migrations
echo "🗄️  Running database migrations..."
node ace migration:run --force

# Setup Typesense (if enabled)
if [ "$TYPESENSE_ENABLED" = "true" ]; then
  echo "🔍 Setting up Typesense..."
  node ace setup:typesense --force || echo "⚠️  Typesense setup skipped"
  
  echo "📊 Indexing data..."
  node ace index:all || echo "⚠️  Typesense indexing skipped"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs tmp public/uploads

# Start the application
echo "🚀 Starting application..."
echo "========================================"
exec "$@"