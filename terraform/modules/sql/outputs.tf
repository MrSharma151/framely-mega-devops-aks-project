# SQL Server name
output "server_name" {
  description = "Name of the Azure SQL Server"
  value       = azurerm_mssql_server.this.name
}

# SQL Database name
output "database_name" {
  description = "Name of the Azure SQL Database"
  value       = azurerm_mssql_database.this.name
}

# SQL Server fully qualified domain name
output "fqdn" {
  description = "Fully qualified domain name of the SQL Server"
  value       = azurerm_mssql_server.this.fully_qualified_domain_name
}
