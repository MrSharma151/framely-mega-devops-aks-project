using Framely.Core.DTOs.Auth;
using Framely.Core.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Framely.Core.Interfaces
{
    /// <summary>
    /// Defines authentication-related operations such as registration, login, and token generation.
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Registers a new user using the provided registration data.
        /// Returns an IdentityResult indicating success or failure.
        /// </summary>
        /// <param name="dto">User registration details</param>
        /// <returns>IdentityResult with status and errors (if any)</returns>
        Task<IdentityResult> RegisterAsync(RegisterDto dto);

        /// <summary>
        /// Authenticates a user using login credentials.
        /// Returns an AuthResponseDto containing JWT token and user info.
        /// </summary>
        /// <param name="dto">User login credentials</param>
        /// <returns>AuthResponseDto if successful; null otherwise</returns>
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);

        /// <summary>
        /// Generates a JWT token for the given authenticated user and role.
        /// </summary>
        /// <param name="user">Authenticated AppUser entity</param>
        /// <param name="role">User role (e.g., "User", "Admin")</param>
        /// <returns>JWT token string</returns>
        Task<string> GenerateJwtTokenAsync(AppUser user, string role);
    }
}

/*
==========================================
 FUTURE EXTENSIONS (For better Auth)
------------------------------------------
   Add Refresh Token support for long-lived sessions
   Add Logout functionality (invalidate refresh tokens)
   Implement Password Reset / Forgot Password flow
   Add Email Verification after registration
   Implement Multi-Factor Authentication (MFA)
   Add Role/Policy-based access control (RBAC)
==========================================
*/