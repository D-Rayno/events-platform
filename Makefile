# ============================================
# Makefile for Development & Deployment
# ============================================

.PHONY: help

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

help: ## Show this help message
	@echo "$(BLUE)═══════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  G-Agency Events - Commands$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ============================================
# Local Development (Docker Compose)
# ============================================

check-ports: ## Check if required ports are available
	@echo "$(BLUE)Checking required ports...$(NC)"
	@if lsof -Pi :3306 -sTCP:LISTEN -t >/dev/null 2>&1 ; then \
		echo "$(RED)✗ Port 3306 (MySQL) is already in use$(NC)"; \
		lsof -Pi :3306 -sTCP:LISTEN; \
		exit 1; \
	fi
	@if lsof -Pi :8108 -sTCP:LISTEN -t >/dev/null 2>&1 ; then \
		echo "$(RED)✗ Port 8108 (Typesense) is already in use$(NC)"; \
		lsof -Pi :8108 -sTCP:LISTEN; \
		echo "$(YELLOW)Run: make kill-typesense$(NC)"; \
		exit 1; \
	fi
	@if lsof -Pi :3333 -sTCP:LISTEN -t >/dev/null 2>&1 ; then \
		echo "$(RED)✗ Port 3333 (App) is already in use$(NC)"; \
		lsof -Pi :3333 -sTCP:LISTEN; \
		exit 1; \
	fi
	@echo "$(GREEN)✓ All ports available$(NC)"

kill-typesense: ## Kill any running Typesense process
	@echo "$(YELLOW)Killing Typesense processes...$(NC)"
	@-pkill -9 typesense 2>/dev/null || true
	@-sudo pkill -9 typesense 2>/dev/null || true
	@echo "$(GREEN)✓ Typesense processes killed$(NC)"

dev: ## Start development environment
	@echo "$(BLUE)Starting development environment...$(NC)"
	@docker compose up -d
	@echo "$(GREEN)✓ Services started$(NC)"
	@echo "$(YELLOW)Waiting for services to be healthy...$(NC)"
	@sleep 5
	@docker compose ps
	@echo ""
	@echo "$(GREEN)✓ Development environment ready!$(NC)"
	@echo "$(YELLOW)Run 'make migrate' and 'make seed' for first-time setup$(NC)"

stop: ## Stop all services
	@echo "$(BLUE)Stopping services...$(NC)"
	@docker compose down
	@echo "$(GREEN)✓ Services stopped$(NC)"

restart: ## Restart all services
	@docker compose restart

logs: ## View application logs
	@docker compose logs -f app

logs-db: ## View database logs
	@docker compose logs -f db

logs-typesense: ## View Typesense logs
	@docker compose logs -f typesense

logs-all: ## View all service logs
	@docker compose logs -f

shell: ## Access application shell
	@docker compose exec app sh

db-shell: ## Access database shell
	@docker compose exec db mysql -uroot -proot events_platform

status: ## Show service status
	@docker compose ps

# ============================================
# Database Operations
# ============================================

migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	@docker compose exec app node ace migration:run
	@echo "$(GREEN)✓ Migrations complete$(NC)"

migrate-rollback: ## Rollback last migration
	@docker compose exec app node ace migration:rollback

seed: ## Seed database
	@echo "$(BLUE)Seeding database...$(NC)"
	@docker compose exec app node ace db:seed
	@echo "$(GREEN)✓ Seeding complete$(NC)"

db-reset: ## Reset database (rollback, migrate, seed)
	@echo "$(YELLOW)Resetting database...$(NC)"
	@docker compose exec app node ace migration:rollback --force
	@docker compose exec app node ace migration:run
	@docker compose exec app node ace db:seed
	@echo "$(GREEN)✓ Database reset complete$(NC)"

# ============================================
# Typesense Operations
# ============================================

typesense-health: ## Check Typesense health
	@echo "$(BLUE)Checking Typesense health...$(NC)"
	@curl -s http://localhost:8108/health || echo "$(RED)Typesense not responding$(NC)"

typesense-setup: ## Setup Typesense collections
	@echo "$(BLUE)Setting up Typesense collections...$(NC)"
	@docker compose exec app node ace setup:typesense --force
	@echo "$(GREEN)✓ Typesense setup complete$(NC)"

typesense-index: ## Index all data into Typesense
	@echo "$(BLUE)Indexing data...$(NC)"
	@docker compose exec app node ace index:all
	@echo "$(GREEN)✓ Indexing complete$(NC)"

typesense-restart: ## Restart Typesense service
	@echo "$(YELLOW)Restarting Typesense...$(NC)"
	@docker compose restart typesense
	@echo "$(YELLOW)Waiting for Typesense to be healthy...$(NC)"
	@sleep 10
	@docker compose ps typesense
	@echo "$(GREEN)✓ Typesense restarted$(NC)"

