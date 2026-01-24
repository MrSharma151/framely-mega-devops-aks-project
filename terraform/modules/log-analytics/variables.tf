# Resource Group name
variable "resource_group_name" {
  description = "Resource Group where Log Analytics Workspace will be created"
  type        = string
}

# Azure region
variable "location" {
  description = "Azure region for Log Analytics Workspace"
  type        = string
}

# Log Analytics Workspace name
variable "name" {
  description = "Name of the Log Analytics Workspace"
  type        = string
}

# Log retention period
variable "retention_in_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 30
}

# Common tags
variable "tags" {
  description = "Tags to apply to Log Analytics resources"
  type        = map(string)
}
