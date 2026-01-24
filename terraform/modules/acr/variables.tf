# Resource Group name
variable "resource_group_name" {
  description = "Resource Group where ACR will be created"
  type        = string
}

# Azure region
variable "location" {
  description = "Azure region for ACR"
  type        = string
}

# ACR name (globally unique)
variable "name" {
  description = "Name of the Azure Container Registry"
  type        = string
}

# ACR SKU
variable "sku" {
  description = "SKU for Azure Container Registry"
  type        = string
  default     = "Basic"
}

# Common tags
variable "tags" {
  description = "Tags to apply to ACR"
  type        = map(string)
}
