# Name of the Azure Resource Group.
variable "name" {
  description = "Name of the Azure Resource Group"
  type        = string
}

# Azure region where the Resource Group will be created.
variable "location" {
  description = "Azure region for the Resource Group"
  type        = string
}

# Tags applied to the Resource Group.
# Used for cost tracking, ownership, and environment identification.
variable "tags" {
  description = "Tags to apply to the Resource Group"
  type        = map(string)
  default     = {}
}
