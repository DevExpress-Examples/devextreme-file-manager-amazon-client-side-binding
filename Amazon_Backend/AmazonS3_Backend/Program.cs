using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using AmazonS3_Backend.Helpers;
using AmazonS3_Backend.Interfaces;

namespace AmazonS3Backend {
    public class Program {
        
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddCors(options => options.AddPolicy("CorsPolicy", builder => {
                builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(_ => true)
                    .AllowCredentials();
            }));

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            var awsOptions = builder.Configuration.GetAWSOptions();

            // Make sure you have accessKey, secretKey and region specified in local environment
            awsOptions.Credentials = new EnvironmentVariablesAWSCredentials();

            // Uncomment these two lines if you want to quickly test with accessKey and secretKey
            //awsOptions.Credentials = new BasicAWSCredentials("accessKey", "secretKey");
            //awsOptions.Region = RegionEndpoint.USEast1;

            builder.Services.AddDefaultAWSOptions(awsOptions);
            
            builder.Services.AddAWSService<IAmazonS3>();

            builder.Services.AddSingleton<IAmazonS3FileUploadService>(provider =>
            {
                return new AmazonS3FileUploadService();
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
