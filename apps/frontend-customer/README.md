
---

# 👓 Framely Customer Frontend

**Framely Customer Frontend** is the **customer-facing web application** for the Framely eyewear platform.
This application allows end users to **browse products, search, filter, place orders, and manage their account**.

It is designed to be:

* **Containerized**
* **Tested**
* **CI/CD friendly**
* **AKS & Azure ready**

This frontend is part of the **Framely Mega DevOps Project**, where the entire system (frontend, backend, database) runs using **Docker, Docker Compose, CI/CD pipelines, and Kubernetes (AKS)**.

---

## 📌 Project Status

* ✅ **Core Customer Features Implemented**
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
* **JWT Authentication** (stored in browser storage)
* **Jest** – unit & component testing
* **Docker** – containerized build & runtime

---

## 📂 Directory Structure (Current)

```bash
apps/frontend-customer/
├── Dockerfile            # Production-ready Dockerfile
├── README.md             # Project documentation
├── VERSION               # App versioning
├── package.json
├── package-lock.json
├── jest.config.js        # Jest configuration
├── babel.config.js
├── next.config.js
├── postcss.config.mjs
├── tsconfig.json
├── public/               # Static assets
├── src/                  # Application source code
└── tests/                # ✅ Test cases (Jest)
```

✅ **Important Notes**

* All **test cases live inside `/tests`**
* **Dockerfile is present at the root of this directory**
* This app is fully runnable via **Docker / Docker Compose**

---

## ✅ Core Features

### 🔐 Authentication & Routing

* User registration & login
* JWT-based authentication
* Protected routes (redirects unauthenticated users)
* Centralized auth handling via hooks & interceptors

### 🛍️ Product Browsing

* Paginated product listing (backend-driven)
* Category-based filtering
* Client-side search
* Sorting support (price / default)

### 📦 Product Details

* Individual product pages
* Backend-driven data
* Fallback handling for missing images

### 🛒 Cart & Checkout

* Client-side cart management
* Basic checkout flow
* Order placement via backend API

### 📑 My Orders

* View logged-in user’s orders
* Order status tracking:

  * `Pending`
  * `Processing`
  * `Completed`
  * `Cancelled`
* Cancel pending orders
* Displays order items & total price

### 🔔 Notifications

* Success & error notifications
* User-friendly feedback for API actions

---

## 🧪 Testing

This project includes **frontend test cases** using **Jest**.

```bash
npm install
npm test
```

Tests are located in:

```bash
apps/frontend-customer/tests/
```

These tests help ensure:

* UI stability
* Correct API interaction
* CI-safe builds

---

## 🐳 Docker Support

The Customer frontend is **fully Dockerized**.

### Build Image

```bash
docker build -t framely-frontend-customer .
```

### Run Container

```bash
docker run -p 3000:3000 framely-frontend-customer
```

### With Docker Compose

This service is intended to run as part of the **root `docker-compose.yml`**, alongside:

* Backend API
* Database
* Admin frontend

---

## 🌐 Backend API Integration

This frontend communicates with the **Framely Backend API**.

The API base URL is injected via environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api/v1
```

✔ No hardcoded URLs
✔ Environment-driven configuration (Docker / CI / AKS compatible)

---

## 🚀 Deployment Strategy

### Local Development

* Docker
* Docker Compose

### CI/CD

* GitHub Actions
* Automated builds & deployments
* Environment-based configs

### Production

* Azure Static Web Apps (current)
* AKS-ready for future scaling

---

## 🔐 Security & Configuration

* No secrets committed to the repository
* Environment variables used for:

  * API base URL
  * Runtime configuration
* JWT handled securely via client interceptors

---

## 📝 Notes

* This is the **customer-facing frontend** of the Framely platform
* Built as part of an **end-to-end DevOps Mega Project**
* Designed to work seamlessly with:

  * Docker
  * Kubernetes (AKS)
  * Azure Cloud services

---

## 🎯 Next Planned Enhancements

* Payment gateway integration
* Advanced checkout flow
* Wishlist & recommendations
* Performance optimizations
* Analytics & tracking

---


