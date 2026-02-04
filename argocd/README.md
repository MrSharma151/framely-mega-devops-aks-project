

---

# 📘 ArgoCD GitOps Configuration

## Framely – Mega DevOps AKS Project


![Apps Overview](../diagrams/screenshots/framely-sg-argocd.png)

## 🎯 Module Purpose

This directory contains the **complete ArgoCD GitOps configuration** for the Framely platform.

It defines:

* **What** workloads are deployed
* **Where** workloads are permitted to deploy
* **How** deployments are controlled and reconciled
* **Which** Git repositories and Kubernetes resources are allowed

This module enforces a **strict separation between CI and CD**.

> Jenkins builds artifacts and updates Git.
> ArgoCD deploys the declared state from Git.
> Kubernetes runs **only** what ArgoCD applies.

---

## 🧠 GitOps Model

The project follows **strict GitOps principles**:

* Git is the **single source of truth**
* No direct `kubectl apply` from CI systems
* No manual changes inside the cluster
* ArgoCD continuously reconciles desired state

All Kubernetes workloads are deployed **exclusively through ArgoCD**.

---

## 📂 Directory Structure

```text
argocd/
├── README.md                 # Module documentation
│
├── projects/
│   └── framely-project.yaml  # ArgoCD Project (security boundary)
│
├── applications/
│   ├── stage/
│   │   └── framely-stage.yaml
│   └── prod/
│       └── framely-prod.yaml
```

---

## 📦 ArgoCD Project

### `framely-project.yaml`

### Purpose

The ArgoCD Project defines a **security and governance boundary** for all Framely deployments.

It restricts:

* Allowed Git repositories
* Allowed Kubernetes namespaces
* Allowed resource types (namespaced and cluster-scoped)

### Rationale

* Prevents accidental deployment to unauthorized namespaces
* Prevents usage of unapproved Git repositories
* Enforces strict environment isolation

ArgoCD Projects act as **policy enforcement units** within the GitOps model.

---

## 🚀 ArgoCD Applications

### Stage Application

`framely-stage.yaml`

**Environment:** Stage

**Configuration**

* Git path: `kubernetes/stage`
* Git branch: `stage`
* Sync policy:

  * Auto-sync: Enabled
  * Self-heal: Enabled
  * Prune: Enabled

### Behavior

All Git changes merged into the `stage` branch are **automatically deployed**.

This environment is used for:

* Continuous deployment
* Integration validation
* End-to-end testing

---

### Production Application

`framely-prod.yaml`

**Environment:** Production

**Configuration**

* Git path: `kubernetes/prod`
* Git branch: `prod`
* Sync policy:

  * Auto-sync: Disabled
  * Manual synchronization required

### Behavior

Deployments require **explicit manual synchronization**.

This ensures:

* Change control
* Human approval
* Deployment auditability

---

## 🔁 CI/CD Responsibility Split

| Responsibility            | Tool    |
| ------------------------- | ------- |
| Build and test            | Jenkins |
| Security scanning (Trivy) | Jenkins |
| Image build and push      | Jenkins |
| GitOps manifest updates   | Jenkins |
| Kubernetes deployment     | ArgoCD  |

Jenkins **never interacts with Kubernetes directly**.
ArgoCD **never builds or mutates artifacts**.

---

## 🔐 Git Repository Access

### Repository Context

This project uses a **single Git repository** as the GitOps source of truth.
The repository may be public or private.

---

### SSH-Based Git Access (Primary)

ArgoCD is configured to access Git via **SSH**:

```yaml
repoURL: git@github.com:MrSharma151/framely-aks-mega-devops.git
```

#### Requirements

For SSH-based access:

1. A private SSH key must be available to ArgoCD
2. The corresponding public key must be added to GitHub
3. ArgoCD must be able to read the key at runtime

If SSH authentication fails, **ArgoCD synchronization will fail**.

---

### HTTPS-Based Git Access (Alternative)

HTTPS access is also supported:

```yaml
repoURL: https://github.com/<your-username>/framely-aks-mega-devops.git
```

Characteristics:

* No SSH key management
* Simpler initial setup
* May require GitHub tokens for private repositories

Both access methods are supported by ArgoCD.

---

## ☁️ Environment Compatibility

| Aspect           | Local (KIND) | AKS  |
| ---------------- | ------------ | ---- |
| ArgoCD Project   | Same         | Same |
| Applications     | Same         | Same |
| GitOps workflow  | Same         | Same |
| YAML definitions | Same         | Same |

The deployment model is **cluster-agnostic**.
Only the Kubernetes cluster endpoint changes.

---

## 🔐 Security and Governance Alignment

* **CI enforces**

  * Automated tests
  * Dependency checks
  * Container image vulnerability scanning
* **GitOps ensures**

  * Only reviewed Git state is deployed
* **Production adds**

  * Manual deployment control
  * Explicit synchronization

This provides **layered control** across the delivery lifecycle.

---

## 📌 Usage Rules (Non-Negotiable)

* Do not apply application manifests manually
* Do not mutate cluster state outside Git
* All deployments must flow through ArgoCD
* All changes must originate from Git commits

---

## 🏁 Final Notes

* This module is **production-ready**
* GitOps behavior is **fully deterministic**
* Environment separation is **strictly enforced**
* Actively used with AKS clusters

This directory defines the **authoritative deployment model** for the Framely platform.

---

