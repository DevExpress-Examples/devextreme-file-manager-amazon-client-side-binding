class AmazonGateway {
    baseUrl = '';
  
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }
  
    getRequestUrl(methodName){
        return `${this.baseUrl}/${methodName}`;
    }
  
    async getItems(key){
        const params = { 'path': key };
        return this.makeRequest(this.getRequestUrl('getItems'), params);
    }
  
    async renameItem(key, parentPath, name){
        const params = { 'key': key, 'directory': parentPath, 'newName': name };
        return this.makeRequest(this.getRequestUrl('renameItem'), params, 'PUT');
    }
  
    async createDirectory(key, name){
        const params = { 'path': key, 'name': name };
        return this.makeRequest(this.getRequestUrl('createDirectory'), params, 'PUT');
    }
  
    async deleteItem(key){
        const params = { 'item': key };
        return this.makeRequest(this.getRequestUrl('deleteItem'), params, 'POST');
    }
  
    async copyItem(sourceKey, destinationKey){
        const params = { 'sourceKey': sourceKey, 'destinationKey': destinationKey };
        return this.makeRequest(this.getRequestUrl('copyItem'), params, 'PUT');
    }
  
    async moveItem(sourceKey, destinationKey){
        const params = { 'sourceKey': sourceKey, 'destinationKey': destinationKey };
        return this.makeRequest(this.getRequestUrl('moveItem'), params, 'POST');
    }
  
    async downloadItems(keys){
        return this.makeRequest(this.getRequestUrl('downloadItems'), {}, 'POST', {}, keys);
    }
  
    async uploadFileChunk(fileData, uploadInfo, destinationDirectory) {
       const formData = new FormData();
       formData.append('file', uploadInfo.chunkBlob);
       formData.append('fileName', fileData.name);
       formData.append('fileSize', fileData.size);
       formData.append('directoryPath', destinationDirectory.key);
       formData.append('chunkNumber', uploadInfo.chunkIndex);
       formData.append('chunkCount', uploadInfo.chunkCount);
       
       try {
           const response = await fetch(`${this.baseUrl}/uploadFileChunk`, {
               method: 'POST',
               body: formData
           });
           if (!response.ok) {
               throw new Error(response.errorText);
           }
       } catch (error) {
           throw error;
       }
    }

    async makeRequest(url, params = {}, method = 'GET', headers = {}, body = null) {
        try {
            const defaultHeaders = {
                'Content-Type': 'application/json',
            };
    
            const mergedHeaders = { ...defaultHeaders, ...headers };
    
            const urlWithParams = new URL(url);
            Object.keys(params).forEach(key => urlWithParams.searchParams.append(key, params[key]));
    
            const options = {
                method: method.toUpperCase(),
                headers: mergedHeaders,
                body: body ? JSON.stringify(body) : null
            };
    
            let response = await fetch(urlWithParams.toString(), options);

            if (response.ok) {
                if (!url.includes('downloadItems')) { 
                    response =  await response.json();
                }

                if (response.errorText) {
                    throw new Error(`${response.errorText}`);
                } else {
                    return response;
                }
            } else {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            throw error;
        }
    }
  }
  