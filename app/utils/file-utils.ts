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

  let downloadedFilePath: string = null;
  __DEV__ && console.tron.log('downloading file from' + url);
  ReactNativeBlobUtil.config({
    fileCache: true,
    path: dirs.DownloadDir + `/${fileName}`,
    overwrite: true,
    timeout: 10000,
  })
    .fetch('GET', url, {})
    .then(async (res: FetchBlobResponse) => {
      __DEV__ && console.tron.logImportant(dirs.DownloadDir + `/${fileName}`);
      __DEV__ && console.tron.logImportant(res.path());

      downloadedFilePath = res.path();
      if (temp) {
        __DEV__ && console.tron.log('download finished' + downloadedFilePath);
      } else {
        ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,
            parentFolder: '',
            mimeType,
          },
          // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
          'Download',
          downloadedFilePath
        ).then(
          response => {
            __DEV__ && console.tron.log('copied successfully');
            __DEV__ && console.tron.log(response);
          },
          reason => __DEV__ && console.tron.error(reason.message, reason.stacktrace)
        );
        __DEV__ && console.tron.log('download finished 2' + downloadedFilePath);
      }
    });

  return downloadedFilePath;
};

export const createFileUrl = (fileId: string, accountId: string, accessToken: string, fileType: string, baseUrl = env.apiBaseUrl) => {
  return baseUrl + `accounts/${accountId}/files/${fileId}/raw?accessToken=${accessToken}&fileType=${fileType}`;
};
