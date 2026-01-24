# ------------------------------------------------------------
# Azure Container Registry (ACR) Module
# ------------------------------------------------------------
# This module provisions an Azure Container Registry
# used to store Docker images for the Framely platform.
#
# Jenkins pushes images to ACR.
# AKS pulls images from ACR using Managed Identity.
# ------------------------------------------------------------

resource "azurerm_container_registry" "this" {

  # Name of the ACR (must be globally unique)
  name = var.name

  # Azure region
  location = var.location

  # Resource Group
  resource_group_name = var.resource_group_name

  # SKU selection
  # Basic is sufficient for personal projects
  sku = var.sku

  # Disable admin user for security best practices
  admin_enabled = false

  # Common tags
  tags = var.tags
}
