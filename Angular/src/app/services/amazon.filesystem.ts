import FileSystemItem from 'devextreme/file_management/file_system_item';
import FileSystemError from 'devextreme/file_management/error';
import { saveAs } from 'file-saver';

import { FileEntry } from './app.service.types';
import { AmazonGateway } from './amazon.gateway';

export class AmazonFileSystem {
  gateway: AmazonGateway;

  constructor(amazonGateway: AmazonGateway) {
    this.gateway = amazonGateway;
  }

  getItems(key: string): Promise<FileSystemItem[]> {
    return this.gateway.getItems(key) as Promise<FileSystemItem[]>;
  }

  createDirectory(key: string, name: string): Promise<any> {
    return this.gateway.createDirectory(key, name);
  }

  renameItem(key: string, parentPath: string, name: string): Promise<any> {
    return this.gateway.renameItem(key, `${parentPath}/`, name);
  }

  deleteItem(key: string): Promise<any> {
    return this.gateway.deleteItem(key);
  }

  copyItem(item: FileSystemItem, destinationDirectory: FileSystemItem): Promise<any> {
    return this.gateway.copyItem(item.key, `${destinationDirectory.key}${item.name}`);
  }

  moveItem(item: FileSystemItem, destinationDirectory: FileSystemItem): Promise<any> {
    return this.gateway.moveItem(item.key, `${destinationDirectory.key}${item.name}`);
  }

  async downloadItems(items: FileSystemItem[]): Promise<void> {
    const keys = items.map((x: FileSystemItem) => x.key);
    const fileName = keys.length > 1 ? 'archive.zip' : keys[0];
    try {
      const response = await this.gateway.downloadItems(keys);
      let blob = await response.blob();
      saveAs(new Blob([blob], { type: 'application/octet-stream' }), fileName);
    } catch (error) {
      throw new Error(fileName);
    }
  }

  uploadFileChunk(fileData: any, uploadInfo: any, destinationDirectory: any): any {
    try {
      return this.gateway.uploadFileChunk(fileData, uploadInfo, destinationDirectory);
    } catch (error) {
      throw new Error(fileData.name);
      // throw new DevExpress.fileManagement.FileSystemError(32767, fileData.name, error.message);
    }
  }
}
