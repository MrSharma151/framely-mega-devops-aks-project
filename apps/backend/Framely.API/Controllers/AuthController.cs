using Framely.Core.DTOs.Auth;
using Framely.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Framely.API.Controllers
{
    // API versioning via route prefix
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Injected authentication service (handles registration, login, etc.)
        private readonly IAuthService _authService;

        // Constructor injection for service layer
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Registers a new user with default role = USER
        /// </summary>
        /// <param name="dto">User registration payload</param>
        /// <returns>200 OK if successful, 400 BadRequest with validation or identity errors</returns>
        [HttpPost("register")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Validate incoming model
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            // Delegate registration to service layer
            var result = await _authService.RegisterAsync(dto);

            // Return identity errors if registration fails
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new
                {
                    message = "Registration failed",
                    errors
                });
            }

            // Success response
            return Ok(new { message = "User registered successfully" });
        }

        /// <summary>
        /// Logs in an existing user and returns JWT token
        /// </summary>
        /// <param name="dto">Login credentials</param>
        /// <returns>200 OK with token, 400 BadRequest for validation errors, 401 Unauthorized for invalid credentials</returns>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Validate incoming model
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            // Delegate login to service layer
            var authResponse = await _authService.LoginAsync(dto);

            // Return 401 if credentials are invalid
            if (authResponse == null)
                return Unauthorized(new { message = "Invalid email or password" });

            // Normalize role casing (always uppercase)
            authResponse.Role = authResponse.Role.ToUpperInvariant();

            // Success response with token payload
            return Ok(authResponse);
        }
    }
}