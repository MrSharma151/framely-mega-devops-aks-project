using System.IO;
using System.Threading.Tasks;

namespace Framely.Core.Interfaces
{
    /// <summary>
    /// Provides methods for uploading, deleting, and accessing blobs in Azure Blob Storage.
    /// </summary>
    public interface IBlobService
    {
        /// <summary>
        /// Uploads a file stream to Blob Storage with the specified name and content type.
        /// </summary>
        /// <param name="fileStream">Stream of the file to upload</param>
        /// <param name="fileName">Name to assign to the blob</param>
        /// <param name="contentType">MIME type of the file</param>
        /// <returns>URL of the uploaded blob</returns>
        Task<string> UploadAsync(Stream fileStream, string fileName, string contentType);

        /// <summary>
        /// Deletes the specified blob from storage.
        /// </summary>
        /// <param name="fileName">Name of the blob to delete</param>
        /// <returns>True if deletion was successful; false otherwise</returns>
        Task<bool> DeleteAsync(string fileName);

        /// <summary>
        /// Gets the public URL of a blob.
        /// </summary>
        /// <param name="fileName">Name of the blob</param>
        /// <returns>Blob URL string</returns>
        string GetBlobUrl(string fileName);

        /// <summary>
        /// Generates a time-limited SAS URL for secure access to a blob.
        /// </summary>
        /// <param name="fileName">Name of the blob</param>
        /// <param name="expiryMinutes">Duration in minutes before the SAS token expires</param>
        /// <returns>SAS token URL string</returns>
        string GenerateSasUrl(string fileName, int expiryMinutes = 30);
    }
}