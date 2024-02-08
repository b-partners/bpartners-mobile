import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { TxKeyPath } from '../../i18n';
import { useStores } from '../../models';
import { palette } from '../../theme/palette';

type FileUploadProps = {
  selectFileTx: TxKeyPath;
  uploadFileTx: TxKeyPath;
  onUploadFile: () => void;
  fileId?: string;
};

export function FileUpload(props: FileUploadProps) {
  const [fileToUpload, setFileToUpload] = useState<File>(null);
  const { fileStore } = useStores();

  const uploadFile = () => {
    if (!fileToUpload) {
      __DEV__ && console.tron.log('Please select a file', fileToUpload);
      return;
    }

    fileStore.upload(fileToUpload, props.fileId);
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      __DEV__ && console.tron.log(`Picking file`, result);
      const documentPickerResponse = result[0];

      const blob = await (await fetch(documentPickerResponse.uri)).blob();
      const file = new File([blob], documentPickerResponse.name);

      setFileToUpload(file);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        __DEV__ && console.tron.log(`Canceling upload`);
      } else {
        __DEV__ && console.tron.log(`Error while uploading file, ${err}`);
        throw err;
      }
    }
  };

  return (
    <TouchableOpacity style={fileUploadStyles.container} onPress={fileToUpload ? uploadFile : selectFile}>
      <View style={fileUploadStyles.round} />
    </TouchableOpacity>
  );
}

const fileUploadStyles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: palette.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  round: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: palette.white,
  },
});
