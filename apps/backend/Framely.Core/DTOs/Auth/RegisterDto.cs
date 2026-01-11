using System.ComponentModel.DataAnnotations;

namespace Framely.Core.DTOs.Auth
{
    /// <summary>
    /// Data Transfer Object for user registration.
    /// Captures user details required to create a new account.
    /// </summary>
    public class RegisterDto
    {
        /// <summary>
        /// Full name of the user.
        /// Required and must be between 3 and 50 characters.
        /// </summary>
        [Required(ErrorMessage = "Full name is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Full name must be between 3 and 50 characters")]
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Email address of the user.
        /// Required and must follow valid email format.
        /// </summary>
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Password for the account.
        /// Must be at least 8 characters and include uppercase, lowercase, number, and special character.
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$",
            ErrorMessage = "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.")]
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Optional phone number of the user.
        /// Must follow valid phone format if provided.
        /// </summary>
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// Default role assigned during registration.
        /// This value is server-controlled and ignored from client input.
        /// </summary>
        public string Role { get; } = "USER";
    }
}