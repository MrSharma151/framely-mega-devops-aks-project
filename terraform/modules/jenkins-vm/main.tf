# ------------------------------------------------------------
# Jenkins VM Module
# ------------------------------------------------------------
# This module provisions a dedicated Azure Virtual Machine
# for running Jenkins CI server.
#
# The VM is intentionally kept outside AKS to ensure:
# - Clean separation of CI and runtime
# - Easier debugging
# - Real-world architecture alignment
# ------------------------------------------------------------


# -------------------------
# Public IP for Jenkins VM
# -------------------------
resource "azurerm_public_ip" "this" {

  # Name of the public IP
  name = var.public_ip_name

  # Azure region
  location = var.location

  # Resource Group
  resource_group_name = var.resource_group_name

  # Static IP ensures Jenkins URL does not change
  allocation_method = "Static"

  # Standard SKU is recommended for production
  sku = "Standard"

  tags = var.tags
}


# -------------------------
# Network Interface (NIC)
# -------------------------
resource "azurerm_network_interface" "this" {

  # Name of the NIC
  name = var.nic_name

  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name = "primary"

    # Jenkins VM subnet
    subnet_id = var.jenkins_subnet_id

    # Private IP assigned dynamically
    private_ip_address_allocation = "Dynamic"

    # Attach public IP
    public_ip_address_id = azurerm_public_ip.this.id
  }

  tags = var.tags
}


# -------------------------
# Network Security Group
# -------------------------
resource "azurerm_network_security_group" "this" {

  name                = var.nsg_name
  location            = var.location
  resource_group_name = var.resource_group_name

  # Allow SSH access (should be restricted to your IP later)
  security_rule {
    name                       = "allow-ssh"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # Allow Jenkins UI access (default port 8080)
  security_rule {
    name                       = "allow-jenkins-ui"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8080"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = var.tags
}


# -------------------------
# Associate NSG with NIC
# -------------------------
resource "azurerm_network_interface_security_group_association" "this" {
  network_interface_id      = azurerm_network_interface.this.id
  network_security_group_id = azurerm_network_security_group.this.id
}


# -------------------------
# Jenkins Virtual Machine
# -------------------------
resource "azurerm_linux_virtual_machine" "this" {

  # Name of the VM
  name = var.vm_name

  location            = var.location
  resource_group_name = var.resource_group_name

  # VM size (cost-optimized)
  size = var.vm_size

  # Attach NIC
  network_interface_ids = [
    azurerm_network_interface.this.id
  ]

  # Admin username
  admin_username = var.admin_username

  # SSH authentication only (no passwords)
  disable_password_authentication = true

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }

  # Managed Identity for the VM
  identity {
    type = "SystemAssigned"
  }

  # OS disk configuration
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  # Ubuntu LTS image
  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  tags = var.tags
}
