# Output AKS subnet ID
output "aks_subnet_id" {
  description = "Subnet ID for AKS"
  value       = azurerm_subnet.aks.id
}

# Output Jenkins subnet ID
output "jenkins_subnet_id" {
  description = "Subnet ID for Jenkins VM"
  value       = azurerm_subnet.jenkins.id
}

# Output VNet ID
output "vnet_id" {
  description = "Virtual Network ID"
  value       = azurerm_virtual_network.this.id
}
