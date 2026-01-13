using System.Threading.Tasks;
using Framely.API.Controllers;
using Framely.Core.DTOs.Auth;
using Framely.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Framely.Tests.Controllers
{
    /// <summary>
    /// Unit tests for AuthController.
    /// These tests are intentionally lightweight and focused on
    /// CI/CD pipeline validation rather than deep QA scenarios.
    /// </summary>
    public class AuthControllerTests
    {
        /// <summary>
        /// Verifies that Register endpoint returns HTTP 200 OK
        /// when the authentication service reports success.
        /// </summary>
        [Fact]
        public async Task Register_ReturnsOk_WhenSuccess()
        {
            // Arrange: mock authentication service
            var mockService = new Mock<IAuthService>();
            mockService
                .Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.IdentityResult.Success);

            var controller = new AuthController(mockService.Object);

            var dto = new RegisterDto
            {
                FullName = "Test User",
                Email = "test@test.com",
                Password = "Password@123"
            };

            // Act: call controller action
            var result = await controller.Register(dto);

            // Assert: ensure OK response
            Assert.IsType<OkObjectResult>(result);
        }
    }
}
