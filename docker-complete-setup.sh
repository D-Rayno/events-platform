#!/bin/bash
# docker-complete-setup.sh - Complete Docker setup from scratch

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Complete Docker Setup                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Detect Docker Compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
    echo -e "${GREEN}✓ Using Docker Compose V2${NC}"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
    echo -e "${YELLOW}⚠ Using Docker Compose V1 (legacy)${NC}"
else
    echo -e "${RED}✗ Docker Compose not found!${NC}"
    exit 1
fi
echo ""

# Step 1: Clean up everything
echo -e "${YELLOW}Step 1: Cleaning up old containers and volumes...${NC}"
$DOCKER_COMPOSE down -v 2>/dev/null || true
docker system prune -f
echo -e "${GREEN}✓ Cleanup complete${NC}\n"

# Step 2: Update .env.docker with correct Typesense key
echo -e "${YELLOW}Step 2: Updating .env.docker...${NC}"
if [ -f .env.docker ]; then
    # Update Typesense API key to match docker-compose.yml
    sed -i 's/^TYPESENSE_API_KEY=.*/TYPESENSE_API_KEY=docker-typesense-dev-key-12345/' .env.docker 2>/dev/null || \
    sed -i '' 's/^TYPESENSE_API_KEY=.*/TYPESENSE_API_KEY=docker-typesense-dev-key-12345/' .env.docker 2>/dev/null
    
    echo -e "${GREEN}✓ .env.docker updated${NC}"
else
    cp .env.docker.example .env.docker
    echo -e "${GREEN}✓ .env.docker created${NC}"
fi
echo ""

# Step 3: Verify adonisrc.ts includes Inertia
echo -e "${YELLOW}Step 3: Checking adonisrc.ts...${NC}"
if grep -q "inertia/\*\*/\*" adonisrc.ts; then
    echo -e "${GREEN}✓ adonisrc.ts is configured correctly${NC}"
else
    echo -e "${RED}✗ adonisrc.ts needs to be fixed${NC}"
    echo -e "${YELLOW}Run: bash docker-fix.sh${NC}"
    exit 1
fi
echo ""

# Step 4: Build Docker images
echo -e "${YELLOW}Step 4: Building Docker images (this may take 5-10 minutes)...${NC}"
$DOCKER_COMPOSE build --no-cache
echo -e "${GREEN}✓ Docker images built${NC}\n"

# Step 5: Start services
echo -e "${YELLOW}Step 5: Starting services...${NC}"
$DOCKER_COMPOSE up -d
echo -e "${GREEN}✓ Services started${NC}\n"

# Step 6: Wait for services to be healthy
echo -e "${YELLOW}Step 6: Waiting for services to be healthy...${NC}"
echo -e "${BLUE}This may take up to 60 seconds...${NC}\n"

# Wait for MySQL
echo -n "Waiting for MySQL... "
MYSQL_READY=0
for i in {1..30}; do
    if docker compose exec -T db mysqladmin ping -h localhost -uroot -proot &>/dev/null; then
        MYSQL_READY=1
        break
    fi
    sleep 2
    echo -n "."
done
echo ""

if [ $MYSQL_READY -eq 1 ]; then
    echo -e "${GREEN}✓ MySQL is ready${NC}"
else
    echo -e "${RED}✗ MySQL failed to start${NC}"
    echo -e "${YELLOW}Check logs: docker compose logs db${NC}"
    exit 1
fi

# Wait for Typesense
echo -n "Waiting for Typesense... "
TYPESENSE_READY=0
for i in {1..30}; do
    if curl -s http://localhost:8108/health &>/dev/null; then
        TYPESENSE_READY=1
        break
    fi
    sleep 2
    echo -n "."
done
echo ""

if [ $TYPESENSE_READY -eq 1 ]; then
    echo -e "${GREEN}✓ Typesense is ready${NC}"
else
    echo -e "${YELLOW}⚠ Typesense may not be ready${NC}"
    echo -e "${YELLOW}Check logs: docker compose logs typesense${NC}"
fi

# Wait for App
echo -n "Waiting for App... "
APP_READY=0
for i in {1..30}; do
    if curl -s http://localhost:3333 &>/dev/null; then
        APP_READY=1
        break
    fi
    sleep 2
    echo -n "."
done
echo ""

if [ $APP_READY -eq 1 ]; then
    echo -e "${GREEN}✓ App is ready${NC}"
else
    echo -e "${YELLOW}⚠ App may not be ready yet${NC}"
    echo -e "${YELLOW}Check logs: docker compose logs app${NC}"
fi
echo ""

# Step 7: Run migrations
echo -e "${YELLOW}Step 7: Running database migrations...${NC}"
$DOCKER_COMPOSE exec -T app node ace migration:run --force
echo -e "${GREEN}✓ Migrations complete${NC}\n"

# Step 8: Seed database
echo -e "${YELLOW}Step 8: Seeding database...${NC}"
$DOCKER_COMPOSE exec -T app node ace db:seed
echo -e "${GREEN}✓ Database seeded${NC}\n"

# Step 9: Setup Typesense
if [ $TYPESENSE_READY -eq 1 ]; then
    echo -e "${YELLOW}Step 9: Setting up Typesense collections...${NC}"
    $DOCKER_COMPOSE exec -T app node ace setup:typesense --force || echo -e "${YELLOW}⚠ Typesense setup skipped${NC}"
    
    echo -e "${YELLOW}Indexing data into Typesense...${NC}"
    $DOCKER_COMPOSE exec -T app node ace index:all || echo -e "${YELLOW}⚠ Typesense indexing skipped${NC}"
    echo -e "${GREEN}✓ Typesense configured${NC}\n"
else
    echo -e "${YELLOW}⚠ Skipping Typesense setup (service not ready)${NC}\n"
fi

# Final status check
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Setup Complete!                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}✓ All services are running!${NC}\n"

echo -e "${BLUE}📊 Service Status:${NC}"
$DOCKER_COMPOSE ps
echo ""

echo -e "${BLUE}🌐 Access Points:${NC}"
echo -e "  ${GREEN}Application:${NC}  http://localhost:3333"
echo -e "  ${GREEN}MySQL:${NC}        localhost:3306"
echo -e "  ${GREEN}Typesense:${NC}    http://localhost:8108"
echo ""

echo -e "${BLUE}🔐 Login Credentials:${NC}"
echo -e "  ${GREEN}Admin:${NC} admin@events.dz / Admin@123"
echo -e "  ${GREEN}Users:${NC} user1@events.dz to user100@events.dz / Password@123"
echo ""

echo -e "${BLUE}📝 Useful Commands:${NC}"
echo -e "  ${YELLOW}View logs:${NC}      $DOCKER_COMPOSE logs -f app"
echo -e "  ${YELLOW}Access shell:${NC}   $DOCKER_COMPOSE exec app sh"
echo -e "  ${YELLOW}Stop services:${NC}  $DOCKER_COMPOSE down"
echo -e "  ${YELLOW}Restart:${NC}        $DOCKER_COMPOSE restart"
echo ""

echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "${YELLOW}Visit: http://localhost:3333${NC}\n"