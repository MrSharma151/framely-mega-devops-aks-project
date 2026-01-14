

---

# 📘 Local Development Setup – Framely DevOps AKS Mega Project

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
* GitOps (ArgoCD) behaves correctly
* Zero cloud cost during development

Later, the same setup is migrated to **AKS** with minimal changes.

---

## 🧰 Prerequisites (One-Time Setup)

Make sure the following tools are installed on your **WSL2 Ubuntu system**:

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

## 🔍 Verify Tool Installation

Run the following commands and ensure **no errors**:

```bash
docker version
kubectl version --client
kind version
helm version
git --version
argocd version --client
```

---

## 🧹 Phase 1 – Clean Existing KIND Clusters

List existing KIND clusters:

```bash
kind get clusters
```

Delete all existing clusters safely:

```bash
for c in $(kind get clusters); do
  kind delete cluster --name $c
done
```

Verify cleanup:

```bash
kind get clusters
```

Expected output:

```
(no output)
```

Clean old kubectl contexts (only KIND ones):

```bash
kubectl config get-contexts
kubectl config delete-context kind-kind
kubectl config delete-context kind-test
```

---

## 🆕 Phase 2 – Create New KIND Cluster (`framely-dev`)

### 2.1 Create KIND Configuration

Create the config file:

```bash
mkdir -p ~/kind
nano ~/kind/framely-dev.yaml
```

Paste the following:

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

Save and exit.

---

### 2.2 Create the Cluster

```bash
kind create cluster --config ~/kind/framely-dev.yaml
```

Verify cluster:

```bash
kubectl get nodes
kubectl cluster-info
```

Set context:

```bash
kubectl config use-context kind-framely-dev
```

---

## 🌐 Phase 3 – Install Core Kubernetes Components

### 3.1 Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

Wait until ready:

```bash
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

Verify:

```bash
kubectl get pods -n ingress-nginx
```

---

### 3.2 Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait for pods:

```bash
kubectl get pods -n argocd
```

---

## 🔐 Phase 4 – Access ArgoCD Locally

⚠️ Jenkins already uses **localhost:8000**, so ArgoCD is exposed on **8081**.

### 4.1 Port Forward ArgoCD Server

```bash
kubectl port-forward svc/argocd-server -n argocd 8081:443
```

---

### 4.2 Access ArgoCD UI

Open browser:

```
https://localhost:8081
```

> Ignore SSL warning (self-signed certificate)

---

### 4.3 Login Credentials

Username:

```
admin
```

Password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo
```

---

## 🧪 Phase 5 – Final Sanity Check

Run:

```bash
kubectl get nodes
kubectl get ns
kubectl get pods -A
```

You should see namespaces like:

* `argocd`
* `ingress-nginx`
* `kube-system`
* `default`

---

## 🔗 Jenkins (Local)

Jenkins is running **locally on the host**, not inside Kubernetes.

Access Jenkins at:

```
http://localhost:8000
```

Jenkins responsibilities in local setup:

* Build Docker images
* Run tests
* Update Git (GitOps image tags)

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

## 🚀 What’s Next?

With local setup complete, next phases include:

1. Create ArgoCD Project
2. Create ArgoCD Application (dev overlay)
3. Deploy Framely services via GitOps
4. Validate CI → Git → ArgoCD → Kubernetes flow
5. Migrate same setup to AKS using Terraform

---

## ✅ Status

* Local Kubernetes: ✅ Ready
* Jenkins: ✅ Ready
* ArgoCD: ✅ Ready
* Apps (Dockerized): ✅ Ready
* GitOps Flow: 🔜 Next

---

💡 **This document serves as the single source of truth for local testing and onboarding.**

---
