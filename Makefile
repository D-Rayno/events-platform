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

# Load environment variables if file exists
ifneq (,$(wildcard ./.env.docker))
    include .env.docker
    export
endif

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
	docker compose -f $(COMPOSE_FILE) exec -T app node ace migration:run --force
	@echo "$(GREEN)✓ Migrations complete$(NC)"

seed: ## Seed database
	@echo "$(BLUE)Seeding database...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec -T app node ace db:seed
	@echo "$(GREEN)✓ Seeding complete$(NC)"

db-reset: ## Reset database
	@echo "$(YELLOW)⚠️  Resetting database...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec -T app node ace migration:rollback --force
	docker compose -f $(COMPOSE_FILE) exec -T app node ace migration:run --force
	docker compose -f $(COMPOSE_FILE) exec -T app node ace db:seed
	@echo "$(GREEN)✓ Database reset complete$(NC)"

db-shell: ## Access database shell
	@docker compose -f $(COMPOSE_FILE) exec db mysql -u$(DB_USER) -p$(DB_PASSWORD) $(DB_DATABASE)

db-setup:
	@echo "$(YELLOW)Setting up database...$(NC)"
	bash ./reset-db.sh

# ============================================
# Typesense Operations
# ============================================

typesense-setup: ## Setup Typesense collections
	@echo "$(BLUE)Setting up Typesense...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec -T app node ace setup:typesense --force
	@echo "$(GREEN)✓ Typesense setup complete$(NC)"

typesense-index: ## Index all data
	@echo "$(BLUE)Indexing data...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec -T app node ace index:all
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
	docker rmi zevent-app 2>/dev/null || true
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
	@echo "  $(GREEN)Application:$(NC)  http://localhost:$(PORT)"
	@echo "  $(GREEN)MySQL:$(NC)        localhost:$(DB_PORT)"
	@echo "  $(GREEN)Typesense:$(NC)    http://localhost:$(TYPESENSE_PORT)"
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
	@echo ""
	@echo "$(YELLOW)4. Environment variables:$(NC)"
	@echo "  DB_USER: $(DB_USER)"
	@echo "  DB_DATABASE: $(DB_DATABASE)"
	@echo "  DB_PORT: $(DB_PORT)"

# ============================================
# Production Deployment
# ============================================

deploy: check-env ## Deploy updates (migrations + reindex)
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   Production Deployment                ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@make build
	@make restart
	@echo "$(BLUE)⏳ Waiting for services to restart (20s)...$(NC)"
	@sleep 20
	@make wait-for-services
	@make migrate
	@make db-init
	@make typesense-setup
	@make typesense-index
	@echo "$(GREEN)✅ Deployment complete$(NC)"
	@make info

# ============================================
# Production Initialization (First Time Setup)
# ============================================

init-prod: check-env ## Initialize production environment (first deployment)
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   Production Initialization             ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)⚠️  This will set up the entire production environment$(NC)"
	@echo "$(YELLOW)⚠️  Including: Build → Deploy → Database → Search$(NC)"
	@echo ""
	@make build
	@make up
	@echo "$(BLUE)⏳ Waiting for services to be healthy (10s)...$(NC)"
	@sleep 10
	@make wait-for-services
	@make db-init
	@make search-init
	@echo ""
	@echo "$(GREEN)╔════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║   ✨ Production Ready! ✨              ║$(NC)"
	@echo "$(GREEN)╚════════════════════════════════════════╝$(NC)"
	@make info

deploy-fresh: check-env ## Fresh deployment (rebuild + full reset)
	@echo "$(RED)╔════════════════════════════════════════╗$(NC)"
	@echo "$(RED)║   ⚠️  FRESH DEPLOYMENT WARNING ⚠️      ║$(NC)"
	@echo "$(RED)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)This will:$(NC)"
	@echo "  1. Stop all services"
	@echo "  2. Remove containers and images"
	@echo "  3. Rebuild from scratch"
	@echo "  4. Reset database (DELETE ALL DATA)"
	@echo "  5. Recreate Typesense collections"
	@echo ""
	@read -p "Are you absolutely sure? Type 'yes' to continue: " confirm; \
	if [ "$$confirm" != "yes" ]; then \
		echo "$(YELLOW)Aborted.$(NC)"; \
		exit 1; \
	fi
	@make clean-images
	@make init-prod
	@echo "$(GREEN)✅ Fresh deployment complete$(NC)"

# ============================================
# Service Health Checks
# ============================================

