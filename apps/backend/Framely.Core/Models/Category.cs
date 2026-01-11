namespace Framely.Core.Models
{
    /// <summary>
    /// Represents a product category in the Framely system.
    /// Each category can contain multiple products.
    /// </summary>
    public class Category
    {
        /// <summary>
        /// Unique identifier for the category.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Name of the category (e.g., "Sunglasses", "Contact Lenses").
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Optional description providing more details about the category.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Collection of products that belong to this category.
        /// </summary>
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}