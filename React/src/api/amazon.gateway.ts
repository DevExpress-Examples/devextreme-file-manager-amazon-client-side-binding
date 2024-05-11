import FileSystemItem from 'devextreme/file_management/file_system_item';
import UploadInfo from 'devextreme/file_management/upload_info';

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

  async getItems(path: string): Promise<any> {
    const params = { path };
    return await this.makeRequest(this.getRequestUrl('getItems'), params) as Promise<FileSystemItem[]>;
  }

  async createDirectory(path: string, name: string): Promise<any> {
    const params = { path, name };
    return await this.makeRequest(this.getRequestUrl('createDirectory'), params, 'PUT') as unknown;
  }

  async renameItem(key: string, parentPath: string, name: string): Promise<any> {
    const params = { key, directory: parentPath, newName: name };
    return await this.makeRequest(this.getRequestUrl('renameItem'), params, 'PUT') as unknown;
  }

  async deleteItem(key: string): Promise<any> {
    const params = { item: key };
    return await this.makeRequest(this.getRequestUrl('deleteItem'), params, 'POST') as unknown;
  }

  async copyItem(sourceKey: string, destinationKey: string): Promise<any> {
    const params = { sourceKey, destinationKey };
    return await this.makeRequest(this.getRequestUrl('copyItem'), params, 'PUT') as unknown;
  }

  async moveItem(sourceKey: string, destinationKey: string): Promise<any> {
    const params = { sourceKey, destinationKey };
    return await this.makeRequest(this.getRequestUrl('moveItem'), params, 'POST') as unknown;
  }

  async downloadItems(keys: string[]): Promise<any> {
    return await this.makeRequest(this.getRequestUrl('downloadItems'), {}, 'POST', {}, keys) as unknown;
  }

  async uploadFileChunk(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): Promise<void> {
    const formData = new FormData();
    formData.append('file', uploadInfo.chunkBlob);
    formData.append('fileName', fileData.name);
    formData.append('fileSize', `${fileData.size}`);
    formData.append('directoryPath', destinationDirectory.key === '' ? '/' : destinationDirectory.key);
    formData.append('chunkNumber', `${uploadInfo.chunkIndex}`);
    formData.append('chunkCount', `${uploadInfo.chunkCount}`);

    const response = await fetch(`${this.endpointUrl}/uploadFileChunk`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  }

  async makeRequest(url: string, params: any = {}, method = 'GET', headers = {}, body: any = null): Promise<any> {
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
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    if (!url.includes('downloadItems')) {
      response = await response.json();
    }
    return response;
  }
}
