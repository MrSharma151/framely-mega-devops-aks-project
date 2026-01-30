# Jenkins VM ID
output "vm_id" {
  description = "ID of the Jenkins VM"
  value       = azurerm_linux_virtual_machine.this.id
}

# Jenkins Public IP
output "public_ip" {
  description = "Public IP address of Jenkins VM"
  value       = azurerm_public_ip.this.ip_address
}

# ------------------------------------------------------------
# Jenkins VM Managed Identity Principal ID
# ------------------------------------------------------------
# This is required for RBAC role assignments
# (e.g. AcrPush access to ACR)
# ------------------------------------------------------------
output "identity_principal_id" {
  description = "Principal ID of the Jenkins VM system-assigned managed identity"
  value       = azurerm_linux_virtual_machine.this.identity[0].principal_id
}
