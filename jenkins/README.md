

---

# 📘 Jenkins CI/CD Setup – Framely Mega DevOps AKS Project

**(FINAL – Single Source of Truth)**

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

```text
jenkins/
├── README.md                # This documentation (single source of truth)
│
├── config/                  # Declarative pipeline configuration
│   ├── apps.yaml            # Application contracts & capabilities
│   ├── images.yaml          # Logical Docker image names
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
> Only actively used shared libraries are kept.
> This keeps the CI codebase minimal, explicit, and interview-explainable.

---

## 📄 Jenkinsfile (Repository Root)

The **`Jenkinsfile` resides at the repository root** and acts as the **single entry point** for all Jenkins pipelines.

### Responsibilities

* Validate branch context
* Prevent GitOps-triggered CI loops (`[skip ci]`)
* Load configuration files:

  * `apps.yaml`
  * `images.yaml`
  * `registries.yaml`
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

Purpose: **Fast feedback without side effects**

* Run tests
* Run security scans (report-only)
* Build Docker images (verification only)

❌ No image push
❌ No GitOps updates

---

### 2️⃣ `ci-stage` — Continuous Deployment via GitOps

Purpose: **Pre-production automation**

* Run tests
* Enforce security and quality scans
* Build and push Docker images
* Update GitOps manifests (image tags only)
* ArgoCD **automatically syncs** to STAGE

---

### 3️⃣ `ci-prod` — Controlled Production Release

Purpose: **Safe, audited releases**

* Same steps as `ci-stage`
* Manual approval gate **before GitOps update**
* ArgoCD synchronization is **manual in PROD**

---

## 🌐 Frontend Build-Time Environment Handling (CRITICAL)

### Background

Both frontend applications (Customer & Admin) are **Next.js** apps.

* They rely on **build-time environment variables**
* All `NEXT_PUBLIC_*` variables are baked into the Docker image
* Any environment change **requires a new image build**

---

### apps.yaml Contract (Environment-Agnostic)

In `apps.yaml`, frontend apps define placeholders:

```yaml
buildArgs:
  NEXT_PUBLIC_API_BASE_URL: __API_BASE_URL__
```

**Important rules:**

* `apps.yaml` defines **what variables are required**
* It does **NOT** define environment-specific values
* This avoids config drift and branching complexity

---

### Environment Resolution in Pipelines

Environment-specific values are injected in pipelines:

| Pipeline   | Resolution Strategy                               |
| ---------- | ------------------------------------------------- |
| `ci-main`  | Placeholders allowed (verification only)          |
| `ci-stage` | `__API_BASE_URL__` resolved to stage API URL      |
| `ci-prod`  | `__API_BASE_URL__` resolved to production API URL |

This ensures:

* Clean, immutable app definitions
* Environment binding at CI/CD layer
* Safe AKS migration later

> **Design Principle**
> 👉 *apps.yaml defines contracts, pipelines bind environments*

---

## 🐳 Docker Image Metadata Contract (IMPORTANT)

The CI system enforces a strict separation:

```text
Image Name → docker.io/mrsharma151/framely-backend
Image Tag  → 0.1.0-<git-sha>
```

### Why this matters

* Kustomize expects:

  * `name` (without tag)
  * `newTag` (tag only)
* Prevents `tag:tag` duplication
* Enables clean GitOps updates

This contract is enforced in `docker.groovy`.

---

## 🔁 GitOps & Kustomize Image Updates

Jenkins updates images using:

```bash
kustomize edit set image <image-name>=<image-name>:<tag>
```

### Rules

* **LEFT side** must exactly match the image in `Deployment.yaml`
* **RIGHT side** contains the updated tag
* If names do not match → Kustomize appends (undesired)

The current setup guarantees:

* Images are **overwritten**, never appended
* `kustomization.yaml` stays clean and stable

---

## 🧰 Required Global Tools (CRITICAL)

> Jenkins runs as the **`jenkins` system user**
> All tools must be available globally via `PATH`

| Tool               | Purpose                       |
| ------------------ | ----------------------------- |
| Docker             | Build and push images         |
| Git                | Source control                |
| .NET SDK 9.x       | Backend build and tests       |
| Node.js 20.x + npm | Frontend build and tests      |
| Kustomize          | GitOps manifest updates       |
| Helm               | Platform tooling (outside CI) |

---

## 🔐 Credentials Summary

| Credential        | Purpose                     |
| ----------------- | --------------------------- |
| `github-pat`      | Checkout + GitOps commits   |
| `dockerhub-creds` | Docker image push (current) |
| `acr-*`           | Future AKS migration        |

---

## ☁️ Local → AKS Migration Safety

| Aspect     | Local      | AKS       |
| ---------- | ---------- | --------- |
| Jenkins    | Local      | Azure VM  |
| Registry   | Docker Hub | Azure ACR |
| Kubernetes | KIND       | AKS       |
| GitOps     | Same       | Same      |
| Pipelines  | Same       | Same      |

👉 **Only infrastructure changes — CI/CD logic remains untouched.**

---

## ✅ Final Status

* Jenkins pipelines: ✅ Stable
* GitOps flow: ✅ Clean & deterministic
* ArgoCD integration: ✅ Verified
* AKS readiness: ✅ Complete

---

## 💡 Key Takeaways

* Jenkins is **stateless**
* Pipelines are **configuration-driven**
* Git is the **single source of truth**
* ArgoCD is the **only deployment engine**
* Environment binding happens **at pipeline level**

---

### 🏁 Final Note

This Jenkins setup mirrors **real-world, production-grade DevOps systems** and is **fully-understandable** end-to-end.

---


