#!/bin/bash
# check-docker-setup.sh - Verify Docker setup is ready

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Docker Setup Verification            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Check counter
PASSED=0
FAILED=0

# Function to check
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# 1. Check Docker
echo -e "${YELLOW}Checking Docker...${NC}"
docker --version &>/dev/null
check "Docker installed"

docker-compose --version &>/dev/null
check "Docker Compose installed"

docker ps &>/dev/null
check "Docker daemon running"
echo ""

# 2. Check required files
echo -e "${YELLOW}Checking required files...${NC}"
test -f "package.json"
check "package.json exists"

test -f "package-lock.json"
check "package-lock.json exists"

test -f "Dockerfile"
check "Dockerfile exists"

test -f "docker-compose.yml"
check "docker-compose.yml exists"

test -f ".env.docker.example"
check ".env.docker.example exists"

test -f ".env.docker"
check ".env.docker exists"
echo ""

# 3. Check package-lock.json validity
echo -e "${YELLOW}Checking package-lock.json...${NC}"
if [ -f "package-lock.json" ]; then
    SIZE=$(stat -f%z "package-lock.json" 2>/dev/null || stat -c%s "package-lock.json" 2>/dev/null)
    if [ "$SIZE" -gt 10000 ]; then
        echo -e "${GREEN}✓${NC} package-lock.json has valid size ($(numfmt --to=iec-i --suffix=B $SIZE 2>/dev/null || echo "$SIZE bytes"))"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} package-lock.json seems too small"
        ((FAILED++))
    fi
    
    # Check if it's valid JSON
    if python3 -c "import json; json.load(open('package-lock.json'))" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} package-lock.json is valid JSON"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} package-lock.json is not valid JSON"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗${NC} package-lock.json missing"
    ((FAILED++))
fi
echo ""

# 4. Check .env.docker configuration
echo -e "${YELLOW}Checking .env.docker...${NC}"
if [ -f ".env.docker" ]; then
    grep -q "APP_KEY=" .env.docker
    check "APP_KEY configured"
    
    grep -q "DB_HOST=" .env.docker
    check "Database host configured"
    
    grep -q "SMTP_HOST=" .env.docker
    check "Email SMTP configured"
    
    grep -q "ADMIN_API_TOKEN=" .env.docker
    check "Admin token configured"
else
    echo -e "${RED}✗${NC} .env.docker missing"
    ((FAILED++))
fi
echo ""

# 5. Check Docker images
echo -e "${YELLOW}Checking Docker images...${NC}"
if docker images | grep -q "g-agency-events"; then
    echo -e "${GREEN}✓${NC} Docker image exists"
    ((PASSED++))
else
    echo -e "${YELLOW}ℹ${NC} Docker image not built yet (run: make build)"
fi

# 6. Check running containers
echo -e "${YELLOW}Checking running containers...${NC}"
RUNNING=$(docker-compose ps -q 2>/dev/null | wc -l | tr -d ' ')
if [ "$RUNNING" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} $RUNNING container(s) running"
    docker-compose ps
else
    echo -e "${YELLOW}ℹ${NC} No containers running (run: make up)"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Summary                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "${YELLOW}Ready to build:${NC} make build"
    echo -e "${YELLOW}Or quick start:${NC} make quick-start"
    exit 0
else
    echo -e "${RED}✗ Some checks failed${NC}"
    echo ""
    echo -e "${YELLOW}Quick fixes:${NC}"
    
    if [ ! -f "package-lock.json" ]; then
        echo "  • Generate lockfile: ${BLUE}npm install --package-lock-only${NC}"
    fi
    
    if [ ! -f ".env.docker" ]; then
        echo "  • Create env file: ${BLUE}cp .env.docker.example .env.docker${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}Then run:${NC} ${BLUE}make build${NC}"
    exit 1
fi