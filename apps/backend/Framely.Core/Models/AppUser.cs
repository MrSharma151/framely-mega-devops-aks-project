using Microsoft.AspNetCore.Identity;

namespace Framely.Core.Models
{
    /// <summary>
    /// Represents an application user in the Framely system.
    /// Inherits from IdentityUser to support ASP.NET Core Identity features.
    /// </summary>
    public class AppUser : IdentityUser
    {
        /// <summary>
        /// Full name of the user. Used for display and personalization.
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Address of the user. Reserved for future use (e.g., billing, shipping).
        /// </summary>
        public string Address { get; set; } = string.Empty;

        /// <summary>
        /// Timestamp when the user account was created.
        /// Stored in UTC for consistency across time zones.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}