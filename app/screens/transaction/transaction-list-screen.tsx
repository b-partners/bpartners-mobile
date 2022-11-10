import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';

import { GradientBackground, Header, Screen, Separator, Text } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
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

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='TransactionListScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
          <Header
            headerTx='transactionListScreen.title'
            style={HEADER}
            titleStyle={HEADER_TITLE}
            onLeftPress={() => navigation.navigate('home')}
            leftIcon={'back'}
          />
          <View style={SUB_HEADER}>
            <Text tx={'transactionListScreen.balance'} style={SUB_HEADER_TITLE} />
            <Text style={SUB_HEADER_TITLE}>{transactions.reduce((a, c) => a + c.amount, 0)} €</Text>
          </View>
          <FlatList
            contentContainerStyle={FLAT_LIST}
            data={[...transactions]}
            renderItem={({ item }) => {
              return <Transaction key={item.id} item={item} transactionCategories={transactionCategories} showTransactionCategory={true} />;
            }}
            ItemSeparatorComponent={() => <Separator />}
          />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
