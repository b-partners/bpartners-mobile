import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { ImageStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { AutoImage, Icon, Screen } from '../../components';
import { HeaderWithBalance } from '../../components/header-with-balance/header-with-balance';
import env from '../../config/env';
import { useStores } from '../../models';
import { InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HomeLatestTransactions } from './components/home-latest-transactions';
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
  const { transactionStore, legalFilesStore, authStore, invoiceStore, marketplaceStore } = useStores();

  const { availableBalance } = authStore.currentAccount;
  const { currentAccount, currentAccountHolder, currentUser, accessToken } = authStore;

  const uri = `${env.apiBaseUrl}/accounts/${currentAccount.id}/files/${currentUser.logoFileId}/raw?accessToken=${accessToken}&fileType=LOGO`;

  const { loadingTransactions, currentMonthSummary, latestTransactions } = transactionStore;

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

  useEffect(() => {
    invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 20 });
    invoiceStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 20 });
    invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: 20 });
    marketplaceStore.getMarketplaces({
      page: 1,
      pageSize: 15,
    });
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='homeScreen' style={FULL}>
        <Screen preset='auto' backgroundColor={palette.white}>
          <HeaderWithBalance balance={availableBalance} left={<Logo uri={uri} />} right={<Menu navigation={navigation} />} />
          <View style={{ padding: spacing[3] }}>
            <TransactionSummary summary={currentMonthSummary} accountHolder={currentAccountHolder} />
          </View>
          <HomeLatestTransactions
            transactions={latestTransactions}
            onPress={() => navigation.navigate('transactionList')}
            loading={loadingTransactions}
            navigation={navigation}
          />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
