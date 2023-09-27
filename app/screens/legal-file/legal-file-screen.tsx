import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/navigation-list';
import { ErrorBoundary } from '../error/error-boundary';
import { LegalFileView } from './component/legal-file-view';

const FULL: ViewStyle = { flex: 1 };
const HEADER_TEXT_STYLE: TextStyle = {
  fontSize: 15,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

export const LegalFileScreen: FC<DrawerScreenProps<NavigatorParamList, 'legalFile'>> = observer(({ navigation }) => {
  const { legalFilesStore, authStore } = useStores();
  const { unApprovedFiles } = legalFilesStore;

  useEffect(() => {
    const fetchLegalFiles = async () => {
      await legalFilesStore.getLegalFiles();
    };
    const fetchUserData = async () => {
      await authStore.getAccounts();
      navigation.navigate('oauth');
    };
    fetchLegalFiles();

    if (unApprovedFiles.length <= 0) {
      fetchUserData();
      __DEV__ && console.tron.log('no unapproved files anymore navigating');
    }
  }, [unApprovedFiles]);

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='legalFileScreen.condition' titleStyle={HEADER_TEXT_STYLE} />
      <View testID='LegalFileScreen' style={FULL}>
        <Screen>{unApprovedFiles.length > 0 && <LegalFileView legalFile={unApprovedFiles[0]} />}</Screen>
      </View>
    </ErrorBoundary>
  );
});
