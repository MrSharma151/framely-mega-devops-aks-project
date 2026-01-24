# Storage Account ID
output "id" {
  description = "ID of the Storage Account"
  value       = azurerm_storage_account.this.id
}

# Storage Account name
output "name" {
  description = "Name of the Storage Account"
  value       = azurerm_storage_account.this.name
}

# Primary Blob endpoint
output "primary_blob_endpoint" {
  description = "Primary Blob service endpoint"
  value       = azurerm_storage_account.this.primary_blob_endpoint
}
