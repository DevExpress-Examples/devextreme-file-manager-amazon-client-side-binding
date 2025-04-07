<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/782922866/23.1.3%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1226606)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
[![](https://img.shields.io/badge/💬_Leave_Feedback-feecdd?style=flat-square)](#does-this-example-address-your-development-requirementsobjectives)
<!-- default badges end -->

# DevExtreme FileManager - Amazon S3 Client-Side Binding

This example uses a custom file provider to connect the FileManager component to the Amazon Simple Storage Service (S3) on the client. The [Custom File System Provider](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxFileManager/File_System_Providers/Custom) allows you to implement custom APIs to handle file operations (add, delete, rename, etc.). All APIs used to access Amazon S3 services on the client are stored in the `amazon.file.system.js` file (`app.service.ts` - for Angular framework). If you expect to use Amazon Simple Storage Service, you should create a bucket, create a user, and add permissions to access the created bucket.

**IMPORTANT**

The code snippets in this repository are for informational purposes only. Security should be your #1 priority when using Amazon S3 storage. You should consult a security expert or apply accepted best practices to maintain the highest security posture for your DevExtreme-powered web application. Remember, a secure web app demands careful consideration/understanding of potential attack vectors, the configuration of your development environment, and security posture of third-party service providers.

If running our Angular, React, Vue, or jQuery example, you need to also run our .NET-based backend project - **Amazon_Backend**. To connect this project to an Amazon S3 server, you need to specify Amazon credentials of the user created previously. You will also need to update the AWS section in [appsettings.json](Amazon_Backend/appsettings.json):

```json
"AWS": {
    "AccessKey": "yourAccessKey",
    "SecretKey": "yourSecretKey",
    "Region": "region",
    "Bucket": "your bucket name"
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

- [File Manager for DevExtreme - Direct Upload to Amazon](https://github.com/DevExpress-Examples/devextreme-file-manager-direct-upload-to-amazon)
- [FileManager for DevExtreme - Azure Server-Side Binding](https://github.com/DevExpress-Examples/devextreme-file-manager-azure-server-side-binding)
- [FileUploader for DevExtreme - Direct Upload to Azure](https://github.com/DevExpress-Examples/devextreme-file-uploader-direct-upload-to-azure)
<!-- feedback -->
## Does this example address your development requirements/objectives?

[<img src="https://www.devexpress.com/support/examples/i/yes-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-file-manager-amazon-client-side-binding&~~~was_helpful=yes) [<img src="https://www.devexpress.com/support/examples/i/no-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-file-manager-amazon-client-side-binding&~~~was_helpful=no)

(you will be redirected to DevExpress.com to submit your response)
<!-- feedback end -->
