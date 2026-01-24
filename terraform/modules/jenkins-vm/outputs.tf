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
