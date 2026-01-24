# Azure Container Registry ID
variable "acr_id" {
  description = "ID of the Azure Container Registry"
  type        = string
}

# Azure Key Vault ID
variable "key_vault_id" {
  description = "ID of the Azure Key Vault"
  type        = string
}

# AKS kubelet identity object ID
# Used specifically for pulling images from ACR
variable "aks_kubelet_identity_object_id" {
  description = "Object ID of the AKS kubelet identity"
  type        = string
}

# AKS Managed Identity object ID
# Used for accessing Azure services like Key Vault
variable "aks_identity_object_id" {
  description = "Object ID of the AKS system-assigned managed identity"
  type        = string
}
