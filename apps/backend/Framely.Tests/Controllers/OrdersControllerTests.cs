using Framely.API.Controllers;
using Framely.Core.DTOs;
using Framely.Tests.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using AutoMapper;

namespace Framely.Tests.Controllers
{
    /// <summary>
    /// Ensures OrdersController works for ADMIN user.
    /// </summary>
    public class OrdersControllerTests
    {
        [Fact]
        public async Task GetAll_AsAdmin_ReturnsOk()
        {
            var db = TestDbContextFactory.Create();

            var mapperMock = new Mock<IMapper>();
            mapperMock
                .Setup(m => m.Map<List<OrderDto>>(It.IsAny<object>()))
                .Returns(new List<OrderDto>());

            var controller = new OrdersController(db, mapperMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = TestUserFactory.CreateAdmin()
                    }
                }
            };

            var result = await controller.GetAll();

            Assert.IsType<OkObjectResult>(result.Result);
        }
    }
}
