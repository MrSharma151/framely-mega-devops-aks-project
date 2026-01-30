

# 📘 Architecture Overview

## Framely – Mega DevOps AKS Project

---

## 🎯 Purpose of This Document

This document provides a **high-level architectural overview** of the Framely platform.

It explains:

* System components and their responsibilities
* Interaction between CI, CD, GitOps, and infrastructure layers
* Environment separation and deployment flow
* Design decisions that shape the platform

This document is **descriptive, not procedural**.
Detailed configuration and implementation are documented in module-specific READMEs.

---

## 🧱 Architecture Summary

Framely follows a **layered, GitOps-driven architecture** designed for:

* Clear separation of concerns
* Predictable deployments
* Environment parity
* Cloud portability

At a high level, the platform consists of:

1. Application Layer
2. CI Layer
3. GitOps & CD Layer
4. Kubernetes Runtime Layer
5. Infrastructure Layer
6. Observability Layer

Each layer is independently managed and loosely coupled.

---

## 🧩 Application Layer

**Location:** `apps/`

The application layer contains all business services:

* Backend API (ASP.NET Core)
* Frontend Customer UI (Next.js)
* Frontend Admin UI (Next.js)

### Key Characteristics

* Stateless services
* Configuration via environment variables only
* Single immutable container image per service
* Same image used across all environments

Applications do **not** contain:

* Environment-specific logic
* Infrastructure assumptions
* Deployment logic

---

## 🔁 CI Layer (Continuous Integration)

**Tool:** Jenkins
**Location:** `jenkins/`

The CI layer is responsible for **building and validating artifacts**.

### Responsibilities

* Execute tests
* Run security scans
* Build container images
* Push images to registry
* Update GitOps manifests (image tags only)

### Explicit Non-Responsibilities

* No Kubernetes access
* No deployments
* No runtime environment control

CI output is always a **Git commit**, never a cluster mutation.

---

## 🔄 GitOps & CD Layer

**Tool:** ArgoCD
**Location:** `argocd/`

The CD layer applies **Git-declared desired state** to Kubernetes clusters.

### Responsibilities

* Watch Git repositories
* Reconcile Kubernetes manifests
* Enforce environment boundaries
* Apply promotion rules

### Environment Behavior

* Stage: automatic synchronization
* Production: manual synchronization

ArgoCD is the **only component** allowed to deploy workloads.

---

## ☸️ Kubernetes Runtime Layer

**Tool:** Kubernetes (KIND locally, AKS in cloud)
**Location:** `kubernetes/`

This layer defines **how workloads run**.

### Characteristics

* Kustomize-based application manifests
* Environment-aligned structure (`stage/`, `prod/`)
* Strong environment parity
* Stateless workloads
* Secure-by-default pod configuration

No imperative deployments are allowed at this layer.

---

## ☁️ Infrastructure Layer

**Tool:** Terraform
**Location:** `terraform/`

Terraform provisions all **cloud infrastructure** required to run the platform.

### Responsibilities

* Azure networking
* AKS clusters
* Jenkins VM
* Container registry
* Databases and storage
* Identity and access management
* Observability infrastructure

Infrastructure lifecycle is **fully decoupled** from application delivery.

---

## ⚙️ Configuration Management Layer

**Tool:** Ansible
**Location:** `ansible/`

Ansible configures the **Jenkins VM** after provisioning.

### Responsibilities

* Install CI tooling
* Ensure environment parity with local setup
* Enforce Jenkins system-user constraints

Ansible does not provision infrastructure or manage applications.

---

## 📊 Observability Layer

**Location:** `monitoring/`

Observability is intentionally split:

### Infrastructure Monitoring

* Azure Log Analytics
* AKS and node-level visibility

### Application Monitoring

* Prometheus
* Grafana
* Deployed via Helm as platform components

This separation ensures portability and cost control.

---

## 🌍 Environment Model

Framely uses **environment-aligned branches and clusters**:

| Environment | Git Branch       | Kubernetes Cluster |
| ----------- | ---------------- | ------------------ |
| Local       | `main` / `stage` | KIND               |
| Stage       | `stage`          | AKS (Stage)        |
| Production  | `prod`           | AKS (Prod)         |

Environment promotion occurs **via Git commits**, not commands.

---

## 🔐 Security Model (High-Level)

Security is enforced at multiple layers:

* CI: tests and vulnerability scanning
* GitOps: reviewed state only
* Kubernetes: restricted pod security
* Infrastructure: managed identities and minimal access

Security enforcement increases progressively from `main` → `stage` → `prod`.

---

## 🔁 End-to-End Flow (Conceptual)

1. Code changes are merged into `main`
2. CI validates design and correctness
3. Promotion to `stage` triggers CI + GitOps update
4. ArgoCD deploys to Stage cluster automatically
5. Promotion to `prod` requires approval
6. ArgoCD deploys to Production manually

All state transitions are **auditable via Git**.

---

## 🧠 Design Philosophy

The architecture prioritizes:

* Simplicity over cleverness
* Deterministic behavior
* Strong separation of concerns
* Git as the control plane
* Cloud portability

Over-engineering is intentionally avoided.

---

## 🏁 Final Notes

* This architecture is **stable and finalized**
* Designed for GitOps-based Kubernetes platforms
* Compatible with local and cloud environments
* Scales from single-developer to team usage

This document represents the **authoritative architectural view** of the Framely platform.

---


