# ------------------------------------------------------------
# Azure SQL Module
# ------------------------------------------------------------
# This module provisions:
# - Azure SQL Logical Server
# - Single Azure SQL Database
# - Firewall rules for connectivity
#
# The design is intentionally simple and cost-aware.
# ------------------------------------------------------------


# -------------------------
# SQL Logical Server
# -------------------------
resource "azurerm_mssql_server" "this" {

  # Name of the SQL logical server (must be globally unique)
  name = var.server_name

  # Azure region
  location = var.location

  # Resource Group
  resource_group_name = var.resource_group_name

  # SQL admin credentials
  # NOTE: Password should be provided via tfvars or secure pipeline variables
  administrator_login          = var.admin_username
  administrator_login_password = var.admin_password

  # Azure AD authentication can be enabled later if required
  version = "12.0"

  tags = var.tags
}


# -------------------------
# SQL Database
# -------------------------
resource "azurerm_mssql_database" "this" {

  # Database name
  name = var.database_name

  # Parent SQL server ID
  server_id = azurerm_mssql_server.this.id

  # SKU / performance tier
  # Basic / DTU-based is sufficient for stage & interview use
  sku_name = var.sku_name

  # Enable zone redundancy only for higher tiers (disabled here for cost)
  zone_redundant = false

  tags = var.tags
}


# -------------------------
# Firewall Rule: Allow Azure Services
# -------------------------
# Allows Azure resources (like AKS) to connect to SQL
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {

  name      = "AllowAzureServices"
  server_id = azurerm_mssql_server.this.id

  # Required magic IP range to allow Azure services
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}


# -------------------------
# Optional Firewall Rule: Client IP
# -------------------------
# Allows local machine access for troubleshooting (optional)
resource "azurerm_mssql_firewall_rule" "client_ip" {

  count = var.client_ip_address != null ? 1 : 0

  name      = "AllowClientIP"
  server_id = azurerm_mssql_server.this.id

  start_ip_address = var.client_ip_address
  end_ip_address   = var.client_ip_address
}
