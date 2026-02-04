

---

# 📘 Local Development Setup

## Framely – Mega DevOps AKS Project

**Run the complete Framely platform locally on a single Linux machine (without AKS)**

---

## 🎯 Purpose of This Document

This document explains **how to run and validate the Framely platform locally** on **one Linux machine**, **without using Azure AKS**.

The local setup is intended for:

* Development and experimentation
* CI and GitOps workflow validation
* Debugging and learning purposes
* Safe testing without cloud cost

> ⚠️ **Important Context**
> The Framely platform is **already deployed and tested on Azure AKS**.
> This document exists to support **local validation**, not as the primary deployment model.

All environment-specific configuration, credentials, and implementation details are documented in the respective module `README.md` files.

---

## 🧑‍💻 Supported Environment

* OS: **Linux / WSL2 (Ubuntu recommended)**
* CPU: 4 cores minimum
* RAM: 8 GB minimum (16 GB recommended)
* Disk: 30 GB free space

> Windows users must use **WSL2 (Ubuntu)** or a Linux VM.

---

## 🧰 Required Tools (Mandatory)

All tools below **must be installed on the same Linux machine**.

### 🔹 Core Platform & DevOps Tooling

| Tool           | Purpose                                |
| -------------- | -------------------------------------- |
| Git            | Source code management                 |
| Docker Engine  | Container runtime                      |
| Docker Compose | Local application testing              |
| kubectl        | Kubernetes CLI                         |
| KIND           | Local Kubernetes cluster               |
| Helm           | Kubernetes package manager             |
| Jenkins        | CI server (runs on host)               |
| ArgoCD CLI     | GitOps interaction                     |
| Kustomize      | GitOps image updates                   |
| Trivy          | Container image vulnerability scanning |

---

### 🔹 Application Build Tooling

| Tool         | Purpose                        |
| ------------ | ------------------------------ |
| .NET SDK 9.x | Backend API build & tests      |
| Node.js 20.x | Frontend builds                |
| npm          | Frontend dependency management |

---

## ⚠️ Mandatory Jenkins Requirement

Jenkins runs as a **dedicated system user (`jenkins`)**.

All tools used in CI pipelines **must be installed globally** and accessible in the system `PATH` for the `jenkins` user.

If any required tool is missing for the Jenkins user, **CI pipelines will fail**.

---

## 🔍 Verify Tool Installation

Run as your normal Linux user:

```bash
git --version
docker --version
docker compose version
kubectl version --client
kind version
helm version
argocd version --client
kustomize version
trivy version
dotnet --version
node --version
npm --version
```

Verify Jenkins user access:

```bash
sudo -u jenkins git --version
sudo -u jenkins docker ps
sudo -u jenkins dotnet --version
sudo -u jenkins node --version
sudo -u jenkins npm --version
sudo -u jenkins kustomize version
sudo -u jenkins trivy version
```

---

## 📦 Clone the Repository

```bash
git clone <repository-url>
cd framely
```

---

# 🚀 Phase 1 – Run Applications Using Docker Compose

This phase validates **application correctness only**, without Kubernetes or GitOps.

📍 **Location**

```
apps/docker-compose.yml
```

---

### ▶️ Start Services

```bash
cd apps
docker compose up -d
```

---

### 🌐 Access URLs

| Component           | URL                                            |
| ------------------- | ---------------------------------------------- |
| Backend API         | [http://localhost:8081](http://localhost:8081) |
| Frontend (Customer) | [http://localhost:3000](http://localhost:3000) |
| Frontend (Admin)    | [http://localhost:3001](http://localhost:3001) |

---

### 🧪 Validation Checklist

* Frontend applications load correctly
* Backend API responds successfully
* Database migrations complete without errors

Stop services:

```bash
docker compose down
```

---

# ☸️ Phase 2 – Create Local Kubernetes Cluster (KIND)

This phase validates **Kubernetes and GitOps behavior locally**.

---

## 🆕 Create KIND Cluster

```bash
kind create cluster --config ~/kind/framely-dev.yaml
kubectl config use-context kind-framely-dev
kubectl get nodes
```

---

## 🌐 Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

---

# 🔁 Phase 3 – Jenkins (Local CI Validation)

Jenkins runs **directly on the host**, not inside Kubernetes.

```
http://localhost:8000
```

> 🔴 **Mandatory**
> Read `jenkins/README.md` before configuring Jenkins.

Jenkins locally validates:

* CI pipelines
* Image builds
* Security scanning
* GitOps commits

Jenkins **never deploys to Kubernetes**.

---

# 🔄 Phase 4 – ArgoCD (Local GitOps Validation)

Install ArgoCD into the KIND cluster and apply **only ArgoCD Projects and Applications**.

> ❌ Never apply application manifests manually
> ✅ ArgoCD owns deployment

Refer to:

```
argocd/README.md
```

---

# 📦 Phase 5 – GitOps Deployment via ArgoCD

```bash
kubectl apply -f argocd/projects/
kubectl apply -f argocd/applications/
```

ArgoCD will reconcile workloads automatically.

---

## 📊 Optional – Local Monitoring

Prometheus and Grafana may be installed locally using Helm.

Refer to:

```
monitoring/README.md
```

---

## 🚫 Modules Not Used in Local Setup

The following modules are **not required locally**:

* `terraform/` → Azure infrastructure provisioning
* `ansible/` → Jenkins VM configuration on Azure

These modules are **already applied in the AKS deployment**.

---

## 📚 Mandatory Documentation References

| Area            | README                 |
| --------------- | ---------------------- |
| Applications    | `apps/README.md`       |
| Jenkins         | `jenkins/README.md`    |
| ArgoCD / GitOps | `argocd/README.md`     |
| Kubernetes      | `kubernetes/README.md` |
| Monitoring      | `monitoring/README.md` |

---

## 🏁 Final Notes (Important)

* The Framely platform is **already deployed on Azure AKS**
* Local setup exists for **validation, learning, and debugging**
* CI/CD and GitOps behavior is **identical** between local and AKS
* Only infrastructure-specific values differ

Local execution allows you to **experiment safely** without impacting live environments.

---

## 🧹 Cleanup

```bash
docker compose down
kind delete cluster --name framely-dev
```

---

## 🏁 Final Summary

* Full platform can be validated on **one Linux machine**
* No cloud resources required for local testing
* Docker Compose validates application logic
* KIND + ArgoCD validate GitOps workflows
* Jenkins validates CI behavior
* AKS remains the **authoritative production runtime**

This document completes the **local validation guide** for the Framely Mega DevOps AKS Project.

---


