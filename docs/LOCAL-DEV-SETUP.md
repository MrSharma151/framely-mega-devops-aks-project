
---

## 📘 Local Development Setup – Framely DevOps AKS Mega Project

This document explains how to set up the **entire Framely platform locally** using **KIND (Kubernetes in Docker)** for end-to-end testing **before migrating to AKS**.

It is intended for:

* Local development & validation
* CI/CD + GitOps testing
* New contributors who want to run the project locally

---

## 🧠 Why Local Kubernetes First?

Before provisioning Azure resources, we validate everything locally to ensure:

* Applications are container-ready
* CI pipelines work end-to-end
* GitOps (ArgoCD + Kustomize) behaves correctly
* Zero cloud cost during development

Later, the same setup is migrated to **AKS** with minimal changes.

---

## 🧰 Prerequisites (One-Time Setup)

Make sure the following tools are installed on your **WSL2 Ubuntu system / any Linux distro**.

> ⚠️ **Important Note (Jenkins User)**
>
> Jenkins runs as a **separate system user (`jenkins`)**.
> Any tool used inside pipelines **must be installed globally** and accessible to the Jenkins user via `PATH`.

---

### 🔹 Core Platform & DevOps Tools

| Tool       | Purpose                                    |
| ---------- | ------------------------------------------ |
| Docker     | Container runtime                          |
| kubectl    | Kubernetes CLI                             |
| kind       | Local Kubernetes cluster                   |
| Helm       | Kubernetes package manager                 |
| Jenkins    | CI server (runs locally, not in container) |
| ArgoCD CLI | GitOps interaction                         |
| Git        | Source control                             |

---

### 🔹 GitOps & Manifest Management Tools (Mandatory)

| Tool      | Purpose                                             | Requirement        |
| --------- | --------------------------------------------------- | ------------------ |
| Kustomize | Update Kubernetes manifests (image tags via GitOps) | **Global install** |

> 🔑 **Why Kustomize is mandatory**
>
> * Jenkins uses **`kustomize edit set image`**
> * Image tags are updated **without touching YAML manually**
> * Required for **stage & prod GitOps pipelines**
>
> 👉 If Kustomize is missing or not accessible to Jenkins, **ci-stage pipeline will fail**.

---

### 🔹 Application Runtime & Build Tools (Mandatory for CI)

These tools are **required by Jenkins pipelines** to run tests and build images.

| Tool         | Purpose                                      | Requirement        |
| ------------ | -------------------------------------------- | ------------------ |
| .NET SDK 9.x | Build & test Backend (.NET API + Tests)      | **Global install** |
| Node.js 20.x | Build & test Frontend applications (Next.js) | **Global install** |
| npm          | Dependency management & test execution       | Comes with Node    |
| Docker CLI   | Image build & push                           | **Global install** |

> ✅ These tools **must be accessible to the Jenkins user**, not only the logged-in Linux user.

---

## 🔍 Verify Tool Installation

Run the following commands and ensure **no errors**:

```bash
docker version
kubectl version --client
kind version
helm version
git --version
argocd version --client
kustomize version

dotnet --version
node --version
npm --version
```

### 🔍 Verify Jenkins User Access (Critical)

```bash
sudo -u jenkins docker ps
sudo -u jenkins dotnet --version
sudo -u jenkins node --version
sudo -u jenkins npm --version
sudo -u jenkins kustomize version
```

> ❌ If **any command fails here**, pipelines **WILL FAIL**.

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

Expected:

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

## 🆕 Phase 2 – Create New KIND Cluster (`framely-dev`)

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
        protocol: TCP
      - containerPort: 443
        hostPort: 443
        protocol: TCP

  - role: worker
    image: kindest/node:v1.33.1

  - role: worker
    image: kindest/node:v1.33.1

  - role: worker
    image: kindest/node:v1.33.1
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

Jenkins runs **directly on the host machine**, not inside Kubernetes.

```
http://localhost:8000
```

### Jenkins Responsibilities

* Run unit & integration tests
* Build Docker images
* Push images to registry (Docker Hub / ACR)
* Update Git repositories (GitOps via Kustomize)

> ❗ Jenkins **never deploys** to Kubernetes directly.
> ArgoCD handles deployment.

---

## 🧠 Architecture Alignment (Important)

| Component  | Local (KIND)  | Cloud (AKS)      |
| ---------- | ------------- | ---------------- |
| Kubernetes | KIND          | AKS              |
| Ingress    | NGINX         | NGINX / AGIC     |
| CI         | Local Jenkins | Azure VM Jenkins |
| CD         | ArgoCD        | ArgoCD           |
| GitOps     | Yes           | Yes              |

👉 **Only Kubernetes changes. Everything else stays the same.**

---

## ✅ Status

* Local Kubernetes: ✅ Ready
* Jenkins: ✅ Ready
* ArgoCD: ✅ Ready
* Runtime Tooling (Dotnet / Node / Kustomize): ✅ Ready
* CI Pipelines (`ci-main`): ✅ Stable
* GitOps Flow (`ci-stage`): ✅ Stable

---

## 🔥 Final Note (Very Important)

> Any machine that runs Jenkins (local VM or Azure VM later)
> **must have Docker, Dotnet, Node.js, npm, and Kustomize installed globally**
> otherwise **CI or GitOps pipelines will fail**.

---

💡 **This document is the single source of truth for local testing, CI validation, and GitOps onboarding.**

---

