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
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public OrdersController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves paginated list of all orders (Admin only)
        /// </summary>
        /// <param name="pageNumber">Page index</param>
        /// <param name="pageSize">Items per page</param>
        /// <param name="sortBy">Sort field (date, amount, status)</param>
        /// <param name="sortOrder">Sort direction (asc or desc)</param>
        /// <param name="status">Optional status filter</param>
        /// <returns>200 OK with paginated order list</returns>
        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll(
            int pageNumber = 1,
            int pageSize = 10,
            string sortBy = "date",
            string sortOrder = "desc",
            string? status = null)
        {
            var query = _context.Orders
                .Include(o => o.Items!)
                .ThenInclude(i => i.Product)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.Status != null && o.Status.ToLower() == status.ToLower());

            query = sortBy.ToLower() switch
            {
                "amount" => sortOrder == "asc" ? query.OrderBy(o => o.TotalAmount) : query.OrderByDescending(o => o.TotalAmount),
                "status" => sortOrder == "asc" ? query.OrderBy(o => o.Status) : query.OrderByDescending(o => o.Status),
                _ => sortOrder == "asc" ? query.OrderBy(o => o.OrderDate) : query.OrderByDescending(o => o.OrderDate)
            };

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var orders = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = _mapper.Map<List<OrderDto>>(orders);

            return Ok(new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                Data = result
            });
        }

        /// <summary>
        /// Retrieves all orders for a specific user (Admin only)
        /// </summary>
        /// <param name="userId">Target user ID</param>
        /// <returns>200 OK with user's orders</returns>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetUserOrders(string userId)
        {
            var userOrders = await _context.Orders
                .Include(o => o.Items!)
                .ThenInclude(i => i.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var result = _mapper.Map<List<OrderDto>>(userOrders);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves a single order by ID (Admin or owner only)
        /// </summary>
        /// <param name="id">Order ID</param>
        /// <returns>200 OK with order, 403 if unauthorized, 404 if not found</returns>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OrderDto>> GetById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items!)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            var loggedInUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("ADMIN");

            if (!isAdmin && order.UserId != loggedInUserId)
                return Forbid();

            var result = _mapper.Map<OrderDto>(order);
            return Ok(result);
        }

        /// <summary>
        /// Places a new order (User only)
        /// </summary>
        /// <param name="orderDto">Order payload</param>
        /// <returns>201 Created with order data</returns>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<OrderDto>> Create(OrderDto orderDto)
        {
            if (orderDto.Items == null || !orderDto.Items.Any())
                return BadRequest("Order must have at least one item.");

            var order = _mapper.Map<Order>(orderDto);

            var loggedInUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(loggedInUserId))
                return Unauthorized("Invalid user token");

            order.UserId = loggedInUserId;
            order.Status = "Pending";
            order.OrderDate = DateTime.UtcNow;

            decimal total = 0;
            foreach (var item in order.Items!)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    return BadRequest($"Invalid product id {item.ProductId}");

                item.UnitPrice = product.Price;
                total += product.Price * item.Quantity;
            }
            order.TotalAmount = total;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var createdDto = _mapper.Map<OrderDto>(order);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, createdDto);
        }

        /// <summary>
        /// Updates order status (Admin only)
        /// </summary>
        /// <param name="id">Order ID</param>
        /// <param name="newStatus">New status value</param>
        /// <returns>204 NoContent if successful, 400/404 on error</returns>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string newStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            var validStatuses = new[] { "Pending", "Processing", "Completed", "Cancelled" };
            if (!validStatuses.Contains(newStatus))
                return BadRequest("Invalid status. Valid: Pending, Processing, Completed, Cancelled");

            order.Status = newStatus;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Cancels or deletes an order (Admin or owner only)
        /// </summary>
        /// <param name="id">Order ID</param>
        /// <returns>204 NoContent if successful, 403/404/400 on error</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> CancelOrDeleteOrder(int id)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return NotFound();

            var loggedInUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("ADMIN");

            if (!isAdmin && order.UserId != loggedInUserId)
                return Forbid();

            if (isAdmin)
            {
                _context.Orders.Remove(order);
            }
            else
            {
                if (order.Status == "Pending")
                    order.Status = "Cancelled";
                else
                    return BadRequest("Cannot cancel a completed order.");
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Retrieves orders for the logged-in user
        /// </summary>
        /// <returns>200 OK with user's orders, 401 if token invalid</returns>
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
        {
            var loggedInUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(loggedInUserId))
                return Unauthorized();

            var myOrders = await _context.Orders
                .Include(o => o.Items!)
                .ThenInclude(i => i.Product)
                .Where(o => o.UserId == loggedInUserId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var result = _mapper.Map<List<OrderDto>>(myOrders);
            return Ok(result);
        }
    }
}