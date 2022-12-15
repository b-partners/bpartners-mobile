import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';

import { GradientBackground, Screen } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';
import { Balance } from './components/balance';
import { HomeHeader } from './components/home-header';
import { HomeLatestTransaction } from './components/home-latest-transaction';
import { TransactionSummary } from './components/transaction-summary';
import { FULL } from './styles';

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore, legalFilesStore  } = useStores();

  const { transactions, loadingTransactions, currentBalance, currentMonthSummary } = transactionStore;

  useEffect(() => {
    const date = new Date();
    legalFilesStore.getLegalFiles();
    transactionStore.getTransactions();
    transactionStore.getTransactionsSummary(date.getFullYear());
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='SignInWebViewScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen preset='auto' backgroundColor={color.transparent}>
          <HomeHeader />
          {transactions && <Balance balance={currentBalance} />}
          <TransactionSummary summary={currentMonthSummary} />
          <HomeLatestTransaction transactions={transactions} onPress={() => navigation.navigate('transactionList')} loading={loadingTransactions} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
