using Amazon.S3;
using AmazonS3_Backend.Interfaces;
using AmazonS3_Backend.Models;
using AmazonS3_Backend.Providers;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication4.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AmazonS3Controller : ControllerBase {
        AmazonS3Provider provider;
        IAmazonS3FileUploadService uploadService;
        
        public AmazonS3Controller(IAmazonS3 client, IAmazonS3FileUploadService service) {
            uploadService = service;
            provider = new AmazonS3Provider(client, "test-devexpress-bucket");
        }

        [HttpGet("getItems")]
        public async Task<IActionResult> GetItems(string? path) {
            try {
                var items = await provider.GetItemsAsync(path);
                return Ok(items);
            } catch (AmazonS3Exception ex) {
                return CreateErrorResult(ex.Message);
            }
        }

        [HttpPut("createDirectory")]
        public async Task<ActionResult> CreateDirectory(string? path, string name) {
            try {
                await provider.CreateDirectoryAsync(path, name);
                return CreateSuccessResult();
            } catch (AmazonS3Exception ex) {
                return CreateErrorResult(ex.Message);
            }
        }
        [HttpPut("renameItem")]
        public async Task<ActionResult> RenameItem(string key, string? directory, string newName) {
            try {
                await provider.RenameItemAsync(key, directory, newName);
                return CreateSuccessResult();
            } catch (Exception ex) {
                return CreateErrorResult(ex.Message);
            }
        }

        [HttpPost("moveItem")]
        public async Task<ActionResult> MoveItem(string sourceKey, string destinationKey) {
            try {
                await provider.MoveItemAsync(sourceKey, destinationKey);
                return CreateSuccessResult();
            } catch (Exception ex) {
                return CreateErrorResult(ex.Message);
            }
        }

        [HttpPost("deleteItem")]
        public async Task<ActionResult> DeleteItem(string item) {
            try {
                await provider.DeleteItemAsync(item);
                return CreateSuccessResult();
            } catch (Exception ex) {
                return CreateErrorResult(ex.Message);
            }
        }
        [HttpPut("copyItem")]
        public async Task<ActionResult> CopyItem(string sourceKey, string destinationKey) {
            try {
                await provider.CopyItemAsync(sourceKey, destinationKey);
                return CreateSuccessResult();
            } catch (Exception ex) {
                return CreateErrorResult(ex.Message);
            }
        }
        [HttpPost("downloadItems")]
        public async Task<object> DownloadItems([FromBody] string[] keys) {
            try {
                var response = await provider.DownloadItemsAsync(keys);
                return response;
            } catch (Exception ex) {
                return CreateErrorResult(ex.Message);
            }
        }
        [HttpPost("uploadFileChunk")]
        public async Task<IActionResult> UploadFileChunk([FromForm] UploadFileChunkRequestModel model) {
            try {
                if (model == null || model.File == null || string.IsNullOrEmpty(model.FileName) ||
                    string.IsNullOrEmpty(model.FileSize) || string.IsNullOrEmpty(model.DirectoryPath)) {
                    return BadRequest("Invalid request parameters.");
                }

                if (!int.TryParse(model.FileSize, out int fileSize)) {
                    return BadRequest("Invalid file size.");
                }

                if (model.ChunkNumber < 0 || model.ChunkNumber > model.ChunkCount) {
                    return BadRequest("Invalid chunk number.");
                }

                if (model.ChunkNumber == 0) {
                    await uploadService.InitializeUploadRequestAsync(provider.Client, provider.BucketName, $"{model.DirectoryPath}{model.FileName}");
                }

                if (model.ChunkNumber <= model.ChunkCount) {
                    using (var stream = model.File.OpenReadStream()) {
                        await uploadService.UploadDataChunkAsync(model.ChunkNumber, fileSize, stream);
                    }
                }

                if (model.ChunkCount - 1 == model.ChunkNumber) {
                    await uploadService.CompleteUploadRequestAsync();
                }

                return CreateSuccessResult();
            } catch (AmazonS3Exception ex) {
                await uploadService.AbortCurrentUploadAsync(provider.Client);
                return CreateErrorResult(ex.Message);
            } catch (Exception ex) {
                return CreateErrorResult("An unexpected error occurred.");
            }
        }

        ActionResult CreateSuccessResult() {
            return Ok(new { success = true });
        }
        ActionResult CreateErrorResult(string message) {
            return Ok(new { errorCode = 32767, errorText = message, success = false });
        }
    }
}
