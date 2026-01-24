# Resource Group
variable "resource_group_name" {
  description = "Resource Group where Jenkins VM will be created"
  type        = string
}

# Azure region
variable "location" {
  description = "Azure region for Jenkins VM"
  type        = string
}

# Jenkins subnet ID
variable "jenkins_subnet_id" {
  description = "Subnet ID for Jenkins VM"
  type        = string
}

# VM name
variable "vm_name" {
  description = "Name of the Jenkins VM"
  type        = string
}

# VM size
variable "vm_size" {
  description = "VM size for Jenkins"
  type        = string
}

# Admin username
variable "admin_username" {
  description = "Admin username for Jenkins VM"
  type        = string
}

# SSH public key
variable "ssh_public_key" {
  description = "SSH public key for Jenkins VM access"
  type        = string
}

# Public IP name
variable "public_ip_name" {
  description = "Public IP resource name"
  type        = string
}

# NIC name
variable "nic_name" {
  description = "Network Interface name"
  type        = string
}

# NSG name
variable "nsg_name" {
  description = "Network Security Group name"
  type        = string
}

# Tags
variable "tags" {
  description = "Common tags"
  type        = map(string)
}
