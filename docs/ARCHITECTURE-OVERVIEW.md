
---

# 📘 Architecture Overview

## Framely – Mega DevOps AKS Project

---

## 🎯 Purpose of This Document

This document provides a **high-level architectural overview** of the Framely platform.

It explains:

* Core system components and their responsibilities
* Interaction between CI, CD, GitOps, and infrastructure layers
* Environment separation and promotion model
* Design decisions that shape the platform

This document is **descriptive, not procedural**.
Detailed implementation details are documented in module-level READMEs.

![Architecture Overview](../diagrams/architecture/framely-architecture.jpg)

---

## 🧱 Architecture Summary

Framely follows a **layered, GitOps-driven architecture** designed to provide:

* Clear separation of concerns
* Deterministic and auditable deployments
* Environment isolation
* Cloud portability

At a high level, the platform consists of the following layers:

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
* Same image promoted across all environments

Applications do **not** contain:

* Environment-specific logic
* Infrastructure assumptions
* Deployment or orchestration logic

---

## 🔁 CI Layer (Continuous Integration)

**Tool:** Jenkins
**Location:** `jenkins/`

The CI layer is responsible for **building, validating, and promoting artifacts via GitOps**.

### Responsibilities

* Execute unit and integration tests
* Perform security and vulnerability scanning
* Build container images
* Push images to the container registry
* Update GitOps manifests (image tags only)

### Explicit Non-Responsibilities

* No Kubernetes access
* No workload deployment
* No runtime environment control

CI output is always a **Git commit**, never a direct cluster mutation.

---

## 🔄 GitOps & CD Layer

**Tool:** ArgoCD
**Location:** `argocd/`

The GitOps and CD layer is responsible for **reconciling Git-declared state** into Kubernetes clusters.

### Responsibilities

* Monitor Git repositories for changes
* Reconcile Kubernetes manifests
* Enforce environment boundaries
* Apply promotion and synchronization rules

### Environment Behavior

* **Stage:** Automatic synchronization
* **Production:** Manual synchronization

ArgoCD is the **only component** permitted to deploy workloads.

---

## ☸️ Kubernetes Runtime Layer

**Tool:** Kubernetes (AKS)
**Location:** `kubernetes/`

This layer defines **how workloads run inside the cluster**.

### Characteristics

* Kustomize-based application manifests
* Environment-aligned structure (`stage/`, `prod/`)
* Stateless workloads
* Secure-by-default pod configuration
* No imperative or manual deployments

Kubernetes executes **only** the state reconciled by ArgoCD.

---

## ☁️ Infrastructure Layer

**Tool:** Terraform
**Location:** `terraform/`

Terraform provisions all **cloud infrastructure** required to support the platform.

### Responsibilities

* Azure networking
* AKS clusters and node pools
* Jenkins virtual machine
* Container registry (ACR)
* Databases and storage
* Identity and access management
* Infrastructure-level observability

Infrastructure lifecycle is **fully decoupled** from application delivery.

---

## ⚙️ Configuration Management Layer

**Tool:** Ansible
**Location:** `ansible/`

Ansible is used to configure the **Jenkins VM** after provisioning.

### Responsibilities

* Install and configure CI tooling
* Enforce system-level dependencies
* Ensure Jenkins runs with correct permissions and constraints

Ansible does not provision infrastructure or manage application workloads.

---

## 📊 Observability Layer

**Location:** `monitoring/`

Observability is intentionally split by responsibility:

### Infrastructure Monitoring

* Azure Log Analytics
* AKS control plane and node-level metrics

### Application Monitoring

* Prometheus
* Grafana
* Deployed as platform components via Helm

This separation ensures portability, scalability, and cost control.

---

## 🌍 Environment Model

Framely uses **environment-aligned Git branches and AKS clusters**:

| Environment | Git Branch | Kubernetes Cluster |
| ----------- | ---------- | ------------------ |
| Local       | `main`     | KIND               |
| Stage       | `stage`    | AKS (Stage)        |
| Production  | `prod`     | AKS (Prod)         |

Environment promotion occurs **through Git commits**, not runtime commands.

---

## 🔐 Security Model (High-Level)

Security is enforced across multiple layers:

* **CI:** Tests and vulnerability scanning
* **GitOps:** Reviewed and approved state only
* **Kubernetes:** Restricted pod security and isolation
* **Infrastructure:** Managed identities and least-privilege access

Security enforcement increases progressively from `main` → `stage` → `prod`.

---

## 🔁 End-to-End Flow (Conceptual)

1. Code changes are merged into `main`
2. CI validates correctness and security
3. Promotion to `stage` triggers CI and GitOps updates
4. ArgoCD automatically deploys to the Stage cluster
5. Promotion to `prod` requires explicit approval
6. ArgoCD deploys to Production manually

All state transitions are **fully auditable via Git history**.

---

## 🧠 Design Philosophy

The architecture prioritizes:

* Simplicity over clever abstractions
* Deterministic and repeatable behavior
* Strong separation of concerns
* Git as the control plane
* Cloud portability

Over-engineering is intentionally avoided.

---

## 🏁 Final Notes

* This architecture is **stable and finalized**
* Designed for GitOps-driven Kubernetes platforms
* Proven across local, stage, and production environments
* Scales cleanly from individual development to team usage

This document represents the **authoritative architectural view** of the Framely platform.

---

