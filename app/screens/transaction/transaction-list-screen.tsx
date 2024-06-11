import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Searchbar } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { BpPagination, HeaderWithBalance, Icon, Loader, NoDataProvided, Screen, Separator } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Transaction as ITransaction, TransactionStatus } from '../../models/entities/transaction/transaction';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/utils/utils';
import { LOADER_STYLE, SCREEN_STYLE } from '../invoices/utils/styles';
import { Transaction } from './components/transaction';
import { TransactionModal } from './components/transaction-modal';

const FULL: ViewStyle = {
  flex: 1,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [maxPage, setMaxPage] = useState(Math.ceil(transactions.length / itemsPerPage));
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const [currentStatus, setCurrentStatus] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions.filter(item => item.status === currentStatus));
  const displayedItems = currentStatus ? filteredTransactions.slice(startItemIndex, endItemIndex) : transactions.slice(startItemIndex, endItemIndex);

  useEffect(() => {
    setFilteredTransactions(transactions.filter(item => item.status === currentStatus));
  }, [currentStatus]);

  const onChangeSearch = query => setSearchQuery(query);
  const debounceTimeoutRef = useRef(null);

  const handleRefresh = async () => {
    await transactionStore.getTransactions({ page: 1, pageSize: invoicePageSize });
    setMaxPage(Math.ceil(transactions.length / itemsPerPage));
  };

  const searchTransaction = async () => {
    await transactionStore.getTransactions({ label: searchQuery, page: 1, pageSize: invoicePageSize });
  };

  const handleInputChange = query => {
    onChangeSearch(query);
    if (query) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        await searchTransaction();
        setMaxPage(Math.ceil(transactions.length / itemsPerPage));
      }, 1000);
    }
  };

  const status = [
    { label: translate('transactionListScreen.status.pending'), value: TransactionStatus.PENDING },
    { label: translate('transactionListScreen.status.booked'), value: TransactionStatus.BOOKED },
    { label: translate('transactionListScreen.status.rejected'), value: TransactionStatus.REJECTED },
    { label: translate('transactionListScreen.status.upcoming'), value: TransactionStatus.UPCOMING },
  ];

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
      <View testID='transactionListScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
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
        {loadingTransactionCategories || loadingTransactions ? (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        ) : transactions.length > 0 ? (
          <ScrollView style={{ backgroundColor: palette.white, flexDirection: 'column', marginTop: spacing[2] }}>
            <FlatList
              testID='listContainer'
              contentContainerStyle={FLAT_LIST}
              data={displayedItems}
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
          </ScrollView>
        ) : (
          <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
            <NoDataProvided reload={handleRefresh} />
          </Screen>
        )}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: spacing[1],
              height: 80,
              width: '100%',
              marginBottom: spacing[4],
              alignItems: 'center',
              paddingLeft: spacing[4],
            }}
          >
            <BpPagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={status}
              maxHeight={300}
              labelField='label'
              valueField='value'
              placeholder={'Status'}
              value={currentStatus}
              onChange={item => {
                setCurrentStatus(item.value);
              }}
              renderLeftIcon={() => (
                <TouchableOpacity onPress={() => setCurrentStatus(null)}>
                  <AntDesignIcon style={styles.icon} color={palette.black} name='closecircleo' size={20} />
                </TouchableOpacity>
              )}
            />
          </View>
        </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    width: 150,
    backgroundColor: palette.solidGrey,
    borderRadius: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: palette.greyDarker,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: palette.greyDarker,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
