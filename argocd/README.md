

---

# 📘 ArgoCD GitOps Setup – Framely Mega DevOps AKS Project

**(FINAL – Single Source of Truth)**

---

## 🎯 Purpose of This Module

This directory defines the **complete ArgoCD GitOps configuration** for the **Framely Mega DevOps AKS Project**.

It is responsible for:

* Declaring **what should be deployed**
* Defining **where it can be deployed**
* Enforcing **GitOps, security, and governance rules**
* Separating **deployment concerns from CI**

> **Important Principle**
> Jenkins builds & updates Git.
> ArgoCD deploys what Git declares.
> Kubernetes only runs what ArgoCD applies.

---

## 🧠 GitOps Model Used

This project follows **strict GitOps principles**:

* Git is the **single source of truth**
* No `kubectl apply` from CI
* No manual cluster changes
* ArgoCD continuously reconciles desired state

---

## 📂 Directory Structure

```text
argocd/
├── README.md                 # This documentation
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

## 📦 ArgoCD Project – `framely-project.yaml`

### Purpose

The ArgoCD Project defines a **security and governance boundary** for all Framely applications.

It controls:

* Which Git repositories ArgoCD is allowed to read
* Which Kubernetes namespaces applications can deploy to
* Which cluster-scoped and namespace-scoped resources are allowed

### Why This Matters

* Prevents accidental deployments to wrong namespaces
* Prevents usage of unauthorized Git repositories
* Mirrors **real enterprise GitOps governance**

> Think of ArgoCD Projects as **GitOps firewalls**.

---

## 🚀 ArgoCD Applications

### 1️⃣ Stage Application – `framely-stage.yaml`

**Environment:** Stage / Pre-Production

**Behavior:**

* Watches Git path: `kubernetes/stage`
* Tracks branch: `stage`
* Auto-sync: ✅ Enabled
* Self-heal: ✅ Enabled
* Prune: ✅ Enabled

**Why Auto-Sync?**

Stage is used for:

* Fast feedback
* Continuous Deployment
* End-to-end validation

Any GitOps commit from Jenkins is **automatically deployed**.

---

### 2️⃣ Production Application – `framely-prod.yaml`

**Environment:** Production (AKS)

**Behavior:**

* Watches Git path: `kubernetes/prod`
* Tracks branch: `prod`
* Auto-sync: ❌ Disabled
* Manual sync required

**Why Manual Sync?**

Production requires:

* Explicit human approval
* Change control
* Auditability

This aligns with **enterprise Continuous Delivery**, not Continuous Deployment.

---

## 🔁 Interaction with Jenkins (CI/CD)

| Responsibility            | Tool    |
| ------------------------- | ------- |
| Build & test applications | Jenkins |
| Security scanning (Trivy) | Jenkins |
| Build & push images       | Jenkins |
| Update image tags         | Jenkins |
| Apply manifests           | ArgoCD  |

> Jenkins **never touches Kubernetes directly**
> ArgoCD **never builds images**

---

## 🔐 Git Repository Access Strategy (IMPORTANT)

### 🔹 Repository Type

This is a **personal DevOps project**.
The Git repository is **personal (not an org repo)** and may be **public or private**.

---

### 🔹 SSH-Based Git Access (Current Setup)

ArgoCD is configured to access Git using **SSH**:

```yaml
repoURL: git@github.com:MrSharma151/framely-aks-mega-devops.git
```

#### Why SSH Was Chosen

* Avoids GitHub API rate-limit issues
* More stable for CI/CD & GitOps
* Common in enterprise environments

#### Mandatory Requirements for SSH Access

If using SSH-based access:

1. **Private SSH key must exist** on the machine where ArgoCD is running
   (KIND node or AKS control plane node)
2. **Public SSH key must be added** to the GitHub repository
   (Deploy Key or personal SSH key)
3. ArgoCD must be able to read the key

If SSH is not configured correctly → **ArgoCD will NOT sync**

---

### 🔹 HTTPS-Based Git Access (Alternative)

If you want to avoid SSH keys entirely:

* You can switch `repoURL` to HTTPS
* Fork this repository
* Use public access or GitHub token authentication

Example:

```yaml
repoURL: https://github.com/<your-username>/framely-aks-mega-devops.git
```

✅ No SSH key required
✅ Easier for beginners
❌ May hit GitHub API limits in heavy usage

Both approaches are **fully supported**.

---

## ☁️ Local (KIND) → AKS Migration Safety

| Aspect         | Local (KIND) | AKS  |
| -------------- | ------------ | ---- |
| ArgoCD YAML    | Same         | Same |
| Project config | Same         | Same |
| Applications   | Same         | Same |
| GitOps flow    | Same         | Same |

👉 **Only the Kubernetes cluster changes**
No ArgoCD refactor required.

---

## 🔐 Security & DevSecOps Alignment

* CI enforces:

  * Tests
  * Dependency scanning
  * Trivy image vulnerability scanning
* GitOps ensures:

  * Only reviewed Git state is deployed
* Production adds:

  * Manual approval
  * Manual ArgoCD sync

This provides **defense in depth**.

---

## ✅ Module Status

* ArgoCD Project: ✅ Locked
* Stage Application: ✅ Locked
* Prod Application: ✅ Locked
* GitOps flow: ✅ Verified
* AKS readiness: ✅ Complete

---

## 🏁 Final Statement

This ArgoCD module is:

* Production-grade
* GitOps-pure
* Security-aware
* AKS-ready

It reflects **how real DevOps teams deploy at scale**, not demo pipelines.

---


