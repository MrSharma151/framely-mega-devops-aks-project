using Framely.API.Controllers;
using Framely.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Framely.Tests.Controllers
{
    /// <summary>
    /// Unit tests for BlobController.
    /// These tests validate basic controller behavior only
    /// to ensure CI/CD pipeline safety.
    /// </summary>
    public class BlobControllerTests
    {
        /// <summary>
        /// Verifies that GetSasToken returns HTTP 400 BadRequest
        /// when the file name is missing or empty.
        /// </summary>
        [Fact]
        public void GetSasToken_ReturnsBadRequest_WhenFileNameMissing()
        {
            // Arrange: mock blob service and logger
            var blobServiceMock = new Mock<IBlobService>();
            var loggerMock = new Mock<ILogger<BlobController>>();

            var controller = new BlobController(
                blobServiceMock.Object,
                loggerMock.Object
            );

            // Act: call endpoint with empty file name
            var result = controller.GetSasToken(string.Empty);

            // Assert: verify BadRequest response
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
