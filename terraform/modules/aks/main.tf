# ------------------------------------------------------------
# AKS Module
# ------------------------------------------------------------
# This module provisions an Azure Kubernetes Service (AKS)
# cluster along with:
# - System node pool
# - User node pool
# - Azure CNI networking
# - Log Analytics integration
#
# The cluster is designed to be:
# - Secure by default
# - Cost-aware
# - GitOps-ready
# ------------------------------------------------------------


# -------------------------
# AKS Cluster
# -------------------------
resource "azurerm_kubernetes_cluster" "this" {

  # Name of the AKS cluster
  name = var.cluster_name

  # Azure region
  location = var.location

  # Resource Group where AKS will be created
  resource_group_name = var.resource_group_name

  # DNS prefix for the AKS API server
  dns_prefix = var.dns_prefix


  # -------------------------
  # Default (System) Node Pool
  # -------------------------
  # This node pool hosts Kubernetes system components.
  default_node_pool {

    # Name of the system node pool
    name = "system"

    # VM size for system nodes
    vm_size = var.system_node_vm_size

    # Number of nodes (fixed, no autoscaling)
    node_count = var.system_node_count

    # Subnet where AKS nodes will be placed
    vnet_subnet_id = var.aks_subnet_id
  }


  # -------------------------
  # Managed Identity
  # -------------------------
  # Use System Assigned Managed Identity for AKS.
  # This avoids service principals and secret management.
  identity {
    type = "SystemAssigned"
  }


  # -------------------------
  # Networking Configuration
  # -------------------------
  network_profile {

    # Azure CNI provides native Azure networking
    network_plugin = "azure"

    # Use standard load balancer (managed by AKS)
    load_balancer_sku = "standard"

    # Network policy can be extended later if required
    network_policy = "azure"
  }


  # -------------------------
  # Log Analytics Integration
  # -------------------------
  # Enables Azure Monitor for AKS.
  oms_agent {
    log_analytics_workspace_id = var.log_analytics_workspace_id
  }


  # -------------------------
  # RBAC & Security
  # -------------------------
  role_based_access_control_enabled = true


  # -------------------------
  # Tags
  # -------------------------
  tags = var.tags
}


# -------------------------
# User Node Pool
# -------------------------
# This node pool hosts Framely application workloads.
resource "azurerm_kubernetes_cluster_node_pool" "user" {

  # Name of the user node pool
  name = "user"

  # AKS cluster ID
  kubernetes_cluster_id = azurerm_kubernetes_cluster.this.id

  # VM size for application workloads
  vm_size = var.user_node_vm_size

  # Minimum and maximum number of nodes (enables autoscaling)
  min_count = var.user_node_min_count
  max_count = var.user_node_max_count

  # Subnet for user node pool
  vnet_subnet_id = var.aks_subnet_id

  # Node pool mode must be User
  mode = "User"

  # Tags
  tags = var.tags
}
