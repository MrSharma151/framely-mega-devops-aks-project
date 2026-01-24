# Resource Group name
variable "resource_group_name" {
  description = "Resource Group where Storage Account will be created"
  type        = string
}

# Azure region
variable "location" {
  description = "Azure region for Storage Account"
  type        = string
}

# Storage Account name
variable "storage_account_name" {
  description = "Name of the Azure Storage Account"
  type        = string
}

# Blob container names
variable "container_names" {
  description = "List of blob container names to create"
  type        = list(string)
}

# Common tags
variable "tags" {
  description = "Tags to apply to Storage resources"
  type        = map(string)
}
