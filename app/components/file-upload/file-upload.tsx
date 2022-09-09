import React, { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { TxKeyPath } from '../../i18n';
import { Button } from '../button/button';
import { View, ViewStyle } from 'react-native';
import { color } from '../../theme';

type FileUploadProps = {
  selectFileTx: TxKeyPath;
  uploadFileTx: TxKeyPath;
  onUploadFile: () => void;
};

const BUTTON_STYLE = { backgroundColor: color.palette.lighterGrey, flex: 1 };

const BUTTON_TEXT_STYLE = { fontSize: 16 };

const CONTAINER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row' };

const FLEX_ITEM_STYLE = { flex: 1 };

export function FileUpload(props: FileUploadProps) {
  const [fileToUpload, setFileToUpload] = useState([]);

  const uploadFile = () => {
    if (!fileToUpload) {
      console.tron.log('Please select a file', fileToUpload);
      return;
    }
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.tron.log(`Picking file`, result);
      setFileToUpload(result);
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
          onPress={fileToUpload.length > 0 ? uploadFile : selectFile}
          tx={fileToUpload.length > 0 ? props.uploadFileTx : props.selectFileTx}
        />
      </View>
      <View style={FLEX_ITEM_STYLE}>
        {fileToUpload.length > 0 && (
          <Button
            style={BUTTON_STYLE}
            textStyle={BUTTON_TEXT_STYLE}
            onPress={() => {
              console.tron.log(`Deleting file`);
              setFileToUpload([]);
            }}
            tx={'profileScreen.fields.removeFileButton'}
          />
        )}
      </View>
    </View>
  );
}
