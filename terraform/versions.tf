terraform {
  # Minimum required Terraform CLI version.
  # Ensures consistent behavior across all environments.
  required_version = ">= 1.6.0"

  # Providers required by this Terraform configuration.
  required_providers {

    # Azure Resource Manager provider.
    # Used to create and manage all Azure infrastructure.
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }

    # Random provider.
    # Used for generating unique names to avoid global naming conflicts
    # (e.g., Storage Accounts, ACR, Key Vault).
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}
