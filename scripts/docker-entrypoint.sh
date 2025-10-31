#!/bin/bash
# ============================================
# Docker Entrypoint Script
# ============================================

set -e

echo "🚀 Starting G-Agency Events..."
echo "========================================"

# ============================================
# Wait for Database
# ============================================
wait_for_db() {
    echo "⏳ Waiting for MySQL to be ready..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" --silent; then
            echo "✅ Database connection successful"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo "   Attempt $attempt/$max_attempts..."
        sleep 2
    done
    
    echo "❌ Database connection timeout"
    return 1
}

# ============================================
# Wait for Typesense
# ============================================
wait_for_typesense() {
    if [ "${TYPESENSE_ENABLED:-false}" != "true" ]; then
        echo "ℹ️  Typesense disabled, skipping..."
        return 0
    fi
    
    echo "⏳ Waiting for Typesense to be ready..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s -f "http://${TYPESENSE_HOST}:${TYPESENSE_PORT}/health" > /dev/null 2>&1; then
            echo "✅ Typesense is ready"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo "   Attempt $attempt/$max_attempts..."
        sleep 2
    done
    
    echo "⚠️  Typesense not responding, continuing anyway..."
    return 0
}

# ============================================
# Run Migrations
# ============================================
run_migrations() {
    echo ""
    echo "🗄️  Running database migrations..."
    
    if node ace migration:run --force; then
        echo "✅ Migrations completed"
        return 0
    else
        echo "⚠️  Migrations failed"
        return 0
    fi
}

# ============================================
# Setup Typesense
# ============================================
setup_typesense() {
    if [ "${TYPESENSE_ENABLED:-false}" != "true" ]; then
        return 0
    fi
    
    echo ""
    echo "🔍 Setting up Typesense collections..."
    
    if node ace setup:typesense --force 2>&1; then
        echo "✅ Typesense collections created"
        
        echo ""
        echo "📊 Indexing data..."
        if node ace index:all 2>&1; then
            echo "✅ Data indexed"
        else
            echo "⚠️  Indexing skipped"
        fi
    else
        echo "⚠️  Typesense setup skipped"
    fi
}

# ============================================
# Main Execution
# ============================================
main() {
    # Wait for dependencies
    wait_for_db || exit 1
    wait_for_typesense
    
    # Database setup
    run_migrations
    
    # Search setup
    setup_typesense
    
    # Show environment info
    echo ""
    echo "========================================"
    echo "🎯 Environment:"
    echo "   NODE_ENV: ${NODE_ENV}"
    echo "   PORT: ${PORT}"
    echo "   DB_HOST: ${DB_HOST}"
    echo "   DB_DATABASE: ${DB_DATABASE}"
    echo "   TYPESENSE_ENABLED: ${TYPESENSE_ENABLED:-false}"
    echo "========================================"
    echo ""
    echo "✅ Initialization complete!"
    echo "🚀 Starting server..."
    echo ""
    
    # Execute the main command
    exec "$@"
}

main "$@"