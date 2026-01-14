

---

# 🧩 Framely Applications – Local → Docker → AKS Ready

This directory contains **all deployable application components** of the Framely platform.
It is designed to work **locally via Docker Compose** and later transition **smoothly into Kubernetes (AKS) using GitOps (ArgoCD)** without architectural changes.

---

## 📂 Applications Overview

```bash
apps/
├── README.md                # This document
├── docker-compose.yml       # Local orchestration (dev only)
├── backend                  # ASP.NET Core API
├── frontend-admin           # Admin dashboard (Next.js)
└── frontend-customer        # Customer storefront (Next.js)
```

Each application is:

* ✅ **Independently buildable**
* ✅ **Dockerized**
* ✅ **Environment-driven**
* ✅ **AKS-ready**

---

## 🧱 Application Responsibilities

### 🧠 Backend (`apps/backend`)

* Central API service
* Authentication & authorization (JWT + Roles)
* Products, categories, orders
* SQL Server + EF Core
* Blob storage integration (Azure)

📘 Detailed docs: `apps/backend/README.md`

---

### 🛍️ Frontend – Customer (`apps/frontend-customer`)

* Public storefront
* User login, orders, cart
* Consumes backend APIs only
* Stateless, CDN-friendly

📘 Detailed docs: `apps/frontend-customer/README.md`

---

### 🧑‍💼 Frontend – Admin (`apps/frontend-admin`)

* Admin-only dashboard
* Product, category & order management
* Role-protected access (`ADMIN`)
* Consumes backend APIs only

📘 Detailed docs: `apps/frontend-admin/README.md`

---

## 🐳 Local Development (Docker Compose)

For **local development & testing only**, all services are orchestrated using:

```bash
apps/docker-compose.yml
```

### What Docker Compose Does

* Spins up:

  * SQL Server
  * Backend API
  * Frontend Customer
  * Frontend Admin
* Provides **service-to-service networking**
* Mimics production topology (API + DB separation)

### Run Locally

```bash
docker compose up -d --build
```

⚠️ **Important**

> Docker Compose is **NOT used in production or AKS**.
> It exists purely for **local validation & integration testing**.

---

## 🗄️ Database & Migrations (CRITICAL FOR AKS)

### Current State (Local + Docker)

* SQL Server runs as a container
* EF Core migrations are:

  * Automatically applied at backend startup
  * Database created if missing
* Roles (`USER`, `ADMIN`) are auto-created

### Why This Matters for AKS

In AKS:

* Pods are **ephemeral**
* Containers restart frequently
* Manual DB steps are **not acceptable**

✔ The backend is already designed to:

* Auto-run migrations
* Auto-ensure roles
* Fail fast if DB is unreachable

➡️ **This design is REQUIRED for Kubernetes stability**

---

## 🔐 Configuration Strategy (AKS-Ready)

All apps rely on **environment variables**, not files.

### Backend

* Connection string
* JWT secrets
* CORS origins

### Frontends

* API base URL only

This enables:

* Kubernetes `ConfigMap`
* Kubernetes `Secret`
* ArgoCD-driven config changes
* Zero image rebuilds for config changes

---

## 🚀 AKS Migration – Planned Flow (IMPORTANT)

This `apps` structure is intentionally aligned with AKS delivery.

### Phase 1 – Local (DONE ✅)

* Dockerfiles
* Docker Compose
* Local SQL Server
* Local validation

### Phase 2 – Container Registry (NEXT)

* Build images via Jenkins
* Push to Azure Container Registry (ACR)
* Tag images (`app:version`)

### Phase 3 – Kubernetes Manifests

* Separate repo/dir for:

  * Deployments
  * Services
  * Ingress
  * ConfigMaps
  * Secrets
* One Deployment per app:

  * backend
  * frontend-customer
  * frontend-admin

### Phase 4 – ArgoCD (GitOps)

* ArgoCD watches manifests
* Jenkins updates image tags only
* No kubectl in CI
* Git = single source of truth

---

## 🔁 What Will CHANGE in AKS (and What Will NOT)

### ❌ Will NOT Be Used

* docker-compose.yml
* Local SQL container

### ✅ Will Be Used

* Dockerfiles (unchanged)
* Environment variables
* Backend auto-migration logic
* Stateless frontend images

### 🔄 Will Be Replaced

| Local          | AKS                  |
| -------------- | -------------------- |
| SQL container  | Azure SQL Database   |
| Docker network | Kubernetes Service   |
| Ports          | Ingress              |
| .env           | Secrets / ConfigMaps |

---

## ⚠️ Critical AKS Notes (Read This Carefully)

### 1️⃣ Never rely on container state

* Containers can restart anytime
* DB & storage must be external (Azure SQL, Blob)

### 2️⃣ Backend must be idempotent

* Migrations should be safe to re-run
* Role seeding must not fail if roles exist
  ✔ Already implemented

### 3️⃣ Frontends must be stateless

* No session storage on container
* JWT stored client-side
  ✔ Already implemented

### 4️⃣ docker-compose.yml is **NOT** production

* Exists only for local dev
* AKS uses YAML manifests + ArgoCD

---

## 🧪 Testing Strategy (Future)

* Backend:

  * Unit tests (`Framely.Tests`)
* Frontend:

  * Jest tests (`tests/`, `test/`)
* CI:

  * Tests run before image build
* CD:

  * Only deploy tested images

---

## 🏁 Summary

* This `apps` directory is **AKS-ready by design**
* No re-architecture needed later
* Clean separation of concerns
* GitOps-friendly structure
* Production-grade DevOps foundation

---


