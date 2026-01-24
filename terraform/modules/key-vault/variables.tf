# Resource Group name
variable "resource_group_name" {
  description = "Resource Group where Key Vault will be created"
  type        = string
}

# Azure region
variable "location" {
  description = "Azure region for Key Vault"
  type        = string
}

# Key Vault name
variable "name" {
  description = "Name of the Azure Key Vault"
  type        = string
}

# Azure tenant ID
variable "tenant_id" {
  description = "Azure tenant ID"
  type        = string
}

# Soft delete retention period
variable "soft_delete_retention_days" {
  description = "Number of days to retain soft-deleted items"
  type        = number
  default     = 7
}

# Common tags
variable "tags" {
  description = "Tags to apply to Key Vault"
  type        = map(string)
}
