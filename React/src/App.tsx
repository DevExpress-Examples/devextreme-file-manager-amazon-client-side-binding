import React, { useCallback, useState, useMemo } from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';

import FileManager, { Permissions, Upload } from 'devextreme-react/file-manager';

import { getAmazonFileSystemProvider } from './api/amazon.custom.provider';

const allowedFileExtensions: string[] = [];

export default function App(): JSX.Element {
  const [requests, setRequests] = useState<
  { method: string; urlPath: string; queryString: string }[]
  >([]);
  const onRequestExecuted = useCallback(
    ({
      method,
      urlPath,
      queryString,
    }: {
      method: string;
      urlPath: string;
      queryString: string;
    }): void => {
      const request = { method, urlPath, queryString };
      setRequests((requests) => [request, ...requests]);
    },
    [],
  );
  const fileSystemProvider = useMemo(() => getAmazonFileSystemProvider(
    'https://localhost:52366/api/AmazonS3',
    onRequestExecuted,
  ), []);

  return (
    <div className="main">
      <FileManager
        id="file-manager"
        fileSystemProvider={fileSystemProvider}
        allowedFileExtensions={allowedFileExtensions}
      >
        <Upload chunkSize={5242880}></Upload>
        <Permissions download={true}></Permissions>
        <Permissions
          create={true}
          copy={true}
          move={true}
          delete={true}
          rename={true}
          upload={true}
          download={true}>
        </Permissions>
      </FileManager>
      <div id="request-panel">
        {requests.map((r, i) => (
          <div key={i} className="request-info">
            <div className="parameter-info">
              <div className="parameter-name">Method:</div>
              <div className="parameter-value dx-theme-accent-as-text-color">
                {r.method}
              </div>
            </div>
            <div className="parameter-info">
              <div className="parameter-name">Url path:</div>
              <div className="parameter-value dx-theme-accent-as-text-color">
                {r.urlPath}
              </div>
            </div>
            <div className="parameter-info">
              <div className="parameter-name">Query string:</div>
              <div className="parameter-value dx-theme-accent-as-text-color">
                {r.queryString}
              </div>
            </div>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}
