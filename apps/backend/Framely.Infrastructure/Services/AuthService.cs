using Framely.Core.DTOs.Auth;
using Framely.Core.Interfaces;
using Framely.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Framely.Infrastructure.Services
{
    /// <summary>
    /// Handles user registration, login, and JWT token generation.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;

        /// <summary>
        /// Initializes AuthService with UserManager and configuration.
        /// </summary>
        public AuthService(UserManager<AppUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        /// <summary>
        /// Registers a new user and assigns the default "USER" role.
        /// Returns IdentityResult indicating success or failure.
        /// </summary>
        /// <param name="dto">User registration details</param>
        /// <returns>IdentityResult with status and errors (if any)</returns>
        public async Task<IdentityResult> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Email is already registered."
                });
            }

            var user = new AppUser
            {
                FullName = dto.FullName,
                UserName = dto.Email,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return result;

            await _userManager.AddToRoleAsync(user, "USER");
            return result;
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token with user info.
        /// </summary>
        /// <param name="dto">User login credentials</param>
        /// <returns>AuthResponseDto if successful; null otherwise</returns>
        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return null;

            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!validPassword) return null;

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "USER";

            var token = await GenerateJwtTokenAsync(user, role);

            var jwtSettings = _config.GetSection("JwtSettings");
            var expiresAt = DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiresInMinutes"]));

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName ?? string.Empty,
                Email = user.Email!,
                Role = role,
                Token = token,
                ExpiresAt = expiresAt
            };
        }

        /// <summary>
        /// Generates a JWT token for the given user and role.
        /// </summary>
        /// <param name="user">Authenticated AppUser entity</param>
        /// <param name="role">User role (e.g., "USER", "ADMIN")</param>
        /// <returns>JWT token string</returns>
        public Task<string> GenerateJwtTokenAsync(AppUser user, string role)
        {
            var jwtSettings = _config.GetSection("JwtSettings");

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.FullName ?? string.Empty),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiresInMinutes"])),
                signingCredentials: creds
            );

            return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
        }
    }
}