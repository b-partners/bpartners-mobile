import { MaterialCommunityIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { SafeAreaView, TextStyle, View, ViewStyle } from 'react-native';

import { Button, Checkbox, PDFView, Text } from '../../../components';
import { CheckboxProps } from '../../../components/checkbox/checkbox.props';
import { Loader } from '../../../components/loader/loader';
import { useStores } from '../../../models';
import { LegalFile } from '../../../models/entities/legal-file/legal-file';
import { navigate } from '../../../navigators';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

interface ILegalFileView {
  legalFile: LegalFile;
  onApprove?: () => void;
}

const PDF_CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  margin: spacing[48],
};
const FULL: ViewStyle = { flex: 1 };
const CHECKBOX_CONTAINER: ViewStyle = {
  flexDirection: 'row',
  marginVertical: spacing[4],
};

const CHECKBOX_STYLE: CheckboxProps['style'] = {
  alignSelf: 'flex-end',
  marginLeft: spacing[2],
};
const FOOTER_CONTENT: ViewStyle = {
  alignItems: 'flex-end',
  paddingRight: spacing[6],
  paddingBottom: spacing[6],
};

const CONTINUE_BUTTON_STYLE: ViewStyle = {
  flexDirection: 'row',
  paddingHorizontal: spacing[2],
  backgroundColor: palette.deepPurple,
};

const FOOTER_ACCEPT_TEXT_STYLE: TextStyle = {
  color: 'black',
};

const PAGE_NUMBERS_STYLE: TextStyle = { color: 'black', position: 'absolute' };

export const LegalFileView = observer(function LegalFileView(props: ILegalFileView) {
  const { legalFilesStore } = useStores();
  const { legalFile, onApprove } = props;
  const { id } = legalFile;
  const [accepted, setAccepted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageNumber, setLastPageNumber] = useState<number>(1);
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);

  const acceptCGUAndContinue = async () => {
    await legalFilesStore.approveLegalFile(id);
    // in case if there are others cgu that was no approved
    navigate('legalFile');
    onApprove();
  };
  const handleLoaCompletedState = (numberOfPages: number) => {
    setContentLoaded(true);
    setLastPageNumber(numberOfPages);
    console.log(contentLoaded, currentPage, numberOfPages);
  };

  return (
    <View style={FULL}>
      <View style={PDF_CONTAINER}>
        <Text text={`${currentPage}/${lastPageNumber}`} style={PAGE_NUMBERS_STYLE} />
        {!contentLoaded && <Loader size='large' animating={true} />}
        <PDFView source={{ uri: legalFile?.fileUrl, cache: true }} onPageChanged={page => setCurrentPage(page)} onLoadComplete={handleLoaCompletedState} />
      </View>

      <SafeAreaView>
        <View style={FOOTER_CONTENT}>
          <View style={CHECKBOX_CONTAINER}>
            <Text text={'Accept'} style={FOOTER_ACCEPT_TEXT_STYLE} />
            <Checkbox onToggle={() => setAccepted(!accepted)} value={accepted} style={CHECKBOX_STYLE} />
          </View>

          <Button onPress={acceptCGUAndContinue} disabled={!accepted} style={CONTINUE_BUTTON_STYLE}>
            <Text text={`${legalFilesStore.unApprovedFiles.length}/${legalFilesStore.legalFiles.length}`} />
            <Text
              text='Continue'
              style={{
                marginHorizontal: spacing[2],
                color: accepted ? palette.white : palette.lighterGrey,
              }}
            />
            <MaterialCommunityIcons name='arrow-right-circle' size={24} color={accepted ? palette.white : palette.lighterGrey} />
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
});
