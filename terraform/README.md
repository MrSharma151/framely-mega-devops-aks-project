

---

# 📘 Terraform Infrastructure – Framely Mega DevOps AKS Project

## 📌 Overview

This directory contains **all Terraform code** responsible for provisioning **Azure infrastructure** for the **Framely – Mega DevOps AKS Project**.

Terraform provisions the **foundational platform** on Azure, while application delivery is handled via **CI (Jenkins)** and **CD (ArgoCD)** using strict GitOps principles.

> **Terraform builds the platform**
> **Jenkins performs CI and GitOps updates**
> **ArgoCD is the only deployment engine**

This separation of concerns is **intentional, production-aligned, and industry-grade**.

---

## 🎯 Scope of Terraform

Terraform is responsible for provisioning:

* Azure Resource Groups
* Virtual Network, Subnets, and NSGs
* AKS Cluster and Node Pools
* Jenkins Virtual Machine (CI runner)
* Azure Container Registry (ACR)
* Azure Key Vault
* Azure SQL Database
* Azure Storage Account (Blob)
* Log Analytics Workspace
* Managed Identities and IAM

### 🚫 What Terraform Does NOT Do

Terraform explicitly **does not**:

* Deploy applications
* Apply Kubernetes manifests
* Install Helm charts
* Manage ArgoCD
* Configure Jenkins (handled by Ansible)
* Trigger from Jenkins pipelines (initial phase)

This guarantees:

* Safe infrastructure lifecycle
* Clean GitOps execution
* Minimal blast radius
* Clear operational ownership

---

## 🗂 Terraform Directory Structure

```
terraform/
├── modules/                     # Reusable, environment-agnostic modules
│   ├── resource-group/          # Azure Resource Group
│   ├── network/                 # VNet, Subnets, NSGs
│   ├── aks/                     # AKS cluster & node pools
│   ├── jenkins-vm/              # Jenkins CI Virtual Machine
│   ├── acr/                     # Azure Container Registry
│   ├── key-vault/               # Azure Key Vault
│   ├── sql/                     # Azure SQL Server & Database
│   ├── storage/                 # Storage Account & Blob containers
│   ├── log-analytics/           # Log Analytics Workspace
│   └── identities/              # Role assignments & IAM
│
├── environments/                # Environment-specific wiring
│   ├── stage/
│   │   ├── backend.tf           # Remote state config
│   │   ├── providers.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── main.tf              # Module composition
│   │
│   └── prod/
│       ├── backend.tf
│       ├── providers.tf
│       ├── variables.tf
│       ├── terraform.tfvars
│       └── main.tf
│
├── versions.tf                  # Terraform & provider version pinning
└── README.md
```

---

## 🌍 Environment Strategy

### Environment Isolation Model

| Environment | Resource Group     | AKS Cluster         | Terraform State |
| ----------- | ------------------ | ------------------- | --------------- |
| Stage       | `rg-framely-stage` | `aks-framely-stage` | Isolated        |
| Prod        | `rg-framely-prod`  | `aks-framely-prod`  | Isolated        |

Each environment is:

* Fully isolated
* Structurally identical
* Independently manageable

This mirrors **real production setups** and avoids cross-environment risk.

---

## 🔐 Terraform State Management

Terraform uses an **Azure Storage remote backend**.

### Why Remote State?

* Prevents accidental state loss
* Enables state locking
* Required for safe collaboration
* Production best practice

### Backend Layout

```
Azure Storage Account
└── Blob Container
    ├── stage/terraform.tfstate
    └── prod/terraform.tfstate
```

> Backend infrastructure is bootstrapped once (manually or via temporary local state), which is a standard Terraform practice.

---

## 🌐 Networking Architecture

### Virtual Network (per environment)

* One VNet per environment
* Example CIDR: `10.0.0.0/16`

### Subnets (Intentionally Minimal)

| Subnet              | Purpose              | Resources                    |
| ------------------- | -------------------- | ---------------------------- |
| `subnet-aks`        | Kubernetes workloads | AKS system & user node pools |
| `subnet-jenkins-vm` | CI infrastructure    | Jenkins Virtual Machine      |

