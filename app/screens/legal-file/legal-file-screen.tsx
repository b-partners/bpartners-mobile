import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { ErrorBoundary } from '..';
import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { LegalFileView } from './component/legal-file-view';

const FULL: ViewStyle = { flex: 1 };
const HEADER_STYLE: ViewStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
  backgroundColor: palette.deepPurple,
};
const HEADER_TEXT_STYLE: TextStyle = {
  fontSize: 15,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

export const LegalFileScreen: FC<DrawerScreenProps<NavigatorParamList, 'legalFile'>> = observer(({}) => {
  const { legalFilesStore, transactionStore, authStore } = useStores();
  const { unApprovedFiles } = legalFilesStore;

  useEffect(() => {
    const fetchLegalFiles = async () => {
      await legalFilesStore.getLegalFiles();
    };

    fetchLegalFiles();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      await Promise.all([authStore.whoami(), transactionStore.getTransactions(), transactionStore.getTransactionCategories()]);
    };

    if (unApprovedFiles.length <= 0) {
      fetchUserData();
      __DEV__ && console.tron.log('no unapproved files anymore navigating');
    }
  }, [unApprovedFiles]);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='LegalFileScreen' style={FULL}>
        <Header style={HEADER_STYLE} headerText='General User Condition' titleStyle={HEADER_TEXT_STYLE} />
        <Screen>{unApprovedFiles.length > 0 && <LegalFileView legalFile={unApprovedFiles[0]} />}</Screen>
      </View>
    </ErrorBoundary>
  );
});
