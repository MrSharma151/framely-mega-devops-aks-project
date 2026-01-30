

# 📘 Local Development Setup

## Framely – Mega DevOps AKS Project

**Run the entire project on a single Linux machine (without AKS)**

---

## 🎯 Purpose of This Document

This document explains **how to run and validate the complete Framely Mega DevOps Project locally** on **one Linux machine**, **without using Azure AKS**.

After following this guide, you will be able to:

* Prepare a Linux system with all required tools
* Run the Framely applications locally
* Validate CI pipelines using Jenkins
* Validate GitOps workflows using ArgoCD
* Validate Kubernetes deployments using KIND
* Test the same workflows that are later migrated to AKS

> This document focuses **only on local execution**.
> **All implementation details, configuration values, repository URLs, and credentials are documented inside individual module `README.md` files.**

---

## 🧑‍💻 Supported Environment

* OS: **Linux / WSL2 (Ubuntu recommended)**
* CPU: 4 cores minimum
* RAM: 8 GB minimum (16 GB recommended)
* Disk: 30 GB free space

> Windows / macOS users must use **WSL2 (Ubuntu)** or a Linux VM.

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

### 📍 Docker Compose Location

```
apps/docker-compose.yml
```

---

### ▶️ Start Services

```bash
cd apps
docker compose up -d
```

This starts:

* SQL Server database
* Backend API
* Frontend (Customer)
* Frontend (Admin)

---

### 🌐 Access URLs

| Component           | URL                                            |
| ------------------- | ---------------------------------------------- |
| Backend API         | [http://localhost:8081](http://localhost:8081) |
| Frontend (Customer) | [http://localhost:3000](http://localhost:3000) |
| Frontend (Admin)    | [http://localhost:3001](http://localhost:3001) |

---

### 🧪 Validation Checklist

* Frontend applications load
* Backend API responds
* Database migrations complete successfully

Stop services:

```bash
docker compose down
```

---

# ☸️ Phase 2 – Create Local Kubernetes Cluster (KIND)

This phase validates **Kubernetes + GitOps behavior**.

---

## 🆕 Create KIND Cluster

```bash
mkdir -p ~/kind
nano ~/kind/framely-dev.yaml
```

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: framely-dev

nodes:
  - role: control-plane
    image: kindest/node:v1.33.1
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
      - containerPort: 443
        hostPort: 443
  - role: worker
  - role: worker
  - role: worker
```

Create and verify:

```bash
kind create cluster --config ~/kind/framely-dev.yaml
kubectl config use-context kind-framely-dev
kubectl get nodes
kubectl cluster-info
```

---

## 🌐 Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

```bash
kubectl wait -n ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

---

# 🔁 Phase 3 – Jenkins (Local CI Validation)

Jenkins runs **directly on the host**, not inside Kubernetes.

```
http://localhost:8000
```

### 🔴 Mandatory Step (Do NOT Skip)

Before configuring Jenkins:

> **You MUST read and understand:**
> 📘 `jenkins/README.md`

That document contains:

* Required plugins
* Jenkins job configuration
* Repository URLs
* Credentials & secrets
* Pipeline behavior

Without following that README, Jenkins **will not work correctly**.

### Jenkins Responsibilities (Local)

* Build application images
* Run unit & integration tests
* Scan images using Trivy
* Push images to registry
* Update GitOps manifests using Kustomize

> Jenkins **never deploys to Kubernetes**.

---

# 🔄 Phase 4 – ArgoCD (Local GitOps Validation)

Install ArgoCD into the KIND cluster:

```bash
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Port-forward UI access:

```bash
kubectl port-forward svc/argocd-server -n argocd 8081:443
```

---

### 🔴 Mandatory Rule (Very Important)

❌ **Do NOT apply application Kubernetes manifests directly**

✅ **Only apply ArgoCD Project and Application manifests**

Before proceeding:

> **You MUST read:**
> 📘 `argocd/README.md`

That document explains:

* ArgoCD Projects
* ArgoCD Applications
* Repository structure
* Sync behavior

Once ArgoCD Applications are applied, **ArgoCD will automatically sync and deploy workloads**.

---

# 📦 Phase 5 – GitOps Deployment via ArgoCD

Apply only ArgoCD resources:

```bash
kubectl apply -f argocd/projects/
kubectl apply -f argocd/applications/
```

> Application manifests under `kubernetes/`
> are **managed exclusively by ArgoCD**.

---

## 📊 Optional – Local Monitoring

For local observability:

* Prometheus and Grafana can be installed using **Helm charts**
* This setup is **optional** for local testing

📘 Refer to:

```
monitoring/README.md
```

---

## 🚫 Modules to Ignore for Local Testing

The following modules are **NOT required** for local execution:

* `terraform/` → Infrastructure provisioning for Azure
* `ansible/` → Jenkins VM configuration on Azure

These are used **only when migrating to AKS**.

---

## 📚 Mandatory Documentation References

Before running the full pipeline, **you must read**:

| Area            | README                 |
| --------------- | ---------------------- |
| Applications    | `apps/README.md`       |
| Jenkins         | `jenkins/README.md`    |
| ArgoCD / GitOps | `argocd/README.md`     |
| Kubernetes      | `kubernetes/README.md` |
| Monitoring      | `monitoring/README.md` |

This document **does not duplicate** those details by design.

---

## ⚠️ Important Migration Note

This same source code repository is later **migrated to Azure AKS**.

During migration:

* Some local configurations may fail
* Environment-specific fixes may be required
* Infrastructure values will change

However:

* **Application source code remains largely unchanged**
* CI/CD logic stays the same
* GitOps principles remain identical

For full context, **read all project documentation before modifying configurations**.

---

## 🧹 Cleanup

```bash
docker compose down
kind delete cluster --name framely-dev
```

---

## 🏁 Final Summary

* Entire project can be tested on **one Linux machine**
* No AKS or cloud resources required
* Docker Compose validates application behavior
* KIND + ArgoCD validate GitOps workflows
* Jenkins validates CI pipelines
* Terraform and Ansible are intentionally excluded

This document enables **full local validation of the Framely Mega DevOps Project** before any cloud deployment.

---


