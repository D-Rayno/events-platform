# 🐳 Docker Setup Guide - Fixed

## 🎯 What Was Fixed

### 1. **Makefile Issues**
- ❌ Referenced non-existent `docker-compose.optimized.yml`
- ✅ Now uses `docker-compose.yml`
- ❌ Had space in compose file name causing parsing errors
- ✅ Fixed all `docker compose` commands

### 2. **Build Script Issues**
- ❌ Bash array syntax error with `local missing_files=()`
- ✅ Fixed bash compatibility
- ❌ `-e` flag in echo causing raw output
- ✅ Removed problematic flags

### 3. **Missing Files in Build**
- ❌ Scripts weren't copied to build folder
- ✅ Now copies `scripts/` directory to build
- ❌ Uploads weren't preserved
- ✅ Copies `public/uploads/` to build

### 4. **Docker Configuration**
- ❌ Compose file name mismatch
- ✅ Standardized on `docker-compose.yml`
- ❌ Missing health checks
- ✅ Added proper health checks

## 📦 Installation Steps

### Step 1: Update Files

Replace these files with the fixed versions:

```bash
# 1. Replace Dockerfile
cp Dockerfile Dockerfile.backup
# (paste fixed Dockerfile content)

# 2. Replace docker-compose.yml  
cp docker-compose.yml docker-compose.backup
# (paste fixed docker-compose.yml content)

# 3. Replace Makefile
cp Makefile Makefile.backup
# (paste fixed Makefile content)

# 4. Update scripts
chmod +x scripts/*.sh
# (paste fixed script contents)
```

### Step 2: Create .env.docker

```bash
# Create .env.docker from template
cp .env .env.docker

# Or create new one
cat > .env.docker << 'EOF'
NODE_ENV=production
PORT=10000
HOST=0.0.0.0
APP_KEY=generate-with-node-ace-generate-key
APP_URL=http://localhost:3333

DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password_here
DB_DATABASE=events_platform

TYPESENSE_ENABLED=true
TYPESENSE_HOST=typesense
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=your_typesense_key_here

SESSION_DRIVER=cookie
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ADMIN_API_TOKEN=generate-with-node-ace-generate-admin-token
EOF
```

### Step 3: Generate Security Keys

```bash
# Generate APP_KEY
node ace generate:key

# Generate ADMIN_API_TOKEN
node ace generate:admin-token

# Update .env.docker with generated keys
```

### Step 4: Create .dockerignore

```bash
cat > .dockerignore << 'EOF'
node_modules
build
.env
.env.local
.git
*.md
logs
tmp
coverage
tests
EOF
```

## 🚀 Usage

### Complete Setup (First Time)

```bash
# 1. Check environment
make check-env

# 2. Build and start everything
make dev-setup

# This will:
# - Build Docker images
# - Start all services
# - Run migrations
# - Seed database
# - Setup Typesense
# - Show access info
```

### Daily Development

```bash
# Start services
make up

# View logs
make logs

# Stop services
make down

# Restart services
make restart
```

### Database Operations

```bash
# Run migrations
make migrate

# Seed database
make seed

# Reset database (rollback, migrate, seed)
make db-reset

# Access MySQL shell
make db-shell
```

### Typesense Operations

```bash
# Setup collections
make typesense-setup

# Index all data
make typesense-index
```

### Monitoring

```bash
# View application logs
make logs

# View all logs
make logs-all

# Check service status
make status

# Check service health
make health

# View resource usage
make stats
```

### Access Application Shell

```bash
# Access app container
make shell

# Then run commands inside
node ace list
node ace migration:status
```

## 🔧 Troubleshooting

### Issue: "docker-compose: No such file or directory"

**Solution:** You have old `docker-compose` (v1). Use Docker Compose v2:

```bash
# Check Docker Compose version
docker compose version

# If you have v1, upgrade Docker Desktop
# Or use: docker-compose instead of docker compose
```

### Issue: "Build stage failed"

**Solution:** Check build logs:

