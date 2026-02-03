

---

# 📘 Kubernetes Manifests

## Framely – Mega DevOps AKS Project

---

## 🎯 Purpose of This Directory

This directory contains **all Kubernetes manifests** for the Framely platform.

It is the **authoritative source of truth** for how Framely workloads are:

* Deployed
* Configured
* Exposed
* Promoted across environments

All workloads are deployed using **strict GitOps principles** via ArgoCD.

---

## 🔐 Non-Negotiable Rules

* No manual `kubectl apply` for application workloads
* Jenkins **never deploys** to Kubernetes
* ArgoCD is the **only deployment engine**
* Git defines the **entire desired state**

Kubernetes clusters run **only what ArgoCD reconciles from Git**.

---

## 🎯 Design Goals

* Production-grade Kubernetes manifests
* First-class compatibility with **Azure Kubernetes Service (AKS)**
* GitOps-first workflow using **ArgoCD**
* Clear separation of **stage** and **production**
* Kustomize-based configuration for application workloads
* Secure, minimal, and deterministic defaults

---

## 📂 Module Structure

```text
kubernetes/
├── README.md
│
├── stage/                     # Pre-production / validation environment
│   ├── namespace.yaml
│   ├── ingress.yaml
│   ├── kustomization.yaml
│   │
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   ├── secretproviderclass.yaml
│   │   └── kustomization.yaml
│   │
│   ├── frontend-admin/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── kustomization.yaml
│   │
│   ├── frontend-customer/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── kustomization.yaml
│   │
│   └── monitoring/
│       └── ingress.yaml
│
└── prod/                      # Production environment
    ├── namespace.yaml
    ├── ingress.yaml
    ├── kustomization.yaml
    ├── backend/
    ├── frontend-admin/
    └── frontend-customer/
```

---

## 🔁 Environment Strategy (Intentional Differences)

The **stage** and **prod** environments are **conceptually aligned**, but **not identical by design**.

### Common Across Environments

* Same applications
* Same container images
* Same Kustomize structure
* Same GitOps workflow via ArgoCD

### Intentional Differences

| Aspect      | Stage                       | Production                       |
| ----------- | --------------------------- | -------------------------------- |
| Purpose     | Validation & testing        | Customer-facing workloads        |
| Secrets     | CSI + SecretProviderClass   | Kubernetes Secrets               |
| Monitoring  | Ingress exposed for tooling | Not exposed by default           |
| Sync policy | Auto-sync (via ArgoCD)      | Manual sync (controlled release) |

This approach balances **security, realism, and operational safety**.

---

## 🧠 Architectural Principles

### 1️⃣ GitOps-First Model

* Git defines desired state
* ArgoCD continuously reconciles cluster state
* Jenkins updates **image tags only**
* No imperative or ad-hoc deployments

Promotion between environments is a **Git operation**, not a runtime action.

---

### 2️⃣ Stateless Application Design

All workloads are **stateless by design**:

* No local filesystem dependency
* Safe pod restarts
* Horizontal scaling supported

Persistent state is externalized to managed services:

* Azure SQL Database
* Azure Blob Storage

---

### 3️⃣ Kustomize-Only for Applications

* Application manifests use **Kustomize exclusively**
* Helm is reserved for **platform tooling** (ingress, monitoring, etc.)
* Image updates are applied using:

  ```bash
  kustomize edit set image
  ```

This guarantees clean Git diffs and predictable ArgoCD behavior.

---

## 🧱 Workload Overview

### Backend – ASP.NET Core API

**Responsibilities**

* Authentication and authorization (JWT)
* Core business logic
* Database access via Entity Framework Core
* Azure Blob Storage integration

**Kubernetes Characteristics**

* Stateless Deployment
* Health probes (liveness, readiness, startup)
* Hardened `securityContext`
* Environment-driven configuration

**Secrets Strategy**

* Stage: Azure Key Vault via CSI (`SecretProviderClass`)
* Prod: Kubernetes Secrets

---

### Frontend – Admin (Next.js)

**Responsibilities**

* Internal administrative dashboard
* Product and order management

**Kubernetes Characteristics**

* Stateless Next.js standalone build
* Build-time environment configuration
* Minimal runtime footprint

---

### Frontend – Customer (Next.js)

**Responsibilities**

* Public customer-facing UI

**Kubernetes Characteristics**

* Stateless architecture
* Ingress-friendly routing
* Same build-time configuration model as Admin UI

---

## 🌐 Ingress and Networking

* Single **NGINX Ingress** per environment
* Path-based routing

| Path       | Service           |
| ---------- | ----------------- |
| `/api/*`   | Backend API       |
| `/admin/*` | Frontend Admin    |
| `/app/*`   | Frontend Customer |

### TLS Strategy

* TLS is intentionally excluded from application manifests
* TLS termination is handled externally (e.g., cert-manager, Front Door, Application Gateway)
* No application changes are required to enable TLS

---

## 🔄 Deployment Flow

1. Code changes are merged
2. Jenkins pipelines execute:

   * Tests
   * Security scans
   * Image builds
3. Jenkins commits updated image tags to Git
4. ArgoCD detects Git changes
5. ArgoCD synchronizes manifests
6. Cluster converges to declared state

---

## 📌 Usage Constraints

* Do not apply application manifests manually
* Do not mutate cluster state outside Git
* All deployments must flow through ArgoCD
* Kustomize overlays must remain deterministic

---

## 🏁 Final Notes

* This directory reflects **running AKS workloads**
* Environment differences are **intentional and documented**
* GitOps behavior is **auditable and deterministic**
* Provides a stable foundation for future scaling

This directory defines the **authoritative Kubernetes deployment model** for the Framely platform.

---

