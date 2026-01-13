using System;
using Framely.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Framely.Tests.Helpers
{
    /// <summary>
    /// Factory class for creating an in-memory ApplicationDbContext.
    /// This is used in unit tests to avoid dependency on a real SQL Server
    /// and to keep CI/CD pipelines fast and reliable.
    /// </summary>
    public static class TestDbContextFactory
    {
        /// <summary>
        /// Creates a new in-memory database instance with a unique name
        /// to ensure test isolation.
        /// </summary>
        /// <returns>Configured ApplicationDbContext for testing</returns>
        public static ApplicationDbContext Create()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }
    }
}
