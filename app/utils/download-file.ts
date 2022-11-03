import RNFS from 'react-native-fs';

type DownloadOptions = { url: string; accessToken?: string; fileName: string };

export const downloadFile = async (options: DownloadOptions) => {
  const { url, fileName } = options;
  console.tron.log(`Downloading ${url}...`);
  return RNFS.downloadFile({
    fromUrl: url,
    toFile: `${RNFS.DownloadDirectoryPath}/${fileName}`,
  }).promise;
};
