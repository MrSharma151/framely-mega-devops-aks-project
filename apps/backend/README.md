

---

# 🧠 Framely Backend API

**Framely Backend** is the **core API service** for the Framely eyewear platform.
It handles **authentication, authorization, products, categories, orders, users, and file uploads**, and acts as the single source of truth for both **Customer** and **Admin** frontends.

This backend is built with **ASP.NET Core + Entity Framework Core**, fully **Dockerized**, and designed to run seamlessly in **Docker Compose, Azure, and AKS**.

---

## 📌 Project Status

* ✅ **Core APIs Implemented**
* ✅ **JWT Authentication & Role-based Authorization**
* ✅ **Entity Framework Core with SQL Server**
* ✅ **Dockerized (Multi-stage build)**
* ✅ **Automatic DB migrations & role seeding**
* 🚀 **Production-ready for AKS / Azure**

---

## 🧱 Tech Stack

* **ASP.NET Core 9**
* **Entity Framework Core**
* **SQL Server**
* **ASP.NET Identity**
* **JWT Authentication**
* **AutoMapper**
* **Swagger / OpenAPI**
* **Docker**
* **Jest-compatible frontend consumers**

---

## 📂 Directory Structure

```bash
apps/backend/
├── Dockerfile                # Multi-stage production Dockerfile
├── README.md                 # Backend documentation
├── VERSION                   # Backend versioning
├── Framely.API               # API layer (Controllers, Program.cs)
├── Framely.Core              # Domain models & interfaces
├── Framely.Infrastructure    # EF Core, Identity, services
└── Framely.Tests              # Unit & integration tests
```

### 📁 Layered Architecture

| Layer                      | Responsibility                            |
| -------------------------- | ----------------------------------------- |
| **Framely.API**            | Controllers, middleware, Swagger, startup |
| **Framely.Core**           | Domain entities, DTOs, interfaces         |
| **Framely.Infrastructure** | EF Core, Identity, DB context, services   |
| **Framely.Tests**          | Unit & service-level tests                |

---

## 🔐 Authentication & Authorization

* **JWT-based authentication**
* **Role-based access control**

  * `USER`
  * `ADMIN`
* Uses **ASP.NET Identity**
* Tokens generated using **HS256**

### Roles

* `USER` → Customer frontend
* `ADMIN` → Admin dashboard

Roles are **auto-created at startup** if missing.

---

## 🗄️ Database

* **SQL Server**
* Managed via **Entity Framework Core**
* Automatic:

  * Database creation
  * Migrations
  * Role seeding

### Tables Include

* `AspNetUsers`
* `AspNetRoles`
* `Products`
* `Categories`
* `Orders`
* `OrderItems`

---

## 🧪 Database Initialization (Important)

On application startup, the backend automatically:

1. Applies EF Core migrations
2. Ensures required roles exist (`USER`, `ADMIN`)

This makes the backend **safe for Docker, Azure, and AKS** environments.

---

## 🌐 API Endpoints (High Level)

### 🔑 Auth

* `POST /api/v1/Auth/register`
* `POST /api/v1/Auth/login`

### 📂 Categories

* `GET /api/v1/Categories`
* `POST /api/v1/Categories`
* `PUT /api/v1/Categories/{id}`
* `DELETE /api/v1/Categories/{id}`

### 🛍️ Products

* `GET /api/v1/Products`
* `GET /api/v1/Products/{id}`
* `POST /api/v1/Products`
* `PUT /api/v1/Products/{id}`
* `DELETE /api/v1/Products/{id}`
* Filtering & search supported

### 📦 Orders

* `GET /api/v1/Orders`
* `GET /api/v1/Orders/my`
* `PUT /api/v1/Orders/{id}/status`
* `DELETE /api/v1/Orders/{id}`

### 🖼️ Blob Storage (Optional)

* `POST /api/v1/Blob/upload`
* `DELETE /api/v1/Blob/{fileName}`

---

## 🧪 Testing

Backend test projects live in:

```bash
apps/backend/Framely.Tests/
```

Includes:

* Service-level tests
* Controller logic validation
* Identity & auth scenarios

---

## 🐳 Docker Support

The backend uses a **multi-stage Dockerfile** for optimized images.

### Build Image

```bash
docker build -t framely-api .
```

### Run Container

```bash
docker run -p 8080:8080 framely-api
```

### Docker Compose

This backend is designed to run with:

* SQL Server container
* Frontend customer
* Frontend admin

via the **root `docker-compose.yml`**.

---

## ⚙️ Configuration

All configuration is **environment-driven**.

### Required Environment Variables

```env
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080

ConnectionStrings__DefaultConnection=Server=...;Database=...;

JwtSettings__Secret=very_long_secret_key_32_chars_min
JwtSettings__Issuer=FramelyAPI
JwtSettings__Audience=FramelyUsers

FrontendOrigins__0=http://localhost:3000
FrontendOrigins__1=http://localhost:3001
```

✔ No hardcoded secrets
✔ Docker & AKS compatible

---

## 📘 Swagger / API Docs

Swagger UI is enabled when configured:

```
GET /swagger
```

Useful for:

* API testing
* Contract validation
* Frontend integration

---

## 🚀 Deployment Strategy

### Local

* Docker
* Docker Compose

### CI/CD

* GitHub Actions
* Automated image builds
* Versioned releases

### Production

* Azure App Service (existing)
* AKS (target architecture)

---

## 🛡️ Security Practices

* JWT secrets via environment variables
* Role-based authorization
* No secrets in source control
* HTTPS enforced at ingress (AKS)

---

## 📝 Notes

* This backend is the **central brain** of Framely
* Built for **cloud-native & GitOps workflows**
* Safe to restart, rebuild, and redeploy
* Fully compatible with **AKS + ArgoCD**

---

## 🎯 Next Enhancements

* Refresh tokens
* Rate limiting
* Caching (Redis)
* Observability (Prometheus + Grafana)
* Background jobs (Hangfire / Azure Jobs)

---

