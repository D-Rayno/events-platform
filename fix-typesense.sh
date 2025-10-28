#!/bin/bash
# fix-typesense.sh - Fix Typesense container issues

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Typesense Fix Script                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Detect Docker Compose
if docker compose version &> /dev/null; then
    DC="docker compose"
elif command -v docker-compose &> /dev/null; then
    DC="docker-compose"
else
    echo -e "${RED}✗ Docker Compose not found${NC}"
    exit 1
fi

# Step 1: Check current status
echo -e "${YELLOW}Checking Typesense container...${NC}"
if $DC ps | grep -q typesense; then
    STATUS=$($DC ps | grep typesense | awk '{print $5}')
    echo -e "${BLUE}Current status: $STATUS${NC}"
else
    echo -e "${RED}✗ Typesense container not found${NC}"
fi
echo ""

# Step 2: Show logs
echo -e "${YELLOW}Recent Typesense logs:${NC}"
echo -e "${BLUE}─────────────────────────────────────────${NC}"
$DC logs --tail=20 typesense 2>/dev/null || echo "No logs available"
echo -e "${BLUE}─────────────────────────────────────────${NC}\n"

# Step 3: Stop and remove Typesense
echo -e "${YELLOW}Stopping and removing Typesense container...${NC}"
$DC stop typesense 2>/dev/null || true
$DC rm -f typesense 2>/dev/null || true
echo -e "${GREEN}✓ Container removed${NC}\n"

# Step 4: Remove Typesense volume
echo -e "${YELLOW}Removing Typesense data volume...${NC}"
docker volume rm $(docker volume ls -q | grep typesense) 2>/dev/null || true
echo -e "${GREEN}✓ Volume removed${NC}\n"

# Step 5: Update .env.docker with correct API key
echo -e "${YELLOW}Updating .env.docker with correct API key...${NC}"
if [ -f .env.docker ]; then
    # Use simple API key
    sed -i 's/^TYPESENSE_API_KEY=.*/TYPESENSE_API_KEY=docker-typesense-dev-key-12345/' .env.docker 2>/dev/null || \
    sed -i '' 's/^TYPESENSE_API_KEY=.*/TYPESENSE_API_KEY=docker-typesense-dev-key-12345/' .env.docker 2>/dev/null
    
    echo -e "${GREEN}✓ API key updated${NC}"
    echo -e "${BLUE}New key: docker-typesense-dev-key-12345${NC}"
else
    echo -e "${RED}✗ .env.docker not found${NC}"
    exit 1
fi
echo ""

# Step 6: Verify docker-compose.yml has correct config
echo -e "${YELLOW}Checking docker-compose.yml...${NC}"
if grep -q "docker-typesense-dev-key-12345" docker-compose.yml; then
    echo -e "${GREEN}✓ docker-compose.yml is correct${NC}"
else
    echo -e "${RED}✗ docker-compose.yml needs updating${NC}"
    echo -e "${YELLOW}Update the TYPESENSE_API_KEY to: docker-typesense-dev-key-12345${NC}"
fi
echo ""

# Step 7: Restart Typesense
echo -e "${YELLOW}Starting Typesense with fresh configuration...${NC}"
$DC up -d typesense
echo -e "${GREEN}✓ Typesense starting...${NC}\n"

# Step 8: Wait for Typesense to be ready
echo -n "Waiting for Typesense health check... "
READY=0
for i in {1..30}; do
    if curl -s http://localhost:8108/health &>/dev/null; then
        READY=1
        break
    fi
    sleep 2
    echo -n "."
done
echo ""

if [ $READY -eq 1 ]; then
    echo -e "${GREEN}✓ Typesense is healthy!${NC}\n"
    
    # Test API key
    echo -e "${YELLOW}Testing API key...${NC}"
    RESPONSE=$(curl -s -H "X-TYPESENSE-API-KEY: docker-typesense-dev-key-12345" \
        http://localhost:8108/collections)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ API key is working${NC}"
        echo -e "${BLUE}Response: $RESPONSE${NC}"
    else
        echo -e "${RED}✗ API key test failed${NC}"
    fi
else
    echo -e "${RED}✗ Typesense failed to start${NC}"
    echo -e "${YELLOW}Check logs with: $DC logs typesense${NC}"
    exit 1
fi
echo ""

# Step 9: Setup collections (if app is running)
if $DC ps | grep -q "app.*Up"; then
    echo -e "${YELLOW}Setting up Typesense collections...${NC}"
    $DC exec -T app node ace setup:typesense --force
    echo -e "${GREEN}✓ Collections created${NC}\n"
    
    echo -e "${YELLOW}Indexing data...${NC}"
    $DC exec -T app node ace index:all
    echo -e "${GREEN}✓ Data indexed${NC}\n"
else
    echo -e "${YELLOW}⚠ App container not running, skipping collection setup${NC}"
    echo -e "${YELLOW}Run manually: $DC exec app node ace setup:typesense --force${NC}\n"
fi

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Typesense Fixed!                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}✓ Typesense is now running correctly${NC}"
echo -e "${BLUE}API Key: docker-typesense-dev-key-12345${NC}"
echo -e "${BLUE}Health: http://localhost:8108/health${NC}\n"

echo -e "${YELLOW}Test with curl:${NC}"
echo -e "${BLUE}curl -H 'X-TYPESENSE-API-KEY: docker-typesense-dev-key-12345' http://localhost:8108/collections${NC}\n"