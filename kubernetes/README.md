

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

All workloads are deployed using **strict GitOps principles** via **ArgoCD**.

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
* Clear separation of **stage** and **production** environments
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
└── prod/                      # Production environment (defined, not provisioned)
    ├── namespace.yaml
    ├── ingress.yaml
    ├── kustomization.yaml
    ├── backend/
    ├── frontend-admin/
    └── frontend-customer/
```

---

## 🔁 Environment Strategy (Intentional Design)

The Framely platform follows a **two-environment Kubernetes model**:

* `stage` – actively provisioned and validated on AKS
* `prod` – fully defined and production-ready, but **not provisioned**

This approach ensures **environment parity** while maintaining **responsible cloud cost management**.

---

## 🚦 Environment Provisioning Status (Important Context)

At the current stage of this project, **only the `stage` Kubernetes environment is provisioned and deployed on AKS**.

The `prod` environment manifests are **intentionally present but not applied to a live cluster**.

### Why Production Was Not Provisioned

This decision was **intentional and cost-aware**, based on the following factors:

* `stage` and `prod` environments are:

  * Structurally identical
  * Architecturally aligned
  * Governed by the same GitOps workflows
* The same:

  * Applications
  * Container images
  * Kustomize layout
  * ArgoCD configuration
* exist across both environments
* Provisioning a second AKS cluster would provide **minimal additional learning value** while **doubling cloud cost**

For this reason, **all functional validation and testing was performed using the `stage` environment only**.

---

## 🔐 Implications for Kubernetes Manifests

Because the `prod` environment is **not actively provisioned**, some production-only integrations are:

* Defined conceptually
* Structurally prepared
* Not exercised against a live cluster

These include:

* CSI-based secret consumption
* Environment-specific secret hardening
* Production-only exposure and ingress constraints

These configurations are **intentionally deferred**, not missing due to design gaps.

Provisioning production would require only:

1. Creating the AKS cluster via Terraform
2. Applying the existing `prod/` manifests via ArgoCD

No architectural or CI/CD changes would be required.

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
* Prod: Kubernetes Secrets (defined, not applied)

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

Framely uses **subdomain-based routing** via a single **NGINX Ingress Controller** per environment.

Each application component is exposed using a **dedicated hostname**, providing clean separation, better security boundaries, and production-aligned routing.

### Routing Model

| Subdomain                    | Service           | Purpose                   |
| ---------------------------- | ----------------- | ------------------------- |
| `framely-api-<env>.domain`   | Backend API       | Application API endpoints |
| `framely-<env>.domain`       | Frontend Customer | Public storefront         |
| `framely-admin-<env>.domain` | Frontend Admin    | Administrative dashboard  |

> Example (Stage environment):
>
> * `framely-api-sg.rohitsharma.org` → Backend API
> * `framely-sg.rohitsharma.org` → Customer UI
> * `framely-admin-sg.rohitsharma.org` → Admin UI

### Design Rationale

* Subdomain-based routing mirrors real-world production setups
* Clean separation between public, admin, and API traffic
* Simpler frontend configuration (no path rewrites)
* CDN- and WAF-friendly architecture
* Easier TLS and certificate management per service

---

### TLS Strategy

* TLS configuration is **intentionally excluded** from application manifests
* Ingress manifests are **TLS-ready** and compatible with:

  * cert-manager
  * Azure Application Gateway
  * Azure Front Door
* TLS can be enabled later without:

  * Modifying application code
  * Changing deployment manifests
  * Breaking GitOps workflows

This approach keeps manifests **environment-agnostic**, **secure**, and **production-aligned**.

---

### Key Notes

* Ingress resources are applied **only via ArgoCD**
* No manual changes are performed inside the cluster
* Azure automatically provisions the external LoadBalancer when the NGINX Ingress Service is created


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

* This directory reflects **running AKS workloads (stage environment)** and **production-ready manifests**
* Environment differences are **intentional, documented, and reversible**
* GitOps behavior is **auditable and deterministic**
* The design prioritizes **correctness, parity, and cost awareness**

This directory defines the **authoritative Kubernetes deployment model** for the Framely platform.

---

