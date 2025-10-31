#!/bin/bash
# ============================================
# Health Check Script for AdonisJS Application
# Enhanced version with better error handling
# ============================================

set -e

# Configuration
HEALTH_URL="http://localhost:10000"
MAX_RETRIES=3
RETRY_DELAY=2

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check application health
check_health() {
    local attempt=1
    
    while [ $attempt -le $MAX_RETRIES ]; do
        echo "Health check attempt $attempt/$MAX_RETRIES..."
        
        # Try to connect to the application
        if curl -f -s --max-time 10 "$HEALTH_URL" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Application is healthy${NC}"
            return 0
        elif curl -f -s --max-time 10 "$HEALTH_URL/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Application health endpoint is responding${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Health check failed (attempt $attempt)${NC}"
            
            if [ $attempt -lt $MAX_RETRIES ]; then
                echo "Retrying in ${RETRY_DELAY}s..."
                sleep $RETRY_DELAY
            fi
        fi
        
        ((attempt++))
    done
    
    echo -e "${RED}❌ Application health check failed after $MAX_RETRIES attempts${NC}"
    return 1
}

# Function to check database connectivity
check_database() {
    if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
        echo "Checking database connectivity..."
        if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
            echo -e "${GREEN}✅ Database is reachable${NC}"
        else
            echo -e "${YELLOW}⚠️  Database connectivity check failed${NC}"
        fi
    fi
}

# Function to check disk space
check_disk_space() {
    local usage=$(df /app | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$usage" -gt 90 ]; then
        echo -e "${RED}❌ Disk usage is critical: ${usage}%${NC}"
        return 1
    elif [ "$usage" -gt 80 ]; then
        echo -e "${YELLOW}⚠️  Disk usage is high: ${usage}%${NC}"
    else
        echo -e "${GREEN}✅ Disk usage is normal: ${usage}%${NC}"
    fi
}

# Function to check memory usage
check_memory() {
    local mem_info=$(cat /proc/meminfo)
    local mem_total=$(echo "$mem_info" | grep MemTotal | awk '{print $2}')
    local mem_available=$(echo "$mem_info" | grep MemAvailable | awk '{print $2}')
    local mem_usage=$((100 - (mem_available * 100 / mem_total)))
    
    if [ "$mem_usage" -gt 90 ]; then
        echo -e "${RED}❌ Memory usage is critical: ${mem_usage}%${NC}"
        return 1
    elif [ "$mem_usage" -gt 80 ]; then
        echo -e "${YELLOW}⚠️  Memory usage is high: ${mem_usage}%${NC}"
    else
        echo -e "${GREEN}✅ Memory usage is normal: ${mem_usage}%${NC}"
    fi
}

# Main health check execution
main() {
    echo "Starting comprehensive health check..."
    echo "======================================"
    
    local exit_code=0
    
    # Check application health
    if ! check_health; then
        exit_code=1
    fi
    
    # Check database connectivity
    check_database
    
    # Check system resources
    if ! check_disk_space; then
        exit_code=1
    fi
    
    if ! check_memory; then
        exit_code=1
    fi
    
    echo "======================================"
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ Overall health check passed${NC}"
    else
        echo -e "${RED}❌ Health check failed${NC}"
    fi
    
    return $exit_code
}

# Execute main function
main "$@"