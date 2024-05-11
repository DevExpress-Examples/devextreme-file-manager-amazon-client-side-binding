import FileSystemItem from 'devextreme/file_management/file_system_item';
import UploadInfo from 'devextreme/file_management/upload_info';
import { saveAs } from 'file-saver';

import { AmazonGateway } from './amazon.gateway';

export class AmazonFileSystem {
  gateway: AmazonGateway;

  constructor(amazonGateway: AmazonGateway) {
    this.gateway = amazonGateway;
  }

  async getItems(key: string): Promise<FileSystemItem[]> {
    return await this.gateway.getItems(key) as Promise<FileSystemItem[]>;
  }

  async createDirectory(key: string, name: string): Promise<any> {
    return await this.gateway.createDirectory(key, name) as unknown;
  }

  async renameItem(key: string, path: string, name: string, newName: string): Promise<any> {
    const parentDirectory = path.replace(new RegExp(`${name}$`), '');
    const parentPath = parentDirectory.endsWith('/') ? parentDirectory : `${parentDirectory}/`;
    return await this.gateway.renameItem(key, parentPath, newName) as unknown;
  }

  async deleteItem(key: string): Promise<any> {
    return await this.gateway.deleteItem(key) as unknown;
  }

  async copyItem(item: FileSystemItem, destinationDirectory: FileSystemItem): Promise<any> {
    return await this.gateway.copyItem(item.key, `${destinationDirectory.key}${item.name}`) as unknown;
  }

  async moveItem(item: FileSystemItem, destinationDirectory: FileSystemItem): Promise<any> {
    return await this.gateway.moveItem(item.key, `${destinationDirectory.key}${item.name}`) as unknown;
  }

  async downloadItems(items: FileSystemItem[]): Promise<void> {
    const keys = items.map((x: FileSystemItem) => x.key);
    const fileName = keys.length > 1 ? 'archive.zip' : keys[0];
    try {
      const response = await this.gateway.downloadItems(keys);
      let blob = await response.blob();
      saveAs(new Blob([blob], { type: 'application/octet-stream' }), fileName);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async uploadFileChunk(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): Promise<any> {
    return await this.gateway.uploadFileChunk(fileData, uploadInfo, destinationDirectory) as unknown;
  }
}
