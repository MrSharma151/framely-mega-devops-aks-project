

---

# 📘 Jenkins CI/CD Setup – Framely Mega DevOps AKS Project

This document describes the **Jenkins CI/CD architecture**, **directory structure**, **pipeline strategy**, and **required setup** for the **Framely Mega DevOps AKS Project**.

It covers:

* Jenkins directory layout
* CI and GitOps pipeline design
* Required tools and plugins
* Credentials management (GitHub, Docker Hub → Azure ACR later)
* Multibranch Pipeline job configuration
* Local Jenkins vs Azure VM–based Jenkins

---

## 🎯 Role of Jenkins in Framely

In the Framely platform, Jenkins is used **strictly for CI and GitOps orchestration**.

### ✅ Jenkins Responsibilities

* Execute unit and integration tests
* Run security and quality scans
* Build Docker images
* Push images to a container registry
* Update Kubernetes manifests **via GitOps commits**

### ❌ What Jenkins Does NOT Do

* Deploy workloads to Kubernetes
* Run `kubectl apply`
* Trigger or control ArgoCD synchronization

> **Golden Rule**
> 👉 *Jenkins updates Git. ArgoCD applies Git.*

---

## 📂 Jenkins Directory Structure

```
jenkins/
├── README.md                # This documentation
│
├── config/                  # Declarative pipeline configuration
│   ├── apps.yaml            # App definitions, paths, tests & scan commands
│   ├── images.yaml          # Logical Docker image naming
│   └── registries.yaml      # Registry configuration per environment
│
├── pipelines/               # Branch-specific pipeline logic
│   ├── ci-main.groovy       # CI validation only (no side effects)
│   ├── ci-stage.groovy      # CI + GitOps (auto deployment)
│   ├── ci-prod.groovy       # CI + manual approval (production release)
│   └── terraform.groovy     # Infrastructure pipeline (future)
│
└── shared/                  # Reusable pipeline building blocks
    ├── tests.groovy         # Test execution logic
    ├── security.groovy      # Security & quality scans
    ├── docker.groovy        # Docker build & push logic
    └── gitops.groovy        # GitOps image update logic
```

> 🧹 **Note**
> Unused helper libraries have been intentionally removed to keep the CI codebase minimal, explicit, and maintainable.

---

## 📄 Jenkinsfile (Repository Root)

The **`Jenkinsfile` resides at the repository root** and acts as the **single entry point** for all Jenkins pipelines.

### Responsibilities

* Validate branch context
* Prevent GitOps-triggered CI loops
* Load configuration files (`apps.yaml`, `images.yaml`, `registries.yaml`)
* Route execution to the correct pipeline based on branch

### Branch → Pipeline Mapping

| Branch  | Pipeline File     | Behavior                |
| ------- | ----------------- | ----------------------- |
| `main`  | `ci-main.groovy`  | CI validation only      |
| `stage` | `ci-stage.groovy` | CI + GitOps (automatic) |
| `prod`  | `ci-prod.groovy`  | CI + manual approval    |

---

## 🧠 Pipeline Design Philosophy

### 1️⃣ `ci-main` — Validation Only

* Run tests
* Run security scans (report-only)
* Build Docker images (verification only)

❌ No image push
❌ No GitOps updates

> Designed for fast feedback and safe integration checks.

---

### 2️⃣ `ci-stage` — Continuous Deployment via GitOps

* Run tests
* Enforce security and quality scans
* Build and push Docker images
* Update GitOps manifests (image tags only)
* ArgoCD **automatically syncs** to the STAGE environment

✅ Fully automated
✅ No manual intervention

---

### 3️⃣ `ci-prod` — Controlled Production Release

* Same steps as `ci-stage`
* Manual approval gate **before GitOps update**
* ArgoCD synchronization is **manual in PROD**

✅ Production-safe
✅ Change-controlled deployment

---

## 🧰 Required Global Tools (CRITICAL)

> ⚠️ Jenkins runs as the **`jenkins` system user**
> All tools must be available in the global `PATH`.

### Mandatory Tools

| Tool               | Purpose                       |
| ------------------ | ----------------------------- |
| Docker             | Build and push images         |
| Git                | Source control                |
| .NET SDK 9.x       | Backend build and tests       |
| Node.js 20.x + npm | Frontend build and tests      |
| Kustomize          | GitOps manifest updates       |
| Helm               | Platform tooling (outside CI) |

### Verify Jenkins User Access

```bash
sudo -u jenkins docker ps
sudo -u jenkins dotnet --version
sudo -u jenkins node --version
sudo -u jenkins npm --version
sudo -u jenkins kustomize version
```

---

## 🔌 Required Jenkins Plugins

### Core Pipeline

* Pipeline
* Pipeline: Groovy
* Pipeline: Multibranch
* Pipeline Utility Steps (`readYaml`)
* Workspace Cleanup

### SCM & GitHub

* Git
* GitHub Branch Source
* GitHub API Plugin

### UX & Logging

* ANSI Color
* Timestamper

### Credentials

* Credentials
* Credentials Binding

---

## 🔐 Jenkins Credentials Configuration

### 1️⃣ GitHub Personal Access Token (PAT)

Used for:

* Repository checkout
* GitOps commits and pushes

**Credential ID**

```
github-pat
```

Required scopes:

* `repo`
* `workflow`

---

### 2️⃣ Docker Hub Credentials (Current)

Used for:

* Pushing Docker images during local and stage pipelines

**Credential ID**

```
dockerhub-creds
```

---

### 🔁 Future Migration: Azure Container Registry (ACR)

* Docker Hub will be replaced by **Azure ACR**
* Jenkins will run on an **Azure VM**
* **Only `registries.yaml` will change**
* Pipelines and shared libraries remain unchanged

---

## 🌿 Multibranch Pipeline Job Configuration

Create a **Multibranch Pipeline Job** in Jenkins.

### Steps

1. New Item → Multibranch Pipeline
2. Configure the GitHub repository
3. Select credentials (`github-pat`)
4. Script Path: `Jenkinsfile`
5. Enable branch discovery
6. Disable periodic scans (local setup)

> With GitHub webhooks enabled, builds trigger only on real code changes.

---

## 🔁 GitOps Infinite Loop Prevention

* GitOps commits include `[skip ci]`
* Jenkins ignores CI execution for GitOps-only commits
* Prevents self-triggered build loops

---

## ☁️ Local Jenkins vs Azure Jenkins (AKS)

| Aspect     | Local Setup | Azure Setup |
| ---------- | ----------- | ----------- |
| Jenkins    | Local host  | Azure VM    |
| Registry   | Docker Hub  | Azure ACR   |
| Kubernetes | KIND        | AKS         |
| GitOps     | Same        | Same        |
| Pipelines  | Same        | Same        |

👉 **Only infrastructure changes — the CI/CD design remains identical.**

---

## ✅ Current Status

* Jenkins pipelines: ✅ Stable
* GitOps workflow: ✅ Stable
* ArgoCD integration: ✅ Stable
* AKS readiness: ✅ Complete

---

## 💡 Key Takeaways

* Jenkins is **stateless**
* Pipelines are **configuration-driven**
* Git is the **single source of truth**
* ArgoCD is the **only deployment engine**

This Jenkins setup reflects **real-world, production-grade DevOps practices**.

---
