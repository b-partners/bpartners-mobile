import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { btoa } from 'react-native-quick-base64';

import { notify } from './snackbar';

const arrayBufferToBase64 = buffer => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const saveFile = async (document: ArrayBuffer, fileName: string) => {
  try {
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;
    await ReactNativeBlobUtil.fs.writeFile(filePath, arrayBufferToBase64(document), 'base64');
    notify(`Fichier enregistrer sous ${fileName}.pdf`, 'success');
    return { filePath, fileName };
  } catch (error) {
    console.error('Error saving file:', error);
  }
};
