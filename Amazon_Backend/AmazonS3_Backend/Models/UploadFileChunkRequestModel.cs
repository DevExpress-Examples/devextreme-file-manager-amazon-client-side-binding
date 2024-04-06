namespace AmazonS3_Backend.Models {
#pragma warning disable CS8618
    public class UploadFileChunkRequestModel {
        public IFormFile File { get; set; }
        public string FileName { get; set; }
        public string FileSize { get; set; }
        public string DirectoryPath { get; set; }
        public int ChunkNumber { get; set; }
        public int ChunkCount { get; set; }
    }
#pragma warning restore
}
