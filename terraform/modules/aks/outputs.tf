# AKS cluster ID
output "aks_id" {
  description = "AKS cluster ID"
  value       = azurerm_kubernetes_cluster.this.id
}

# AKS cluster name
output "aks_name" {
  description = "AKS cluster name"
  value       = azurerm_kubernetes_cluster.this.name
}

# AKS kubelet identity (used later for ACR access)
output "kubelet_identity_object_id" {
  description = "Object ID of the AKS kubelet identity"
  value       = azurerm_kubernetes_cluster.this.kubelet_identity[0].object_id
}

# AKS system-assigned managed identity object ID
output "identity_object_id" {
  description = "Object ID of the AKS system-assigned managed identity"
  value       = azurerm_kubernetes_cluster.this.identity[0].principal_id
}