```bash
# Clean and rebuild
make clean
make rebuild

# View detailed build logs
docker compose build --no-cache --progress=plain
```

### Issue: "Database connection failed"

**Solution:** Check database is running:

```bash
# Check status
make status

# View database logs
make logs-db

# Restart database
docker compose restart db
```

### Issue: "Scripts not found in build folder"

**Solution:** The fixed Dockerfile now copies scripts:

```bash
# Verify in Dockerfile line ~70:
# RUN cp -r scripts build/

# Rebuild to apply fix
make rebuild
```

### Issue: "Permission denied on scripts"

**Solution:** Make scripts executable:

```bash
chmod +x scripts/*.sh
chmod +x scripts/*.cjs

# Rebuild
make rebuild
```

## 📊 Verification Checklist

After setup, verify everything works:

```bash
# ✅ Check all services are running
make status

# ✅ Check health
make health

# ✅ Test application
curl http://localhost:3333

# ✅ Check database
make db-shell
# Then: SHOW DATABASES;

# ✅ Check Typesense
curl http://localhost:8108/health

# ✅ View logs for errors
make logs
```

## 🎯 Production Deployment

### Full Deployment

```bash
# Deploy everything
make deploy

# This will:
# 1. Build production image
# 2. Start all services
# 3. Run migrations
# 4. Setup Typesense
# 5. Index data
# 6. Show access info
```

### Manual Deployment

```bash
# 1. Build
make build

# 2. Start services
make up

# 3. Wait for services
sleep 20

# 4. Setup database
make migrate
make seed

# 5. Setup Typesense
make typesense-setup
make typesense-index

# 6. Check everything
make health
make info
```

## 🧹 Cleanup

### Remove Everything

```bash
# Stop and remove containers + volumes
make clean

# Remove images too
make clean-images

# Deep clean (removes ALL Docker resources)
make prune
```

### Start Fresh

```bash
# Complete cleanup and rebuild
make clean
make dev-setup
```

## 📁 File Structure After Build

```
build/
├── bin/
│   └── server.js          ✅ Server entry point
├── app/                   ✅ Compiled application
├── config/                ✅ Configuration
├── database/              ✅ Migrations & seeders
├── public/
│   ├── assets/            ✅ Compiled frontend
│   └── uploads/           ✅ User uploads
├── scripts/               ✅ Runtime scripts (FIXED!)
│   ├── docker-entrypoint.sh
│   ├── health-check.sh
│   └── generate-theme.cjs
├── resources/             ✅ Email templates
├── node_modules/          ✅ Production dependencies
└── package.json           ✅ Package info
```

## 🆘 Getting Help

### System Diagnostics

```bash
# Run comprehensive check
make doctor

# This checks:
# - Docker versions
# - Required files
# - Container status
# - Image information
```

### View All Available Commands

```bash
# Show help
make help

# Or just
make
```

## 📝 Key Changes Summary

| Issue | Before | After |
|-------|--------|-------|
| Compose file | `docker compose.optimized.yml` ❌ | `docker-compose.yml` ✅ |
| Scripts in build | Not copied ❌ | Copied to build/ ✅ |
| Bash syntax | Array errors ❌ | Compatible ✅ |
| Echo flags | `-e` causing issues ❌ | Proper escaping ✅ |
| File checks | Missing ❌ | Complete ✅ |
| Health checks | Incomplete ❌ | Full coverage ✅ |

## ✅ Success Indicators

You know it's working when:

1. ✅ `make build` completes without errors
2. ✅ `make up` starts all services (db, typesense, app)
3. ✅ `make status` shows all services as "Up"
4. ✅ `http://localhost:3333` loads the application
5. ✅ `make logs` shows no critical errors
6. ✅ `make health` shows all services healthy

## 🎉 Next Steps

After successful setup:

1. Access application: `http://localhost:3333`
2. Login as admin: `admin@events.dz` / `Admin@123`
3. Check Typesense: `http://localhost:8108`
4. View logs: `make logs`
5. Monitor resources: `make stats`

---

**Need more help?** Run `make doctor` for diagnostics or `make help` for all commands.