wait-for-services: ## Wait for all services to be healthy
	@echo "$(BLUE)🏥 Checking service health...$(NC)"
	@echo "$(YELLOW)Waiting for MySQL...$(NC)"
	@timeout=10s; \
	while [ $$timeout -gt 0 ]; do \
		if docker compose -f $(COMPOSE_FILE) exec -T db mysqladmin ping -h localhost -u$(DB_USER) -p'$(DB_ROOT_PASSWORD)' 2>/dev/null | grep -q "mysqld is alive"; then \
			echo "$(GREEN)✓ MySQL is ready$(NC)"; \
			break; \
		fi; \
		sleep 2; \
		timeout=$$((timeout - 2)); \
	done; \
	if [ $$timeout -le 0 ]; then \
		echo "$(RED)✗ MySQL failed to start$(NC)"; \
		echo "$(YELLOW)Checking MySQL logs...$(NC)"; \
		docker compose -f $(COMPOSE_FILE) logs --tail=20 db; \
		exit 1; \
	fi
	@echo "$(YELLOW)Waiting for Typesense...$(NC)"
	@timeout=60; \
	while [ $$timeout -gt 0 ]; do \
		if curl -sf http://localhost:$(TYPESENSE_PORT)/health >/dev/null 2>&1; then \
			echo "$(GREEN)✓ Typesense is ready$(NC)"; \
			break; \
		fi; \
		sleep 2; \
		timeout=$$((timeout - 2)); \
	done; \
	if [ $$timeout -le 0 ]; then \
		echo "$(RED)✗ Typesense failed to start$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Waiting for Application...$(NC)"
	@timeout=60; \
	while [ $$timeout -gt 0 ]; do \
		if curl -sf http://localhost:$(PORT)/health >/dev/null 2>&1; then \
			echo "$(GREEN)✓ Application is ready$(NC)"; \
			break; \
		fi; \
		sleep 2; \
		timeout=$$((timeout - 2)); \
	done; \
	if [ $$timeout -le 0 ]; then \
		echo "$(YELLOW)⚠️  Application health check timeout (may be normal)$(NC)"; \
	fi
	@echo "$(GREEN)✅ All critical services are healthy$(NC)"

# ============================================
# Database Initialization
# ============================================

db-init: ## Initialize database (migrate + seed)
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   Database Initialization              ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)📊 Running migrations...$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T app node ace migration:run --force || \
		(echo "$(RED)❌ Migration failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Migrations complete$(NC)"
	@echo ""
	@echo "$(YELLOW)🌱 Seeding database...$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T app node ace db:seed || \
		(echo "$(RED)❌ Seeding failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Database seeding complete$(NC)"
	@echo ""
	@echo "$(GREEN)✅ Database initialization complete$(NC)"

db-migrate-only: ## Run migrations only (no seed)
	@echo "$(BLUE)Running database migrations...$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T app node ace migration:run --force || \
		(echo "$(RED)❌ Migration failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Migrations complete$(NC)"

db-seed-only: ## Run database seeding only
	@echo "$(BLUE)Seeding database...$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T app node ace db:seed || \
		(echo "$(RED)❌ Seeding failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Seeding complete$(NC)"

# ============================================
# Search Engine Initialization
# ============================================

search-init: ## Initialize Typesense (setup + index)
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   Search Engine Initialization         ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)🔧 Setting up Typesense collections...$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T app node ace setup:typesense --force || \
		(echo "$(RED)❌ Typesense setup failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Typesense collections created$(NC)"
	@echo ""
	@echo "$(YELLOW)📦 Indexing all data...$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T app node ace index:all || \
		(echo "$(RED)❌ Indexing failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ All data indexed$(NC)"
	@echo ""
	@echo "$(GREEN)✅ Search engine initialization complete$(NC)"

search-reindex: ## Reindex all Typesense collections
	@echo "$(BLUE)🔄 Reindexing all collections...$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T app node ace index:all || \
		(echo "$(RED)❌ Reindexing failed$(NC)" && exit 1)
	@echo "$(GREEN)✅ Reindexing complete$(NC)"

search-reset: ## Reset and recreate Typesense collections
	@echo "$(YELLOW)⚠️  Resetting Typesense collections...$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T app node ace setup:typesense --force
	@make search-reindex
	@echo "$(GREEN)✅ Search reset complete$(NC)"

# ============================================
# Backup Operations
# ============================================

backup-db: ## Backup database
	@echo "$(BLUE)📦 Creating database backup...$(NC)"
	@mkdir -p ./backups
	@timestamp=$$(date +%Y%m%d_%H%M%S); \
	docker compose -f $(COMPOSE_FILE) exec -T db mysqldump \
		-u$(DB_USER) -p'$(DB_PASSWORD)' $(DB_DATABASE) \
		> ./backups/db_backup_$$timestamp.sql && \
	echo "$(GREEN)✓ Backup saved: ./backups/db_backup_$$timestamp.sql$(NC)"

backup-uploads: ## Backup uploads directory
	@echo "$(BLUE)📦 Creating uploads backup...$(NC)"
	@mkdir -p ./backups
	@timestamp=$$(date +%Y%m%d_%H%M%S); \
	tar -czf ./backups/uploads_backup_$$timestamp.tar.gz ./public/uploads && \
	echo "$(GREEN)✓ Backup saved: ./backups/uploads_backup_$$timestamp.tar.gz$(NC)"

backup-all: backup-db backup-uploads ## Backup everything
	@echo "$(GREEN)✅ Full backup complete$(NC)"

restore-db: ## Restore database from backup
	@echo "$(YELLOW)Available backups:$(NC)"
	@ls -1 ./backups/db_backup_*.sql 2>/dev/null || echo "No backups found"
	@read -p "Enter backup filename: " backup; \
	if [ -f "./backups/$$backup" ]; then \
		docker compose -f $(COMPOSE_FILE) exec -T db mysql \
			-u$(DB_USER) -p'$(DB_PASSWORD)' $(DB_DATABASE) \
			< ./backups/$$backup && \
		echo "$(GREEN)✓ Database restored$(NC)"; \
	else \
		echo "$(RED)✗ Backup not found$(NC)"; \
	fi