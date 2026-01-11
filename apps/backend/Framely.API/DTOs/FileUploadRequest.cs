using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Framely.API.DTOs
{
    /// <summary>
    /// Represents a file upload payload for single-file endpoints.
    /// </summary>
    public class FileUploadRequest
    {
        /// <summary>
        /// The file to be uploaded. Must be provided in multipart/form-data.
        /// </summary>
        [Required(ErrorMessage = "File is required.")]
        public IFormFile File { get; set; } = null!;
    }
}