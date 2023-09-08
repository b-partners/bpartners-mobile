import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';

import { Screen } from '../../components';
import { HeaderWithBalance } from '../../components/header-with-balance/header-with-balance';
import { useStores } from '../../models';
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
  const { transactionStore, authStore } = useStores();
  const { availableBalance } = authStore.currentAccount;
  const { currentAccount, currentAccountHolder, currentUser, accessToken } = authStore;
  const { loadingTransactions, currentMonthSummary, latestTransactions, transactionsSummary } = transactionStore;

  const uri = createFileUrl(currentUser.logoFileId, currentAccount.id, accessToken, 'LOGO');

  useEffect(() => {
    (async () => {
      const date = new Date();
      await transactionStore.getTransactions({ page: 1, pageSize: invoicePageSize });
      await transactionStore.getTransactionsSummary(date.getFullYear());
      await transactionStore.getTransactionCategories();
    })();
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='homeScreen' style={FULL}>
        <HeaderWithBalance
          balance={availableBalance}
          left={<Logo uri={uri} logoStyle={{ width: 50, height: 50 }} />}
          right={<Menu navigation={navigation} />}
        />
        <Screen preset='scroll' backgroundColor={palette.white}>
          <View style={{ padding: spacing[3] }}>
            <TransactionSummary
              currentMonthSummary={currentMonthSummary}
              accountHolder={currentAccountHolder}
              balance={availableBalance}
              currentYearSummary={transactionsSummary}
            />
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
