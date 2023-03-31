import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { FlatList, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon, Screen, Separator } from '../../components';
import { HeaderWithBalance } from '../../components/header-with-balance/header-with-balance';
import { Loader } from '../../components/loader/loader';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { LOADER_STYLE } from '../invoice-quotation/styles';
import { Transaction } from './components/transaction';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: palette.white,
};
const FLAT_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
  borderColor: palette.white,
  margin: spacing[3],
};

export const TransactionListScreen: FC<DrawerScreenProps<NavigatorParamList, 'transactionList'>> = observer(({ navigation }) => {
  const { transactionStore, authStore } = useStores();

  const { availableBalance } = authStore.currentAccount;

  const { transactions, transactionCategories, loadingTransactionCategories } = transactionStore;

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='TransactionListScreen' style={FULL}>
        <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
          <HeaderWithBalance
            balance={availableBalance}
            left={
              <TouchableOpacity onPress={() => navigation.navigate('home')}>
                <Icon icon='back' />
              </TouchableOpacity>
            }
          />
          {!loadingTransactionCategories ? (
            <FlatList
              testID='listContainer'
              contentContainerStyle={FLAT_LIST}
              data={[...transactions]}
              renderItem={({ item }) => {
                return <Transaction key={item.id} item={item} transactionCategories={transactionCategories} showTransactionCategory={true} />;
              }}
              ItemSeparatorComponent={() => <Separator />}
            />
          ) : (
            <Loader size='large' containerStyle={LOADER_STYLE} />
          )}
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
