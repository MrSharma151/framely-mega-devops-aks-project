# ------------------------------------------------------------
# Log Analytics Module
# ------------------------------------------------------------
# This module provisions an Azure Log Analytics Workspace.
#
# The workspace is primarily used for:
# - AKS cluster monitoring
# - Node and control plane logs
# - Basic infrastructure observability
#
# Application-level monitoring is handled separately
# using Prometheus and Grafana.
# ------------------------------------------------------------

resource "azurerm_log_analytics_workspace" "this" {

  # Name of the Log Analytics Workspace
  name = var.name

  # Azure region
  location = var.location

  # Resource Group where the workspace will be created
  resource_group_name = var.resource_group_name

  # Pricing tier for Log Analytics
  # PerGB2018 is the standard and most commonly used tier
  sku = "PerGB2018"

  # Data retention period (in days)
  # 30 days is sufficient for troubleshooting and cost control
  retention_in_days = var.retention_in_days

  # Common tags
  tags = var.tags
}
