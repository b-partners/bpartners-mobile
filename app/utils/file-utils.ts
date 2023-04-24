import ReactNativeBlobUtil, { FetchBlobResponse } from 'react-native-blob-util';
import RNFS from 'react-native-fs';

import env from '../config/env';

type DownloadOptions = { url: string; accessToken?: string; fileName: string };

export const fetchBinaryFiles = async (options: DownloadOptions) => {
  const { url, fileName } = options;
  __DEV__ && console.tron.log(`Downloading ${url}...`);
  return RNFS.downloadFile({
    fromUrl: url,
    toFile: `${RNFS.DownloadDirectoryPath}/${fileName}`,
  }).promise;
};

type DownloadOptionsV2 = { mimeType?: string; temp?: boolean } & DownloadOptions;
export const fetchBinaryFileV2 = async (options: DownloadOptionsV2) => {
  const { url, fileName, mimeType, temp = false } = options;
  const dirs = ReactNativeBlobUtil.fs.dirs;
  let downloadedFilePath = null;

  ReactNativeBlobUtil.config({
    fileCache: true,
    path: dirs.DownloadDir + fileName,
    overwrite: true,
  })
    .fetch('GET', url, {})
    .then(async (res: FetchBlobResponse) => {
      if (temp){
        downloadedFilePath=res.path();
        return
      }

      const result = await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
        {
          name: fileName,
          parentFolder: '',
          mimeType,
        },
        'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
        res.path()
      );
      downloadedFilePath = result;
    });

  return downloadedFilePath;
};

export const createFileUrl = (fileId: string, accountId: string, accessToken: string, fileType: string, baseUrl = env.apiBaseUrl) => {
  return baseUrl + `accounts/${accountId}/files/${fileId}/raw?accessToken=${accessToken}&fileType=${fileType}`;
};
