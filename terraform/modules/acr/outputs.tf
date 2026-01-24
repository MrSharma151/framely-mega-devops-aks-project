# ACR ID
output "id" {
  description = "ID of the Azure Container Registry"
  value       = azurerm_container_registry.this.id
}

# ACR name
output "name" {
  description = "Name of the Azure Container Registry"
  value       = azurerm_container_registry.this.name
}

# ACR login server (used by Jenkins and Kubernetes manifests)
output "login_server" {
  description = "Login server URL of ACR"
  value       = azurerm_container_registry.this.login_server
}
