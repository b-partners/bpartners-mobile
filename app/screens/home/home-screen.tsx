import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { ImageStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { AutoImage, Icon, Screen } from '../../components';
import { HeaderWithBalance } from '../../components/header-with-balance/header-with-balance';
import env from '../../config/env';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';
import { HomeLatestTransaction } from './components/home-latest-transaction';
import { TransactionSummary } from './components/transaction-summary';
import { FULL } from './styles';

const BULLET_STYLE: ViewStyle = { position: 'absolute', top: -5, left: -5, zIndex: 1 };

export const Menu: FC<{ navigation: DrawerNavigationProp<any> }> = observer(({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} testID='menuContainer'>
      <View>
        <View style={BULLET_STYLE}>
          <Icon icon='redBullet' />
        </View>
        <Icon icon='whiteMenu' />
      </View>
    </TouchableOpacity>
  );
});

export const Logo: FC<{ uri: string }> = observer(({ uri }) => {
  const LOGO_STYLE: ImageStyle = { width: '100%', height: '100%' };

  return (
    <View style={{ height: 50, width: 50 }}>
      <AutoImage source={{ uri }} style={LOGO_STYLE} resizeMethod='resize' resizeMode='stretch' />
    </View>
  );
});

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore, legalFilesStore, authStore } = useStores();

  const { availableBalance } = authStore.currentAccount;
  const { currentAccount, currentUser, accessToken } = authStore;

  const uri = `${env.apiBaseUrl}/accounts/${currentAccount.id}/files/${currentUser.logoFileId}/raw?accessToken=${accessToken}&fileType=LOGO`;

  const { transactions, loadingTransactions, currentMonthSummary } = transactionStore;

  useEffect(() => {
    const date = new Date();
    legalFilesStore.getLegalFiles();
    transactionStore.getTransactions();
    transactionStore.getTransactionsSummary(date.getFullYear());
  }, []);

  useEffect(() => {
    transactionStore.getTransactions();
    transactionStore.getTransactionCategories();
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='homeScreen' style={FULL}>
        <Screen preset='auto' backgroundColor={color.transparent}>
          <HeaderWithBalance balance={availableBalance} left={<Logo uri={uri} />} right={<Menu navigation={navigation} />} />
          <View style={{ padding: spacing[3] }}>
            <TransactionSummary summary={currentMonthSummary} />
            <HomeLatestTransaction transactions={transactions} onPress={() => navigation.navigate('transactionList')} loading={loadingTransactions} />
          </View>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
