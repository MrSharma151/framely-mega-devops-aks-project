using AutoMapper;
using Framely.Core.Models;
using Framely.Core.DTOs;

namespace Framely.API.Mappings
{
    /// <summary>
    /// AutoMapper configuration profile for Framely domain and DTO mappings.
    /// </summary>
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Product → ProductDto
            // Includes CategoryName from nested Category
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName,
                           opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty));

            // ProductDto → Product
            // Ignores Category navigation; handled manually in controller
            CreateMap<ProductDto, Product>();

            // Category → CategoryDto
            // No nested Products mapping (DTO doesn't expose it)
            CreateMap<Category, CategoryDto>();

            // CategoryDto → Category
            CreateMap<CategoryDto, Category>();

            // OrderItem → OrderItemDto
            // Includes ProductName from nested Product
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductName,
                           opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty));

            // OrderItemDto → OrderItem
            // Product navigation handled externally
            CreateMap<OrderItemDto, OrderItem>();

            // Order → OrderDto
            // Maps nested Items collection
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.Items,
                           opt => opt.MapFrom(src => src.Items));

            // OrderDto → Order
            // Maps Items back into domain model
            CreateMap<OrderDto, Order>()
                .ForMember(dest => dest.Items,
                           opt => opt.MapFrom(src => src.Items));
        }
    }
}