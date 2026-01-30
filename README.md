

# 📦 Framely – Mega DevOps AKS Project

A complete, end-to-end **DevOps implementation** of a real application — built to **learn, experiment, and demonstrate** modern **Kubernetes & GitOps practices on Azure**.

This repository represents a **cloud-native, Kubernetes-first re-architecture** of the Framely application, focused on **CI/CD design, GitOps workflows, and infrastructure automation**, rather than application feature development.

---

## 🚀 Why This Project Exists

This project was created to:

- 📖 Learn and apply **real-world DevOps concepts**  
- 🔄 Design a **production-style CI/CD + GitOps workflow**  
- ☸️ Understand **AKS-based platform engineering**  
- ⚖️ Compare **PaaS vs Kubernetes/IaaS delivery models**  
- 🎯 Serve as a **hands-on reference** for DevOps interviews and self-learning  

> ⚠️ This is a **personal learning and showcase project**, not a commercial product.

---

## 🔗 Original Framely Project (PaaS-Based, Live on Azure)

The original Framely application was built using **Azure PaaS services** and is currently live on Azure.

👉 [Original PaaS Repository](https://github.com/MrSharma151/Framely.git)

That repository demonstrates:

- Azure App Service  
- Azure Static Web Apps  
- Azure SQL Database  
- Azure Blob Storage  
- GitHub Actions–based CI/CD  

This AKS repository does **not replace** the PaaS project. Instead, it explores how the same application can be delivered using **Kubernetes, GitOps, and infrastructure automation**.

---

## 🧠 What This Repository Represents

A **DevOps-focused implementation** of the same application, designed around:

- 🐳 Docker-based containerization  
- ☸️ Kubernetes-first deployment model  
- 🔄 GitOps-driven Continuous Delivery  
- 🧩 Strong separation of CI, CD, and infrastructure  
- 🌱 Environment promotion via Git (stage → prod)  

> The application code is treated as **stable input**; the main focus is on **platform engineering and delivery workflows**.

---

## 🧱 High-Level Platform Overview

### Application Layer
- Backend API: **ASP.NET Core (stateless)**  
- Frontend (Customer): **Next.js**  
- Frontend (Admin): **Next.js**  
- Database: **Azure SQL Database**  
- Object Storage: **Azure Blob Storage**

### DevOps & Platform Stack
- 🐳 Docker (containerization)  
- ☸️ Kubernetes (AKS, KIND for local)  
- 🛠️ Kustomize (application manifests)  
- 🔧 Jenkins (Continuous Integration)  
- 🚀 ArgoCD (GitOps-based Continuous Delivery)  
- 🌍 Terraform (Azure infrastructure provisioning)  
- ⚙️ Ansible (Jenkins VM configuration)  
- 📊 Prometheus & Grafana (application monitoring)  
- 📡 Azure Log Analytics (infrastructure monitoring)  

---

## 📂 Repository Structure

```plaintext
framely/
├── CONTRIBUTING.md     # Contribution & usage guidelines
├── Jenkinsfile         # CI entry point (multibranch pipeline)
├── LICENSE             # Project license
├── README.md           # Project overview and navigation
│
├── apps/               # Application source code & Dockerfiles
├── jenkins/            # Jenkins pipelines and shared CI libraries
├── argocd/             # GitOps configuration (projects & applications)
├── kubernetes/         # Kubernetes manifests (stage & prod)
├── terraform/          # Azure infrastructure as code
├── ansible/            # Jenkins VM configuration (post-provisioning)
├── monitoring/         # Observability documentation
│
├── docs/               # Architecture, workflow, and setup documentation
├── diagrams/           # Architecture and flow diagrams
```

> Each major directory contains its own **README.md** that acts as the **single source of truth** for that module.

---

## 🌿 Branching & Environment Model

| Branch | Purpose                          | Environment |
|--------|----------------------------------|-------------|
| `main` | Design validation & source of truth | None        |
| `stage`| Integration & pre-production     | Stage       |
| `prod` | Controlled releases              | Production  |

- Jenkins behavior varies by branch  
- Jenkins **never deploys** to Kubernetes  
- ArgoCD is the **only deployment engine**  
- Environment promotion happens via **Git commits**  

📘 See: `docs/BRANCHING-AND-CI-CD-WORKFLOW-STRATEGY.md`

---

## ☸️ GitOps Delivery Model

- Git defines the **desired state**  
- Jenkins updates Git (**image tags only**)  
- ArgoCD reconciles Kubernetes clusters  
- ❌ No manual `kubectl apply` for application workloads  

✅ Ensures **deterministic, auditable deployments**.

---

## 🧪 Local Development & Validation

The entire platform can be tested on a **single Linux machine**, without AKS.

Supported local workflows:

- 🐳 Docker Compose–based application testing  
- ☸️ Local Kubernetes using KIND  
- 🔧 Jenkins CI execution  
- 🚀 ArgoCD-based GitOps validation  

📘 Setup instructions: `docs/LOCAL-DEV-SETUP.md`

---

## 📚 Documentation Index

Key documentation under `docs/`:

- `ARCHITECTURE-OVERVIEW.md` – System architecture  
- `BRANCHING-AND-CI-CD-WORKFLOW-STRATEGY.md` – CI/CD & GitOps flow  
- `LOCAL-DEV-SETUP.md` – End-to-end local setup guide  

> Module-level documentation exists inside each major directory.

---

## 🧠 Design Philosophy

This project prioritizes:

- 🎓 Learning through realistic implementation  
- 🧩 Clear separation of concerns  
- 📂 Git as the control plane  
- ⚡ Minimal but production-aligned design  
- ✨ Clarity over over-engineering  

It is intentionally **opinionated, documented, and reproducible**.

---

## 👤 Author

**Rohit Sharma**  
DevOps Engineer  
🌐 [https://rohitsharma.org](https://rohitsharma.org)

---

## 📄 License

This project is licensed under the **MIT License**.

---


