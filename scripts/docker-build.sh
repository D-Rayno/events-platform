#!/bin/bash
# ============================================
# Docker Build Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_NAME="g-agency-events"
DOCKERFILE="Dockerfile"
COMPOSE_FILE="docker-compose.yml"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Docker Build Script                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to check requirements
check_requirements() {
    echo -e "${YELLOW}🔍 Checking requirements...${NC}"
    
    local missing_files=()
    
    if [ ! -f ".env.docker" ]; then
        missing_files+=(".env.docker")
    fi
    
    if [ ! -f "$DOCKERFILE" ]; then
        missing_files+=("$DOCKERFILE")
    fi
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        missing_files+=("$COMPOSE_FILE")
    fi
    
    if [ ${#missing_files[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required files:${NC}"
        printf '%s\n' "${missing_files[@]}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All requirements met${NC}"
}

# Function to build the image
build_image() {
    echo -e "${YELLOW}🏗️ Building Docker image...${NC}"
    
    docker compose -f "$COMPOSE_FILE" build --no-cache
    
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
}

# Function to verify the image
verify_image() {
    echo -e "${YELLOW}🔍 Verifying built image...${NC}"
    
    local image_name="${PROJECT_NAME}-app"
    
    if ! docker image inspect "$image_name" > /dev/null 2>&1; then
        echo -e "${RED}❌ Image not found${NC}"
        return 1
    fi
    
    local image_size=$(docker image inspect "$image_name" --format='{{.Size}}' | awk '{print int($1/1024/1024)}')
    echo -e "${BLUE}📦 Image size: ${image_size}MB${NC}"
    
    echo -e "${GREEN}✅ Image verified${NC}"
}

# Function to show summary
show_summary() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   Build Complete! 🎉                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}🚀 Next steps:${NC}"
    echo -e "  ${BLUE}•${NC} Run with: ${GREEN}make up${NC}"
    echo -e "  ${BLUE}•${NC} Check logs: ${GREEN}make logs${NC}"
    echo ""
}

# Main execution
main() {
    check_requirements
    build_image
    verify_image
    show_summary
}

# Handle script arguments
case "${1:-build}" in
    "build")
        main
        ;;
    "clean")
        echo -e "${YELLOW}🧹 Cleaning up Docker resources...${NC}"
        docker compose -f "$COMPOSE_FILE" down -v 2>/dev/null || true
        docker system prune -f
        echo -e "${GREEN}✅ Cleanup complete${NC}"
        ;;
    "rebuild")
        echo -e "${YELLOW}🔄 Rebuilding from scratch...${NC}"
        $0 clean
        main
        ;;
    *)
        echo "Usage: $0 [build|clean|rebuild]"
        exit 1
        ;;
esac