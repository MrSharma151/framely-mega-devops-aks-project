# Key Vault ID
output "id" {
  description = "ID of the Azure Key Vault"
  value       = azurerm_key_vault.this.id
}

# Key Vault name
output "name" {
  description = "Name of the Azure Key Vault"
  value       = azurerm_key_vault.this.name
}

# Key Vault URI (used by applications or CSI driver later)
output "vault_uri" {
  description = "URI of the Azure Key Vault"
  value       = azurerm_key_vault.this.vault_uri
}
