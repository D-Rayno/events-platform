#!/bin/bash
# quick-docker-fix.sh - Fix Docker Compose and Inertia build issues

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Docker Quick Fix Script              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# 1. Check Docker Compose version
echo -e "${YELLOW}Checking Docker Compose...${NC}"
if command -v docker &> /dev/null; then
    if docker compose version &> /dev/null; then
        echo -e "${GREEN}✓ Docker Compose V2 available${NC}"
        DOCKER_COMPOSE="docker compose"
    elif command -v docker-compose &> /dev/null; then
        echo -e "${YELLOW}⚠ Using Docker Compose V1 (legacy)${NC}"
        DOCKER_COMPOSE="docker-compose"
    else
        echo -e "${RED}✗ Docker Compose not found!${NC}"
        echo -e "${YELLOW}Install Docker Compose:${NC}"
        echo -e "  https://docs.docker.com/compose/install/"
        exit 1
    fi
else
    echo -e "${RED}✗ Docker not found!${NC}"
    exit 1
fi
echo ""

# 2. Update adonisrc.ts to include inertia files in build
echo -e "${YELLOW}Fixing adonisrc.ts...${NC}"
if ! grep -q "inertia/\*\*/\*" adonisrc.ts; then
    echo -e "${YELLOW}Adding Inertia files to metaFiles...${NC}"
    
    # Backup original
    cp adonisrc.ts adonisrc.ts.backup
    
    # Add inertia pattern before the closing bracket
    sed -i '/metaFiles: \[/,/\],/ {
        /pattern: .public\/\*\*./a\    {\n      pattern: '"'"'inertia/**/*.{js,json,tsx,ts,jsx,css}'"'"',\n      reloadServer: false,\n    },
    }' adonisrc.ts 2>/dev/null || \
    sed -i '' '/metaFiles: \[/,/\],/ {
        /pattern: .public\/\*\*./a\
\    {\
\      pattern: '"'"'inertia/**/*.{js,json,tsx,ts,jsx,css}'"'"',\
\      reloadServer: false,\
\    },
    }' adonisrc.ts 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ adonisrc.ts updated${NC}"
    else
        echo -e "${YELLOW}⚠ Could not auto-update adonisrc.ts${NC}"
        echo -e "${YELLOW}Please manually add this to metaFiles array:${NC}"
        echo -e "${BLUE}"
        cat << 'EOF'
    {
      pattern: 'inertia/**/*.{js,json,tsx,ts,jsx,css}',
      reloadServer: false,
    },
EOF
        echo -e "${NC}"
    fi
else
    echo -e "${GREEN}✓ adonisrc.ts already includes Inertia files${NC}"
fi
echo ""

# 3. Create/Update .env.docker
echo -e "${YELLOW}Checking .env.docker...${NC}"
if [ ! -f .env.docker ]; then
    if [ -f .env.docker.example ]; then
        cp .env.docker.example .env.docker
        echo -e "${GREEN}✓ Created .env.docker${NC}"
    else
        echo -e "${RED}✗ .env.docker.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env.docker exists${NC}"
fi
echo ""

# 4. Check package-lock.json
echo -e "${YELLOW}Checking package-lock.json...${NC}"
if [ ! -f package-lock.json ]; then
    echo -e "${YELLOW}Generating package-lock.json...${NC}"
    npm install --package-lock-only
    echo -e "${GREEN}✓ package-lock.json generated${NC}"
else
    echo -e "${GREEN}✓ package-lock.json exists${NC}"
fi
echo ""

# 5. Clean old build
echo -e "${YELLOW}Cleaning old build...${NC}"
if [ -d build ]; then
    rm -rf build
    echo -e "${GREEN}✓ Old build removed${NC}"
fi
echo ""

# 6. Rebuild locally to verify
echo -e "${YELLOW}Testing local build...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Local build successful${NC}"
    
    # Check if inertia files are in build
    if [ -d "build/public/assets" ]; then
        echo -e "${GREEN}✓ Assets directory exists${NC}"
        
        # Count JS files
        JS_COUNT=$(find build/public/assets -name "*.js" 2>/dev/null | wc -l)
        CSS_COUNT=$(find build/public/assets -name "*.css" 2>/dev/null | wc -l)
        
        echo -e "${BLUE}Found assets:${NC}"
        echo -e "  ${GREEN}$JS_COUNT JavaScript files${NC}"
        echo -e "  ${GREEN}$CSS_COUNT CSS files${NC}"
        
        if [ $JS_COUNT -gt 0 ]; then
            echo -e "${GREEN}✓ Inertia pages compiled successfully${NC}"
        else
            echo -e "${RED}✗ No JavaScript files found!${NC}"
            echo -e "${YELLOW}Check vite.config.ts and inertia setup${NC}"
        fi
    else
        echo -e "${RED}✗ Assets directory not found${NC}"
    fi
else
    echo -e "${RED}✗ Local build failed${NC}"
    exit 1
fi
echo ""

# 7. Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
$DOCKER_COMPOSE build --no-cache
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully${NC}"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Summary                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}✓ All checks passed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Start services:   ${BLUE}$DOCKER_COMPOSE up -d${NC}"
echo -e "  2. Run migrations:   ${BLUE}$DOCKER_COMPOSE exec app node ace migration:run${NC}"
echo -e "  3. Seed database:    ${BLUE}$DOCKER_COMPOSE exec app node ace db:seed${NC}"
echo -e "  4. Visit:            ${BLUE}http://localhost:3333${NC}"
echo ""
echo -e "${YELLOW}Or use Makefile commands:${NC}"
echo -e "  ${BLUE}make up${NC}"
echo -e "  ${BLUE}make migrate${NC}"
echo -e "  ${BLUE}make seed${NC}"