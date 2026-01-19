

---

# 📘 Jenkins CI/CD Setup – Framely Mega DevOps AKS Project

This document explains the **Jenkins CI/CD architecture**, **directory structure**, **pipeline design**, and **required setup** for the Framely Mega DevOps AKS Project.

It covers:

* Jenkins directory structure
* CI & GitOps pipeline design
* Required tools & plugins
* Credentials management (GitHub, Docker Hub, ACR later)
* Multibranch Pipeline job configuration
* Local Jenkins vs Azure VM Jenkins (future)

---

## 🎯 Purpose of Jenkins in Framely

Jenkins is responsible for **CI and GitOps only**.

### Jenkins DOES:

* Run unit & integration tests
* Run security & quality scans
* Build Docker images
* Push images to container registry
* Update Kubernetes manifests (GitOps)

### Jenkins DOES NOT:

* Deploy to Kubernetes
* Run `kubectl apply`
* Control ArgoCD sync

> **Golden Rule**
> 👉 *Jenkins updates Git. ArgoCD applies Git.*

---

## 📂 Jenkins Directory Structure

```
jenkins/
├── README.md                # This document
│
├── config/                  # Declarative pipeline configuration
│   ├── apps.yaml            # Applications, paths, test & scan commands
│   ├── images.yaml          # Logical Docker image names
│   └── registries.yaml      # Registry config per environment
│
├── pipelines/               # Branch-specific pipeline logic
│   ├── ci-main.groovy       # CI validation (no side effects)
│   ├── ci-stage.groovy      # CI + GitOps (auto deploy)
│   ├── ci-prod.groovy       # CI + manual approval (future)
│   └── terraform.groovy    # Infra pipeline (future)
│
└── shared/                  # Reusable pipeline building blocks
    ├── tests.groovy         # Test execution logic
    ├── security.groovy      # Security & quality scans
    ├── docker.groovy        # Docker build & push logic
    ├── gitops.groovy        # GitOps image update logic
    └── utils.groovy         # Helper utilities
```

---

## 📄 Jenkinsfile (Root of Repository)

The **`Jenkinsfile` lives in the repository root** and acts as the **single entry point** for all pipelines.

Responsibilities:

* Validate branch
* Load configuration (`apps.yaml`, `images.yaml`, `registries.yaml`)
* Route execution to correct pipeline based on branch

### Branch → Pipeline Mapping

| Branch  | Pipeline File     | Behavior             |
| ------- | ----------------- | -------------------- |
| `main`  | `ci-main.groovy`  | CI validation only   |
| `stage` | `ci-stage.groovy` | CI + GitOps (auto)   |
| `prod`  | `ci-prod.groovy`  | CI + manual approval |

---

## 🧠 Pipeline Design Philosophy

### 1️⃣ `ci-main` (Validation Only)

* Run tests
* Run security scans
* Build Docker images (no push)

❌ No registry push
❌ No GitOps update

> Used for fast feedback & PR validation.

---

### 2️⃣ `ci-stage` (Continuous Deployment)

* Run tests
* Run security scans
* Build & push Docker images
* Update Kubernetes manifests via GitOps
* ArgoCD auto-syncs changes

✅ Fully automated
✅ No manual approval

---

### 3️⃣ `ci-prod` (Future – Controlled Release)

* Same as stage
* Manual approval gate
* Production-safe releases

---

## 🧰 Required Global Tools (CRITICAL)

> ⚠️ Jenkins runs as a **system user (`jenkins`)**
> Any tool used in pipelines **must be installed globally** and accessible via `PATH`.

### Mandatory Tools

| Tool               | Purpose                           |
| ------------------ | --------------------------------- |
| Docker             | Build & push images               |
| Git                | Source control                    |
| .NET SDK 9.x       | Backend build & tests             |
| Node.js 20.x + npm | Frontend build & tests            |
| Kustomize          | GitOps manifest updates           |
| Helm               | Platform tooling                  |
| kubectl            | Cluster interaction (ArgoCD only) |

### Verify Jenkins User Access

```bash
sudo -u jenkins docker ps
sudo -u jenkins dotnet --version
sudo -u jenkins node --version
sudo -u jenkins npm --version
sudo -u jenkins kustomize version
```

> ❌ If any command fails → pipelines WILL fail.

---

## 🔌 Required Jenkins Plugins

The following plugins are **mandatory** for this project:

### Core Pipeline Plugins

* Pipeline
* Pipeline: Groovy
* Pipeline: Multibranch
* Pipeline Utility Steps (`readYaml`)
* Workspace Cleanup

### SCM & GitHub

* Git
* GitHub Branch Source
* GitHub API Plugin

### UX & Logs

* ANSI Color
* Timestamper

### Credentials

* Credentials
* Credentials Binding

---

## 🔐 Jenkins Credentials Setup

### 1️⃣ GitHub Personal Access Token (PAT)

Used for:

* Repository checkout
* GitOps commits & pushes

**Type:** Username with password

* Username: GitHub username
* Password: GitHub PAT

**Credential ID:**

```
github-pat
```

Required permissions:

* `repo`
* `workflow`

---

### 2️⃣ Docker Hub Credentials (Local / Stage)

Used for:

* Pushing Docker images during local testing

**Credential ID example:**

```
dockerhub-creds
```

> 🔁 **Later (AKS migration)**
> Docker Hub will be replaced with **Azure Container Registry (ACR)**
> Jenkins will run on **Azure VM**, using ACR credentials.

---

## 🌿 Multibranch Pipeline Job Setup (IMPORTANT)

You must create a **Multibranch Pipeline Job** in Jenkins.

### Steps:

1. **New Item**
2. Select **Multibranch Pipeline**
3. Configure:

   * Repository URL (GitHub)
   * GitHub credentials (`github-pat`)
   * Script Path: `Jenkinsfile`
4. Branch discovery:

   * Discover branches
   * Discover PRs (optional)
5. Disable periodic scan (local setup)

   * Use **manual builds** or **webhooks later**

> 🔔 In production (GitHub Webhooks enabled),
> Jenkins will trigger builds **only on real code changes**.

---

## 🔁 Infinite Loop Prevention (GitOps)

* GitOps commits use:

  ```
  gitops(stage): update image [skip ci]
  ```
* Jenkins is configured to **ignore GitOps-only commits**
* Periodic repository scanning is disabled in local setup

> ✅ This problem disappears completely once **GitHub Webhooks** are enabled.

---

## ☁️ Local Jenkins vs Azure VM Jenkins

| Aspect     | Local Setup | Azure Setup |
| ---------- | ----------- | ----------- |
| Jenkins    | Local host  | Azure VM    |
| Registry   | Docker Hub  | Azure ACR   |
| Kubernetes | KIND        | AKS         |
| GitOps     | Same        | Same        |
| Pipelines  | Same        | Same        |

👉 **Only infrastructure changes. CI/CD design stays identical.**

---

## ✅ Current Status

* Jenkins directory: ✅ Stable
* `ci-main` pipeline: ✅ Stable
* `ci-stage` pipeline: ✅ Stable
* GitOps flow: ✅ Working
* ArgoCD auto-sync: ✅ Working

---

## 💡 Final Notes

* Jenkins is **stateless**
* Pipelines are **config-driven**
* Git is the **single source of truth**
* ArgoCD is the **only deployment engine**

This Jenkins setup follows **real-world DevOps standards** used in production systems.

---

