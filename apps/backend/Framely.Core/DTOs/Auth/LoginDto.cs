using System.ComponentModel.DataAnnotations;

namespace Framely.Core.DTOs.Auth
{
    /// <summary>
    /// Data Transfer Object for user login requests.
    /// Contains credentials required for authentication.
    /// </summary>
    public class LoginDto
    {
        /// <summary>
        /// Email address of the user.
        /// Required and must follow valid email format.
        /// </summary>
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Password of the user.
        /// Required and must be at least 6 characters long.
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; } = string.Empty;
    }
}