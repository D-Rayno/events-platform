# 🧠 AdonisJS + Inertia + Vue.js Fullstack App

This repository contains a **fullstack AdonisJS application** that uses **Inertia.js** to render **Vue.js** pages on the web, while also exposing **API routes** for a mobile app.

It’s designed to serve as a **unified backend** that powers both a web interface and mobile clients efficiently.

---

## ⚡ Tech Stack

### Backend

- **Framework:** [AdonisJS 6](https://adonisjs.com/) (Node.js MVC)
- **Language:** TypeScript
- **Routing:** Inertia + API routes
- **ORM:** Lucid ORM
- **Auth:** Adonis Auth (Sanctum-style tokens for API)
- **Database:** PostgreSQL / MySQL / SQLite (configurable)
- **Package Manager:** npm / yarn / pnpm

### Frontend (Web)

- **Inertia.js** — bridges AdonisJS and Vue.js without a traditional API
- **Vue 3** — modern reactive frontend framework
- **Vite** — lightning-fast bundler for Vue components

### Mobile App (API Client)

- Will communicate with `/api/...` routes using JSON
- Built with any mobile framework (e.g., **React Native**, **Flutter**, or **Ionic Vue**)

---

## 🧰 Prerequisites

You need to have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn
- AdonisJS CLI (optional)
  ```bash
  npm i -g @adonisjs/cli
  ```
