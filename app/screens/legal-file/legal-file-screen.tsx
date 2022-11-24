import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { View, ViewStyle } from 'react-native';

import { ErrorBoundary } from '..';
import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { LegalFileView } from './component/legal-file-view';

const FULL: ViewStyle = { flex: 1 };
const HEADER_STYLE: ViewStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
};

export const LegalFileScreen: FC<DrawerScreenProps<NavigatorParamList, 'legalFile'>> = observer(({ navigation }) => {
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
      __DEV__ && console.tron.log('no unapproved files anymore navigating to home');
      navigation.navigate('home');
    }
  }, [unApprovedFiles]);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='LegalFileScreen' style={FULL}>
        <Header style={HEADER_STYLE} />
        <Screen>{unApprovedFiles.length > 0 && <LegalFileView legalFile={unApprovedFiles[0]} />}</Screen>
      </View>
    </ErrorBoundary>
  );
});
