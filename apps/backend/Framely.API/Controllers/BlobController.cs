using Framely.Core.Interfaces;
using Framely.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Framely.API.Controllers
{
    // API versioning via route prefix
    [ApiController]
    [Route("api/v1/[controller]")]
    public class BlobController : ControllerBase
    {
        // Injected blob service (handles SAS, upload, delete)
        private readonly IBlobService _blobService;

        // Injected logger for diagnostics
        private readonly ILogger<BlobController> _logger;

        // Constructor injection for services
        public BlobController(IBlobService blobService, ILogger<BlobController> logger)
        {
            _blobService = blobService;
            _logger = logger;
        }

        /// <summary>
        /// Generates a SAS token for secure client-side upload
        /// </summary>
        /// <param name="fileName">Target file name</param>
        /// <returns>200 OK with SAS URL, 400 BadRequest if missing, 500 on failure</returns>
        [HttpGet("sas-token")]
        [Authorize(Roles = "ADMIN")] // restrict access if needed
        public IActionResult GetSasToken([FromQuery] string fileName)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(fileName))
                return BadRequest(new { Message = "File name is required." });

            try
            {
                // Generate SAS URL via service
                var sasUrl = _blobService.GenerateSasUrl(fileName);
                return Ok(new { Url = sasUrl });
            }
            catch (Exception ex)
            {
                // Log and return error
                _logger.LogError(ex, "Error generating SAS token for {FileName}", fileName);
                return StatusCode(500, new { Message = "Error generating SAS token." });
            }
        }

        /// <summary>
        /// Uploads an image file to Blob Storage
        /// </summary>
        /// <param name="request">File upload payload</param>
        /// <returns>200 OK with Blob URL, 400 BadRequest for invalid input, 500 on failure</returns>
        [HttpPost("upload")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Upload([FromForm] FileUploadRequest request)
        {
            var file = request.File;

            // Validate file presence
            if (file == null || file.Length == 0)
                return BadRequest(new { Message = "No file uploaded." });

            // Validate file size (max 2 MB)
            const long maxFileSize = 2 * 1024 * 1024;
            if (file.Length > maxFileSize)
                return BadRequest(new { Message = "File size must be less than 2 MB." });

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp", "image/avif" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest(new { Message = "Only image files (JPEG, PNG, GIF, WebP, Avif) are allowed." });

            try
            {
                // Generate unique file name
                var extension = Path.GetExtension(file.FileName);
                var uniqueFileName = $"{Guid.NewGuid()}{extension}";

                // Upload to Blob Storage
                var blobUrl = await _blobService.UploadAsync(
                    file.OpenReadStream(),
                    uniqueFileName,
                    file.ContentType
                );

                return Ok(new { Url = blobUrl });
            }
            catch (Exception ex)
            {
                // Log and return error
                _logger.LogError(ex, "Error uploading file {FileName}", file?.FileName);
                return StatusCode(500, new { Message = "Error uploading file." });
            }
        }

        /// <summary>
        /// Deletes a file from Blob Storage
        /// </summary>
        /// <param name="fileName">Target file name</param>
        /// <returns>204 NoContent if successful, 400 BadRequest if missing, 500 on failure</returns>
        [HttpDelete("{fileName}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Delete(string fileName)
        {
            // Validate input
            if (string.IsNullOrEmpty(fileName))
                return BadRequest(new { Message = "File name is required." });

            try
            {
                // Delete via service
                await _blobService.DeleteAsync(fileName);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log and return error
                _logger.LogError(ex, "Error deleting file {FileName}", fileName);
                return StatusCode(500, new { Message = "Error deleting file." });
            }
        }
    }
}