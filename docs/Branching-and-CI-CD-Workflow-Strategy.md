

---

# 📘 Branching & CI/CD Workflow Strategy

## Framely – Mega DevOps AKS Project

**(FINAL – Single Source of Truth)**

---

## 1️⃣ Overview

This document defines the **branching model**, **CI/CD workflow**, **GitOps execution**, and **DevSecOps enforcement strategy** used in the **Framely Mega DevOps AKS Project**.

This strategy is designed to:

* Maintain **high code quality and security**
* Provide **fast feedback** during development
* Enable **safe, automated pre-production deployments**
* Ensure **controlled, auditable production releases**
* Enforce **clear separation of concerns** between:

  * CI (Jenkins)
  * CD (ArgoCD)
  * Infrastructure (Terraform – future)

The design is inspired by **GitLab Flow**, **Trunk-Based Development**, and **GitOps + DevSecOps best practices**.

---

## 2️⃣ Branching Model

The project follows a **single-repository, multi-branch strategy** where **branches directly map to environments**.

### Permanent Branches (Environment-Aligned)

| Branch  | Purpose                               | Environment |
| ------- | ------------------------------------- | ----------- |
| `main`  | Design correctness & system contracts | None        |
| `stage` | Integration & validation              | Stage       |
| `prod`  | Stable, customer-facing releases      | Production  |

### Key Rules

* Only these three branches are **long-lived**
* **All deployments originate from Git**
* No direct Kubernetes or environment changes are allowed outside GitOps
* Jenkins may commit **execution-only changes** to `stage` and `prod`

---

## 3️⃣ High-Level Workflow

```
Feature / Fix
      ↓
main   → CI validation only
      ↓ Pull Request
stage  → CI + GitOps + auto deploy
      ↓ Approval
prod   → CI + GitOps + manual deploy
```

### Core Principle

> **Design flows downward, execution flows forward**

* `main` defines **what the system should be**
* `stage` validates **how it behaves**
* `prod` controls **when it is released**

---

## 4️⃣ `main` Branch – Source of Truth

### Purpose

* Represents the **desired system design**
* Contains reviewed, clean, and secure code
* Must always remain **buildable and trustworthy**

---

### CI Behavior (Automated)

* ✔ Unit & integration tests
* ✔ Dependency & security scanning (SAST + Trivy – report only)
* ✔ Docker image build (verification only)

---

### What Does NOT Happen

* ❌ No Docker image push
* ❌ No GitOps updates
* ❌ No ArgoCD interaction
* ❌ No infrastructure changes

---

### DevSecOps Policy (`main`)

* Trivy runs in **report-only mode**
* Vulnerabilities **do not fail the pipeline**
* Used strictly for **developer feedback**

> **`main` validates correctness, not execution**

---

## 5️⃣ `stage` Branch – Integration Environment

### Purpose

* First environment where **real execution happens**
* Closely mirrors production behavior
* Used for **end-to-end validation**

---

### CI Behavior (Automated)

* ✔ Full test suite
* ✔ Security scans (SAST + Trivy)
* ✔ Docker image build & tagging
* ✔ Image push to Stage registry (Docker Hub)
* ✔ GitOps manifest updates (image tags only)

---

### CD Behavior

* ✔ ArgoCD **auto-sync enabled**
* ✔ Automatic deployment to Stage cluster

---

### DevSecOps Policy (`stage`)

* Trivy scans **all built images**
* Vulnerabilities are **reported**
* Pipeline **does NOT fail**, even if HIGH vulnerabilities.

> This allows legacy apps to progress while maintaining visibility.

---

### Why This Matters

* Fast feedback loop
* Realistic environment testing
* Zero manual effort
* No unsafe production exposure

> **Stage follows Continuous Deployment**

---

## 6️⃣ `prod` Branch – Production Environment

### Purpose

* Represents the **live, customer-facing system**
* Highest standards for **stability, security, and auditability**

---

### CI Behavior (Automated)

* ✔ Same tests and scans as `stage`
* ✔ Docker image build & verification
* ✔ Trivy security scanning

---

### DevSecOps Policy (`prod`)

* ❌ Pipeline **FAILS on CRITICAL vulnerabilities**
* ✔ HIGH vulnerabilities are reported but tolerated
* Enforces **risk-based security gating**

> This reflects real-world enterprise DevSecOps behavior.

---

### CD Behavior (Controlled)

* ✔ Manual approval required **before GitOps update**
* ✔ ArgoCD sync is **manual**
* ✔ Full audit trail maintained

> **Production follows Continuous Delivery, not Continuous Deployment**

---

## 7️⃣ GitOps Execution Model

This project strictly follows **GitOps principles**.

### Non-Negotiable Rules

* Jenkins **never deploys** to Kubernetes
* Jenkins **only updates Git**
* ArgoCD is the **only deployment engine**

---

### Commit Types

| Commit Category               | Branch          |
| ----------------------------- | --------------- |
| Design & code changes         | `main`          |
| Execution (image tag updates) | `stage`, `prod` |

This explains why **CI-generated commits exist only in `stage` and `prod`**.

---

## 8️⃣ Terraform & Infrastructure Workflow (Future)

Infrastructure follows **stricter controls than applications**.

| Branch  | Terraform Behavior    |
| ------- | --------------------- |
| `main`  | `terraform plan` only |
| `stage` | `plan` + manual apply |
| `prod`  | `plan` + manual apply |

### Benefits

* Prevents accidental infra changes
* Clear separation between app lifecycle and infra lifecycle
* Production-safe governance model

---

## 9️⃣ Feature Branch Workflow

Feature branches are **short-lived** (single-developer setup).

### Example

```
feature/add-order-search
          ↓
        main
```

### Rules

* Branch from `main`
* CI runs automatically
* Merge via Pull Request
* Delete after merge

❌ Feature branches never deploy directly

---

## 🔟 Hotfix Strategy

### Option A – Preferred (Recommended)

```
hotfix/critical-fix
        ↓
main → stage → prod
```

* Fix validated properly
* Security scans enforced
* Production approval preserved

---

### Option B – Emergency Only (Rare)

```
hotfix/critical-fix
        ↓
      prod
        ↓
      main
```

Used **only** when:

* Immediate production fix is required
* Mandatory back-merge to `main` is performed

---

## 1️⃣1️⃣ Why This Strategy Works

* ✔ Mirrors real enterprise CI/CD setups
* ✔ Clean GitOps implementation
* ✔ Built-in DevSecOps enforcement
* ✔ Safe production releases
* ✔ Easy to explain in interviews
* ✔ Scales from solo developer to full team

---

## 🏁 Final Statement

This branching and CI/CD strategy is:

* **Production-grade**
* **Security-aware**
* **GitOps-native**
* **AKS-ready**

It reflects **how modern DevOps teams actually ship software**, not demo pipelines.

---

