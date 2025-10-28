#!/bin/bash
# scripts/health-check.sh - Health check script for monitoring

set -e

# Check if server is responding
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT:-3333}/ || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "✅ Health check passed (HTTP $HTTP_CODE)"
    exit 0
else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    exit 1
fi