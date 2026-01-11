namespace Framely.Core.Models
{
    /// <summary>
    /// Represents a customer order in the Framely system.
    /// Contains metadata, customer details, and associated order items.
    /// </summary>
    public class Order
    {
        /// <summary>
        /// Unique identifier for the order.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Timestamp when the order was placed.
        /// Stored in UTC for consistency.
        /// </summary>
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Name of the customer placing the order.
        /// Optional for guest checkouts.
        /// </summary>
        public string? CustomerName { get; set; }

        /// <summary>
        /// Email address of the customer.
        /// Used for order confirmation and communication.
        /// </summary>
        public string? Email { get; set; }

        /// <summary>
        /// Mobile number of the customer.
        /// Optional field for contact purposes.
        /// </summary>
        public string? MobileNumber { get; set; }

        /// <summary>
        /// Delivery or billing address for the order.
        /// </summary>
        public string? Address { get; set; }

        /// <summary>
        /// Total monetary value of the order.
        /// </summary>
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Current status of the order (e.g., "Pending", "Processing", "Completed").
        /// Defaults to "Pending".
        /// </summary>
        public string Status { get; set; } = "Pending";

        /// <summary>
        /// ID of the user who placed the order.
        /// </summary>
        public string? UserId { get; set; }

        /// <summary>
        /// Collection of items included in the order.
        /// </summary>
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}