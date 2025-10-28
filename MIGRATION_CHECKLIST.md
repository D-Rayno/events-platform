# 📋 Migration Checklist

Step-by-step guide to refactor your deployment setup.

---

## Phase 1: Cleanup (15 minutes)

### 1.1 Backup Current Setup

```bash
# Create backup branch
git checkout -b backup-before-refactor
git push origin backup-before-refactor

# Or create zip backup
zip -r backup-$(date +%Y%m%d).zip . -x "node_modules/*" "build/*" ".git/*"
```

### 1.2 Remove Old Scripts

```bash
# Delete redundant scripts
rm docker-complete-setup.sh
rm fix-typesense.sh
rm docker-fix.sh
rm check-docker-setup.sh
rm setup-lockfile.sh
rm docker-entrypoint.sh
rm debug-search.sh
rm reset-db.sh
rm render-docker.yml

# Verify deletion
git status
```

---

## Phase 2: Add New Files (10 minutes)

### 2.1 Create Scripts Directory Structure

```bash
# Ensure scripts directory exists
mkdir -p scripts

# Create new scripts (copy from artifacts)
touch scripts/render-build.sh
touch scripts/render-start.sh
touch scripts/health-check.sh

# Make executable
chmod +x scripts/*.sh
```

### 2.2 Copy New Files

Copy content from artifacts to these files:

- [ ] `scripts/render-build.sh`
- [ ] `scripts/render-start.sh`
- [ ] `scripts/health-check.sh`
- [ ] `.env.render.example`
- [ ] `Dockerfile` (replace existing)
- [ ] `Makefile` (replace existing)
- [ ] `render.yaml` (new file in root)
- [ ] `DEPLOYMENT.md` (new file in root)

### 2.3 Update package.json

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "start": "node bin/server.js",
    "build": "node ace build",
    "dev": "node ace serve --hmr",
    "render:build": "bash scripts/render-build.sh",
    "render:start": "bash scripts/render-start.sh",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down",
    "docker:logs": "docker compose logs -f",
    "db:migrate": "node ace migration:run",
    "db:seed": "node ace db:seed"
  }
}
```

---

## Phase 3: Test Locally (20 minutes)

### 3.1 Test Docker Setup

```bash
# Clean start
make clean  # or: docker compose down -v

# Fresh setup
make setup

# Verify services
make status

# Check logs
make logs

# Test application
curl http://localhost:3333
```

### 3.2 Test Build Process

```bash
# Test Render build locally
npm run render:build

# Verify build output
ls -la build/
ls -la build/public/assets/

# Test start script
npm run render:start
# (Ctrl+C to stop)
```

### 3.3 Verify Database

```bash
# Check migrations
make migrate

# Check seeding
make seed

# Access database
make db-shell
```

### 3.4 Test Makefile Commands

```bash
# Test each major command
make help
make dev
make status
make logs
make migrate
make seed
make typesense-setup
make typesense-index
make stop
```

---

## Phase 4: Prepare for Render (15 minutes)

### 4.1 Setup External Database

**Option A: PlanetScale (Recommended)**

```bash
# 1. Sign up at planetscale.com
# 2. Create database: g-agency-events
# 3. Get connection string
# 4. Save for next step
```

**Option B: Railway**

```bash
# 1. Sign up at railway.app
# 2. New Project → Add MySQL
# 3. Get connection details
# 4. Save for next step
```

### 4.2 Setup Email Service

**MailerSend** (Already configured)

```bash
# You already have these:
SMTP_HOST=smtp.mailersend.net
SMTP_USERNAME=MS_aIcKU5@test-vz9dlem2qwp4kj50.mlsender.net
SMTP_PASSWORD=mssp.SgRll8i.z86org8129klew13.gKPUiVJ

# Verify at: mailersend.com/dashboard
```

### 4.3 Generate Production Secrets

```bash
# Generate APP_KEY
node ace generate:key
# Copy output, save for Render

# Generate ADMIN_API_TOKEN
node ace generate:admin-token
# Copy output, save for Render
```

### 4.4 Create .env.render File

```bash
# Copy template
cp .env.render.example .env.render

# Fill in values:
# - APP_KEY (from step 4.3)
# - ADMIN_API_TOKEN (from step 4.3)
# - DB_* (from step 4.1)
# - SMTP_* (from step 4.2)

# DO NOT commit .env.render to git!
```

---

## Phase 5: Deploy to Render (20 minutes)

### 5.1 Push to GitHub

```bash
# Review changes
git status
git diff

# Commit new structure
git add .
git commit -m "refactor: optimize deployment setup for Render"

# Push to main branch
git push origin main
```

### 5.2 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 5.3 Deploy Using Blueprint

**Method A: Automatic (Recommended)**

1. Dashboard → New + → Blueprint
2. Select your repository
3. Render detects `render.yaml`
4. Click "Apply"
5. Go to step 5.4

**Method B: Manual Web Service**

1. Dashboard → New + → Web Service
2. Connect repository
3. Configure:
   - Name: `g-agency-events`
   - Region: `Frankfurt`
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `npm run render:build`
   - Start Command: `npm run render:start`

### 5.4 Configure Environment Variables

In Render Dashboard → your service → Environment:

```env
# Auto-generate these
APP_KEY = <click Generate>
ADMIN_API_TOKEN = <click Generate>

# Database (from Phase 4.1)
DB_HOST = <your-db-host>
DB_PORT = 3306
DB_USER = <your-db-user>
DB_PASSWORD = <your-db-password>
DB_DATABASE = <your-db-name>

