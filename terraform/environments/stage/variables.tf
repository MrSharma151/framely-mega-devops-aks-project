# Azure subscription ID for the Stage environment.
# Passed explicitly to avoid accidental deployment to the wrong subscription.
variable "subscription_id" {
  description = "Azure subscription ID for the Stage environment"
  type        = string
}

# Name of the Resource Group for the Stage environment
variable "resource_group_name" {
  description = "Azure Resource Group name for Stage environment"
  type        = string
}

# Azure region where Stage resources will be created
variable "location" {
  description = "Azure region for Stage environment"
  type        = string
}

# Common tags applied to all Stage resources
variable "tags" {
  description = "Common tags for Stage environment resources"
  type        = map(string)
}

# SSH public key for Jenkins VM access
variable "jenkins_ssh_public_key" {
  description = "SSH public key for Jenkins VM"
  type        = string
}

# Azure tenant ID
variable "tenant_id" {
  description = "Azure tenant ID"
  type        = string
}

# SQL admin username
variable "sql_admin_username" {
  description = "SQL admin username"
  type        = string
}

# SQL admin password
variable "sql_admin_password" {
  description = "SQL admin password"
  type        = string
  sensitive   = true
}

# Optional client IP for SQL firewall
variable "client_ip_address" {
  description = "Optional client IP address for SQL firewall rule"
  type        = string
  default     = null
}
