#!/usr/bin/env bash
# render-build.sh - Build script for Render deployment

set -o errexit  # Exit on error
set -o pipefail # Exit on pipe failure

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate theme config and CSS variables
echo "🎨 Generating theme configuration..."
node scripts/generate-theme.cjs

# Generate AdonisJS app key if not exists
if [ -z "$APP_KEY" ]; then
  echo "⚠️  APP_KEY not found, generating one..."
  node ace generate:key
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Create logs directory for PM2
echo "📁 Creating logs directory..."
mkdir -p logs

# Run database migrations
echo "🗄️  Running database migrations..."
node ace migration:run --force

# Optional: Seed database (comment out if not needed)
# echo "🌱 Seeding database..."
# node ace db:seed

# Setup Typesense (if enabled)
if [ "$TYPESENSE_ENABLED" = "true" ]; then
  echo "🔍 Setting up Typesense collections..."
  node ace setup:typesense --force || echo "⚠️  Typesense setup skipped (not critical)"
  
  echo "📊 Indexing data into Typesense..."
  node ace index:all || echo "⚠️  Typesense indexing skipped (not critical)"
fi

echo "✅ Build completed successfully!"