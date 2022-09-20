import React, { FC, useEffect } from 'react';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import { GradientBackground, Header, Screen, Separator, Text } from '../../components';
import { color, spacing } from '../../theme';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { palette } from '../../theme/palette';
import { Transaction } from './components/transaction';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
};
const SUB_HEADER: TextStyle = {
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
};
const HEADER_TITLE: TextStyle = {
  fontSize: 15,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};
const SUB_HEADER_TITLE: TextStyle = {
  fontSize: 14,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  marginBottom: spacing[2],
};
const FLAT_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: palette.white,
  margin: spacing[3],
};

export const TransactionListScreen: FC<DrawerScreenProps<NavigatorParamList, 'transactionList'>> = observer(({ navigation }) => {
  const { transactionStore } = useStores();
  const { transactions, transactionCategories } = transactionStore;

  useEffect(() => {
    async function fetchData() {
      await transactionStore.getTransactions();
      await transactionStore.getTransactionCategories();
    }

    fetchData();
  });

  return (
    <View testID='TransactionListScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
        <Header headerTx='transactionListScreen.title' style={HEADER} titleStyle={HEADER_TITLE} onLeftPress={() => navigation.navigate('home')} />
        <View style={SUB_HEADER}>
          <Text tx={'transactionListScreen.balance'} style={SUB_HEADER_TITLE} />
          <Text style={SUB_HEADER_TITLE}>{transactions.reduce((a, c) => a + c.amount, 0)} €</Text>
        </View>
        <FlatList
          contentContainerStyle={FLAT_LIST}
          data={[...transactions]}
          renderItem={({ item }) => {
            return <Transaction item={item} transactionCategories={transactionCategories} />;
          }}
          ItemSeparatorComponent={() => <Separator />}
        />
      </Screen>
    </View>
  );
});
