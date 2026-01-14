
---

# 👓 Framely Admin Frontend (Admin Dashboard)

**Framely Admin Frontend** is the **Admin Dashboard application** for managing the Framely eyewear platform.
This application is designed to be **containerized, testable, and deployable via CI/CD** as part of the **Framely Mega DevOps Project**.

It allows **ADMIN users** to manage:

* Categories
* Products
* Orders
* Product images (via Blob Storage – backend dependent)

This frontend is built with **Next.js (App Router)** and is intended to run:

* Locally via **Docker / Docker Compose**
* In production via **Azure Static Web Apps**
* Inside **AKS** as part of an end-to-end GitOps workflow

---

## 📌 Project Status

* ✅ **Core Admin Features Implemented**
* ✅ **Dockerized**
* ✅ **Unit & Component Tests Added**
* ✅ **Integrated with Framely Backend API**
* 🚀 **Production-ready for AKS / Azure Static Web Apps**

---

## 🧱 Tech Stack

* **Next.js 14 (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Axios** – centralized API client
* **JWT-based Auth (Admin only)**
* **Jest** – unit & component testing
* **Docker** – containerized build & runtime

---

## 📂 Directory Structure (Current)

```bash
apps/frontend-admin/
├── Dockerfile            # Production-ready Dockerfile
├── README.md             # Project documentation
├── VERSION               # App versioning
├── package.json
├── package-lock.json
├── jest.config.js        # Jest configuration
├── babel.config.js
├── next.config.ts
├── tailwind.config.js
├── tsconfig.json
├── src/                  # Application source code
└── test/                 # ✅ Test cases (Jest)
```

✅ **Important Notes**

* All **test cases live inside `/test`**
* **Dockerfile is present at root of this directory**
* No external setup needed to containerize this app

---

## ✅ Core Features

### 📊 Admin Dashboard

* High-level overview of system data
* Reusable cards & tables
* Responsive layout

### 📂 Category Management

* Create / update / delete categories
* Search & filter support
* Clean UI with modals

### 🛍️ Product Management

* Full CRUD on products
* Category & brand filtering
* Pagination & search
* Image upload handled by backend Blob APIs

### 📦 Order Management

* View all orders
* Update order status
* View order details
* Delete orders (admin-only)

### 🔐 Authentication & Authorization

* Admin-only access
* JWT-based authentication
* Protected routes

---

## 🧪 Testing

This project includes **frontend test cases** using **Jest**.

```bash
npm install
npm test
```

Tests are located in:

```bash
apps/frontend-admin/test/
```

These tests are designed to:

* Validate components
* Catch regressions early
* Be CI-friendly

---

## 🐳 Docker Support

This frontend is **fully Dockerized**.

### Build Image

```bash
docker build -t framely-admin .
```

### Run Container

```bash
docker run -p 3001:3000 framely-admin
```

### With Docker Compose

This service is designed to run via the **root `docker-compose.yml`** along with:

* Backend API
* Database
* Other frontends

---

## 🌐 Backend API Integration

The Admin frontend communicates with the **Framely Backend API**.

The API base URL is injected via environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api/v1
```

Configured inside Docker Compose and CI pipelines — **no hardcoded URLs**.

---

## 🚀 Deployment Strategy

### Local Development

* Docker / Docker Compose

### CI/CD

* GitHub Actions
* Image build & push
* Environment-based configuration

### Production

* Azure Static Web Apps (current)
* AKS (planned / scalable path)

---

## 🔐 Security & Config

* No secrets committed in repo
* Environment variables used for:

  * API URLs
  * Auth tokens
* JWT handled securely on client side

---

## 📝 Notes

* This Admin frontend is **part of a larger DevOps Mega Project**
* Designed with **AKS, GitOps (ArgoCD), and CI/CD pipelines** in mind
* Fully compatible with:

  * Docker
  * Kubernetes
  * Azure Cloud

---

## 🎯 Next Planned Enhancements

* Advanced analytics dashboard
* Role-based access control (RBAC)
* Audit logs
* Performance optimizations

---

