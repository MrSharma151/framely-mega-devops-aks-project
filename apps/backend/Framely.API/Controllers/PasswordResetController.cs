using Framely.Core.DTOs.Auth;
using Framely.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Framely.API.Controllers
{
    [Route("api/v1/password-reset")]
    [ApiController]
    public class PasswordResetController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        public PasswordResetController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        /// <summary>
        /// Allows authenticated ADMIN to reset their own password by verifying current password
        /// </summary>
        /// <param name="dto">Payload containing current and new password</param>
        /// <returns>200 OK if successful, 400 BadRequest for validation errors, 401 Unauthorized if user not found</returns>
        [HttpPost("admin")]
        [Authorize(Roles = "ADMIN")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ResetAdminPassword([FromBody] AdminResetPasswordDto dto)
        {
            if (User.FindFirstValue(ClaimTypes.NameIdentifier) is not string userId || string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "User ID missing or invalid." });

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized(new { message = "Admin user not found" });

            var isValid = await _userManager.CheckPasswordAsync(user, dto.CurrentPassword);
            if (!isValid)
                return BadRequest(new { message = "Current password is incorrect" });

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            if (result.Succeeded)
                return Ok(new { message = "Password changed successfully" });

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { message = "Password change failed", errors });
        }
    }
}