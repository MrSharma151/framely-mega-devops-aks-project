namespace Framely.Core.DTOs.Auth
{
    public class AdminResetPasswordDto
    {
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
    }
}