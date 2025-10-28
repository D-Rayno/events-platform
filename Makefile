# ============================================
# Makefile for Docker Development & Deployment
# ============================================

.PHONY: help setup build up down restart logs shell clean migrate seed reset test

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)═══════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  G-Agency Events - Docker Commands$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $1, $2}'
	@echo ""

check-lockfile: ## Check if package-lock.json exists
	@if [ ! -f package-lock.json ]; then \
		echo "$(RED)⚠️  package-lock.json not found!$(NC)"; \
		echo "$(YELLOW)Run: make generate-lockfile$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✓ package-lock.json exists$(NC)"

generate-lockfile: ## Generate package-lock.json
	@echo "$(BLUE)Generating package-lock.json...$(NC)"
	@bash setup-lockfile.sh
	@echo "$(GREEN)✓ Done$(NC)"

setup: ## Initial setup (create .env.docker)
	@echo "$(BLUE)Setting up environment...$(NC)"
	@if [ ! -f .env.docker ]; then \
		cp .env.docker.example .env.docker; \
		echo "$(GREEN)✓ Created .env.docker$(NC)"; \
		echo "$(YELLOW)⚠ Please edit .env.docker with your values$(NC)"; \
	else \
		echo "$(YELLOW)⚠ .env.docker already exists$(NC)"; \
	fi
	@make check-lockfile || make generate-lockfile

build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	@docker compose build --no-cache || docker-compose build --no-cache
	@echo "$(GREEN)✓ Build complete$(NC)"

up: ## Start all services
	@echo "$(BLUE)Starting services...$(NC)"
	@docker compose up -d || docker-compose up -d
	@echo "$(GREEN)✓ Services started$(NC)"
	@echo "$(YELLOW)Access app at: http://localhost:3333$(NC)"

down: ## Stop all services
	@echo "$(BLUE)Stopping services...$(NC)"
	@docker compose down || docker-compose down
	@echo "$(GREEN)✓ Services stopped$(NC)"

restart: ## Restart all services
	@echo "$(BLUE)Restarting services...$(NC)"
	@docker compose restart || docker-compose restart
	@echo "$(GREEN)✓ Services restarted$(NC)"

logs: ## View logs (app service)
	@docker compose logs -f app || docker-compose logs -f app

logs-db: ## View database logs
	@docker compose logs -f db || docker-compose logs -f db

logs-typesense: ## View Typesense logs
	@docker compose logs -f typesense || docker-compose logs -f typesense

logs-all: ## View all logs
	@docker compose logs -f || docker-compose logs -f

shell: ## Access app container shell
	@echo "$(BLUE)Accessing app shell...$(NC)"
	@docker compose exec app sh || docker-compose exec app sh

shell-db: ## Access database shell
	@echo "$(BLUE)Accessing MySQL shell...$(NC)"
	@docker compose exec db mysql -uroot -proot events_platform || docker-compose exec db mysql -uroot -proot events_platform

migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	@docker compose exec app node ace migration:run || docker-compose exec app node ace migration:run
	@echo "$(GREEN)✓ Migrations complete$(NC)"

migrate-rollback: ## Rollback last migration
	@echo "$(YELLOW)Rolling back last migration...$(NC)"
	@docker compose exec app node ace migration:rollback || docker-compose exec app node ace migration:rollback
	@echo "$(GREEN)✓ Rollback complete$(NC)"

seed: ## Seed database
	@echo "$(BLUE)Seeding database...$(NC)"
	@docker compose exec app node ace db:seed || docker-compose exec app node ace db:seed
	@echo "$(GREEN)✓ Seeding complete$(NC)"

reset: ## Reset database (rollback, migrate, seed)
	@echo "$(YELLOW)Resetting database...$(NC)"
	@docker compose exec app node ace migration:rollback --force || docker-compose exec app node ace migration:rollback --force
	@docker compose exec app node ace migration:run || docker-compose exec app node ace migration:run
	@docker compose exec app node ace db:seed || docker-compose exec app node ace db:seed
	@echo "$(GREEN)✓ Database reset complete$(NC)"

typesense-setup: ## Setup Typesense collections
	@echo "$(BLUE)Setting up Typesense...$(NC)"
	@docker compose exec app node ace setup:typesense --force || docker-compose exec app node ace setup:typesense --force
	@echo "$(GREEN)✓ Typesense setup complete$(NC)"

typesense-index: ## Index all data into Typesense
	@echo "$(BLUE)Indexing data...$(NC)"
	@docker compose exec app node ace index:all || docker-compose exec app node ace index:all
	@echo "$(GREEN)✓ Indexing complete$(NC)"

clean: ## Remove all containers, volumes, and images
	@echo "$(RED)⚠ This will remove ALL data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $REPLY =~ ^[Yy]$ ]]; then \
		docker compose down -v || docker-compose down -v; \
		docker compose rm -f || docker-compose rm -f; \
		echo "$(GREEN)✓ Cleanup complete$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

prune: ## Remove unused Docker resources
	@echo "$(BLUE)Pruning Docker resources...$(NC)"
	docker system prune -f
	@echo "$(GREEN)✓ Prune complete$(NC)"

status: ## Show service status
	@echo "$(BLUE)Service Status:$(NC)"
	@docker compose ps || docker-compose ps

rebuild: down build up ## Rebuild and restart services

dev: ## Start development server (without Docker)
	npm run dev

test: ## Run tests
	docker-compose exec app node ace test

production-build: ## Build for production (Render)
	@echo "$(BLUE)Building for production...$(NC)"
	bash render-build.sh
	@echo "$(GREEN)✓ Production build complete$(NC)"

production-start: ## Start production server locally
	@echo "$(BLUE)Starting production server...$(NC)"
	bash render-start.sh

deploy-render: ## Deploy to Render (requires Render CLI)
	@echo "$(BLUE)Deploying to Render...$(NC)"
	@if command -v render >/dev/null 2>&1; then \
		render deploy; \
	else \
		echo "$(RED)Error: Render CLI not installed$(NC)"; \
		echo "$(YELLOW)Install: https://render.com/docs/cli$(NC)"; \
	fi

# Development helpers
generate-key: ## Generate new APP_KEY
	node ace generate:key

generate-token: ## Generate new ADMIN_API_TOKEN
	node ace generate:admin-token

list-routes: ## List all routes
	@docker compose exec app node ace list:routes || docker-compose exec app node ace list:routes

# Quick commands
quick-start: setup build up migrate seed typesense-setup typesense-index ## Complete setup and start
	@echo "$(GREEN)✓ Everything ready!$(NC)"
	@echo "$(YELLOW)Visit: http://localhost:3333$(NC)"
	@echo "$(YELLOW)Admin: admin@events.dz / Admin@123$(NC)"

fresh: clean build up migrate seed ## Fresh installation
	@echo "$(GREEN)✓ Fresh installation complete$(NC)"