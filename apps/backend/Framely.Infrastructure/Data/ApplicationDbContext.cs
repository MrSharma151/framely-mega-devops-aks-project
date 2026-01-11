using Framely.Core.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Framely.Infrastructure.Data
{
    /// <summary>
    /// Application database context extending IdentityDbContext to include Identity tables and custom entities.
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        /// <summary>
        /// Initializes the DbContext with specified options.
        /// </summary>
        /// <param name="options">DbContext configuration options</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Custom domain entities
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;

        /// <summary>
        /// Configures entity relationships and precision settings.
        /// </summary>
        /// <param name="modelBuilder">ModelBuilder instance for configuring entities</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ensure Identity tables are created
            base.OnModelCreating(modelBuilder);

            // OrderItem → Product (many-to-one)
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            // OrderItem → Order (many-to-one)
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId);

            // Decimal precision to avoid silent truncation
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);
        }
    }
}