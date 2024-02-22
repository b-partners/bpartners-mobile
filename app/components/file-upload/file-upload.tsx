import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import uuid from 'react-native-uuid';

import { translate } from '../../i18n';
import { useStores } from '../../models';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';

export function FileUpload() {
  const { fileStore } = useStores();

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const documentPickerResponse = result[0];
      const uri = documentPickerResponse.uri;
      const type = documentPickerResponse.type;

      const formData = new FormData();
      formData.append('file', {
        // @ts-ignore
        uri: uri,
        type: type,
        name: 'file',
      });

      const logoFileId = `${uuid.v4()}.${type.split('/').pop()}`;
      await fileStore.upload(logoFileId, 'LOGO', type, formData);
      await fileStore.getFileUrl(logoFileId);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        __DEV__ && console.tron.log(`Canceling upload`);
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      } else {
        __DEV__ && console.tron.log(`Error while uploading file, ${err}`);
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
        throw err;
      }
    }
  };

  return (
    <TouchableOpacity style={fileUploadStyles.container} onPress={selectFile}>
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
