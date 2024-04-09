﻿using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using DevExtreme.AspNet.Mvc.FileManagement;

namespace AmazonS3_Backend.Providers {
    public class AmazonS3Provider {
        const string Delimiter = "/";
        const string ArchiveName = "archive.zip";
        public IAmazonS3 Client { get; private set; }
        public string BucketName { get; private set; }
        public AmazonS3Provider(IAmazonS3 client, string bucketName) {
            BucketName = bucketName;
            Client = client;
        }

        public async Task<IEnumerable<FileSystemItem>> GetItemsAsync(string? path) {
            List<FileSystemItem> result = new List<FileSystemItem>();
            ListObjectsV2Request request = new ListObjectsV2Request {
                BucketName = BucketName,
                Prefix = GetPrefixFromPath(path),
                Delimiter = Delimiter
            };

            ListObjectsV2Response response;
            do {
                response = await Client.ListObjectsV2Async(request);
                var directories = await GetDirectoriesFromCommonPrefixes(response.CommonPrefixes);
                result.AddRange(directories);

                var objects = GetItemsFromS3Objects(response.S3Objects);
                result.AddRange(objects);

                request.ContinuationToken = response.NextContinuationToken;

            } while (response.IsTruncated);
            return result;
        }

        public async Task CopyItemAsync(string itemKey, string destinationKey) {
            if(IsDirectory(itemKey)) {
                throw new NotImplementedException("Copying directories is not supported");
            }

            var request = new CopyObjectRequest() {
                SourceBucket = BucketName,
                DestinationBucket = BucketName,
                SourceKey = itemKey,
                DestinationKey = destinationKey
            };
            try {
                await Client.CopyObjectAsync(request);
            } catch (AmazonS3Exception ex) {
                throw new Exception(ex.Message);
            }
        }
        string GetDestinationKey(string itemKey, string? destinationDirectory) {
            if (string.IsNullOrEmpty(itemKey)) {
                throw new ArgumentException($"Item key cannot be null or empty");
            }
            if (string.IsNullOrEmpty(destinationDirectory)) {
                return $"{GetName(itemKey)}";
            }
            return $"{destinationDirectory}{GetName(itemKey)}";
        }
        public async Task CreateDirectoryAsync(string? path, string name) {
            var request = new PutObjectRequest {
                BucketName = BucketName,
                Key = GetNewDirectoryName(path, name),
            };
            try {
                PutObjectResponse response = await Client.PutObjectAsync(request);
            } catch (AmazonS3Exception ex) {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteItemAsync(string itemKey) {
            try {
                if (IsDirectory(itemKey)) {
                    await DeleteDirectoryAsync(itemKey);
                } else {
                    await Client.DeleteObjectAsync(BucketName, itemKey);
                }
            } catch (AmazonS3Exception ex) {
                throw new Exception(ex.Message);
            }

        }

        async Task DeleteDirectoryAsync(string directoryKey) {
                var itemsRequest = new ListObjectsV2Request {
                    BucketName = BucketName,
                    Prefix = directoryKey
                };

                var deleteObjectsRequest = new DeleteObjectsRequest {
                    BucketName = BucketName
                };

                ListObjectsV2Response listResponse;
                do {
                    listResponse = await Client.ListObjectsV2Async(itemsRequest);
                    foreach (S3Object item in listResponse.S3Objects.OrderBy(x => x.Key)) {
                        deleteObjectsRequest.AddKey(item.Key);
                        if (deleteObjectsRequest.Objects.Count == 1000) {
                            await Client.DeleteObjectsAsync(deleteObjectsRequest);
                            deleteObjectsRequest.Objects.Clear();
                        }
                        itemsRequest.StartAfter = item.Key;
                    }
                }
                while (listResponse.IsTruncated);
                if (deleteObjectsRequest.Objects.Count > 0) {
                    await Client.DeleteObjectsAsync(deleteObjectsRequest);
                }
        }

        public async Task<FileContentResult> DownloadItemsAsync(string[] keys) {
            if (keys == null || keys.Length == 0)
                return null;

            if (keys.Length > 1) {
                return await DownloadFilesAsArchive(keys);
            } 

            return await DownloadSingleFile(keys[0]);
        }

        public async Task<FileContentResult> DownloadFilesAsArchive(string[] keys) {
            using (var memoryStream = new MemoryStream()) {
                using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true)) {
                    foreach (var file in keys) {
                        using (var response = await Client.GetObjectAsync(BucketName, file)) {
                            using (var entryStream = zipArchive.CreateEntry(Path.GetFileName(file)).Open()) {
                                await response.ResponseStream.CopyToAsync(entryStream);
                            }
                        }
                    }
                }
                var result = new FileContentResult(memoryStream.ToArray(), "application/octet-stream") {
                    FileDownloadName = ArchiveName
                };
                return result;
            }
        }

