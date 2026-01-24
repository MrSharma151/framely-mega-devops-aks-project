# Resource Group name
variable "resource_group_name" {
  description = "Resource Group where AKS will be deployed"
  type        = string
}

# Azure region
variable "location" {
  description = "Azure region for AKS"
  type        = string
}

# AKS cluster name
variable "cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
}

# DNS prefix for AKS
variable "dns_prefix" {
  description = "DNS prefix for AKS API server"
  type        = string
}

# AKS subnet ID
variable "aks_subnet_id" {
  description = "Subnet ID where AKS nodes will be deployed"
  type        = string
}

# Log Analytics workspace ID
variable "log_analytics_workspace_id" {
  description = "Log Analytics Workspace ID for AKS monitoring"
  type        = string
}

# System node pool configuration
variable "system_node_vm_size" {
  description = "VM size for system node pool"
  type        = string
}

variable "system_node_count" {
  description = "Number of system nodes"
  type        = number
}

# User node pool configuration
variable "user_node_vm_size" {
  description = "VM size for user node pool"
  type        = string
}

variable "user_node_min_count" {
  description = "Minimum number of user nodes"
  type        = number
}

variable "user_node_max_count" {
  description = "Maximum number of user nodes"
  type        = number
}

# Common tags
variable "tags" {
  description = "Tags to apply to AKS resources"
  type        = map(string)
}
