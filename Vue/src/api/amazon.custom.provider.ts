import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import type FileSystemItem from 'devextreme/file_management/file_system_item';
import type UploadInfo from 'devextreme/file_management/upload_info';
import FileSystemError from 'devextreme/file_management/error';

import { AmazonGateway } from './amazon.gateway';
import { AmazonFileSystem } from './amazon.filesystem';

export class AmazonCustomProvider {
  fileSystemProvider: CustomFileSystemProvider;

  amazon: AmazonFileSystem;

  gateway: AmazonGateway;

  constructor(endpointUrl: string, onRequestExecuted?: Function) {
    this.gateway = new AmazonGateway(endpointUrl, onRequestExecuted);
    this.amazon = new AmazonFileSystem(this.gateway);

    const options = {
      getItems: this.getItems,
      createDirectory: this.createDirectory,
      renameItem: this.renameItem,
      deleteItem: this.deleteItem,
      copyItem: this.copyItem,
      moveItem: this.moveItem,
      uploadFileChunk: this.uploadFileChunk,
      downloadItems: this.downloadItems,
    };
    this.fileSystemProvider = new CustomFileSystemProvider(options);
  }

  getItems = async(parentDirectory: FileSystemItem): Promise<FileSystemItem[]> => {
    try {
      return await this.amazon.getItems(parentDirectory.key);
    } catch (error: any) {
      throw new FileSystemError(32767, parentDirectory, error.message);
    }
  };

  createDirectory = async(parentDirectory: FileSystemItem, name: string): Promise<any> => {
    try {
      return await this.amazon.createDirectory(parentDirectory.key, name);
    } catch (error: any) {
      throw new FileSystemError(32767, parentDirectory, error.message);
    }
  };

  renameItem = async(item: FileSystemItem, name: string): Promise<any> => {
    try {
      return await this.amazon.renameItem(item.key, item.path, item.name, name);
    } catch (error: any) {
      throw new FileSystemError(32767, item, error.message);
    }
  };

  deleteItem = async(item: FileSystemItem): Promise<any> => {
    try {
      return await this.amazon.deleteItem(item.key);
    } catch (error: any) {
      throw new FileSystemError(32767, item, error.message);
    }
  };

  copyItem = async(item: FileSystemItem, destinationDirectory: FileSystemItem): Promise<any> => {
    try {
      return await this.amazon.copyItem(item, destinationDirectory);
    } catch (error: any) {
      throw new FileSystemError(32767, item, error.message);
    }
  };

  moveItem = async(item: FileSystemItem, destinationDirectory: FileSystemItem): Promise<any> => {
    try {
      return await this.amazon.moveItem(item, destinationDirectory);
    } catch (error: any) {
      throw new FileSystemError(32767, item, error.message);
    }
  };
  /* eslint-disable-next-line vue/max-len */
  uploadFileChunk = async(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): Promise<void> => {
    try {
      await this.amazon.uploadFileChunk(fileData, uploadInfo, destinationDirectory);
    } catch (error: any) {
      throw new FileSystemError(32767, destinationDirectory, error.message);
    }
  };

  downloadItems = async(items: FileSystemItem[]): Promise<void> => {
    try {
      return await this.amazon.downloadItems(items);
    } catch (error: any) {
      const item = items.length > 1 ? undefined : items[0];
      throw new FileSystemError(32767, item, error.message);
    }
  };
}

export function getAmazonFileSystemProvider(
  endpointUrl: string,
  onRequestExecuted?: Function
): CustomFileSystemProvider {
  return new AmazonCustomProvider(endpointUrl, onRequestExecuted)
    .fileSystemProvider;
}
