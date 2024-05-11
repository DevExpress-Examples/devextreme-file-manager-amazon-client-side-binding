<!-- default badges list -->
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1226606)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
<!-- default badges end -->

# FileManager for DevExtreme - Amazon S3 Client-Side Binding

This example illustrates how to use the custom file provider to connect the FileManager component to the Amazon Simple Storage Service on the client side. The [Custom File System Provider](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxFileManager/File_System_Providers/Custom) allows you to implement custom APIs to handle file operations (add, delete, rename, etc.). All APIs that implement access to Amazon S3 on the client are stored in the amazon.file.system.js file (app.service.ts - for Angular framework). 
On the Amazon S3, create a bucket, create a user and add permissions to access the created bucket.

If you run an Angular, React, Vue, or jQuery example, you need to also run a .NET-based backend project - **Amazon_Backend**. To connect this project to an Amazon S3 server, you need to specify Amazon credentials of the user created previously. You need to add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION` environment variables on your local machine or update the `AWS` section in [appsettings.json](Amazon_Backend/appsettings.json):

```json
"AWS": {
    "AccessKey": "yourAccessKey",
    "SecretKey": "yourSecretKey",
    "BlobName": "blobName",
    "Region": "region"
  },
```

![FileManager](/file-manager-client-side-binding.png) 

## Files to Review

- **jQuery**
    - [index.js](jQuery/src/index.js)
- **Angular**
    - [app.component.html](Angular/src/app/app.component.html)
    - [app.component.ts](Angular/src/app/app.component.ts)
- **Vue**
    - [Home.vue](Vue/src/components/HomeContent.vue)
- **React**
    - [App.tsx](React/src/App.tsx)
- **NetCore**    
    - [Index.cshtml](ASP.NET%20Core/Views/Home/Index.cshtml)

## Documentation

- [Getting Started with FileManager](https://js.devexpress.com/Angular/Documentation/Guide/UI_Components/FileManager/Getting_Started_with_File_Manager/)
- [Bind FileManager to File Systems](https://js.devexpress.com/Angular/Documentation/Guide/UI_Components/FileManager/Bind_to_File_Systems/)

## More Examples

- [FileManager for DevExtreme - Azure Server-Side Binding](https://github.com/DevExpress-Examples/devextreme-file-manager-azure-server-side-binding)
- [FileUploader for DevExtreme - Direct Upload to Azure](https://github.com/DevExpress-Examples/devextreme-file-uploader-direct-upload-to-azure)
