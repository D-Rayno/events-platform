# Routes Documentation

## Web Routes (Frontend UI - `view()` responses)

These routes return Inertia.js pages and require UI implementation.

### Authentication Routes (`/auth/*`)
- **GET** `/auth/login` → `auth/login.vue` ✅
- **POST** `/auth/login` → Backend handler (no UI)
- **GET** `/auth/register` → `auth/register.vue` ✅
- **POST** `/auth/register` → Backend handler (no UI)
- **GET** `/auth/forgot-password` → `auth/forgot_password.vue` ✅
- **POST** `/auth/forgot-password` → Backend handler (no UI)
- **GET** `/auth/reset-password` → `auth/reset_password.vue` ✅
- **POST** `/auth/reset-password` → Backend handler (no UI)
- **GET** `/auth/verify-email` → Backend redirect (no UI)
- **POST** `/auth/logout` → Backend handler (no UI)
- **POST** `/auth/resend-verification` → Backend handler (no UI)

### Public Routes
- **GET** `/` → `home.vue` ✅
- **GET** `/events` → `events/index.vue` ✅
- **GET** `/events/:id` → `events/show.vue` ✅

### Protected Routes (Require Authentication)
- **GET** `/profile` → `profile/show.vue` ✅
- **POST** `/profile` → Backend handler (no UI)
- **DELETE** `/profile/avatar` → Backend handler (no UI)
- **GET** `/registrations` → `registrations/index.vue` ✅
- **GET** `/registrations/:id` → `registrations/show.vue` ✅
- **POST** `/events/:eventId/register` → Backend handler (no UI)
- **DELETE** `/registrations/:id` → Backend handler (no UI)

---

## API Routes (Mobile Admin App - JSON responses)

These routes are for the mobile admin application and **DO NOT** require frontend UI.

### Admin API (`/api/admin/*`)
All routes require `ADMIN_API_TOKEN` authentication via Bearer header.

#### Authentication
- **POST** `/api/admin/auth/login` → JSON
- **GET** `/api/admin/auth/check` → JSON

#### Events Management
- **GET** `/api/admin/events` → JSON list
- **GET** `/api/admin/events/stats` → JSON stats
- **GET** `/api/admin/events/:id` → JSON detail
- **POST** `/api/admin/events` → JSON create
- **PUT** `/api/admin/events/:id` → JSON update
- **DELETE** `/api/admin/events/:id` → JSON delete

#### Registrations Management
- **GET** `/api/admin/registrations` → JSON list
- **GET** `/api/admin/registrations/stats` → JSON stats
- **GET** `/api/admin/registrations/:id` → JSON detail
- **POST** `/api/admin/registrations/verify` → JSON verify QR
- **POST** `/api/admin/registrations/confirm` → JSON confirm attendance
- **DELETE** `/api/admin/registrations/:id` → JSON cancel

#### Users Management
- **GET** `/api/admin/users` → JSON list
- **GET** `/api/admin/users/stats` → JSON stats
- **GET** `/api/admin/users/:id` → JSON detail
- **PATCH** `/api/admin/users/:id/toggle-block` → JSON toggle
- **PATCH** `/api/admin/users/:id/toggle-active` → JSON toggle
- **DELETE** `/api/admin/users/:id` → JSON delete

---

## Summary

### UI Pages to Maintain: **11 pages**
1. Home
2. Events List
3. Event Details
4. Login
5. Register
6. Forgot Password
7. Reset Password
8. Profile
9. User Registrations List
10. Registration Detail (Ticket)
11. Error Pages (404, 500)

### API Endpoints (No UI): **23 endpoints**
All admin API routes are JSON-only for mobile app consumption.

---

## Color Theme Reference

From `theme.config.json`:

### Primary Colors (Blue)
- Primary-500: `#0ea5e9` (Default)
- Primary-600: `#0284c7` (Hover)
- Primary-50: `#f0f9ff` (Light backgrounds)

### Secondary Colors (Purple)
- Secondary-500: `#a855f7`
- Secondary-600: `#9333ea`

### Semantic Colors
- Success: `#22c55e` (Green)
- Error: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)
- Info: `#3b82f6` (Blue)

### Neutral/Sand (Radix UI inspired)
- Text primary: `sand-12` 
- Text secondary: `sand-11`
- Backgrounds: `sand-1` to `sand-6`
- Borders: `sand-6`, `sand-7`