using System.Security.Claims;

namespace Framely.Tests.Helpers
{
    /// <summary>
    /// Factory class for creating fake authenticated users
    /// used in controller unit tests.
    /// This avoids real authentication and keeps tests fast
    /// and CI/CD pipeline friendly.
    /// </summary>
    public static class TestUserFactory
    {
        /// <summary>
        /// Creates a ClaimsPrincipal representing an ADMIN user.
        /// Used for testing role-restricted endpoints.
        /// </summary>
        /// <returns>ClaimsPrincipal with ADMIN role</returns>
        public static ClaimsPrincipal CreateAdmin()
        {
            return new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, "admin-id"),
                        new Claim(ClaimTypes.Role, "ADMIN")
                    },
                    authenticationType: "TestAuth"
                )
            );
        }

        /// <summary>
        /// Creates a ClaimsPrincipal representing a normal USER.
        /// Used for testing user-level access scenarios.
        /// </summary>
        /// <returns>ClaimsPrincipal with USER role</returns>
        public static ClaimsPrincipal CreateUser()
        {
            return new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, "user-id"),
                        new Claim(ClaimTypes.Role, "USER")
                    },
                    authenticationType: "TestAuth"
                )
            );
        }
    }
}
