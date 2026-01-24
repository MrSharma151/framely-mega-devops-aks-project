# Resource Group name
variable "resource_group_name" {
  description = "Resource Group name where network resources will be created"
  type        = string
}

# Azure region
variable "location" {
  description = "Azure region for network resources"
  type        = string
}

# Virtual Network name
variable "vnet_name" {
  description = "Name of the Virtual Network"
  type        = string
}

# VNet CIDR block
variable "vnet_cidr" {
  description = "CIDR block for the Virtual Network"
  type        = string
}

# AKS subnet name
variable "aks_subnet_name" {
  description = "Subnet name for AKS"
  type        = string
}

# AKS subnet CIDR
variable "aks_subnet_cidr" {
  description = "CIDR block for AKS subnet"
  type        = string
}

# Jenkins subnet name
variable "jenkins_subnet_name" {
  description = "Subnet name for Jenkins VM"
  type        = string
}

# Jenkins subnet CIDR
variable "jenkins_subnet_cidr" {
  description = "CIDR block for Jenkins VM subnet"
  type        = string
}

# AKS NSG name
variable "aks_nsg_name" {
  description = "Network Security Group name for AKS subnet"
  type        = string
}

# Jenkins NSG name
variable "jenkins_nsg_name" {
  description = "Network Security Group name for Jenkins subnet"
  type        = string
}

# Common tags
variable "tags" {
  description = "Common tags for network resources"
  type        = map(string)
}
