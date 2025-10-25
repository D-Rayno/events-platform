#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Database Reset & Seed Script         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Step 1: Rollback migrations
echo -e "${YELLOW}🗑️  Step 1: Rolling back migrations...${NC}"
node ace migration:rollback --force

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Rollback failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Rollback complete${NC}\n"

# Step 2: Run migrations
echo -e "${YELLOW}📦 Step 2: Running migrations...${NC}"
node ace migration:run

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Migration failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Migrations complete${NC}\n"

# Step 3: Seed database
echo -e "${YELLOW}🌱 Step 3: Seeding database...${NC}"
node ace db:seed

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Seeding failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Seeding complete${NC}\n"

# Success message
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         ✨ All Done! ✨                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}📊 Database Summary:${NC}"
echo -e "   • 101 users (1 admin + 100 regular)"
echo -e "   • 30 events (published, ongoing, finished)"
echo -e "   • ~300 registrations\n"

echo -e "${BLUE}🔐 Test Credentials:${NC}"
echo -e "   ${GREEN}Admin:${NC} admin@events.dz / Admin@123"
echo -e "   ${GREEN}Users:${NC} user1@events.dz to user100@events.dz / Password@123\n"

echo -e "${BLUE}🚀 Next steps:${NC}"
echo -e "   Run: ${YELLOW}npm run dev${NC} to start the server\n"