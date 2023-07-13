import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { ImageStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { AutoImage, Icon, Screen } from '../../components';
import { HeaderWithBalance } from '../../components/header-with-balance/header-with-balance';
import { useStores } from '../../models';
import { InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { createFileUrl } from '../../utils/file-utils';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/components/utils';
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

export const Logo: FC<{ uri: string; logoStyle: ViewStyle }> = observer(({ uri, logoStyle }) => {
  const LOGO_STYLE: ImageStyle = { width: '100%', height: '100%' };

  return (
    <View style={logoStyle}>
      <AutoImage source={{ uri }} style={LOGO_STYLE} resizeMethod='resize' resizeMode='stretch' />
    </View>
  );
});

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore, authStore, invoiceStore, draftStore, quotationStore } = useStores();

  const { availableBalance } = authStore.currentAccount;
  const { currentAccount, currentAccountHolder, currentUser, accessToken } = authStore;

  const uri = createFileUrl(currentUser.logoFileId, currentAccount.id, accessToken, 'LOGO');

  const { loadingTransactions, currentMonthSummary, latestTransactions } = transactionStore;

  useEffect(() => {
    const date = new Date();
    transactionStore.getTransactions();
    transactionStore.getTransactionsSummary(date.getFullYear());
  }, []);

  useEffect(() => {
    draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: invoicePageSize });
    quotationStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: invoicePageSize });
    invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: invoicePageSize });
    invoiceStore.getPaidInvoices({ status: InvoiceStatus.PAID, page: 1, pageSize: invoicePageSize });
  }, []);

  useEffect(() => {
    transactionStore.getTransactionCategories();
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='homeScreen' style={FULL}>
        <Screen preset='auto' backgroundColor={palette.white}>
          <HeaderWithBalance
            balance={availableBalance}
            left={<Logo uri={uri} logoStyle={{ width: 50, height: 50 }} />}
            right={<Menu navigation={navigation} />}
          />
          <View style={{ padding: spacing[3] }}>
            <TransactionSummary summary={currentMonthSummary} accountHolder={currentAccountHolder} balance={availableBalance} />
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
