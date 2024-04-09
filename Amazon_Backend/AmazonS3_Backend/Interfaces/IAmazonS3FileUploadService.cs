using Amazon.S3;

namespace AmazonS3_Backend.Interfaces {
    public interface IAmazonS3FileUploadService {
        Task InitializeUploadRequestAsync(IAmazonS3 client, string bucketName, string fileName);
        Task UploadDataChunkAsync(int partNumber, long partSize, Stream bytes);
        Task CompleteUploadRequestAsync();
        Task AbortCurrentUploadAsync(IAmazonS3 client);
    }
}
