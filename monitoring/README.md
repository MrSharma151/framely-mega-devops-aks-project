

## 📊 Observability

### Framely – Mega DevOps AKS Project

---

## 🎯 Purpose of This Directory

This directory documents the **observability strategy** for the Framely platform.

It defines how monitoring and visibility are handled across:

* Infrastructure and Kubernetes clusters
* Application workloads

The observability stack is **intentionally split by responsibility** to align with production-grade, cloud-native practices.

---

## 🧠 Observability Model

Framely follows a **hybrid observability approach**:

* **Azure-native monitoring** for infrastructure and cluster-level signals
* **Cloud-native tooling (Prometheus and Grafana)** for application-level metrics

This separation provides:

* Clear ownership boundaries
* Reduced coupling between cloud provider and application monitoring
* Easier portability across environments
* Better control over monitoring costs

---

## 📘 Azure Log Analytics

### Infrastructure and Cluster Observability

Azure Log Analytics is used for **platform-level monitoring**.

### Scope

* AKS cluster health
* Node and node pool metrics
* Control plane diagnostics
* Azure resource logs

### Characteristics

* Integrated with AKS during cluster provisioning via Terraform
* Used for:

  * Cluster availability
  * Node health
  * Resource utilization
  * Infrastructure diagnostics
* **Not used for application-level metrics**

Application metrics are intentionally excluded to avoid vendor lock-in and excessive ingestion costs.

---

## 📈 Prometheus and Grafana

### Application Observability

Application metrics are handled using **Prometheus and Grafana**, deployed **inside the Kubernetes cluster**.

### Deployment Model

* Installed using **Helm charts**
* Deployed in a dedicated Kubernetes namespace
* Treated as **platform components**, not application workloads

### Responsibilities

* Application metrics collection
* Service-level monitoring
* Metrics visualization via dashboards
* Alerting (when enabled)

### Rationale

* Kubernetes-native monitoring stack
* Industry-standard tooling
* Cloud-provider independent
* Consistent behavior across local and AKS environments

---

## 📁 Directory Scope

The `monitoring/` directory acts as a **logical boundary** for observability-related concerns.

It contains:

* Documentation of the observability approach
* References for Prometheus and Grafana usage
* Design decisions related to monitoring

At the current stage, this directory contains **documentation only**.

Helm charts and configuration values may be added as the platform evolves.

---

## 🎯 Design Constraints

* Infrastructure monitoring is separate from application monitoring
* Observability tooling is treated as **platform infrastructure**
* GitOps-compatible and Kubernetes-native
* Cost-aware and production-aligned

---

## 🚀 Optional Extensions

The observability stack can be extended to include:

* Prometheus alert rules
* Grafana dashboards as code
* Alertmanager integration
* External metrics adapters for HPA

These enhancements are optional and environment-dependent.

---

## 🏁 Summary

* **Azure Log Analytics** is used for infrastructure and AKS monitoring
* **Prometheus and Grafana** are used for application metrics
* **Helm-based deployment** enables cluster-native observability
* Clear separation of concerns ensures a maintainable and scalable design

This directory documents the **authoritative observability model** for the Framely platform.

---

