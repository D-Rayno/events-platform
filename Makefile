# ============================================
# Makefile for Docker Development
# ============================================

.PHONY: help
.DEFAULT_GOAL := help

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

# Configuration
COMPOSE_FILE := docker-compose.yml
PROJECT_NAME := g-agency-events

help: ## Show this help message
	@echo "$(BLUE)═══════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  G-Agency Events - Docker Commands$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ============================================
# Environment Setup
# ============================================

check-env: ## Check if .env.docker exists
	@if [ ! -f .env.docker ]; then \
		echo "$(RED)❌ .env.docker not found!$(NC)"; \
		echo "$(YELLOW)Creating from template...$(NC)"; \
		cp .env .env.docker 2>/dev/null || touch .env.docker; \
		echo "$(GREEN)✓ Created .env.docker$(NC)"; \
		echo "$(YELLOW)⚠️  Please edit .env.docker with your settings$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✓ .env.docker found$(NC)"

# ============================================
# Docker Build Operations
# ============================================

build: check-env ## Build Docker image
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker compose -f $(COMPOSE_FILE) build
	@echo "$(GREEN)✓ Build complete$(NC)"

rebuild: clean-images build ## Rebuild from scratch
	@echo "$(GREEN)✓ Rebuild complete$(NC)"

# ============================================
# Service Management
# ============================================

up: check-env ## Start all services
	@echo "$(BLUE)Starting services...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✓ Services started$(NC)"
	@sleep 5
	@make status

down: ## Stop all services
	@echo "$(BLUE)Stopping services...$(NC)"
	docker compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)✓ Services stopped$(NC)"

restart: ## Restart all services
	@echo "$(BLUE)Restarting services...$(NC)"
	docker compose -f $(COMPOSE_FILE) restart
	@echo "$(GREEN)✓ Services restarted$(NC)"

status: ## Show service status
	@echo "$(BLUE)Service Status:$(NC)"
	@docker compose -f $(COMPOSE_FILE) ps

# ============================================
# Development Workflow
# ============================================

dev-setup: check-env build up ## Complete development setup
	@echo "$(BLUE)Waiting for services to be ready...$(NC)"
	@sleep 15
	@make migrate || echo "$(YELLOW)⚠️  Migration skipped$(NC)"
	@make seed || echo "$(YELLOW)⚠️  Seeding skipped$(NC)"
	@make typesense-setup || echo "$(YELLOW)⚠️  Typesense setup skipped$(NC)"
	@echo "$(GREEN)╔════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║   Development Setup Complete! ✨       ║$(NC)"
	@echo "$(GREEN)╚════════════════════════════════════════╝$(NC)"
	@make info

quick-start: check-env up ## Quick start with existing image
	@echo "$(BLUE)Quick starting services...$(NC)"
	@sleep 10
	@make migrate || echo "$(YELLOW)⚠️  Migration skipped$(NC)"
	@make info

# ============================================
# Database Operations
# ============================================

migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec app node ace migration:run
	@echo "$(GREEN)✓ Migrations complete$(NC)"

seed: ## Seed database
	@echo "$(BLUE)Seeding database...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec app node ace db:seed
	@echo "$(GREEN)✓ Seeding complete$(NC)"

db-reset: ## Reset database
	@echo "$(YELLOW)⚠️  Resetting database...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec app node ace migration:rollback --force
	docker compose -f $(COMPOSE_FILE) exec app node ace migration:run
	docker compose -f $(COMPOSE_FILE) exec app node ace db:seed
	@echo "$(GREEN)✓ Database reset complete$(NC)"

db-shell: ## Access database shell
	@docker compose -f $(COMPOSE_FILE) exec db mysql -uroot -p$${DB_PASSWORD:-root} $${DB_DATABASE:-events_platform}

db-setup:
	@echo "$(YELLOW)Setting up database...$(NC)"
	bash ./reset-db.sh

# ============================================
# Typesense Operations
# ============================================

