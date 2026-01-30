# ------------------------------------------------------------
# Stage Environment - Main Terraform Configuration
# ------------------------------------------------------------
# Entry point for provisioning Stage infrastructure.
# Modules are ordered by dependency and architectural layers.
# ------------------------------------------------------------


# ------------------------------------------------------------
# 1. Resource Group (Foundation)
# ------------------------------------------------------------

module "resource_group" {
  source = "../../modules/resource-group"

  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}


# ------------------------------------------------------------
# 2. Network (Foundation)
# ------------------------------------------------------------

module "network" {
  source = "../../modules/network"

  resource_group_name = module.resource_group.name
  location            = var.location

  vnet_name = "vnet-framely-stage"
  vnet_cidr = "10.0.0.0/16"

  aks_subnet_name  = "subnet-aks"
  aks_subnet_cidr = "10.0.1.0/24"

  jenkins_subnet_name  = "subnet-jenkins"
  jenkins_subnet_cidr = "10.0.2.0/24"

  aks_nsg_name     = "nsg-aks-stage"
  jenkins_nsg_name = "nsg-jenkins-stage"

  tags = var.tags
}


# ------------------------------------------------------------
# 3. Log Analytics (Platform Observability)
# ------------------------------------------------------------

module "log_analytics" {
  source = "../../modules/log-analytics"

  resource_group_name = module.resource_group.name
  location            = var.location

  name = "law-framely-stage"
  retention_in_days = 30

  tags = var.tags
}


# ------------------------------------------------------------
# 4. AKS (Core Platform) - TEMPORARILY DISABLED
# ------------------------------------------------------------
# AKS provisioning is intentionally postponed until
# Jenkins CI pipelines are fully validated.
#
# This avoids unnecessary AKS node costs during
# Jenkins & CI debugging phase.
# ------------------------------------------------------------

# module "aks" {
#   source = "../../modules/aks"
#
#   resource_group_name = module.resource_group.name
#   location            = var.location
#
#   cluster_name = "aks-framely-stage"
#   dns_prefix  = "framely-stage"
#
#   aks_subnet_id = module.network.aks_subnet_id
#   log_analytics_workspace_id = module.log_analytics.id
#
#   # System node pool
#   system_node_vm_size = "Standard_B2s"
#   system_node_count  = 1
#
#   # User node pool
#   user_node_vm_size   = "Standard_B2s"
#   user_node_min_count = 1
#   user_node_max_count = 3
#
#   tags = var.tags
# }


# ------------------------------------------------------------
# 5. Azure Container Registry (Runtime Dependency)
# ------------------------------------------------------------

module "acr" {
  source = "../../modules/acr"

  resource_group_name = module.resource_group.name
  location            = var.location

  name = "acrframelystage"
  sku  = "Basic"

  tags = var.tags
}


# ------------------------------------------------------------
# 6. Key Vault (Security Primitive)
# ------------------------------------------------------------

module "key_vault" {
  source = "../../modules/key-vault"

  resource_group_name = module.resource_group.name
  location            = var.location

  name      = "kv-framely-stage"
  tenant_id = var.tenant_id

  soft_delete_retention_days = 7

  tags = var.tags
}


# ------------------------------------------------------------
# 7. Azure SQL (Data Layer)
# ------------------------------------------------------------

module "sql" {
  source = "../../modules/sql"

  resource_group_name = module.resource_group.name
  location            = var.location

  server_name   = "sql-framely-stage"
  database_name = "framelydb"

  admin_username = var.sql_admin_username
  admin_password = var.sql_admin_password

  client_ip_address = var.client_ip_address

  tags = var.tags
}


# ------------------------------------------------------------
# 8. Storage Account (Data Layer)
# ------------------------------------------------------------

module "storage" {
  source = "../../modules/storage"

  resource_group_name = module.resource_group.name
  location            = var.location

  storage_account_name = "stframelystage"

  container_names = [
    "uploads",
    "media",
    "exports"
  ]

  tags = var.tags
}


# ------------------------------------------------------------
# 9. Jenkins VM (CI Infrastructure)
# ------------------------------------------------------------

module "jenkins_vm" {
  source = "../../modules/jenkins-vm"

  resource_group_name = module.resource_group.name
  location            = var.location

  jenkins_subnet_id = module.network.jenkins_subnet_id

  vm_name = "vm-jenkins-stage"
  vm_size = "Standard_B2s"

  admin_username = "azureuser"
  ssh_public_key = var.jenkins_ssh_public_key

  public_ip_name = "pip-jenkins-stage"
  nic_name       = "nic-jenkins-stage"
  nsg_name       = "nsg-jenkins-stage"

  tags = var.tags
}


# ------------------------------------------------------------
# 10. Identities (IAM Glue) - TEMPORARILY DISABLED
# ------------------------------------------------------------
# This module depends on AKS identities.
# It will be enabled AFTER AKS provisioning.
# ------------------------------------------------------------

# module "identities" {
#   source = "../../modules/identities"
#
#   acr_id       = module.acr.id
#   key_vault_id = module.key_vault.id
#
#   aks_kubelet_identity_object_id = module.aks.kubelet_identity_object_id
#   aks_identity_object_id         = module.aks.identity_object_id
# }


# ------------------------------------------------------------
# TEMP: Jenkins VM → ACR (AcrPush)
# ------------------------------------------------------------
# This is intentionally defined inline while AKS is disabled.
# It will be moved to identities module after AKS is enabled.
# ------------------------------------------------------------
resource "azurerm_role_assignment" "jenkins_acr_push" {
  scope                = module.acr.id
  role_definition_name = "AcrPush"
  principal_id         = module.jenkins_vm.identity_principal_id
}

