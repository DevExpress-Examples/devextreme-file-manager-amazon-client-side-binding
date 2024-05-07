using Amazon.S3;
using AmazonS3_Backend.Interfaces;
using AmazonS3_Backend.Models;
using AmazonS3_Backend.Providers;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace AmazonS3Backend.Controllers {
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
            } catch (Exception ex) {
                throw new Exception(ex.Message);
            }
        }

        [HttpPut("createDirectory")]
        public async Task<IActionResult> CreateDirectory(string? path, string name) {
            try {
                await provider.CreateDirectoryAsync(path, name);
                return OkResult();
            } catch (AmazonS3Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPut("renameItem")]
        public async Task<IActionResult> RenameItem(string key, string? directory, string newName) {
            try {
                await provider.RenameItemAsync(key, directory, newName);
                return OkResult();
            } catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("moveItem")]
        public async Task<IActionResult> MoveItem(string sourceKey, string destinationKey) {
            try {
                await provider.MoveItemAsync(sourceKey, destinationKey);
                return OkResult();
            } catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("deleteItem")]
        public async Task<IActionResult> DeleteItem(string item) {
            try {
                await provider.DeleteItemAsync(item);
                return OkResult();
            } catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPut("copyItem")]
        public async Task<IActionResult> CopyItem(string sourceKey, string destinationKey) {
            try {
                await provider.CopyItemAsync(sourceKey, destinationKey);
                return OkResult();
            } catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("downloadItems")]
        public async Task<object> DownloadItems([FromBody] string[] keys) {
            try {
                var response = await provider.DownloadItemsAsync(keys);
                return response;
            } catch (Exception ex) {
                return StatusCode(500, ex.Message);
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

                return OkResult();
            } catch (AmazonS3Exception ex) {
                await uploadService.AbortCurrentUploadAsync(provider.Client);
                return StatusCode(500, ex.Message);
            } catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        IActionResult OkResult() {
            return Ok(new { });
        }
    }
}
