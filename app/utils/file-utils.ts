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

export const createFileUrl = (fileId: string, accountId: string, accessToken: string, fileType: string, baseUrl = env.apiBaseUrl) => {
  return baseUrl + `accounts/${accountId}/files/${fileId}/raw?accessToken=${accessToken}&fileType=${fileType}`;
};
