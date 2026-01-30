

# 📘 Kubernetes Manifests

## Framely – Mega DevOps AKS Project

---

## 🎯 Purpose of This Directory

This directory contains **all Kubernetes manifests** for the Framely platform.

It is the **authoritative source of truth** for how Framely workloads are:

* Deployed
* Configured
* Operated
* Promoted across environments

All deployments follow **strict GitOps principles**.

---

## 🔐 Non-Negotiable Rules

* No manual `kubectl apply` for application workloads
* Jenkins **never deploys** to Kubernetes
* ArgoCD is the **only deployment engine**
* Git defines the **desired state**

Kubernetes clusters run **only what ArgoCD applies from Git**.

---

## 🎯 Design Goals

* Production-grade Kubernetes manifests
* Fully compatible with **Azure Kubernetes Service (AKS)**
* GitOps-first workflow using **ArgoCD**
* Environment promotion via Git (`stage` → `prod`)
* Kustomize-based configuration for application workloads
* Minimal, secure, and deterministic defaults

---

## 📂 Repository Structure

```text
kubernetes/
├── README.md              # Module documentation (this file)
├── stage/                 # Stage / pre-production environment
│   ├── namespace.yaml
│   ├── ingress.yaml
│   ├── kustomization.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── secret.yaml
│   │   └── kustomization.yaml
│   ├── frontend-admin/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── kustomization.yaml
│   └── frontend-customer/
│       ├── deployment.yaml
│       ├── service.yaml
│       └── kustomization.yaml
└── prod/                  # Production environment
    ├── namespace.yaml
    ├── ingress.yaml
    ├── kustomization.yaml
    ├── backend/
    ├── frontend-admin/
    └── frontend-customer/
```

---

## 🔁 Environment Parity

The **stage** and **prod** environments are **structurally identical**.

Only environment-specific values differ, including:

* Namespace names
* Secrets
* Ingress hostnames

This ensures:

* Predictable promotions
* Minimal configuration drift
* Reduced production risk

---

## 🧠 Architectural Principles

### 1️⃣ GitOps-First Model

* Git defines the desired state
* ArgoCD continuously reconciles cluster state
* Jenkins updates **image tags only** via Git commits
* No imperative or manual deployments

Promotion between environments is a **Git operation**, not a runtime command.

---

### 2️⃣ Stateless Application Design

All workloads are intentionally **stateless**:

* No local filesystem dependency
* Safe pod restarts
* Horizontal scaling supported

Application state is externalized to managed services:

* Azure SQL Database
* Azure Blob Storage

---

### 3️⃣ Kustomize-Only for Applications

* Application workloads use **Kustomize only**
* Helm is reserved for **platform tooling**
* Image updates are managed via `kustomize edit set image`

This ensures clean Git diffs and deterministic ArgoCD sync behavior.

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
* Liveness, readiness, and startup probes
* Hardened `securityContext`
* Secrets injected via Kubernetes Secrets

---

### Frontend – Admin (Next.js)

**Responsibilities**

* Administrative dashboard
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
* Ingress and CDN-friendly
* Same build-time configuration model as Admin UI

---

## ⚙️ Configuration Strategy

### Backend Configuration

* Fully driven by environment variables
* Sensitive values stored in **Kubernetes Secrets**

Examples include:

* Database connection strings
* JWT signing keys
* Storage credentials

---

### Frontend Configuration

* `NEXT_PUBLIC_*` variables are **build-time only**
* Injected during CI image builds
* Kubernetes manifests document the contract only

This behavior is **intentional and correct** for Next.js applications.

---

## 🔐 Security Model

### Pod-Level Security

All workloads enforce:

* Non-root container execution
* No privilege escalation
* Read-only root filesystem
* Dropped Linux capabilities

This aligns with **Kubernetes Restricted Pod Security Standards**.

---

### Secrets Management

* Secrets are isolated and explicitly defined
* No inline secrets in Deployment manifests
* Structure is compatible with:

  * Sealed Secrets
  * SOPS
  * External Secrets Operator

(Currently stored as plain YAML for clarity.)

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

* TLS is intentionally excluded from manifests
* Cloud-specific TLS is handled externally (e.g., cert-manager, Application Gateway, Front Door)
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
6. Cluster converges to the declared state

---

## 🧪 Local and Pre-Production Validation

* Manifests are validated using **KIND**
* Stage mirrors production behavior
* Production differences are configuration-only

---

## 📌 Usage Constraints

* Do not apply application manifests manually
* Do not modify cluster state outside Git
* All deployments must flow through ArgoCD
* Kustomize overlays must remain deterministic

---

## 🏁 Final Notes

* This directory is **finalized and stable**
* Manifests are **AKS-ready**
* GitOps behavior is **deterministic and auditable**
* Provides a clean foundation for future scaling

This directory defines the **authoritative Kubernetes deployment model** for the Framely platform.

---
