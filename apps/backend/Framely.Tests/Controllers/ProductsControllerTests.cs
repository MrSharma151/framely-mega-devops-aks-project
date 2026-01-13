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
    /// CI-safe smoke test for ProductsController.
    /// </summary>
    public class ProductsControllerTests
    {
        [Fact]
        public async Task GetAll_ReturnsOk()
        {
            var db = TestDbContextFactory.Create();

            var mapperMock = new Mock<IMapper>();
            mapperMock
                .Setup(m => m.Map<List<ProductDto>>(It.IsAny<object>()))
                .Returns(new List<ProductDto>());

            var controller = new ProductsController(db, mapperMock.Object);

            var result = await controller.GetAll();

            Assert.IsType<OkObjectResult>(result.Result);
        }
    }
}
