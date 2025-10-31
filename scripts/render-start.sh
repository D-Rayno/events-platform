#!/bin/bash
# scripts/render-start.sh - Render.com start script
# Runs when the service starts

set -e

echo "🚀 Starting Application..."
echo "========================================"

# Function to check database connectivity
check_database() {
    echo "📊 Checking database connection..."
    
    # Try to connect to database
    if node ace db:check 2>/dev/null; then
        echo "✅ Database connection successful"
        return 0
    else
        echo "⚠️  Database connection failed"
        return 1
    fi
}

# Wait for database to be ready (with timeout)
echo "⏳ Waiting for database..."
TIMEOUT=60
ELAPSED=0
INTERVAL=2

while [ $ELAPSED -lt $TIMEOUT ]; do
    if check_database; then
        break
    fi
    
    echo "   Waiting for database... (${ELAPSED}s/${TIMEOUT}s)"
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "⚠️  Database check timed out after ${TIMEOUT}s"
    echo "⚠️  Proceeding anyway... (migrations may fail)"
fi

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
if node ace migration:run --force; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migrations failed (this may be expected on first run)"
    echo "⚠️  Continuing with startup..."
fi

# Setup Typesense (if enabled)
if [ "$TYPESENSE_ENABLED" = "true" ]; then
    echo ""
    echo "🔍 Setting up Typesense..."
    
    if node ace setup:typesense --force 2>/dev/null; then
        echo "✅ Typesense collections created"
        
        echo "📊 Indexing data..."
        if node ace index:all 2>/dev/null; then
            echo "✅ Data indexed successfully"
        else
            echo "⚠️  Indexing skipped (no data or Typesense unavailable)"
        fi
    else
        echo "⚠️  Typesense setup skipped (service may not be available)"
    fi
else
    echo ""
    echo "ℹ️  Typesense is disabled (TYPESENSE_ENABLED=false)"
fi

# Start application
echo ""
echo "🚀 Starting server..."
echo "========================================"
echo ""
echo "Environment:"
echo "  - NODE_ENV: ${NODE_ENV}"
echo "  - PORT: ${PORT}"
echo "  - DB_HOST: ${DB_HOST}"
echo "  - TYPESENSE_ENABLED: ${TYPESENSE_ENABLED}"
echo ""
echo "Starting..."
echo ""

exec node bin/server.js