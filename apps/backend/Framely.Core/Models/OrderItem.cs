namespace Framely.Core.Models
{
    /// <summary>
    /// Represents an individual item within a customer order.
    /// Links to both the product and the parent order.
    /// </summary>
    public class OrderItem
    {
        /// <summary>
        /// Unique identifier for the order item.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Foreign key referencing the associated product.
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Navigation property for the associated product.
        /// </summary>
        public Product? Product { get; set; }

        /// <summary>
        /// Quantity of the product ordered.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Price per unit at the time the order was placed.
        /// Used to preserve historical pricing.
        /// </summary>
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// Foreign key referencing the parent order.
        /// </summary>
        public int OrderId { get; set; }

        /// <summary>
        /// Navigation property for the parent order.
        /// </summary>
        public Order? Order { get; set; }
    }
}