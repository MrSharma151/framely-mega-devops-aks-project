

# 📘 Ansible – Jenkins VM Configuration

## Framely – Mega DevOps AKS Project

---

## 🎯 Module Objective

This Ansible module is responsible for **configuring a Jenkins CI server on an Azure Virtual Machine** for the **Framely – Mega DevOps AKS Project**.

Its primary goal is to prepare the Jenkins VM with **all required CI, GitOps, and DevSecOps tooling**, ensuring the pipelines run **identically to the local development setup**, while maintaining:

* Complete environment parity (Local → Azure)
* Deterministic and repeatable CI executions
* Zero configuration drift
* Production-ready CI infrastructure before AKS rollout

> ⚠️ **Important**
> This module **does not provision infrastructure**.
> All infrastructure resources are created **exclusively via Terraform**.

---

## 🧱 Scope & Responsibilities

### ✅ Responsibilities (What This Module Does)

* Configures an **already-provisioned Azure VM** as a Jenkins CI server
* Installs all **required system-level tooling**
* Ensures **full compatibility with the Jenkins system user**
* Prepares the VM for:

  * CI pipelines
  * GitOps-based image tag updates
  * DevSecOps security scanning

### ❌ Out of Scope (What This Module Does Not Do)

* Provision Azure infrastructure (VMs, networking, AKS, etc.)
* Deploy applications
* Execute `kubectl apply`
* Interact with Kubernetes clusters
* Configure Jenkins jobs, pipelines, or plugins

> **CI → Jenkins**
> **CD → ArgoCD**
> **Infrastructure → Terraform**

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

This strict separation reflects **real-world, production-grade DevOps architecture**.

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

## 🔧 Roles Breakdown

Each role is **idempotent**, **self-contained**, and follows the **single-responsibility principle**.

### 🔹 `common`

Prepares the base operating system:

* Updates system package cache
* Installs essential OS utilities
* Enables HTTPS repositories and GPG support

---

### 🔹 `docker`

Installs and configures Docker:

* Docker Engine (official repository)
* Docker CLI and containerd
* Adds `jenkins` user to the `docker` group
* Enables Docker usage without `sudo`

> Mandatory for all CI pipelines

---

### 🔹 `jenkins`

Installs and configures Jenkins:

* OpenJDK 17
* Jenkins LTS
* Jenkins system service
* Ensures Jenkins runs under the `jenkins` system user

> Plugin and job configuration is intentionally excluded

---

### 🔹 `dotnet`

Installs backend CI dependencies:

* **.NET SDK 9.x**
* Installed via official Microsoft installation script
* Globally available for Jenkins pipelines

---

### 🔹 `nodejs`

Installs frontend CI dependencies:

* **Node.js 20.x**
* npm (bundled)
* Installed from the official NodeSource repository

---

### 🔹 `kustomize`

Installs GitOps tooling:

* Kustomize CLI (binary installation)
* Used by Jenkins to update image tags in the GitOps repository

---

### 🔹 `trivy`

Installs DevSecOps security tooling:

* Trivy CLI (official Aqua Security repository)
* Performs container image vulnerability scanning
* Enforces security gates within CI pipelines

---

## 🔐 Jenkins User Constraint (CRITICAL)

Jenkins runs as a **non-root system user (`jenkins`)**.

To ensure pipeline reliability:

* All tools are installed **globally**
* No user-specific installations (`nvm`, `~/.dotnet`, etc.)
* Every tool is validated using:

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

✔ Safe to run multiple times (idempotent)

---

### 3️⃣ Verify Tooling (MANDATORY)

```bash
chmod +x scripts/verify-jenkins-tool.sh
./scripts/verify-jenkins-tool.sh
```

Successful execution confirms:

* Jenkins VM is fully configured
* CI, GitOps, and DevSecOps pipelines are ready to run

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
* Closely mirrors enterprise CI environments
* Designed for **seamless AKS migration**
* Clean, minimal, and production-ready

> **Infrastructure may change.
> CI logic remains constant.**

---


