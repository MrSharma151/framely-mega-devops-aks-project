# Resource Group name
variable "resource_group_name" {
  description = "Resource Group where SQL resources will be created"
  type        = string
}

# Azure region
variable "location" {
  description = "Azure region for SQL resources"
  type        = string
}

# SQL Server name
variable "server_name" {
  description = "Name of the Azure SQL logical server"
  type        = string
}

# Database name
variable "database_name" {
  description = "Name of the Azure SQL database"
  type        = string
}

# SQL admin username
variable "admin_username" {
  description = "Administrator username for SQL server"
  type        = string
}

# SQL admin password
variable "admin_password" {
  description = "Administrator password for SQL server"
  type        = string
  sensitive   = true
}

# SQL SKU
variable "sku_name" {
  description = "SKU name for Azure SQL Database"
  type        = string
  default     = "Basic"
}

# Optional client IP address for firewall rule
variable "client_ip_address" {
  description = "Optional client IP address to allow SQL access"
  type        = string
  default     = null
}

# Common tags
variable "tags" {
  description = "Tags to apply to SQL resources"
  type        = map(string)
}
