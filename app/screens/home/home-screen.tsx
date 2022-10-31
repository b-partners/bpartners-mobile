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
import { HomeFooter } from './components/home-footer';
import { HomeHeader } from './components/home-header';
import { HomeLatestTransaction } from './components/home-latest-transaction';
import { HomeNavbar } from './components/home-navbar';
import { TransactionSummary } from './components/transaction-summary';
import { FULL } from './styles';

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore } = useStores();
  const { transactions, loadingTransactions, currentBalance, transactionCategories: categories } = transactionStore;

  useEffect(() => {
    transactionStore.getTransactions();
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='SignInWebViewScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen preset='auto' backgroundColor={color.transparent}>
          <HomeHeader onPress={() => navigation.navigate('paymentInitiation')} />
          {transactions && <Balance balance={currentBalance} />}
          <HomeNavbar
            goToInvoices={() => {
              navigation.navigate('paymentList');
            }}
          />
          {categories && <TransactionSummary transactionCategories={categories} />}
          <HomeLatestTransaction transactions={transactions} onPress={() => navigation.navigate('transactionList')} loading={loadingTransactions} />
          <HomeFooter />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
