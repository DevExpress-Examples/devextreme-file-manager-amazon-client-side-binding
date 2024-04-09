class AmazonFileSystem {
  gateway = null;
  constructor(baseUrl) {
    this.gateway = new AmazonGateway(baseUrl)
  }

  async getItems(path) {
    try {
      return await this.gateway.getItems(path);
    } catch (error) {
      throw new DevExpress.fileManagement.FileSystemError(32767, path, error.message);
    }
  }

  async createDirectory(key, name) {
    try {
      return await this.gateway.createDirectory(key, name);
    } catch (error) {
      throw new DevExpress.fileManagement.FileSystemError(32767, name, error.message);
    }
  }

  async renameItem(key, parentPath, name) {
    try {
      return await this.gateway.renameItem(key, `${parentPath}/`, name);
    } catch (error) {
      throw new DevExpress.fileManagement.FileSystemError(32767, key, error.message);
    }
  }

  async deleteItem(key) {
    try {
      return await this.gateway.deleteItem(key);
    } catch (error) {
      throw new DevExpress.fileManagement.FileSystemError(32767, key, error.message);
    }
  }

  async copyItem(item, destinationDir) {
    try {
      return await this.gateway.copyItem(item.key, `${destinationDir.key}${item.name}`);
    } catch (error) {
      throw new DevExpress.fileManagement.FileSystemError(32767, item.key, error.message);
    }
  };
  
  async moveItem(item, destinationDir){
    try { 
      return await this.gateway.moveItem(item.key, `${destinationDir.key}${item.name}`);
    } catch (error) {
      throw new DevExpress.fileManagement.FileSystemError(32767, item.key, error.message);
    }
  };

  async uploadFileChunk(fileData, uploadInfo, destinationDirectory){
    try {
      return await this.gateway.uploadFileChunk(fileData, uploadInfo, destinationDirectory);
    } catch (error) {
      throw new DevExpress.fileManagement.FileSystemError(32767, fileData.name, error.message);
    }
  }

  async downloadItems(items) {
    const keys = items.map(x => x.key);
    const fileName = keys.length > 1 ? "archive.zip" : keys[0];
    try {
      const response = await this.gateway.downloadItems(keys);
      saveAs(new Blob([await response.blob()], { type: 'application/octet-stream' }), fileName);
      } catch (error) {
        throw new DevExpress.fileManagement.FileSystemError(32767, fileName, error.message);
      }
  }
}
