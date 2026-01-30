

# 📘 Ansible – Jenkins VM Configuration

## Framely – Mega DevOps AKS Project

---

## 🎯 Module Objective

This Ansible module configures an **already provisioned Azure Virtual Machine** as a **production-ready Jenkins CI server** for the Framely Mega DevOps AKS Project.

The objective of this module is to ensure that the Jenkins VM:

* Has **all required CI, GitOps, and DevSecOps tooling installed**
* Executes pipelines **identically to the local development environment**
* Remains **fully reproducible and idempotent**
* Is ready for **AKS-based delivery workflows** without manual intervention

> ⚠️ **Important**
> This module **does not provision infrastructure**.
> All Azure resources (VM, networking, AKS, ACR, etc.) are created **exclusively using Terraform**.

---

## 🧱 Scope & Responsibilities

### ✅ In Scope

This module is responsible for:

* Configuring an **existing Azure VM** as a Jenkins CI server
* Installing **system-level dependencies** required by CI pipelines
* Ensuring **tool accessibility for the Jenkins system user**
* Preparing the VM for:

  * CI pipelines
  * GitOps-based image tag updates
  * DevSecOps vulnerability scanning

---

### ❌ Out of Scope

This module explicitly **does not**:

* Provision Azure infrastructure
* Deploy applications
* Run `kubectl apply`
* Interact with Kubernetes or AKS
* Configure Jenkins jobs, pipelines, or plugins

> **Infrastructure → Terraform**
> **CI → Jenkins**
> **CD → ArgoCD**

---

## 🧠 Architectural Context

| Layer                       | Tool      |
| --------------------------- | --------- |
| Infrastructure Provisioning | Terraform |
| Configuration Management    | Ansible   |
| Continuous Integration      | Jenkins   |
| Continuous Delivery         | ArgoCD    |
| GitOps                      | Kustomize |
| DevSecOps                   | Trivy     |
| Container Orchestration     | AKS       |

This separation is **intentional** and reflects **real-world enterprise DevOps architecture**.

---

## 📁 Directory Structure

```text
ansible/
├── ansible.cfg
├── inventory/
│   ├── hosts.ini
│   └── group_vars/
│       └── jenkins.yml
├── playbooks/
│   └── jenkins-vm-setup.yml
├── roles/
│   ├── common/
│   ├── docker/
│   ├── jenkins/
│   ├── dotnet/
│   ├── nodejs/
│   ├── kustomize/
│   └── trivy/
└── scripts/
    └── verify-jenkins-tool.sh
```

---

## 🔧 Roles Overview

Each role is:

* **Idempotent**
* **Self-contained**
* Focused on a **single responsibility**

---

### 🔹 `common`

Base OS preparation:

* Updates package cache
* Installs essential system utilities
* Enables HTTPS repositories and GPG support

---

### 🔹 `docker`

Docker installation and configuration:

* Docker Engine (official repository)
* Docker CLI and containerd
* Adds `jenkins` user to `docker` group
* Enables Docker usage without `sudo`

> Mandatory for all CI pipelines

---

### 🔹 `jenkins`

Jenkins runtime setup:

* OpenJDK 17
* Jenkins LTS installation
* Jenkins system service configuration
* Ensures Jenkins runs as the `jenkins` system user

> Jenkins plugins and jobs are **intentionally excluded**

---

### 🔹 `dotnet`

Backend CI dependencies:

* .NET SDK **9.x**
* Installed using the official Microsoft installer
* Available globally for Jenkins pipelines

---

### 🔹 `nodejs`

Frontend CI dependencies:

* Node.js **20.x**
* npm (bundled)
* Installed via the official NodeSource repository

---

### 🔹 `kustomize`

GitOps tooling:

* Kustomize CLI (binary installation)
* Used by Jenkins to update image tags in GitOps repositories

---

### 🔹 `trivy`

DevSecOps security tooling:

* Trivy CLI (official Aqua Security repository)
* Performs container image vulnerability scans
* Enforces security gates in CI pipelines

---

## 🔐 Jenkins User Constraint (CRITICAL)

Jenkins runs as a **non-root system user (`jenkins`)**.

To guarantee pipeline reliability:

* All tools are installed **system-wide**
* No user-specific installations (`nvm`, `~/.dotnet`, etc.)
* Tool availability is validated using:

```bash
sudo -u jenkins <tool> --version
```

If a tool is inaccessible to the Jenkins user, **CI pipelines will fail**.

---

## ▶️ Execution Guide

### 1️⃣ Configure Inventory

Edit:

```bash
inventory/hosts.ini
```

Add the Jenkins VM public IP:

```ini
[jenkins]
jenkins-vm ansible_host=<JENKINS_VM_PUBLIC_IP>
```

---

### 2️⃣ Run the Playbook

```bash
ansible-playbook playbooks/jenkins-vm-setup.yml
```

* Safe to run multiple times
* Fully idempotent

---

### 3️⃣ Verify Installation (Mandatory)

```bash
chmod +x scripts/verify-jenkins-tool.sh
./scripts/verify-jenkins-tool.sh
```

Successful execution confirms:

* Jenkins VM is correctly configured
* CI, GitOps, and DevSecOps tooling is ready

---

## ✅ Installed Toolchain Summary

| Tool      | Version | Purpose            |
| --------- | ------- | ------------------ |
| Jenkins   | LTS     | CI orchestration   |
| Java      | 17      | Jenkins runtime    |
| Docker    | Latest  | Image build & push |
| .NET SDK  | 9.x     | Backend CI         |
| Node.js   | 20.x    | Frontend CI        |
| npm       | Bundled | Frontend CI        |
| Kustomize | Latest  | GitOps operations  |
| Trivy     | Latest  | DevSecOps scanning |

---

## 🏁 Final Notes

* This module is **production-grade**
* Mirrors enterprise CI server configurations
* Designed for **seamless AKS migration**
* Clean, deterministic, and reproducible

> **Infrastructure may change.
> CI logic remains constant.**

---

