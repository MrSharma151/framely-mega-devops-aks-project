using System.ComponentModel.DataAnnotations;

namespace Framely.Core.DTOs
{
    /// <summary>
    /// Data Transfer Object for creating or updating a product category.
    /// Used in API requests and responses.
    /// </summary>
    public class CategoryDto
    {
        /// <summary>
        /// Unique identifier for the category.
        /// Used in GET and UPDATE operations. Ignored during creation.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Name of the category.
        /// Required field with a maximum length of 100 characters.
        /// </summary>
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Optional description of the category.
        /// Maximum length is 250 characters.
        /// </summary>
        [StringLength(250, ErrorMessage = "Description cannot exceed 250 characters")]
        public string? Description { get; set; }
    }
}