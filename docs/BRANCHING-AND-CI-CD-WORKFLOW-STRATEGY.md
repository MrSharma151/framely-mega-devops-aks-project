
---

# 📘 Branching and CI/CD Workflow Strategy

## Framely – Mega DevOps AKS Project

---

## 🎯 Purpose of This Document

This document defines the **branching strategy**, **CI/CD behavior**, **GitOps execution model**, and **security enforcement rules** used in the Framely platform.

It explains:

* How code moves across branches
* How CI pipelines behave per branch
* How deployments are triggered
* How security controls are enforced
* How responsibilities are separated between tools

This document is the **single reference** for understanding the delivery workflow of this project.

---

## 🧱 Core Principles

* Git is the **single source of truth**
* Jenkins performs **CI and GitOps updates only**
* ArgoCD is the **only deployment engine**
* No manual Kubernetes changes are allowed
* Infrastructure lifecycle is decoupled from application delivery

---

## 🌿 Branching Model

The repository follows a **single-repository, environment-aligned branching model**.

### Long-Lived Branches

| Branch  | Purpose                                 | Environment |
| ------- | --------------------------------------- | ----------- |
| `main`  | Design correctness and system contracts | None        |
| `stage` | Integration and validation              | AKS (Stage) |
| `prod`  | Stable releases                         | AKS (Prod)  |

Only these branches are permanent.
All deployments originate from these branches via GitOps.

---

## 🔁 High-Level Flow

```
Feature / Fix
      ↓
main   → CI validation only
      ↓ Pull Request
stage  → CI + GitOps + auto deployment
      ↓ Approval
prod   → CI + GitOps + manual deployment
```

### Key Concept

* `main` defines **what the system should be**
* `stage` validates **how it behaves**
* `prod` controls **when it is released**

---

## 🟦 `main` Branch – Design Validation

### Purpose

* Defines desired system behavior
* Holds clean, reviewed, and secure code
* Must always remain buildable

---

### CI Behavior

Automatically executed:

* Unit and integration tests
* Dependency and security scans
* Docker image build (validation only)

---

### Explicitly Disabled

* Docker image push
* GitOps manifest updates
* ArgoCD interaction
* Any Kubernetes deployment

---

### Security Policy

* Trivy runs in **report-only mode**
* Vulnerabilities do **not fail** the pipeline
* Used exclusively for developer visibility

`main` validates **correctness**, not execution.

---

## 🟨 `stage` Branch – Integration Environment

### Purpose

* First environment where real execution occurs
* Closely mirrors production behavior
* Used for end-to-end validation

---

### CI Behavior

Automatically executed:

* Full test suite
* Security scans
* Docker image build and push
* GitOps image tag updates

---

### CD Behavior

* ArgoCD auto-sync is enabled
* Deployments occur automatically after GitOps updates

---

### Security Policy

* Trivy scans all images
* Vulnerabilities are reported
* Pipeline does **not fail**, including HIGH severity findings

This ensures visibility without blocking delivery.

---

## 🟥 `prod` Branch – Production Environment

### Purpose

* Represents the live system
* Requires the highest level of stability and control

---

### CI Behavior

* Same validations as `stage`
* Docker image build and verification
* Security scanning

---

### Security Policy

* Pipeline **fails on CRITICAL vulnerabilities**
* HIGH vulnerabilities are reported but allowed
* Enforces risk-based security gating

---

### CD Behavior

* Manual approval required before GitOps update
* ArgoCD synchronization is manual
* Full audit trail is preserved

Production follows **Continuous Delivery**, not Continuous Deployment.

---

## 🔁 GitOps Execution Model

This project follows **strict GitOps rules**.

### Rules

* Jenkins never deploys to Kubernetes
* Jenkins only mutates Git
* ArgoCD is the only tool that applies manifests

---

### Commit Types by Branch

| Commit Type                      | Branch          |
| -------------------------------- | --------------- |
| Code and design changes          | `main`          |
| Image tag updates (CI-generated) | `stage`, `prod` |

CI-generated commits appear **only** in deployment branches.

---

## 🏗 Infrastructure Workflow (Terraform)

Infrastructure changes are intentionally more controlled than application changes.

| Branch  | Terraform Behavior  |
| ------- | ------------------- |
| `main`  | Plan only           |
| `stage` | Plan + manual apply |
| `prod`  | Plan + manual apply |

Infrastructure is **never auto-applied**.

---

## 🌱 Feature Branch Workflow

Feature branches are **short-lived**.

### Flow

```
feature/<name>
      ↓
     main
```

### Rules

* Always branch from `main`
* CI runs automatically
* Merge via Pull Request
* Delete branch after merge
* Feature branches never deploy

---

## 🚑 Hotfix Strategy

### Standard Hotfix (Preferred)

```
hotfix/<issue>
        ↓
main → stage → prod
```

Ensures full validation and security enforcement.

---

### Emergency Hotfix (Exceptional)

```
hotfix/<issue>
        ↓
      prod
        ↓
      main
```

Used only for critical production incidents.
Back-merge to `main` is mandatory.

---

## 🧠 Why This Strategy Works

* Clear separation of responsibilities
* Deterministic CI/CD behavior
* Strict GitOps enforcement
* Progressive security controls
* Predictable production releases

---

## 🏁 Final Notes

* This strategy is **stable and finalized**
* Designed for GitOps-based AKS delivery
* Fully aligned with Jenkins and ArgoCD behavior
* Scales from single-developer to team workflows

This document defines the **authoritative branching and delivery model** for the Framely platform.

---

