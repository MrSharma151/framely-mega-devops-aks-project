# ------------------------------------------------------------
# Resource Group Outputs
# ------------------------------------------------------------

# Resource Group ID
output "id" {
  description = "ID of the Azure Resource Group"
  value       = azurerm_resource_group.this.id
}

# Resource Group name
output "name" {
  description = "Name of the Azure Resource Group"
  value       = azurerm_resource_group.this.name
}
