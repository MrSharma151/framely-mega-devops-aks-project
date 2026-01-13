using Framely.API.Controllers;
using Framely.Core.DTOs;
using Framely.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using AutoMapper;

namespace Framely.Tests.Controllers
{
    /// <summary>
    /// Smoke test for CategoriesController.
    /// AutoMapper is mocked to keep tests CI-safe.
    /// </summary>
    public class CategoriesControllerTests
    {
        [Fact]
        public async Task GetAll_ReturnsOk()
        {
            var db = TestDbContextFactory.Create();

            var mapperMock = new Mock<IMapper>();
            mapperMock
                .Setup(m => m.Map<List<CategoryDto>>(It.IsAny<object>()))
                .Returns(new List<CategoryDto>());

            var controller = new CategoriesController(db, mapperMock.Object);

            var result = await controller.GetAll();

            Assert.IsType<OkObjectResult>(result.Result);
        }
    }
}
