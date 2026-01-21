

---

# 📘 Jenkins CI/CD Setup – Framely Mega DevOps AKS Project

**(FINAL – Single Source of Truth)**

---

## 🎯 Role of Jenkins in Framely

In the Framely platform, Jenkins is used **strictly for CI and GitOps orchestration**, with **built-in DevSecOps controls**.

### ✅ Jenkins Responsibilities

* Execute unit and integration tests
* Run application and container security scans
* Build Docker images
* Push images to a container registry
* Update Kubernetes manifests **via GitOps commits**

### ❌ What Jenkins Does NOT Do

* Deploy workloads to Kubernetes
* Run `kubectl apply`
* Control or auto-trigger ArgoCD synchronization

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
└── shared/                  # Reusable CI/CD building blocks
    ├── tests.groovy         # Test execution logic
    ├── security.groovy      # Dependency & code security scans
    ├── docker.groovy        # Docker build & push logic
    ├── trivy.groovy         # Container image vulnerability scanning
    └── gitops.groovy        # GitOps image update logic
```

> 🧹 **Design Choice**
> Only actively used shared libraries are kept.
> This keeps the CI system **explicit, auditable, and devops-friendly**.

---

## 📄 Jenkinsfile (Repository Root)

The **`Jenkinsfile` at repository root** acts as the **single entry point** for all pipelines.

### Responsibilities

* Detect branch context (multibranch pipeline)
* Prevent GitOps-triggered CI loops (`[skip ci]`)
* Load configuration files:

  * `apps.yaml`
  * `images.yaml`
  * `registries.yaml`
* Route execution to the correct pipeline

### Branch → Pipeline Mapping

| Branch  | Pipeline File     | Purpose                         |
| ------- | ----------------- | ------------------------------- |
| `main`  | `ci-main.groovy`  | Validation & feedback           |
| `stage` | `ci-stage.groovy` | Automated pre-production deploy |
| `prod`  | `ci-prod.groovy`  | Controlled production release   |

---

## 🧠 Pipeline Design Philosophy (DevSecOps-First)

This Jenkins setup follows **shift-left security**, enforced progressively per environment.

---

### 1️⃣ `ci-main` — Validation & Feedback Loop

Purpose: **Fast feedback without blocking developers**

**Stages**

* Tests
* Dependency security scans
* Docker build verification
* Trivy image scan (**report-only**)

**Security Behavior**

* Vulnerabilities are **reported**
* Pipeline **does NOT fail**
* Issues must be fixed before promotion

❌ No image push
❌ No GitOps updates

---

### 2️⃣ `ci-stage` — Secure Continuous Delivery

Purpose: **Pre-production enforcement**

**Stages**

* Tests
* Dependency security scans
* Docker build & push
* Trivy image scan (**enforced**)
* GitOps image update

**Security Policy**

* CRITICAL & HIGH vulnerabilities are **reported**
* Pipeline **does NOT fail**
* Acts as a security visibility gate

ArgoCD **auto-syncs** changes to STAGE.

---

### 3️⃣ `ci-prod` — Controlled & Audited Release

Purpose: **Production safety**

**Stages**

* Tests
* Security scans
* Docker build & push
* Trivy scan (**STRICT enforcement**)
* Manual approval gate
* GitOps image update

**Security Policy**

* ❌ Pipeline FAILS on **CRITICAL vulnerabilities**
* HIGH vulnerabilities are allowed but visible
* ArgoCD sync is **manual**

> **DevSecOps Principle**
> 👉 *Security is progressive, not binary.*

---

## 🔐 DevSecOps with Trivy (Container Security)

### Why Trivy?

* Lightweight & fast
* No SaaS dependency
* Industry-standard for container security
* Perfect fit for GitOps + AKS

### What is Scanned?

* OS-level packages
* Language dependencies
* Known CVEs from upstream sources

### Enforcement Matrix

| Environment | Scan Mode     | Pipeline Fails On |
| ----------- | ------------- | ----------------- |
| `main`      | Report only   | ❌ Never           |
| `stage`     | Enforced view | ❌ Never           |
| `prod`      | Strict gate   | ✅ CRITICAL only   |

> Jenkins **never fixes vulnerabilities** —
> it **reports, enforces, and protects environments**.

---

## 🌐 Frontend Build-Time Environment Handling (CRITICAL)

### Background

Both frontend apps are **Next.js** applications.

* `NEXT_PUBLIC_*` variables are **baked at build time**
* Environment changes require **new image builds**

---

### apps.yaml Contract (Environment-Agnostic)

```yaml
buildArgs:
  NEXT_PUBLIC_API_BASE_URL: __API_BASE_URL__
```

**Rules**

* `apps.yaml` defines **required variables**
* It does **not** define environment values
* Prevents config drift

---

### Environment Binding in Pipelines

| Pipeline   | Resolution                 |
| ---------- | -------------------------- |
| `ci-main`  | Placeholder allowed        |
| `ci-stage` | Injects stage API URL      |
| `ci-prod`  | Injects production API URL |

> **Design Principle**
> 👉 *apps.yaml defines contracts, pipelines bind environments*

---

## 🐳 Docker Image Metadata Contract

```text
Image Name → docker.io/mrsharma151/framely-backend
Image Tag  → 0.1.0-<git-sha>
```

**Why**

* Prevents tag duplication (`tag:tag`)
* Ensures Kustomize correctness
* Enables clean GitOps diffs

---

## 🔁 GitOps & Kustomize Safety

Jenkins updates images using:

```bash
kustomize edit set image <image>=<image>:<tag>
```

Rules:

* LEFT side must match Deployment image exactly
* Images are **overwritten**, never appended
* Prevents broken ArgoCD syncs

---

## 🧰 Required Global Tools

> Jenkins runs as **system user `jenkins`**

| Tool               | Purpose                      |
| ------------------ | ---------------------------- |
| Docker             | Image build & push           |
| Git                | SCM & GitOps                 |
| .NET SDK 9.x       | Backend tests                |
| Node.js 20.x + npm | Frontend builds              |
| Trivy              | Container vulnerability scan |
| Kustomize          | GitOps updates               |

---

## 🔐 Credentials Summary

| Credential        | Usage                     |
| ----------------- | ------------------------- |
| `github-pat`      | Checkout & GitOps commits |
| `dockerhub-creds` | Docker image push         |
| `acr-*`           | Future AKS migration      |

---

## ☁️ Local → AKS Migration Safety

| Aspect     | Local      | AKS       |
| ---------- | ---------- | --------- |
| Jenkins    | Local      | Azure VM  |
| Registry   | Docker Hub | Azure ACR |
| Kubernetes | KIND       | AKS       |
| GitOps     | Same       | Same      |
| Pipelines  | Same       | Same      |

👉 **Only infra changes — CI/CD logic stays identical**

---

## ✅ Final Status

* Multibranch CI/CD: ✅ Stable
* DevSecOps enforcement: ✅ Progressive & correct
* GitOps flow: ✅ Deterministic
* AKS readiness: ✅ Complete

---

## 💡 Final Takeaways 

* Jenkins is **stateless**
* Pipelines are **config-driven**
* Security is **shift-left & environment-aware**
* Git is the **single source of truth**
* ArgoCD is the **only deployment engine**

---

### 🏁 Final Note

This Jenkins setup demonstrates **real-world DevSecOps maturity**, not toy pipelines.
Every decision is **explainable, auditable, and production-aligned**.

---

