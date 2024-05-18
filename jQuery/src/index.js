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

async function getItems(item) {
  try {
    return amazon.getItems(item.key);
  } catch (error) {
    throw new DevExpress.fileManagement.FileSystemError(32767, item, error.message);
  }
}

async function createDirectory(parentDirectory, name) {
  try {
    await amazon.createDirectory(parentDirectory.key, name);
  } catch (error) {
    throw new DevExpress.fileManagement.FileSystemError(32767, item, error.message);
  }
}

async function renameItem(item, name) {
  try {
    await amazon.renameItem(item.key, item.parentPath, name);
  } catch (error) {
    throw new DevExpress.fileManagement.FileSystemError(32767, item, error.message);
  }
}

async function deleteItem(item) {
  try {
    await amazon.deleteItem(item.key);
  } catch (error) {
    throw new DevExpress.fileManagement.FileSystemError(32767, item, error.message);
  }
}

async function copyItem(item, destinationDirectory) {
  try {
    await amazon.copyItem(item, destinationDirectory);
  } catch (error) {
    throw new DevExpress.fileManagement.FileSystemError(32767, item, error.message);
  }
}

async function moveItem(item, destinationDirectory) {
  try {
    await amazon.moveItem(item, destinationDirectory);
  } catch (error) {
    throw new DevExpress.fileManagement.FileSystemError(32767, item, error.message);
  }
}

async function abortFileUpload(fileData, uploadInfo, destinationDirectory) {
  try {
    await amazon.abortFileUpload(fileData, uploadInfo, destinationDirectory);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function uploadFileChunk(fileData, uploadInfo, destinationDirectory) {
  try {
    await amazon.uploadFileChunk(fileData, uploadInfo, destinationDirectory);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function downloadItems(items) {
  try {
    await amazon.downloadItems(items);
  } catch (error) {
    throw new Error(error.message);
  }
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