typesense-reset: ## Reset Typesense (remove volume and restart)
	@echo "$(RED)⚠ This will delete all Typesense data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose stop typesense; \
		docker compose rm -f typesense; \
		docker volume rm $$(docker volume ls -q | grep typesense) 2>/dev/null || true; \
		docker compose up -d typesense; \
		sleep 10; \
		make typesense-setup; \
		make typesense-index; \
		echo "$(GREEN)✓ Typesense reset complete$(NC)"; \
	fi

# ============================================
# Docker Build & Management
# ============================================

build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	@docker compose build --no-cache
	@echo "$(GREEN)✓ Build complete$(NC)"

clean: ## Remove containers, volumes, and images
	@echo "$(RED)⚠ This will remove ALL data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v; \
		docker system prune -f; \
		echo "$(GREEN)✓ Cleanup complete$(NC)"; \
	fi

rebuild: stop build dev ## Rebuild and restart services

# ============================================
# Quick Setup
# ============================================

setup: check-ports kill-typesense build dev ## Initial setup (first time)
	@echo "$(BLUE)Setting up project...$(NC)"
	@if [ ! -f .env.docker ]; then cp .env.example .env.docker; echo "$(GREEN)✓ Created .env.docker$(NC)"; fi
	@echo "$(YELLOW)Waiting for services to be healthy...$(NC)"
	@sleep 15
	@make migrate
	@make seed
	@echo "$(YELLOW)Setting up Typesense...$(NC)"
	@sleep 5
	@make typesense-setup || echo "$(YELLOW)⚠ Typesense setup skipped (will retry)$(NC)"
	@sleep 5
	@make typesense-setup || echo "$(RED)✗ Typesense setup failed$(NC)"
	@make typesense-index || echo "$(YELLOW)⚠ Typesense indexing skipped$(NC)"
	@echo ""
	@echo "$(GREEN)╔════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║   Setup Complete!                      ║$(NC)"
	@echo "$(GREEN)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(BLUE)🌐 Access Points:$(NC)"
	@echo "  $(GREEN)Application:$(NC)  http://localhost:3333"
	@echo "  $(GREEN)MySQL:$(NC)        localhost:3306"
	@echo "  $(GREEN)Typesense:$(NC)    http://localhost:8108"
	@echo ""
	@echo "$(BLUE)🔐 Login:$(NC)"
	@echo "  $(GREEN)Admin:$(NC) admin@events.dz / Admin@123"
	@echo ""

fresh: kill-typesense clean setup ## Fresh installation

# ============================================
# Testing & Quality
# ============================================

test: ## Run tests
	@docker compose exec app node ace test

lint: ## Run linter
	@npm run lint

format: ## Format code
	@npm run format

typecheck: ## Type check
	@npm run typecheck

# ============================================
# Utilities
# ============================================

generate-key: ## Generate new APP_KEY
	@node ace generate:key

generate-token: ## Generate new ADMIN_API_TOKEN
	@node ace generate:admin-token

routes: ## List all routes
	@docker compose exec app node ace list:routes

# ============================================
# Production/Render
# ============================================

render-build: ## Build for Render deployment
	@echo "$(BLUE)Building for Render...$(NC)"
	@bash scripts/render-build.sh
	@echo "$(GREEN)✓ Build complete$(NC)"

render-start: ## Start for Render deployment
	@echo "$(BLUE)Starting Render service...$(NC)"
	@bash scripts/render-start.sh

# ============================================
# Troubleshooting
# ============================================

doctor: ## Run diagnostics
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   System Diagnostics                   ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Checking Docker...$(NC)"
	@docker --version || echo "$(RED)✗ Docker not found$(NC)"
	@docker compose version || echo "$(RED)✗ Docker Compose not found$(NC)"
	@echo ""
	@echo "$(YELLOW)2. Checking ports...$(NC)"
	@-make check-ports 2>&1 || true
	@echo ""
	@echo "$(YELLOW)3. Checking containers...$(NC)"
	@docker compose ps
	@echo ""
	@echo "$(YELLOW)4. Checking Typesense health...$(NC)"
	@-make typesense-health
	@echo ""
	@echo "$(YELLOW)5. Recent errors (if any):$(NC)"
	@docker compose logs --tail=20 --timestamps

fix-typesense: kill-typesense typesense-reset ## Fix Typesense issues

# ============================================
# Scripts
# ============================================

make-scripts-executable: ## Make all scripts executable
	@chmod +x scripts/*.sh
	@echo "$(GREEN)✓ Scripts are now executable$(NC)"