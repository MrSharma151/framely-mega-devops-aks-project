

---

# 📘 Local Development Setup – Framely DevOps AKS Mega Project

**(FINAL – Single Source of Truth)**

---

## 🎯 Purpose of This Document

This document explains how to set up the **entire Framely platform locally** using **KIND (Kubernetes in Docker)** to perform **end-to-end CI/CD + GitOps + DevSecOps validation** **before migrating to AKS**.

It is intended for:

* Local development & validation
* Jenkins multibranch CI/CD testing
* GitOps (ArgoCD + Kustomize) verification
* DevSecOps validation (Trivy-based image scanning)
* New contributors onboarding

---

## 🧠 Why Local Kubernetes First?

Before provisioning Azure infrastructure, everything is validated locally to ensure:

* Applications are container-ready
* Dockerfiles are secure & reproducible
* Jenkins pipelines work end-to-end
* GitOps updates behave deterministically
* DevSecOps gates work as expected
* **Zero cloud cost during development**

Later, this setup is migrated to **AKS** with **minimal changes**.

> 👉 *Local failures are cheap. Cloud failures are expensive.*

---

## 🧰 Prerequisites (One-Time Setup)

All tools must be installed on your **WSL2 Ubuntu / Linux system**.

> ⚠️ **CRITICAL: Jenkins User Constraint**
>
> Jenkins runs as a **separate system user (`jenkins`)**.
> Any tool used inside pipelines **must be installed globally** and accessible via `PATH` for the Jenkins user.

---

## 🔹 Core Platform & DevOps Tools

| Tool       | Purpose                                     |
| ---------- | ------------------------------------------- |
| Docker     | Container runtime                           |
| kubectl    | Kubernetes CLI                              |
| kind       | Local Kubernetes cluster                    |
| Helm       | Kubernetes package manager                  |
| Jenkins    | CI server (runs on host, not in Kubernetes) |
| ArgoCD CLI | GitOps interaction                          |
| Git        | Source control                              |

---

## 🔹 CI / Build / Runtime Tooling (MANDATORY)

These tools are **directly used by Jenkins pipelines**.

| Tool         | Purpose                                            | Requirement        |
| ------------ | -------------------------------------------------- | ------------------ |
| Docker CLI   | Image build & push                                 | **Global install** |
| .NET SDK 9.x | Backend build & tests                              | **Global install** |
| Node.js 20.x | Frontend build & tests (Next.js)                   | **Global install** |
| npm          | Frontend dependency & test execution               | Comes with Node    |
| Kustomize    | GitOps image updates                               | **Global install** |
| Trivy        | Container image vulnerability scanning (DevSecOps) | **Global install** |

---

## 🔐 Why Trivy Is Mandatory Now (DevSecOps)

Trivy is used to scan **built Docker images** for vulnerabilities.

**Role of Trivy in Framely pipelines:**

* `main`  → report-only (developer feedback)
* `stage` → enforced visibility (no failure)
* `prod`  → **FAILS on CRITICAL vulnerabilities**

> Jenkins **never fixes vulnerabilities**.
> It **reports, enforces, and protects environments**.

If Trivy is missing, **pipelines WILL FAIL**.

---

## 🔍 Verify Tool Installation (Host User)

Run these commands as your normal Linux user:

```bash
docker version
kubectl version --client
kind version
helm version
git --version
argocd version --client
kustomize version
trivy version

dotnet --version
node --version
npm --version
```

---

## 🔍 Verify Jenkins User Access (CRITICAL)

Run these exactly:

```bash
sudo -u jenkins docker ps
sudo -u jenkins dotnet --version
sudo -u jenkins node --version
sudo -u jenkins npm --version
sudo -u jenkins kustomize version
sudo -u jenkins trivy version
```

> ❌ If **any command fails here**, CI pipelines **WILL FAIL**
> (especially `ci-stage` and `ci-prod`).

---

## 🧹 Phase 1 – Clean Existing KIND Clusters

```bash
kind get clusters
```

```bash
for c in $(kind get clusters); do
  kind delete cluster --name $c
done
```

Verify:

```bash
kind get clusters
```

Expected output:

```
(no output)
```

Clean old contexts (only KIND ones):

```bash
kubectl config get-contexts
kubectl config delete-context kind-kind
kubectl config delete-context kind-test
```

---

## 🆕 Phase 2 – Create KIND Cluster (`framely-dev`)

### 2.1 Create KIND Configuration

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

Create cluster:

```bash
kind create cluster --config ~/kind/framely-dev.yaml
```

Verify:

```bash
kubectl get nodes
kubectl cluster-info
kubectl config use-context kind-framely-dev
```

---

## 🌐 Phase 3 – Install Core Kubernetes Components

### 3.1 Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

```bash
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

---

### 3.2 Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

---

## 🔗 Jenkins (Local)

Jenkins runs **directly on the host**, not inside Kubernetes.

```
http://localhost:8000
```

### Jenkins Responsibilities (Local)

* Run unit & integration tests
* Build Docker images
* Scan images using Trivy (DevSecOps)
* Push images to Docker Hub
* Update GitOps manifests using Kustomize

> ❗ Jenkins **never deploys** to Kubernetes
> ArgoCD is the **only deployment engine**

---

## 🧠 Architecture Alignment (Local → AKS)

| Component  | Local (KIND)  | Cloud (AKS)      |
| ---------- | ------------- | ---------------- |
| Kubernetes | KIND          | AKS              |
| Ingress    | NGINX         | NGINX / AGIC     |
| CI         | Local Jenkins | Azure VM Jenkins |
| CD         | ArgoCD        | ArgoCD           |
| GitOps     | Yes           | Yes              |
| DevSecOps  | Trivy         | Trivy            |

👉 **Only infrastructure changes. CI/CD logic stays identical.**

---

## ✅ Current Local Validation Status

* KIND cluster: ✅ Ready
* Jenkins: ✅ Ready
* ArgoCD: ✅ Ready
* Docker builds: ✅ Stable
* GitOps flow: ✅ Verified
* Trivy scans: ✅ Integrated
* CI pipelines:

  * `ci-main`  → ✅ Green
  * `ci-stage` → ✅ Green
  * `ci-prod`  → ✅ Green (with security gates)
* K8s manifets: ✅ Ready

---

## 🔥 Final & Non-Negotiable Rule

> Any machine running Jenkins
> (local VM today, Azure VM tomorrow)
> **MUST have Docker, Dotnet, Node.js, npm, Kustomize, and Trivy installed globally**
>
> Otherwise **CI / GitOps / DevSecOps pipelines WILL FAIL**.

---

## 🏁 Final Statement

This document is the **single source of truth** for:

* Local Kubernetes setup
* Jenkins CI/CD execution
* GitOps validation
* DevSecOps enforcement
* AKS migration readiness

It mirrors **real-world production DevOps systems**, not demos.

---

