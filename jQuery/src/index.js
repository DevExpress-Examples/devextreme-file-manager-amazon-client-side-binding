$(() => {
  baseUrl = 'https://localhost:52366/api/AmazonS3';
  amazon = new AmazonFileSystem(baseUrl, onRequestExecuted);

  const provider = new DevExpress.fileManagement.CustomFileSystemProvider({
    getItems,
    createDirectory,
    renameItem,
    deleteItem,
    copyItem,
    moveItem,
    uploadFileChunk,
    downloadItems,
    abortFileUpload,
  });

  $('#file-manager').dxFileManager({
    fileSystemProvider: provider,

    allowedFileExtensions: [],
    upload: {
      chunkSize: 5242880,
    },
    permissions: {
      download: true,
      create: true,
      copy: true,
      move: true,
      delete: true,
      rename: true,
      upload: true,
    },
  });
});

function getItems(item) {
  return amazon.getItems(item.key);
}

function createDirectory(parentDirectory, name) {
  return amazon.createDirectory(parentDirectory.key, name);
}

function renameItem(item, name) {
  return amazon.renameItem(item.key, item.parentPath, name);
}

function deleteItem(item) {
  return amazon.deleteItem(item.key);
}

function copyItem(item, destinationDirectory) {
  return amazon.copyItem(item, destinationDirectory);
}

function moveItem(item, destinationDirectory) {
  return amazon.moveItem(item, destinationDirectory);
}

async function abortFileUpload(fileData, uploadInfo) {
  return amazon.abortFileUpload(fileData, uploadInfo);
}

async function uploadFileChunk(fileData, uploadInfo, destinationDirectory) {
  await amazon.uploadFileChunk(fileData, uploadInfo, destinationDirectory);
}

function downloadItems(items) {
  return amazon.downloadItems(items);
}

function onRequestExecuted(e) {
  $('<div>')
    .addClass('request-info')
    .append(
      createParameterInfoDiv('Method:', e.method),
      createParameterInfoDiv('Url path:', e.urlPath),
      createParameterInfoDiv('Query string:', e.queryString),
      $('<br>'),
    )
    .prependTo('#request-panel');
}

function createParameterInfoDiv(name, value) {
  return $('<div>')
    .addClass('parameter-info')
    .append(
      $('<div>').addClass('parameter-name').text(name),
      $('<div>').addClass('parameter-value dx-theme-accent-as-text-color').text(value).attr('title', value),
    );
}
