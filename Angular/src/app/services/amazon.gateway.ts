import FileSystemItem from 'devextreme/file_management/file_system_item';
import {
  FileEntry,
} from './app.service.types';

export class AmazonGateway {
  endpointUrl: string;

  onRequestExecuted: Function | undefined;

  constructor(endpointUrl: string, onRequestExecuted?: Function) {
    this.endpointUrl = endpointUrl;
    this.onRequestExecuted = onRequestExecuted;
  }

  getRequestUrl(methodName: string): string {
    return `${this.endpointUrl}/${methodName}`;
  }

  getItems(path: string): Promise<any> {
    const params = { path };
    return this.makeRequest(this.getRequestUrl('getItems'), params);
  }

  createDirectory(path: string, name: string): Promise<any> {
    const params = { path, name };
    return this.makeRequest(this.getRequestUrl('createDirectory'), params, 'PUT');
  }

  renameItem(key: string, parentPath: string, name: string): Promise<any> {
    const params = { key, directory: parentPath, newName: name };
    return this.makeRequest(this.getRequestUrl('renameItem'), params, 'PUT');
  }

  deleteItem(key: string): Promise<any> {
    const params = { item: key };
    return this.makeRequest(this.getRequestUrl('deleteItem'), params, 'POST');
  }

  copyItem(sourceKey: string, destinationKey: string): Promise<any> {
    const params = { sourceKey, destinationKey };
    return this.makeRequest(this.getRequestUrl('copyItem'), params, 'PUT');
  }

  moveItem(sourceKey: string, destinationKey: string): Promise<any> {
    const params = { sourceKey, destinationKey };
    return this.makeRequest(this.getRequestUrl('moveItem'), params, 'POST');
  }

  downloadItems(keys: any): Promise<any> {
    return this.makeRequest(this.getRequestUrl('downloadItems'), {}, 'POST', {}, keys);
  }

  uploadFileChunk(fileData: any, uploadInfo: any, destinationDirectory: any): any {
    const formData = new FormData();
    formData.append('file', uploadInfo.chunkBlob);
    formData.append('fileName', fileData.name);
    formData.append('fileSize', fileData.size);
    formData.append('directoryPath', destinationDirectory.key);
    formData.append('chunkNumber', uploadInfo.chunkIndex);
    formData.append('chunkCount', uploadInfo.chunkCount);

    const response = fetch(`${this.endpointUrl}/uploadFileChunk`, {
      method: 'POST',
      body: formData,
    });
    if (!(response as any).ok) {
      throw new Error((response as any).errorText);
    }
  }

  async makeRequest(url: string, params: any = {}, method = 'GET', headers = {}, body = null): Promise<any> {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    const mergedHeaders = { ...defaultHeaders, ...headers };

    const urlWithParams = new URL(url);
    Object.keys(params).forEach((key) => urlWithParams.searchParams.append(key, params[key]));

    const options = {
      method: method.toUpperCase(),
      headers: mergedHeaders,
      body: body ? JSON.stringify(body) : null,
    };

    let response = await fetch(urlWithParams.toString(), options);

    if (response.ok) {
      if (!url.includes('downloadItems')) {
        response = await response.json();
      }

      if ((response as any).errorText) {
        throw new Error(`${(response as any).errorText}`);
      } else {
        return response;
      }
    } else {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
  }
}
