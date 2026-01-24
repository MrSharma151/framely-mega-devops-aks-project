# ------------------------------------------------------------
# Azure Provider Configuration for Stage Environment
# ------------------------------------------------------------

provider "azurerm" {

  # Enable all default AzureRM provider features.
  # This block is mandatory even if no specific features are configured.
  features {}

  # Azure Subscription ID where Stage infrastructure will be created.
  # This ensures Terraform operates only within the intended subscription.
  subscription_id = var.subscription_id
}
