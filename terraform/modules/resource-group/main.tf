# ------------------------------------------------------------
# Resource Group Module
# ------------------------------------------------------------
# This module is responsible for creating an Azure Resource Group.
# Each environment (Stage / Prod) will have its own dedicated
# resource group to ensure clean isolation, billing clarity,
# and safe lifecycle management.
# ------------------------------------------------------------

resource "azurerm_resource_group" "this" {

  # Name of the resource group.
  # Passed from the environment layer (stage/prod).
  name = var.name

  # Azure region where all resources in this environment will be created.
  # Keeping all resources in the same region avoids latency and data transfer costs.
  location = var.location

  # Common tags applied to the resource group.
  # These tags will automatically propagate to most child resources.
  tags = var.tags
}