typesense-setup: ## Setup Typesense collections
	@echo "$(BLUE)Setting up Typesense...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec app node ace setup:typesense --force
	@echo "$(GREEN)✓ Typesense setup complete$(NC)"

typesense-index: ## Index all data
	@echo "$(BLUE)Indexing data...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec app node ace index:all
	@echo "$(GREEN)✓ Indexing complete$(NC)"

# ============================================
# Logging and Debugging
# ============================================

logs: ## View application logs
	@docker compose -f $(COMPOSE_FILE) logs -f app

logs-all: ## View all service logs
	@docker compose -f $(COMPOSE_FILE) logs -f

logs-db: ## View database logs
	@docker compose -f $(COMPOSE_FILE) logs -f db

logs-typesense: ## View Typesense logs
	@docker compose -f $(COMPOSE_FILE) logs -f typesense

shell: ## Access application shell
	@docker compose -f $(COMPOSE_FILE) exec app sh

# ============================================
# Monitoring
# ============================================

stats: ## Show container resource usage
	@echo "$(BLUE)Container Resource Usage:$(NC)"
	@docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

health: ## Check service health
	@echo "$(BLUE)Service Health Check:$(NC)"
	@docker compose -f $(COMPOSE_FILE) ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"

# ============================================
# Cleanup Operations
# ============================================

clean: ## Remove containers and volumes
	@echo "$(RED)⚠️  Removing containers and volumes...$(NC)"
	docker compose -f $(COMPOSE_FILE) down -v
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-images: ## Remove project images
	@echo "$(YELLOW)Removing project images...$(NC)"
	docker compose -f $(COMPOSE_FILE) down
	docker rmi $(PROJECT_NAME)-app 2>/dev/null || true
	docker rmi g-agency-events-app 2>/dev/null || true
	@echo "$(GREEN)✓ Images removed$(NC)"

prune: ## Deep clean Docker system
	@echo "$(RED)⚠️  This will remove ALL unused Docker resources!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
		make clean; \
		docker system prune -af --volumes; \
		echo "$(GREEN)✓ Docker system pruned$(NC)"; \
	fi

# ============================================
# Information
# ============================================

info: ## Show access information
	@echo ""
	@echo "$(BLUE)🌐 Access Points:$(NC)"
	@echo "  $(GREEN)Application:$(NC)  http://localhost:$${PORT:-3333}"
	@echo "  $(GREEN)MySQL:$(NC)        localhost:$${DB_PORT:-3306}"
	@echo "  $(GREEN)Typesense:$(NC)    http://localhost:$${TYPESENSE_PORT:-8108}"
	@echo ""
	@echo "$(BLUE)🔐 Default Credentials:$(NC)"
	@echo "  $(GREEN)Admin:$(NC) admin@events.dz / Admin@123"
	@echo ""

doctor: ## Run diagnostics
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   System Diagnostics                   ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Docker versions:$(NC)"
	@docker --version
	@docker compose version
	@echo ""
	@echo "$(YELLOW)2. Environment files:$(NC)"
	@if [ -f .env.docker ]; then echo "  $(GREEN)✓ .env.docker exists$(NC)"; else echo "  $(RED)✗ .env.docker missing$(NC)"; fi
	@if [ -f $(COMPOSE_FILE) ]; then echo "  $(GREEN)✓ $(COMPOSE_FILE) exists$(NC)"; else echo "  $(RED)✗ $(COMPOSE_FILE) missing$(NC)"; fi
	@echo ""
	@echo "$(YELLOW)3. Container status:$(NC)"
	@docker compose -f $(COMPOSE_FILE) ps 2>/dev/null || echo "  $(YELLOW)No containers running$(NC)"

# ============================================
# Production Deployment
# ============================================

deploy: ## Full production deployment
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   Production Deployment                ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@make build
	@make up
	@sleep 20
	@make migrate
	@make typesense-setup
	@make typesense-index
	@echo "$(GREEN)✅ Production deployment complete$(NC)"
	@make info