### Why Only Two Subnets?

* Clear separation between **Kubernetes** and **non-Kubernetes** compute
* Simple security boundaries
* Easier troubleshooting
* Cost-aware design

### What Is NOT Placed in Subnets

* Azure SQL Database
* Storage Account
* Key Vault

**Reason:**

* Public endpoints with firewall restrictions
* Lower cost
* Reduced complexity
* Private endpoints intentionally deferred as future enhancement

---

## ☸️ AKS Architecture

### AKS Cluster

* One cluster per environment
* Azure CNI networking
* System Assigned Managed Identity
* Integrated with Log Analytics

### Node Pools

#### System Node Pool

* Hosts Kubernetes control components
* Small and fixed-size
* Autoscaling disabled

#### User Node Pool

* Hosts Framely applications
* Autoscaling enabled
* Cost-controlled limits

> Node pools are intentionally not over-segmented.

---

## 🖥 Jenkins Virtual Machine (CI Layer)

### Purpose

Jenkins runs on a **dedicated Azure Virtual Machine**, outside the AKS cluster.

This enforces a **clean separation between CI and runtime environments**.

### Responsibilities

Jenkins:

* Runs tests
* Performs security scans
* Builds Docker images
* Pushes images to ACR
* Updates GitOps manifests via Git commits

Jenkins **does NOT**:

* Deploy to Kubernetes
* Run `kubectl`
* Interact directly with AKS

### Design Characteristics

* VM Size: Cost-optimized (`Standard_B2s`)
* OS: Ubuntu LTS
* Subnet: `subnet-jenkins-vm`
* Public IP: Enabled with restricted NSG
* Configuration: Managed via **Ansible (outside Terraform)**

This reflects **real-world CI architecture**, not demo setups.

---

## 🐳 Azure Container Registry (ACR)

### Purpose

* Central image registry
* Supports immutable image tagging
* Shared by Jenkins and AKS

### Access Model

| Actor   | Access                           |
| ------- | -------------------------------- |
| Jenkins | Push images                      |
| AKS     | Pull images via Managed Identity |

No admin user is enabled.
No secrets are stored in Terraform.

---

## 🔑 Identity & Access Management

### Managed Identity Strategy

* AKS uses **System Assigned Managed Identity**
* Role assignments managed via Terraform:

  * `AcrPull` on ACR
  * Key Vault read access
  * Log Analytics permissions

This avoids secrets and aligns with Azure best practices.

---

## 🗝 Azure Key Vault

### Purpose

* Centralized infrastructure secret store
* Secure storage for credentials and keys

### Usage Model

* Terraform provisions Key Vault
* Secrets may be added later
* Applications still consume secrets via Kubernetes Secrets

> CSI Driver integration is a planned future enhancement.

---

## 🗄 Azure SQL Database

### Design

* Azure SQL Server + Single Database
* Cost-optimized tier
* Public endpoint with firewall restrictions

Private endpoints are intentionally deferred.

---

## 🧺 Storage Account (Blob)

### Purpose

* Application file storage
* Media uploads and exports

### Access

* Connection strings (current)
* Managed Identity (future)

---

## 📊 Observability

### Log Analytics Workspace

* Integrated with AKS
* Cluster and node monitoring
* Infrastructure diagnostics

Application metrics are handled separately via Prometheus & Grafana.

---

## 🧠 Design Philosophy

This Terraform architecture prioritizes:

* Clarity over cleverness
* Predictability over abstraction
* Cost awareness
* Production realism

Over-engineering is **intentionally avoided**.

---

## 🚀 Execution Plan

1. Fully provision **Stage** infrastructure
2. Validate CI → GitOps → ArgoCD → AKS flow
3. Implement **Prod** Terraform code
4. Do **not** provision Prod to avoid unnecessary cost

---

## 🏁 Final Statement

This Terraform setup reflects **how real DevOps teams design infrastructure**:

* Infrastructure as Code
* GitOps-native application delivery
* Strong separation of concerns
* Secure, minimal, and scalable foundations

---


