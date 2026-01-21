

---

# Framely – Kubernetes Manifests

### Single Source of Truth

This directory contains **all Kubernetes manifests** for the **Framely Mega DevOps AKS Project**.
It serves as the **authoritative and single source of truth** for how the Framely platform is deployed, configured, and operated on Kubernetes using **strict GitOps principles**.

> ⚠️ **Important Principles**
>
> * No manual `kubectl apply` for application workloads
> * Jenkins **never deploys** to Kubernetes
> * ArgoCD is the **only deployment engine**
> * Git is the **single source of truth** for desired state

---

## 🎯 Goals of This Kubernetes Design

* Production-grade Kubernetes manifests
* Fully compatible with **Azure Kubernetes Service (AKS)**
* GitOps-first workflow using **ArgoCD**
* Environment promotion via Git (stage → prod)
* Enterprise-aligned and interview-explainable architecture
* **Kustomize only** for applications (no Helm for app workloads)
* Minimal, secure, and reliable defaults

---

## 📂 Repository Structure

```text
kubernetes/
├── README.md              # This document (single source of truth)
├── stage/                 # Stage / Pre-Production environment
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

The **stage** and **prod** environments are **structurally identical**.
Only environment-specific values differ, such as:

* Namespace names
* Secrets
* Ingress hostnames

---

## 🧠 Architectural Principles

### 1️⃣ GitOps-First Model

* Git defines the **desired state**
* ArgoCD continuously reconciles the cluster
* Jenkins updates **image tags only** via Git commits
* No imperative or manual deployments

> Promotion to production is a **Git commit**, not a command.

---

### 2️⃣ Strong Environment Parity

* Same Kubernetes manifests for stage and prod
* Same container images across environments
* Only configuration varies (namespace, secrets, ingress)

This approach significantly **reduces production risk** and configuration drift.

---

### 3️⃣ Stateless-by-Design Applications

All services are intentionally **stateless**:

* No local disk dependency
* Safe pod restarts
* Horizontal-scaling friendly

State is externalized to managed services:

* **Azure SQL Database**
* **Azure Blob Storage**

---

## 🧱 Application Overview

### 🧠 Backend – ASP.NET Core API

**Responsibilities**

* Authentication & authorization (JWT)
* Core business logic
* Database access via EF Core
* Azure Blob Storage integration

**Kubernetes Characteristics**

* Stateless Deployment
* Startup, readiness, and liveness probes
* Hardened `securityContext`
* Secrets managed via Kubernetes Secrets

---

### 🧑‍💼 Frontend – Admin (Next.js)

**Responsibilities**

* Administrative dashboard
* Product and order management

**Kubernetes Characteristics**

* Stateless Next.js standalone build
* Build-time environment configuration
* Minimal runtime footprint

---

### 🛍️ Frontend – Customer (Next.js)

**Responsibilities**

* Public storefront
* Customer-facing UI

**Kubernetes Characteristics**

* Stateless architecture
* CDN and ingress-friendly
* Same build-time configuration strategy as Admin UI

---

## ⚙️ Configuration Strategy

### Backend Configuration

* Fully driven by environment variables
* Sensitive values stored in **Kubernetes Secrets**

Examples include:

* Database connection string
* JWT signing key
* Azure Blob Storage credentials

---

### Frontend Configuration

* `NEXT_PUBLIC_*` variables are **build-time only**
* Injected during CI image builds
* Kubernetes manifests document the contract but do not control runtime behavior

This is **intentional and correct** for Next.js applications.

---

## 🔐 Security Model

### Pod-Level Security

All workloads enforce:

* Non-root containers
* No privilege escalation
* Read-only root filesystem
* Dropped Linux capabilities

This aligns with **Kubernetes Restricted Pod Security Standards**.

---

### Secrets Management

* Secrets are explicitly defined and isolated
* No inline secrets in Deployments
* Structure is compatible with:

  * Sealed Secrets
  * SOPS
  * External Secrets Operator

(Currently stored as plain YAML for clarity and learning purposes.)

---

## 🌐 Ingress & Networking

* Single **NGINX Ingress** per environment
* Path-based routing strategy

| Path       | Service              |
| ---------- | -------------------- |
| `/api/*`   | Backend API          |
| `/admin/*` | Frontend Admin UI    |
| `/app/*`   | Frontend Customer UI |

### TLS Strategy

* TLS is not enforced directly in manifests to remain cloud-agnostic
* Can be added later via:

  * cert-manager
  * Azure Application Gateway
  * Azure Front Door

No application changes are required.

---

## 🚀 End-to-End Deployment Flow

1. Developer pushes code
2. Jenkins pipeline executes:

   * Tests
   * Security and quality scans
   * Docker image build
3. Jenkins commits updated image tags to GitOps repo
4. ArgoCD detects Git changes
5. ArgoCD syncs Kubernetes manifests
6. AKS cluster converges to desired state

---

## 🧪 Local & Stage Validation

* Manifests are validated using **KIND**
* Stage environment mirrors production behavior
* Production differences are configuration-only

---

## 🎤 Summary

> “This project follows a strict GitOps model where Jenkins only builds artifacts and Git defines deployments. Kubernetes manifests are environment-agnostic, stateless, secure by default, and AKS-ready. Promotion from stage to production happens through Git commits, not imperative commands.”

---

## 🏁 Final Notes

* This directory is **finalized and stable**
* Represents a **real-world AKS deployment model**
* Designed to be readable, auditable, and explainable
* Provides a safe foundation for future scaling and enhancements

---


