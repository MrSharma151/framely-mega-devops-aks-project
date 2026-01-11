using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Framely.API.Swagger
{
    /// <summary>
    /// Enhances Swagger documentation for endpoints accepting file uploads via IFormFile.
    /// Ensures multipart/form-data is properly represented in OpenAPI spec.
    /// </summary>
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation == null || context == null || context.ApiDescription == null)
                return;

            var fileParams = context.ApiDescription.ParameterDescriptions
                .Where(p =>
                    p.ModelMetadata?.ContainerType == typeof(IFormFile) ||
                    p.Type == typeof(IFormFile) ||
                    p.Type == typeof(IEnumerable<IFormFile>));

            if (!fileParams.Any())
                return;

            // Define multipart/form-data schema for file upload
            operation.RequestBody = new OpenApiRequestBody
            {
                Content =
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties =
                            {
                                ["file"] = new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary"
                                }
                            },
                            Required = new HashSet<string> { "file" }
                        }
                    }
                }
            };
        }
    }
}