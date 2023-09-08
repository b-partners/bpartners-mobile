import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Searchbar } from 'react-native-paper';

import { HeaderWithBalance, Icon, Loader, NoDataProvided, Screen, Separator } from '../../components';
import { translate } from '../../i18n';
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

  const { transactions, transactionCategories, loadingTransactionCategories, loadingTransactions } = transactionStore;
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<ITransaction>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);
  const debounceTimeoutRef = useRef(null);

  const handleRefresh = async () => {
    await transactionStore.getTransactions();
  };

  const searchTransaction = async () => {
    await transactionStore.getTransactions();
  };

  const handleInputChange = query => {
    onChangeSearch(query);
    /*if (query) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        await searchProspect();
      }, 1000);
    }*/
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <HeaderWithBalance
        balance={availableBalance}
        left={
          <TouchableOpacity onPress={() => navigation.navigate('home')}>
            <Icon icon='back' />
          </TouchableOpacity>
        }
      />
      <View testID='TransactionListScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        <Searchbar
          placeholder={translate('common.search')}
          onChangeText={handleInputChange}
          value={searchQuery}
          style={{
            backgroundColor: palette.solidGrey,
            height: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing[4],
            width: '90%',
            marginHorizontal: '5%',
          }}
          iconColor={palette.lightGrey}
          clearIcon='close-circle'
          onClearIconPress={handleRefresh}
          inputStyle={{ color: palette.black, alignSelf: 'center' }}
          placeholderTextColor={palette.lightGrey}
        />
        <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
          {loadingTransactionCategories || loadingTransactions ? (
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
