import RNFS from 'react-native-fs';

type DownloadOptions = { url: string; accessToken?: string; fileName: string };

export const fetchBinaryFile = async (options: DownloadOptions) => {
  const { url, fileName } = options;
  __DEV__ && console.tron.log(`Downloading ${url}...`);
  return RNFS.downloadFile({
    fromUrl: url,
    toFile: `${RNFS.DownloadDirectoryPath}/${fileName}`,
  }).promise;
};
