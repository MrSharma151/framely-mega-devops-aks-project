namespace Framely.Core.Models
{
    /// <summary>
    /// Represents a product listed in the Framely catalog.
    /// Contains metadata, pricing, and category association.
    /// </summary>
    public class Product
    {
        /// <summary>
        /// Unique identifier for the product.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Name of the product (e.g., "Ray-Ban Aviator").
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// Brand associated with the product (e.g., "Ray-Ban").
        /// </summary>
        public string? Brand { get; set; }

        /// <summary>
        /// Detailed description of the product.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Price of the product in local currency.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// URL or path to the product image.
        /// Used for display in frontend.
        /// </summary>
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Foreign key referencing the product's category.
        /// </summary>
        public int CategoryId { get; set; }

        /// <summary>
        /// Navigation property for the associated category.
        /// </summary>
        public Category? Category { get; set; }
    }
}