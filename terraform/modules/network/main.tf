# ------------------------------------------------------------
# Network Module
# ------------------------------------------------------------
# This module creates the core Azure networking components
# required for the Framely environment:
#
# - Virtual Network (VNet)
# - AKS Subnet
# - Jenkins VM Subnet
# - Network Security Groups (NSGs)
# - NSG to Subnet associations
# ------------------------------------------------------------


# -------------------------
# Virtual Network
# -------------------------
resource "azurerm_virtual_network" "this" {

  # Name of the Virtual Network
  name = var.vnet_name

  # Address space for the VNet
  address_space = [var.vnet_cidr]

  # Azure region
  location = var.location

  # Resource Group where VNet will be created
  resource_group_name = var.resource_group_name

  # Common tags
  tags = var.tags
}


# -------------------------
# AKS Subnet
# -------------------------
resource "azurerm_subnet" "aks" {

  # Subnet name for AKS nodes
  name = var.aks_subnet_name

  # Resource Group
  resource_group_name = var.resource_group_name

  # Parent VNet name
  virtual_network_name = azurerm_virtual_network.this.name

  # CIDR range for AKS subnet
  address_prefixes = [var.aks_subnet_cidr]
}


# -------------------------
# Jenkins VM Subnet
# -------------------------
resource "azurerm_subnet" "jenkins" {

  # Subnet name for Jenkins VM
  name = var.jenkins_subnet_name

  # Resource Group
  resource_group_name = var.resource_group_name

  # Parent VNet name
  virtual_network_name = azurerm_virtual_network.this.name

  # CIDR range for Jenkins VM subnet
  address_prefixes = [var.jenkins_subnet_cidr]
}


# -------------------------
# NSG for AKS Subnet
# -------------------------
resource "azurerm_network_security_group" "aks" {

  # Name of the NSG
  name = var.aks_nsg_name

  location            = var.location
  resource_group_name = var.resource_group_name

  # AKS manages most networking internally.
  # We intentionally keep this NSG minimal.
  tags = var.tags
}


# -------------------------
# NSG for Jenkins VM Subnet
# -------------------------
resource "azurerm_network_security_group" "jenkins" {

  # Name of the NSG
  name = var.jenkins_nsg_name

  location            = var.location
  resource_group_name = var.resource_group_name

  # Example inbound rules could be added later:
  # - SSH (restricted IP)
  # - HTTP/HTTPS (if required)
  tags = var.tags
}


# -------------------------
# Associate NSG with AKS Subnet
# -------------------------
resource "azurerm_subnet_network_security_group_association" "aks" {

  subnet_id                 = azurerm_subnet.aks.id
  network_security_group_id = azurerm_network_security_group.aks.id
}


# -------------------------
# Associate NSG with Jenkins Subnet
# -------------------------
resource "azurerm_subnet_network_security_group_association" "jenkins" {

  subnet_id                 = azurerm_subnet.jenkins.id
  network_security_group_id = azurerm_network_security_group.jenkins.id
}
