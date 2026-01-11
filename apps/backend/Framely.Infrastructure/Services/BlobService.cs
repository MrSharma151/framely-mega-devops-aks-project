using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Framely.Core.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Framely.Infrastructure.Services
{
    /// <summary>
    /// Provides methods to interact with Azure Blob Storage including upload, delete, and SAS token generation.
    /// </summary>
    public class BlobService : IBlobService
    {
        private readonly BlobContainerClient _containerClient;
        private readonly string _accountName;
        private readonly string _accountKey;

        /// <summary>
        /// Initializes the BlobService with configuration values and ensures the container exists.
        /// </summary>
        /// <param name="configuration">Application configuration</param>
        public BlobService(IConfiguration configuration)
        {
            var connectionString = configuration["Storage:ConnectionString"];
            var containerName = configuration["Storage:Container"];

            _accountName = configuration["Storage:Name"]
                ?? throw new ArgumentNullException("Storage:Name");

            _accountKey = configuration["Storage:Key"]
                ?? throw new ArgumentNullException("Storage:Key");

            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentNullException(nameof(connectionString), "Azure Blob Storage connection string is missing.");

            if (string.IsNullOrEmpty(containerName))
                throw new ArgumentNullException(nameof(containerName), "Azure Blob Storage container name is missing.");

            if (string.IsNullOrEmpty(_accountName) || string.IsNullOrEmpty(_accountKey))
                throw new ArgumentNullException("Storage Name/Key missing in configuration.");

            _containerClient = new BlobContainerClient(connectionString, containerName);
            _containerClient.CreateIfNotExists(PublicAccessType.None);
        }


        /// <summary>
        /// Uploads a file stream to Blob Storage with the specified name and content type.
        /// If a blob with the same name exists, it is overwritten.
        /// </summary>
        /// <param name="fileStream">Stream of the file to upload</param>
        /// <param name="fileName">Name to assign to the blob</param>
        /// <param name="contentType">MIME type of the file</param>
        /// <returns>URL of the uploaded blob</returns>
        public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType)
        {
            var blobClient = _containerClient.GetBlobClient(fileName);

            if (await blobClient.ExistsAsync())
                await blobClient.DeleteAsync();

            var headers = new BlobHttpHeaders { ContentType = contentType };
            await blobClient.UploadAsync(fileStream, headers);

            return blobClient.Uri.ToString();
        }

        /// <summary>
        /// Deletes the specified blob from storage if it exists.
        /// </summary>
        /// <param name="fileName">Name of the blob to delete</param>
        /// <returns>True if deletion was successful; false otherwise</returns>
        public async Task<bool> DeleteAsync(string fileName)
        {
            var blobClient = _containerClient.GetBlobClient(fileName);
            return await blobClient.DeleteIfExistsAsync();
        }

        /// <summary>
        /// Gets the public URL of a blob.
        /// </summary>
        /// <param name="fileName">Name of the blob</param>
        /// <returns>Blob URL string</returns>
        public string GetBlobUrl(string fileName)
        {
            var blobClient = _containerClient.GetBlobClient(fileName);
            return blobClient.Uri.ToString();
        }

        /// <summary>
        /// Generates a time-limited SAS URL for secure access to a blob.
        /// </summary>
        /// <param name="fileName">Name of the blob</param>
        /// <param name="expiryMinutes">Duration in minutes before the SAS token expires</param>
        /// <returns>SAS token URL string</returns>
        public string GenerateSasUrl(string fileName, int expiryMinutes = 30)
        {
            var blobClient = _containerClient.GetBlobClient(fileName);

            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _containerClient.Name,
                BlobName = fileName,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(expiryMinutes)
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Read | BlobSasPermissions.Write);

            var credential = new StorageSharedKeyCredential(_accountName, _accountKey);
            var sasToken = sasBuilder.ToSasQueryParameters(credential).ToString();

            return $"{blobClient.Uri}?{sasToken}";
        }
    }
}