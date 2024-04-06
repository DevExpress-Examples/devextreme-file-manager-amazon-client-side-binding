using Amazon.S3.Model;
using Amazon.S3;
using AmazonS3_Backend.Interfaces;

namespace AmazonS3_Backend.Helpers {
    public class AmazonS3FileUploadService : IAmazonS3FileUploadService, IDisposable {
#pragma warning disable CS8618
        private IAmazonS3 _client;
        private List<UploadPartResponse> _uploadResponses;
        private InitiateMultipartUploadRequest _initiateRequest;
        private InitiateMultipartUploadResponse _initResponse;

        private string _bucketName;
        private string _fileName;
#pragma warning restore
        public async Task InitializeUploadRequestAsync(IAmazonS3 client, string bucketName, string fileName) {
            _fileName = fileName ?? throw new ArgumentNullException(nameof(fileName));
            _client = client ?? throw new ArgumentNullException(nameof(client));
            _bucketName = bucketName ?? throw new ArgumentNullException(nameof(bucketName));

            _uploadResponses = new List<UploadPartResponse>();
            _initiateRequest = new InitiateMultipartUploadRequest {
                BucketName = _bucketName,
                Key = _fileName
            };
            _initResponse = await _client.InitiateMultipartUploadAsync(_initiateRequest).ConfigureAwait(false);
        }

        public async Task UploadDataChunkAsync(int partNumber, long partSize, Stream bytes) {
            if (bytes == null)
                throw new ArgumentNullException(nameof(bytes));

            using (bytes) {
                UploadPartRequest uploadRequest = new UploadPartRequest {
                    BucketName = _bucketName,
                    Key = _fileName,
                    UploadId = _initResponse.UploadId,
                    PartNumber = partNumber + 1,
                    PartSize = partSize,
                    InputStream = bytes
                };
                _uploadResponses.Add(await _client.UploadPartAsync(uploadRequest).ConfigureAwait(false));
            }
        }

        public async Task CompleteUploadRequestAsync() {
            CompleteMultipartUploadRequest completeRequest = new CompleteMultipartUploadRequest {
                BucketName = _bucketName,
                Key = _fileName,
                UploadId = _initResponse.UploadId
            };
            completeRequest.AddPartETags(_uploadResponses);
            await _client.CompleteMultipartUploadAsync(completeRequest).ConfigureAwait(false);

            ResetOptions();
        }

        public async Task AbortCurrentUploadAsync(IAmazonS3 client) {
            AbortMultipartUploadRequest abortMPURequest = new AbortMultipartUploadRequest {
                BucketName = _bucketName,
                Key = _fileName,
                UploadId = _initResponse.UploadId
            };
            await client.AbortMultipartUploadAsync(abortMPURequest).ConfigureAwait(false);
            ResetOptions();
        }

        private void ResetOptions() {
#pragma warning disable CS8625
            _fileName = null;
            _bucketName = null;
            _initiateRequest = null;
            _initResponse = null;
            _uploadResponses = null;
#pragma warning restore
        }

        public void Dispose() {
            _client?.Dispose();
        }
    }
}