# Email (from Phase 4.2)
SMTP_HOST = smtp.mailersend.net
SMTP_PORT = 587
SMTP_USERNAME = <your-username>
SMTP_PASSWORD = <your-password>
MAIL_FROM_ADDRESS = <your-email>
MAIL_FROM_NAME = G-Agency Events

# Fixed values
NODE_ENV = production
PORT = 10000
HOST = 0.0.0.0
SESSION_DRIVER = cookie
DRIVE_DISK = fs
TYPESENSE_ENABLED = false
LOG_LEVEL = info
```

### 5.5 Deploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait 5-10 minutes for first deploy
3. Monitor build logs
4. Check for errors

### 5.6 Run Initial Migration

After deploy succeeds:

1. Go to Shell tab in Render dashboard
2. Run:
   ```bash
   node ace migration:run --force
   node ace db:seed
   ```

---

## Phase 6: Verify Deployment (10 minutes)

### 6.1 Check Health

```bash
# Your Render URL
curl https://your-app.onrender.com

# Should return 200 or 302
```

### 6.2 Test Login

1. Visit: `https://your-app.onrender.com`
2. Login with: `admin@events.dz` / `Admin@123`
3. Create test event
4. Register for event

### 6.3 Check Logs

Render Dashboard → Logs tab:

- Look for errors
- Verify migrations ran
- Check database connection

### 6.4 Test Features

- [ ] User registration works
- [ ] Login works
- [ ] Event creation works
- [ ] Event listing works
- [ ] Image upload works (or fails gracefully)
- [ ] Email sending works
- [ ] QR code generation works

---

## Phase 7: Optimize (Optional, 15 minutes)

### 7.1 Setup Image Hosting

**Cloudinary (Recommended)**

```bash
# 1. Sign up at cloudinary.com
# 2. Install package
npm install @adonisjs/drive-cloudinary

# 3. Configure in config/drive.ts
# 4. Update DRIVE_DISK=cloudinary
# 5. Redeploy
```

### 7.2 Setup Custom Domain

1. Render Dashboard → Settings → Custom Domain
2. Add your domain
3. Update DNS records
4. Update `APP_URL` environment variable

### 7.3 Setup Monitoring

1. Render Dashboard → Settings → Health Check Path
2. Set to: `/`
3. Enable notifications

### 7.4 Setup Backups

```bash
# Database backups (if using PlanetScale)
# - Automatic daily backups included

# File backups (if using Cloudinary)
# - Automatic backups included

# Code backups
# - GitHub is your backup
```

---

## Phase 8: Documentation (10 minutes)

### 8.1 Update README

Add deployment section:

```markdown
## 🚀 Deployment

This project is deployed on Render.com.

See [DEPLOYMENT.md](DEPLOYMENT.md) for full guide.

### Quick Deploy

1. Push to `main` branch
2. Render auto-deploys
3. Check logs for errors
```

### 8.2 Document Environment Variables

Create `.env.example` for team:

```bash
# Copy from .env.render.example
# Remove sensitive values
# Commit to git
```

### 8.3 Create CHANGELOG

```markdown
## [2.0.0] - 2024-XX-XX

### Changed

- Refactored deployment setup for Render
- Consolidated scripts into Makefile
- Simplified Docker configuration
- Added comprehensive deployment docs

### Removed

- Redundant deployment scripts
- Unused configuration files

### Added

- Render.com deployment support
- Health check endpoints
- Build optimization
```

---

## 🎉 Completion Checklist

### Development

- [ ] Old scripts removed
- [ ] New scripts added and executable
- [ ] Makefile tested locally
- [ ] Docker Compose works
- [ ] Database migrations work
- [ ] Seeding works
- [ ] Build process works

### Production

- [ ] External database configured
- [ ] Email service configured
- [ ] Render account created
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Initial deploy successful
- [ ] Migrations ran
- [ ] Application accessible
- [ ] Login works
- [ ] Features tested

### Documentation

- [ ] DEPLOYMENT.md created
- [ ] README updated
- [ ] .env.render.example created
- [ ] CHANGELOG updated
- [ ] Team notified

---

## 🆘 Rollback Plan

If something goes wrong:

### Quick Rollback

```bash
# 1. Switch to backup branch
git checkout backup-before-refactor

# 2. Force push (⚠️ destructive)
git push origin main --force

# 3. Render will auto-deploy old version
```

### Partial Rollback

```bash
# Keep new structure, revert specific files
git checkout backup-before-refactor -- <file>
git commit -m "revert: restore <file>"
git push
```

---

## 📊 Time Estimate

| Phase             | Estimated Time | Status |
| ----------------- | -------------- | ------ |
| 1. Cleanup        | 15 min         | ⏳     |
| 2. Add Files      | 10 min         | ⏳     |
| 3. Test Locally   | 20 min         | ⏳     |
| 4. Prepare Render | 15 min         | ⏳     |
| 5. Deploy         | 20 min         | ⏳     |
| 6. Verify         | 10 min         | ⏳     |
| 7. Optimize       | 15 min         | ⏳     |
| 8. Document       | 10 min         | ⏳     |
| **Total**         | **~2 hours**   |        |

---

## 📞 Support

Stuck? Check:

1. This checklist's troubleshooting section
2. DEPLOYMENT.md troubleshooting section
3. Render documentation
4. GitHub issues

Happy deploying! 🚀
