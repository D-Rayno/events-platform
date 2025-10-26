#!/usr/bin/env bash
# render-start.sh - Start script for Render deployment with PM2

set -o errexit

echo "🚀 Starting application with PM2..."

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
  echo "📦 Installing PM2..."
  npm install -g pm2
fi

# Stop any existing PM2 processes
pm2 delete all || true

# Start the application using PM2
echo "▶️  Starting application..."
pm2 start ecosystem.config.cjs --env production

# Save PM2 process list
pm2 save

# Keep the process alive (required for Render)
pm2 logs --nostream