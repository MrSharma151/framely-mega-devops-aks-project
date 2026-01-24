# Output to confirm ACR pull role assignment
output "acr_pull_assigned" {
  description = "Indicates that AcrPull role assignment is created"
  value       = true
}

# Output to confirm Key Vault access assignment
output "key_vault_access_assigned" {
  description = "Indicates that Key Vault access role assignment is created"
  value       = true
}
