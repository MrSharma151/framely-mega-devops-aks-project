# ------------------------------------------------------------
# Identities (IAM) Module
# ------------------------------------------------------------
# This module manages Azure RBAC role assignments
# using Managed Identities.
#
# It connects AKS with:
# - Azure Container Registry (image pull)
# - Azure Key Vault (secret read access)
#
# No credentials or secrets are created here.
# ------------------------------------------------------------


# ------------------------------------------------------------
# AKS → ACR (AcrPull)
# ------------------------------------------------------------
# Allows AKS to pull container images from ACR
# using Managed Identity instead of registry credentials.
resource "azurerm_role_assignment" "aks_acr_pull" {

  # Scope is the Azure Container Registry
  scope = var.acr_id

  # Built-in role for pulling images
  role_definition_name = "AcrPull"

  # Object ID of the AKS kubelet identity
  principal_id = var.aks_kubelet_identity_object_id
}


# ------------------------------------------------------------
# AKS → Key Vault (Secrets Reader)
# ------------------------------------------------------------
# Allows AKS workloads to read secrets from Azure Key Vault.
# Useful for future CSI driver or secret sync patterns.
resource "azurerm_role_assignment" "aks_keyvault_reader" {

  # Scope is the Azure Key Vault
  scope = var.key_vault_id

  # Built-in role for reading secrets
  role_definition_name = "Key Vault Secrets User"

  # Object ID of the AKS Managed Identity
  principal_id = var.aks_identity_object_id
}
