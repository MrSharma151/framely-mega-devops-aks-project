namespace Framely.Core.DTOs.Auth
{
    /// <summary>
    /// Response DTO returned after successful authentication.
    /// Contains user identity and access token details.
    /// </summary>
    public class AuthResponseDto
    {
        /// <summary>
        /// Unique identifier of the authenticated user.
        /// </summary>
        public string UserId { get; set; } = string.Empty;

        /// <summary>
        /// Full name of the user.
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Email address of the user.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Role assigned to the user (e.g., User, Admin).
        /// </summary>
        public string Role { get; set; } = "User";

        /// <summary>
        /// JWT access token for authenticated requests.
        /// </summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// Expiration timestamp of the access token.
        /// </summary>
        public DateTime ExpiresAt { get; set; }

        /// <summary>
        /// Optional refresh token for renewing access.
        /// </summary>
        public string? RefreshToken { get; set; }
    }
}