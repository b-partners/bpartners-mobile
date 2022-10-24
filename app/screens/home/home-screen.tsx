import React, { FC } from 'react';
import { View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Screen } from '../../components';
import { useStores } from '../../models';
import { color } from '../../theme';
import { FULL } from './styles';
import { Balance } from './components/balance';
import { HomeHeader } from './components/home-header';
import { HomeNavbar } from './components/home-navbar';
import { TransactionSummary } from './components/transaction-summary';
import { HomeLatestTransaction } from './components/home-latest-transaction';
import { HomeFooter } from './components/home-footer';

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore } = useStores();
  const { transactions } = transactionStore;

  return (
    <View testID='SignInWebViewScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen preset='auto' backgroundColor={color.transparent}>
        <HomeHeader onPress={() => navigation.navigate('paymentInitiation')} />
        {transactions && <Balance balance={transactions.reduce((a, c) => a + c.amount, 0)} />}
        <HomeNavbar
          goToInvoices={() => {
            navigation.navigate('paymentList');
          }}
        />
        <TransactionSummary />
        <HomeLatestTransaction transactions={transactions} onPress={() => navigation.navigate('transactionList')} />
        <HomeFooter />
      </Screen>
    </View>
  );
});
