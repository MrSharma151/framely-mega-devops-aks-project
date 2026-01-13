using System;
using Framely.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Framely.Tests.Services
{
    /// <summary>
    /// Lightweight unit tests for BlobService.
    /// These tests validate constructor behavior only
    /// to ensure safe failure in CI/CD pipelines.
    /// </summary>
    public class BlobServiceTests
    {
        /// <summary>
        /// Verifies that BlobService throws an exception
        /// when required storage configuration values are missing.
        /// </summary>
        [Fact]
        public void Constructor_Throws_WhenConfigMissing()
        {
            // Arrange: empty configuration (no storage settings)
            var configuration = new ConfigurationBuilder().Build();

            // Act & Assert: constructor should fail fast
            Assert.Throws<ArgumentNullException>(() =>
                new BlobService(configuration)
            );
        }
    }
}
