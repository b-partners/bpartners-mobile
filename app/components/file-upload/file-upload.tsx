import React, { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { TxKeyPath } from '../../i18n';
import { Button } from '../button/button';
import { View, ViewStyle } from 'react-native';
import { color } from '../../theme';
import { useStores } from '../../models';

type FileUploadProps = {
  selectFileTx: TxKeyPath;
  uploadFileTx: TxKeyPath;
  onUploadFile: () => void;
  fileId?: string;
};

const BUTTON_STYLE = { backgroundColor: color.palette.lighterGrey, flex: 1 };

const BUTTON_TEXT_STYLE = { fontSize: 16 };

const CONTAINER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row' };

const FLEX_ITEM_STYLE = { flex: 1 };

export function FileUpload(props: FileUploadProps) {
  const [fileToUpload, setFileToUpload] = useState<File>(null);
  const { fileStore } = useStores();

  const uploadFile = () => {
    if (!fileToUpload) {
      console.tron.log('Please select a file', fileToUpload);
      return;
    }

    fileStore.upload(fileToUpload, props.fileId);
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.tron.log(`Picking file`, result);
      const documentPickerResponse = result[0];

      // get the file from the file system
      const blob = await (await fetch(documentPickerResponse.uri)).blob();
      const file = new File([blob], documentPickerResponse.name);

      setFileToUpload(file);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.tron.log(`Canceling upload`);
      } else {
        console.tron.log(`Error while uploading file, ${err}`);
        throw err;
      }
    }
  };

  return (
    <View style={CONTAINER_STYLE}>
      <View style={FLEX_ITEM_STYLE}>
        <Button
          style={BUTTON_STYLE}
          textStyle={BUTTON_TEXT_STYLE}
          onPress={fileToUpload ? uploadFile : selectFile}
          tx={fileToUpload ? props.uploadFileTx : props.selectFileTx}
        />
      </View>
      <View style={FLEX_ITEM_STYLE}>
        {fileToUpload && (
          <Button
            style={BUTTON_STYLE}
            textStyle={BUTTON_TEXT_STYLE}
            onPress={() => {
              console.tron.log(`Deleting file`);
              setFileToUpload(null);
            }}
            tx={'profileScreen.fields.removeFileButton'}
          />
        )}
      </View>
    </View>
  );
}
