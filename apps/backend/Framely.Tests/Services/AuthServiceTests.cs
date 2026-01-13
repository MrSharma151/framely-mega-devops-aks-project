using Framely.Core.Models;
using Framely.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace Framely.Tests.Services
{
    /// <summary>
    /// Smoke test to ensure AuthService can be instantiated.
    /// Not intended for full authentication validation.
    /// </summary>
    public class AuthServiceTests
    {
        [Fact]
        public void Service_CanBeCreated()
        {
            var userStore = Mock.Of<IUserStore<AppUser>>();
            var userManager = new UserManager<AppUser>(
                userStore,
                null!, null!, null!, null!, null!, null!, null!, null!);

            var config = Mock.Of<IConfiguration>();

            var service = new AuthService(userManager, config);

            Assert.NotNull(service);
        }
    }
}