        public async Task<FileContentResult> DownloadSingleFile(string key) {
            var request = new GetObjectRequest {
                BucketName = BucketName,
                Key = GetName(key)
            };

            using (var response = await Client.GetObjectAsync(request)) {
                var memoryStream = new MemoryStream();
                await response.ResponseStream.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                var fileName = Path.GetFileName(key);
                var result = new FileContentResult(memoryStream.ToArray(), "application/octet-stream") {
                    FileDownloadName = fileName
                };
                return result;
            }
        }

        public async Task MoveItemAsync(string sourceKey, string destinationKey) {
            try {
                await CopyItemAsync(sourceKey, destinationKey);
                await DeleteItemAsync(sourceKey);
            } catch (Exception) {
                throw;
            }
        }
        public async Task RenameItemAsync(string key, string? directory, string newName) {
            if (IsDirectory(key)) {
                throw new NotImplementedException("Renaming directories is not implemented");
            }
            try {
                await CopyItemAsync(key, $"{directory}{newName}");
                await DeleteItemAsync(key);
            } catch (Exception) {
                throw;
            }
        }

        List<FileSystemItem> GetItemsFromS3Objects(List<S3Object> objects) {
            var result = new List<FileSystemItem>();
            foreach (S3Object obj in objects) {
                if (IsDirectory(obj.Key)) {
                    continue;
                }
                string name = GetName(obj.Key);
                string key = obj.Key;
                long size = obj.Size;
                DateTime dateModified = obj.LastModified;

                bool isDirectory = IsDirectory(obj.Key);
                bool hasSubdirectories = isDirectory;

                FileSystemItem item = new FileSystemItem {
                    Name = name,
                    Key = key,
                    Size = size,
                    DateModified = dateModified,
                    IsDirectory = isDirectory,
                    HasSubDirectories = hasSubdirectories
                };
                result.Add(item);
            }
            return result;
        }
        public string GetDirectoryNameFromKey(string key) {
            if (string.IsNullOrEmpty(key))
                throw new ArgumentException("Directory name cannot be empty");

            if (!IsDirectory(key))
                throw new ArgumentException("Specified path is not a valid directory name");

            string[] parts = key.Split(Delimiter);
            return parts[parts.Length - 2];
        }
        public async Task<List<FileSystemItem>> GetDirectoriesFromCommonPrefixes(List<string> prefixes) {
            var result = new List<FileSystemItem>();
            foreach (var item in prefixes) {
                result.Add(new FileSystemItem() {
                    Name = GetDirectoryNameFromKey(item),
                    Key = item,
                    Size = 0,
                    IsDirectory = true,
                    HasSubDirectories = await HasDirectorySubDirectoriesAsync(item),
                });
            }
            return result;
        }
        public async Task<bool> HasDirectorySubDirectoriesAsync(string key) {
            try {
                var request = new ListObjectsV2Request {
                    BucketName = BucketName,
                    Prefix = key,
                    Delimiter = Delimiter
                };

                var response = await Client.ListObjectsV2Async(request);

                return response.CommonPrefixes.Count > 0;
            } catch (Exception) {
                throw;
            }
        }
        string GetNewDirectoryName(string? path, string name) {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Directory name cannot be null or empty");
            if (string.IsNullOrEmpty(path))
                return $"{name}/";

            return $"{path}{name}/";
        }

        string? GetPrefixFromPath(string? path) {
            if (string.IsNullOrEmpty(path))
                return null;
            return path.TrimEnd('/') + "/";
        }

        bool IsDirectory(string key) {
            return key.EndsWith(Delimiter);
        }

        string GetName(string key) {
            return key.Substring(key.LastIndexOf(Delimiter) + 1);
        }
    }
}