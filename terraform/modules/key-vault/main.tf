# ------------------------------------------------------------
# Key Vault Module
# ------------------------------------------------------------
# This module provisions an Azure Key Vault configured
# for RBAC-based access control.
#
# The Key Vault is intended for infrastructure-level secrets
# and future integrations (e.g., CSI driver), not for
# direct application deployment logic.
# ------------------------------------------------------------

resource "azurerm_key_vault" "this" {

  # Name of the Key Vault (must be globally unique)
  name = var.name

  # Azure region
  location = var.location

  # Resource Group where Key Vault will be created
  resource_group_name = var.resource_group_name

  # Azure tenant ID
  tenant_id = var.tenant_id

  # RBAC authorization is now enabled by default in recent provider versions.
  # No need to set enable_rbac_authorization.

  # SKU selection
  sku_name = "standard"

  # Soft delete retention period (in days)
  # Prevents accidental deletion of secrets
  soft_delete_retention_days = var.soft_delete_retention_days

  # Purge protection prevents permanent deletion
  # This is recommended for production-like environments
  purge_protection_enabled = true

  # Common tags
  tags = var.tags
}
