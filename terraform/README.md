

---

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

![rg-framely-stage](../diagrams/screenshots/rg-framely-stage.png)

---

### ❌ Out of Scope

Terraform explicitly does **not**:

* Deploy application workloads
* Apply Kubernetes manifests
* Install Helm charts
* Configure or manage ArgoCD
* Configure Jenkins (handled via Ansible)
* Provision Kubernetes `Service`-level resources (e.g., LoadBalancers)

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
│   │   ├── backend.tf
│   │   ├── providers.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── main.tf
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

---

## 🔁 Environment Provisioning Status (Clarification)

At the current stage of this project, **only the `stage` environment infrastructure is provisioned on Azure**.

The `prod` Terraform configuration is:

* Fully defined
* Structurally identical to `stage`
* Intentionally **not applied**

### Rationale

This was a **deliberate, cost-aware decision**:

* `stage` and `prod` environments share the same:

  * Architecture
  * Terraform modules
  * AKS configuration
  * CI/CD and GitOps workflows
* Provisioning a second AKS cluster would **double cloud cost** without providing additional learning or validation value

For this reason, **all infrastructure validation and platform testing was performed using the `stage` environment only**.

### Important Note

Provisioning production would require **only running `terraform apply`** for the `prod` environment.

No module changes, architectural refactoring, or CI/CD updates would be required.

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

## 🌐 Load Balancer Responsibility (Important Clarification)

Azure Load Balancers are **not provisioned by Terraform** in this project.

They are **automatically created and managed by Azure** when:

* An ingress-nginx `Service` of type `LoadBalancer` is applied
* The manifest is deployed by **ArgoCD**

Terraform’s responsibility ends at **AKS cluster provisioning**.
Service-level networking resources are owned by Kubernetes and Azure’s AKS integration.

This aligns with standard AKS operational behavior.

![rg-loadbalancer](../diagrams/screenshots/MC-rg-framely-stage.png)

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

Jenkins does **not** deploy workloads or interact directly with AKS.

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

* AKS uses system-assigned managed identity
* Role assignments managed via Terraform:

  * `AcrPull` on ACR
  * Key Vault read access
  * Log Analytics permissions

This avoids secrets and aligns with Azure best practices.

---

## 📊 Observability Integration

* Log Analytics Workspace provisioned via Terraform
* Integrated with AKS for:

  * Cluster health
  * Node monitoring
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

## 🏁 Final Notes

* Infrastructure is fully defined as code (**stage applied, prod defined**)
* Responsibility boundaries are explicit
* AKS-native behavior is respected
* GitOps delivery remains clean and deterministic

This directory defines the **authoritative Azure infrastructure model** for the Framely platform.

---


