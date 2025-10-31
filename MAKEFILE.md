# 🐳 Docker Setup Guide - G-Agency Events

## 📋 Overview

This guide provides complete instructions for setting up your AdonisJS + Inertia + React application with Docker.

---

## 🔧 Files to Create/Update

### ✅ Files to CREATE (New)

1. **`.env.docker`** - Docker environment configuration
   ```bash
   cp .env.example .env.docker
   # Then edit with your settings
   ```

2. **`scripts/docker-entrypoint.sh`** - Container startup script
   - Use the artifact provided above
   - Make it executable: `chmod +x scripts/docker-entrypoint.sh`

### ✏️ Files to UPDATE (Replace)

1. **`Dockerfile`** - Replace with the new multi-stage version
2. **`docker-compose.yml`** - Replace with the enhanced version
3. **`Makefile`** - Replace with the enhanced version
4. **`.dockerignore`** - Keep your current version (it's good)

### 🗑️ Files to DELETE

1. **`fix-vite-build.sh`** - No longer needed (fixed in Dockerfile)
2. **`debug-search.sh`** - Not in your files, but remove if exists
3. **`ecosystem.config.cjs`** - Not needed for Docker (PM2 config)

### 📝 Files to KEEP (No Changes)

1. **`reset-db.sh`** - Keep as-is
2. **`scripts/convert-images.cjs`** - Keep as-is
3. **`scripts/generate-theme.cjs`** - Keep as-is
4. **`scripts/health-check.sh`** - Keep as-is
5. **`scripts/render-build.sh`** - Keep for Render deployment
6. **`scripts/render-start.sh`** - Keep for Render deployment
7. **All other existing files** - No changes needed

---

## 🚀 Quick Start (First Time Setup)

### Step 1: Prerequisites

```bash
# Verify Docker is installed
docker --version
docker compose version

# Should show Docker 20+ and Compose 2+
```

### Step 2: Environment Setup

```bash
# 1. Copy environment template
cp .env.example .env.docker

# 2. Generate keys
node ace generate:key          # Copy to APP_KEY in .env.docker
node ace generate:admin-token  # Copy to ADMIN_API_TOKEN in .env.docker

# 3. Edit .env.docker with your email settings
# - SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD
# - MAIL_FROM_ADDRESS, MAIL_FROM_NAME
```

### Step 3: Key Settings in `.env.docker`

```bash
# Critical settings to configure:
NODE_ENV=production
APP_KEY=<generated-key>
APP_URL=http://localhost:3333

# Database (these work out of the box with Docker)
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=events_platform

# Email (MUST configure with real credentials)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=your_actual_username
SMTP_PASSWORD=your_actual_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com

# Admin Token
ADMIN_API_TOKEN=<generated-token>

# Typesense (works out of the box)
TYPESENSE_ENABLED=true
TYPESENSE_HOST=typesense
TYPESENSE_API_KEY=XW2pN1Ybe7wjRgZ8bB8cno+oAEN1ddAIEcviVrRZ4gU=
```

### Step 4: Run Setup

```bash
# Option A: Using Makefile (Recommended)
make setup

# Option B: Manual Docker Compose
docker compose build
docker compose up -d
docker compose exec app node ace migration:run
docker compose exec app node ace db:seed
docker compose exec app node ace setup:typesense --force
docker compose exec app node ace index:all
```

### Step 5: Verify Installation

```bash
# Check services are running
make status

# View logs
make logs

# Access the application
open http://localhost:3333
```

---

## 📚 Common Commands

### Development Workflow

```bash
# Start services
make up

# Stop services
make down

# View logs
make logs              # App logs
make logs-db           # Database logs
make logs-typesense    # Typesense logs
make logs-all          # All logs

# Restart services
make restart

# Access shell
make shell             # App container
make db-shell          # MySQL shell
```

### Database Operations

```bash
# Run migrations
make migrate

# Rollback migrations
make migrate-rollback

# Seed database
make seed

# Complete reset (⚠️ deletes data)
make db-reset
```

### Typesense Operations

```bash
# Setup collections
make typesense-setup

# Index data
make typesense-index

# Check health
make typesense-health

# Complete reset
make typesense-reset
```

### Maintenance

```bash
# Check system health
make doctor

# Rebuild everything
make rebuild

# Fresh start (⚠️ deletes ALL data)
make fresh

# Clean up containers and volumes
make clean

# Deep clean Docker (⚠️ removes ALL unused Docker resources)
make prune
```

---

## 🔍 Troubleshooting

### Problem: Port Already in Use

```bash
# Check which ports are busy
make check-ports

# Kill Typesense if needed
make kill-typesense

# Find process using port
lsof -i :3333  # or :3306, :8108
```

### Problem: Database Connection Failed

```bash
# Check database is running
docker compose ps db

# View database logs
make logs-db

# Try connecting manually
make db-shell

# Restart database
docker compose restart db
```

### Problem: Vite Manifest Not Found

```bash
# Rebuild with verification
make rebuild

# Check build artifacts
docker compose exec app ls -la public/assets/.vite/

# View build logs
docker compose logs app | grep -i vite
```

### Problem: Typesense Not Responding

```bash
# Check Typesense health
make typesense-health

# View Typesense logs
make logs-typesense

# Restart Typesense
docker compose restart typesense

# Reset Typesense
make typesense-reset
```

### Problem: Environment Variables Not Loading

```bash
# Verify .env.docker exists
ls -la .env.docker

# Check format (no spaces around =)
cat .env.docker | grep -E "^\s*[A-Z_]+=.*\s"

# Restart services to reload env
make restart
```

---

## 📁 Directory Structure

```
g-agency-events/
├── .env.docker                    # ✨ CREATE THIS
├── Dockerfile                     # ✏️ REPLACE
├── docker-compose.yml            # ✏️ REPLACE
├── Makefile                       # ✏️ REPLACE
├── .dockerignore                  # ✅ KEEP
│
├── scripts/
│   ├── docker-entrypoint.sh      # ✨ CREATE THIS
│   ├── health-check.sh           # ✅ KEEP
│   ├── generate-theme.cjs        # ✅ KEEP
│   ├── convert-images.cjs        # ✅ KEEP
│   ├── render-build.sh           # ✅ KEEP
│   └── render-start.sh           # ✅ KEEP
│
├── public/
│   └── uploads/                   # Volume mounted
│
└── logs/                          # Volume mounted
```

---

## 🎯 Production Deployment

### For Render.com

Keep your existing Render setup:
- `render.yaml` ✅
- `scripts/render-build.sh` ✅
- `scripts/render-start.sh` ✅

### For Custom VPS

1. **Copy files to server:**
   ```bash
   rsync -avz --exclude node_modules --exclude .git . user@server:/app
   ```

2. **Setup on server:**
   ```bash
   cd /app
   cp .env.example .env.docker
   # Edit .env.docker with production values
   make setup
   ```

3. **Configure reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3333;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## ✅ Post-Setup Checklist

- [ ] `.env.docker` created and configured
- [ ] `APP_KEY` generated and set
- [ ] `ADMIN_API_TOKEN` generated and set
- [ ] Email credentials configured (SMTP)
- [ ] All services running (`make status`)
- [ ] Database migrated (`make migrate`)
- [ ] Database seeded (`make seed`)
- [ ] Typesense collections created (`make typesense-setup`)
- [ ] Data indexed (`make typesense-index`)
- [ ] Application accessible at http://localhost:3333
- [ ] Can login with admin@events.dz / Admin@123
- [ ] Uploads directory writable

---

## 🆘 Getting Help

### Check Logs
```bash
make logs-all
```

### Run Diagnostics
```bash
make doctor
```

### Common Issues
1. **Port conflicts** → `make check-ports` → `make kill-typesense`
2. **Database issues** → `make logs-db` → `make db-reset`
3. **Build failures** → `make clean` → `make rebuild`
4. **Typesense issues** → `make typesense-reset`

### Still Stuck?
```bash
# Get detailed system info
make doctor > diagnostics.txt

# Share diagnostics.txt when asking for help
```

---

## 📝 Notes

- **Data Persistence**: MySQL and Typesense data are stored in Docker volumes
- **Uploads**: Files in `public/uploads/` are persisted via volume mount
- **Logs**: Application logs in `logs/` are persisted via volume mount
- **Development**: For live reload, run `npm run dev` outside Docker
- **Production**: This Docker setup is production-ready with health checks

---

## 🎉 Success!

Once setup is complete, you should see:

```
✅ Initialization complete!
🚀 Starting server...

🌐 Access Points:
  Application:  http://localhost:3333
  MySQL:        localhost:3306
  Typesense:    http://localhost:8108

🔐 Default Credentials:
  Admin: admin@events.dz / Admin@123
  Users: user1@events.dz / Password@123
```

---

Happy coding! 🚀