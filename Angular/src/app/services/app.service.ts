import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import FileSystemItem from 'devextreme/file_management/file_system_item';
import UploadInfo from 'devextreme/file_management/upload_info';
import FileSystemError from 'devextreme/file_management/error';

import { Injectable } from '@angular/core';

import { AmazonGateway } from './amazon.gateway';
import { AmazonFileSystem } from './amazon.filesystem';

export class FileManagerService {
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

  getItems = (parentDirectory: FileSystemItem): Promise<FileSystemItem[]> => {
    try {
      return this.amazon.getItems(parentDirectory.key);
    } catch (error: any) {
      throw new FileSystemError(32767, parentDirectory, error.message);
    }
  };

  createDirectory = (parentDirectory: FileSystemItem, name: string): Promise<any> => {
    try {
      return this.amazon.createDirectory(parentDirectory.key, name);
    } catch (error: any) {
      throw new FileSystemError(32767, parentDirectory, error.message);
    }
  };

  renameItem = (item: FileSystemItem, name: string): Promise<any> => {
    try {
      return this.amazon.renameItem(item.key, (item as any).parentPath, name);
    } catch (error: any) {
      throw new FileSystemError(32767, item, error.message);
    }
  };

  deleteItem = (item: FileSystemItem): Promise<any> => {
    try {
      return this.amazon.deleteItem(item.key);
    } catch (error: any) {
      throw new FileSystemError(32767, item, error.message);
    }
  };

  copyItem = (item: FileSystemItem, destinationDirectory: FileSystemItem): Promise<any> => {
    try {
      return this.amazon.copyItem(item, destinationDirectory);
    } catch (error: any) {
      throw new FileSystemError(32767, item, error.message);
    }
  };

  moveItem = (item: FileSystemItem, destinationDirectory: FileSystemItem): Promise<any> => {
    try {
      return this.amazon.moveItem(item, destinationDirectory);
    } catch (error: any) {
      throw new FileSystemError(32767, item, error.message);
    }
  };

  uploadFileChunk = (fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): void => {
    try {
      this.amazon.uploadFileChunk(fileData, uploadInfo, destinationDirectory);
    } catch (error: any) {
      throw new FileSystemError(32767, destinationDirectory, error.message);
    }
  };

  downloadItems = (items: FileSystemItem[]): Promise<void> => {
    try {
      return this.amazon.downloadItems(items);
    } catch (error: any) {
      throw new FileSystemError(32767, items[0], error.message);
    }
  };
}

@Injectable()
export class Service {
  getAmazonFileSystemProvider(endpointUrl: string, onRequestExecuted?: Function): CustomFileSystemProvider {
    return new FileManagerService(endpointUrl, onRequestExecuted).fileSystemProvider;
  }
}
