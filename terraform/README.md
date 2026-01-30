

# 📘 Terraform Infrastructure

## Framely – Mega DevOps AKS Project

---

## 🎯 Purpose of This Directory

This directory contains **all Terraform code** responsible for provisioning **Azure infrastructure** for the Framely platform.

Terraform provisions the **foundational cloud platform**, while application delivery is handled separately through:

* **CI:** Jenkins
* **CD:** ArgoCD (GitOps)

> Terraform builds infrastructure.
> Jenkins produces artifacts and updates Git.
> ArgoCD deploys declared state to Kubernetes.

This separation of responsibilities is **intentional and production-aligned**.

---

## 🧱 Scope of Terraform

Terraform is responsible for provisioning and managing:

* Azure Resource Groups
* Virtual Networks, Subnets, and Network Security Groups
* Azure Kubernetes Service (AKS) clusters and node pools
* Jenkins Virtual Machine (CI runner)
* Azure Container Registry (ACR)
* Azure Key Vault
* Azure SQL Server and Database
* Azure Storage Account (Blob)
* Log Analytics Workspace
* Managed Identities and role assignments

---

### ❌ Out of Scope

Terraform explicitly does **not**:

* Deploy application workloads
* Apply Kubernetes manifests
* Install Helm charts
* Configure or manage ArgoCD
* Configure Jenkins (handled via Ansible)
* Execute from Jenkins pipelines during the initial phase

This ensures:

* Predictable infrastructure lifecycle
* Clean GitOps execution
* Reduced blast radius
* Clear operational ownership

---

## 📂 Directory Structure

```text
terraform/
├── modules/                     # Reusable, environment-agnostic modules
│   ├── resource-group/          # Azure Resource Groups
│   ├── network/                 # VNet, Subnets, NSGs
│   ├── aks/                     # AKS cluster and node pools
│   ├── jenkins-vm/              # Jenkins CI virtual machine
│   ├── acr/                     # Azure Container Registry
│   ├── key-vault/               # Azure Key Vault
│   ├── sql/                     # Azure SQL Server and Database
│   ├── storage/                 # Storage Account and Blob containers
│   ├── log-analytics/           # Log Analytics Workspace
│   └── identities/              # IAM and role assignments
│
├── environments/                # Environment-specific composition
│   ├── stage/
│   │   ├── backend.tf           # Remote state configuration
│   │   ├── providers.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── main.tf              # Module wiring
│   │
│   └── prod/
│       ├── backend.tf
│       ├── providers.tf
│       ├── variables.tf
│       ├── terraform.tfvars
│       └── main.tf
│
├── versions.tf                  # Terraform and provider version pinning
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

This prevents cross-environment impact and mirrors real production setups.

---

## 🔐 Terraform State Management

Terraform uses an **Azure Storage remote backend**.

### Rationale

* Prevents accidental state loss
* Enables state locking
* Required for safe collaboration
* Standard production practice

### Backend Layout

```text
Azure Storage Account
└── Blob Container
    ├── stage/terraform.tfstate
    └── prod/terraform.tfstate
```

Backend resources are bootstrapped once, which is standard Terraform practice.

---

## 🌐 Networking Architecture

### Virtual Network

* One VNet per environment
* Example CIDR: `10.0.0.0/16`

### Subnet Design

| Subnet              | Purpose              | Resources                      |
| ------------------- | -------------------- | ------------------------------ |
| `subnet-aks`        | Kubernetes workloads | AKS system and user node pools |
| `subnet-jenkins-vm` | CI infrastructure    | Jenkins virtual machine        |

### Design Rationale

* Clear separation between Kubernetes and non-Kubernetes compute
* Simple security boundaries
* Reduced operational complexity
* Cost-aware design

### Excluded from Subnets

* Azure SQL Database
* Storage Account
* Key Vault

These services use public endpoints with firewall restrictions.
Private endpoints are intentionally deferred.

---

## ☸️ AKS Architecture

### Cluster Design

* One AKS cluster per environment
* Azure CNI networking
* System-assigned managed identity
* Integrated with Log Analytics

### Node Pools

**System Node Pool**

* Hosts Kubernetes system components
* Fixed size
* Autoscaling disabled

**User Node Pool**

* Hosts application workloads
* Autoscaling enabled
* Cost-controlled limits

Node pools are intentionally not over-segmented.

---

## 🖥 Jenkins Virtual Machine

### Purpose

Jenkins runs on a **dedicated Azure VM**, outside the AKS cluster.

This enforces a strict separation between:

* CI execution
* Application runtime environments

### Responsibilities

Jenkins performs:

* Test execution
* Security scanning
* Docker image builds
* Image pushes to ACR
* GitOps manifest updates via Git commits

Jenkins does **not**:

* Deploy workloads
* Execute `kubectl`
* Interact directly with AKS

### Characteristics

* VM size: Cost-optimized
* OS: Ubuntu LTS
* Network: `subnet-jenkins-vm`
* Public IP: Enabled with restricted NSG
* Configuration: Managed via **Ansible**

---

## 🐳 Azure Container Registry (ACR)

### Purpose

* Central container image registry
* Immutable image tagging
* Shared by Jenkins and AKS

### Access Model

| Actor   | Access                           |
| ------- | -------------------------------- |
| Jenkins | Push images                      |
| AKS     | Pull images via managed identity |

No admin user is enabled.
No registry credentials are stored in Terraform.

---

## 🔑 Identity and Access Management

### Managed Identity Strategy

* AKS uses system-assigned managed identity
* Role assignments managed via Terraform:

  * `AcrPull` on ACR
  * Key Vault read access
  * Log Analytics permissions

This avoids secrets and aligns with Azure best practices.

---

## 🗝 Azure Key Vault

### Purpose

* Centralized infrastructure secret store

### Usage Model

* Key Vault is provisioned via Terraform
* Secrets may be added post-provisioning
* Applications consume secrets via Kubernetes Secrets

CSI driver integration is deferred for future enhancement.

---

## 🗄 Azure SQL Database

### Design

* Azure SQL Server with a single database
* Cost-optimized tier
* Public endpoint with firewall restrictions

Private endpoints are intentionally deferred.

---

## 🧺 Azure Storage Account (Blob)

### Purpose

* Application file storage
* Media uploads and exports

### Access Model

* Connection strings (current)
* Managed identity (future)

---

## 📊 Observability Integration

### Log Analytics Workspace

* Integrated with AKS
* Cluster and node monitoring
* Infrastructure diagnostics

Application metrics are handled separately via Prometheus and Grafana.

---

## 🧠 Design Philosophy

This Terraform architecture prioritizes:

* Clarity over abstraction
* Predictability over flexibility
* Cost awareness
* Production realism

Over-engineering is intentionally avoided.

---

## 🚀 Execution Strategy

1. Provision **Stage** infrastructure
2. Validate CI → GitOps → ArgoCD → AKS flow
3. Maintain **Prod** configuration parity
4. Avoid provisioning Prod to control cost

---

## 🏁 Final Notes

* Infrastructure is fully defined as code
* Clear separation of concerns is enforced
* GitOps-native application delivery is preserved
* Foundations are secure, minimal, and scalable

This directory defines the **authoritative Azure infrastructure model** for the Framely platform.

---
