import { MaterialCommunityIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, TextStyle, View, ViewStyle } from 'react-native';

import { Button, Checkbox, PDFView, Text } from '../../../components';
import { CheckboxProps } from '../../../components/checkbox/checkbox.props';
import { useStores } from '../../../models';
import { LegalFile } from '../../../models/entities/legal-file/legal-file';
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
  backgroundColor: palette.secondaryColor,
};

const FOOTER_ACCEPT_TEXT_STYLE: TextStyle = {
  color: 'black',
};

const PAGE_NUMBERS_STYLE: TextStyle = { color: 'black', position: 'absolute', zIndex: 999 };
const ERROR_MESSAGE_STYLE: TextStyle = { fontSize: 21, color: 'black', margin: spacing[7], fontWeight: 'bold' };

function renderFooter(
  setAccepted: (value: ((prevState: boolean) => boolean) | boolean) => void,
  accepted: boolean,
  acceptCGUAndContinue: () => Promise<void>,
  legalFilesStore
) {
  return (
    <SafeAreaView>
      <View style={FOOTER_CONTENT}>
        <View style={CHECKBOX_CONTAINER}>
          <Text tx='legalFileScreen.accept' style={FOOTER_ACCEPT_TEXT_STYLE} />
          <Checkbox onToggle={() => setAccepted(!accepted)} value={accepted} style={CHECKBOX_STYLE} />
        </View>

        <Button onPress={acceptCGUAndContinue} disabled={!accepted} style={CONTINUE_BUTTON_STYLE}>
          <Text text={`${legalFilesStore.legalFiles.length - legalFilesStore.unApprovedFiles.length + 1}/${legalFilesStore.legalFiles.length}`} />
          <Text
            tx='legalFileScreen.continue'
            style={{
              marginHorizontal: spacing[2],
              color: accepted ? palette.white : palette.lighterGrey,
            }}
          />
          <MaterialCommunityIcons name='arrow-right-circle' size={24} color={accepted ? palette.white : palette.lighterGrey} />
        </Button>
      </View>
    </SafeAreaView>
  );
}

function renderErrorMessage(error: boolean, handleReloadPress: () => Promise<void>) {
  return (
    <>
      {error && (
        <>
          <Text tx='legalFileScreen.errorMessage' style={ERROR_MESSAGE_STYLE} />
          <Button tx='legalFileScreen.reload' onPress={handleReloadPress} />
        </>
      )}
    </>
  );
}

export const LegalFileView = observer(function LegalFileView(props: ILegalFileView) {
  const { legalFilesStore } = useStores();
  const { legalFile, onApprove } = props;
  const { id } = legalFile;

  const [accepted, setAccepted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageNumber, setLastPageNumber] = useState<number>(1);
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // do not display the activity indicator
    // if there was error
    if (error) setContentLoaded(true);
  }, [error]);

  const acceptCGUAndContinue = async () => {
    setContentLoaded(false);

    try {
      await legalFilesStore.approveLegalFile(id);
    } catch (e) {
      setError(true);
      throw e;
    } finally {
      setAccepted(false);
    }
    onApprove();
    setContentLoaded(true);
  };
  const handleLoaCompletedState = (numberOfPages: number) => {
    setContentLoaded(true);
    setLastPageNumber(numberOfPages);
  };
  const handleReloadPress = async () => {
    setContentLoaded(false);
    setError(false);

    try {
      await legalFilesStore.getLegalFiles();
    } catch (e) {
      setError(true);
      throw e;
    }

    setContentLoaded(true);
    setError(false);
  };
  return (
    <View style={FULL}>
      <View style={PDF_CONTAINER}>
        {renderErrorMessage(error, handleReloadPress)}
        {contentLoaded && !error && <Text text={`${currentPage}/${lastPageNumber}`} style={PAGE_NUMBERS_STYLE} />}
        {!error && (
          <PDFView
            source={{ uri: legalFile?.fileUrl, cache: true }}
            onPageChanged={page => setCurrentPage(page)}
            onLoadComplete={handleLoaCompletedState}
            onError={() => setError(true)}
            renderActivityIndicator={() => <ActivityIndicator animating={!contentLoaded} />}
          />
        )}
      </View>

      {contentLoaded && !error && renderFooter(setAccepted, accepted, acceptCGUAndContinue, legalFilesStore)}
    </View>
  );
});
