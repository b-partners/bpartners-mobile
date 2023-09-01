import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { FlatList, TouchableOpacity, View, ViewStyle } from 'react-native';

import { HeaderWithBalance, Icon, Loader, NoDataProvided, Screen, Separator } from '../../components';
import { useStores } from '../../models';
import { Transaction as ITransaction } from '../../models/entities/transaction/transaction';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { LOADER_STYLE, SCREEN_STYLE } from '../invoices/utils/styles';
import { Transaction } from './components/transaction';
import { TransactionModal } from './components/transaction-modal';

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
  const { transactionStore, authStore, invoiceStore } = useStores();
  const { invoice, loading, invoices, paidInvoices, loadingInvoice } = invoiceStore;
  const combinedInvoices = invoices.concat(paidInvoices);

  const { availableBalance } = authStore.currentAccount;

  const { transactions, transactionCategories, loadingTransactionCategories } = transactionStore;
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<ITransaction>(null);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='TransactionListScreen' style={FULL}>
        <HeaderWithBalance
          balance={availableBalance}
          left={
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
              <Icon icon='back' />
            </TouchableOpacity>
          }
        />
        <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
          {loadingTransactionCategories ? (
            <Loader size='large' containerStyle={LOADER_STYLE} />
          ) : transactions.length > 0 ? (
            <FlatList
              testID='listContainer'
              contentContainerStyle={FLAT_LIST}
              data={[...transactions]}
              renderItem={({ item }) => {
                return (
                  <Transaction
                    key={item.id}
                    item={item}
                    transactionCategories={transactionCategories}
                    showTransactionCategory={true}
                    setShowModal={setShowModal}
                    setCurrentTransaction={setCurrentTransaction}
                  />
                );
              }}
              ItemSeparatorComponent={() => <Separator />}
            />
          ) : (
            <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
              <NoDataProvided />
            </Screen>
          )}
        </Screen>
        {currentTransaction && (
          <TransactionModal
            showModal={showModal}
            setShowModal={setShowModal}
            currentTransaction={currentTransaction}
            invoice={invoice}
            loading={loading}
            loadingInvoice={loadingInvoice}
            invoices={combinedInvoices}
          />
        )}
      </View>
    </ErrorBoundary>
  );
});
