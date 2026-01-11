
# 📦 Framely – AKS Mega DevOps Project

This repository contains the **AKS-based, cloud-native DevOps implementation** of the **Framely optical e-commerce platform**.

The goal of this project is to demonstrate a **real-world, end-to-end DevOps architecture on Azure**, focusing on **containerization, Kubernetes, CI/CD, and GitOps practices**.

---

## 🔗 Original Project (PaaS-Based Reference)

The original Framely project is deployed using **Azure PaaS services** and is fully live and production-ready.

👉 **Original PaaS Repository:**
[https://github.com/MrSharma151/Framely.git](https://github.com/MrSharma151/Framely.git)

That repository represents:

* Azure App Service
* Azure Static Web Apps
* Azure SQL Database
* Azure Blob Storage
* GitHub Actions–based CI/CD

---

## 🚀 What This Repository Represents

This repository is a **separate implementation of the same application**, designed to showcase a **Kubernetes + DevOps–centric deployment model**.

Key focus areas:

* Docker-based containerization
* Azure Kubernetes Service (AKS)
* Infrastructure as Code (Terraform)
* Jenkins-based CI pipelines
* GitOps-based Continuous Delivery using ArgoCD
* Environment isolation (stage & prod)
* Cost-optimized cloud infrastructure

> ⚠️ The original PaaS repository remains unchanged.
> This project focuses purely on the **AKS / IaaS / GitOps** approach.

---

## 🧱 High-Level Architecture

**Application Layers:**

* Backend API: ASP.NET Core Web API
* Frontend (Customer): Next.js
* Frontend (Admin): Next.js
* Database: Azure SQL (managed)
* Object Storage: Azure Blob Storage (product images)

**DevOps Stack:**

* Docker
* Kubernetes + Kustomize
* Jenkins (CI)
* ArgoCD (CD / GitOps)
* Terraform (Azure Infrastructure)
* Ansible (Jenkins VM configuration)

---

## 🌿 Repository Strategy

* **Single repository**
* **Multi-branch model** (to be introduced later):

  * `main` → Design & source of truth
  * `stage` → Integration & testing
  * `prod` → Production (manual approvals)

At the current stage, development is happening on the **main branch** only.

---

## 📌 Project Status

🚧 **Under active development**

Current focus:

* Refactoring the Framely application for container-based deployment
* Dockerization of backend and frontend services
* Preparing the codebase for AKS and GitOps workflows

Detailed documentation and diagrams will be added once the implementation phases are completed.

---

## 👨‍💻 Author

**Rohit Sharma**

---

## 📄 License

This project is licensed under the **MIT License**.

---






