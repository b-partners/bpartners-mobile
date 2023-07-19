import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';

import { Screen } from '../../components';
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
import { Logo } from './components/logo';
import { Menu } from './components/menu';
import { TransactionSummary } from './components/transaction-summary';
import { FULL } from './utils/styles';

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
