import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { btoa } from 'react-native-quick-base64';
import share from 'react-native-share';

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

const savingPath = Platform.OS === 'android' ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;

export const saveFile = async (document: ArrayBuffer, filename: string) => {
  try {
    const filePath = `${savingPath}/${filename}.pdf`;
    const base64 = arrayBufferToBase64(document);
    if (Platform.OS === 'android') {
      await ReactNativeBlobUtil.fs.writeFile(filePath, base64, 'base64');
    } else {
      await share.open({
        filename,
        url: 'data:application/pdf;base64,' + base64,
        type: 'application/pdf',
        saveToFiles: true,
      });
    }
    if (Platform.OS === 'android') notify(`Fichier enregistrer sous ${filename}.pdf`, 'success');
    return { filePath, fileName: filename, base64 };
  } catch (error) {
    console.error('Error saving file:', error);
  }
};
