using AutoMapper;
using Framely.Core.DTOs;
using Framely.Core.Models;
using Framely.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Framely.API.Controllers
{
    // API versioning via route prefix
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CategoriesController : ControllerBase
    {
        // Injected EF DbContext
        private readonly ApplicationDbContext _context;

        // Injected AutoMapper instance
        private readonly IMapper _mapper;

        // Constructor injection for dependencies
        public CategoriesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves paginated list of categories with optional sorting
        /// </summary>
        /// <param name="pageNumber">Page index (default = 1)</param>
        /// <param name="pageSize">Items per page (default = 10)</param>
        /// <param name="sortBy">Sort field (name or id)</param>
        /// <param name="sortOrder">Sort direction (asc or desc)</param>
        /// <returns>200 OK with paginated category list</returns>
        [HttpGet]
        [AllowAnonymous] // public endpoint
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll(
            int pageNumber = 1,
            int pageSize = 10,
            string sortBy = "name",
            string sortOrder = "asc")
        {
            // Base query
            var query = _context.Categories.AsQueryable();

            // Apply sorting
            switch (sortBy.ToLower())
            {
                case "id":
                    query = sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(c => c.Id)
                        : query.OrderBy(c => c.Id);
                    break;
                default:
                    query = sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(c => c.Name)
                        : query.OrderBy(c => c.Name);
                    break;
            }

            // Pagination metadata
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // Fetch paginated data
            var categories = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = _mapper.Map<List<CategoryDto>>(categories);

            // Return structured response
            var response = new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                Data = result
            };

            return Ok(response);
        }

        /// <summary>
        /// Retrieves a single category by ID
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <returns>200 OK with category, 404 NotFound if missing</returns>
        [HttpGet("{id}")]
        [AllowAnonymous] // public endpoint
        public async Task<ActionResult<CategoryDto>> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            var result = _mapper.Map<CategoryDto>(category);
            return Ok(result);
        }

        /// <summary>
        /// Creates a new category
        /// </summary>
        /// <param name="categoryDto">Category payload</param>
        /// <returns>201 Created with category data</returns>
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<CategoryDto>> Create(CategoryDto categoryDto)
        {
            var category = _mapper.Map<Category>(categoryDto);
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<CategoryDto>(category);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, result);
        }

        /// <summary>
        /// Updates an existing category
        /// </summary>
        /// <param name="id">Target category ID</param>
        /// <param name="categoryDto">Updated payload</param>
        /// <returns>204 NoContent if successful, 400/404 on error</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Update(int id, CategoryDto categoryDto)
        {
            if (id != categoryDto.Id)
                return BadRequest("Id mismatch");

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            _mapper.Map(categoryDto, category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Deletes a category by ID
        /// </summary>
        /// <param name="id">Target category ID</param>
        /// <returns>204 NoContent if successful, 404 if not found</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}