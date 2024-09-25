import React, { useRef, useState } from 'react';
import { FlatList, Modal, Platform, TouchableOpacity, View } from 'react-native';
import { ProgressBar, Searchbar } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { BpPagination, Button, Loader, Separator, Text } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Invoice, SearchInvoice } from '../../../models/entities/invoice/invoice';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../../invoices/utils/styles';
import { InvoiceSelectionModalProps } from '../utils/utils';
import { InvoiceRow } from './invoice-row';

export const InvoiceSelectionModal: React.FC<InvoiceSelectionModalProps> = props => {
  const { showModal, setShowModal, invoices, loading, transaction, setTransactionModal, getSelectedInvoice } = props;

  const { transactionStore, invoiceStore } = useStores();
  const { searchInvoices } = invoiceStore;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedInvoices = invoices.slice(startItemIndex, endItemIndex);
  const maxPage = Math.ceil(invoices.length / itemsPerPage);
  const filteredInvoices = searchInvoices.slice(startItemIndex, endItemIndex);
  const filteredPage = Math.ceil(searchInvoices.length / itemsPerPage);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | SearchInvoice | null>();
  const [loadingCreation, setLoadingCreation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const onChangeSearch = query => setSearchQuery(query);

  const associate = async () => {
    setLoadingCreation(true);
    try {
      if (!transaction) {
        await getSelectedInvoice(selectedInvoice);
      } else {
        await transactionStore.associateTransaction(transaction.id, selectedInvoice.id);
        await transactionStore.getTransactions();
        setTransactionModal(false);
      }
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    } finally {
      setLoadingCreation(false);
      setShowModal(false);
    }
  };

  const searchInvoice = async () => {
    setLoadingSearch(true);
    await invoiceStore.searchInvoice(searchQuery);
    setIsSearching(true);
    setTimeout(() => {
      setLoadingSearch(false);
    }, 500);
  };

  const debounceTimeoutRef = useRef(null);
  const handleInputChange = query => {
    onChangeSearch(query);

    if (query) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        await searchInvoice();
      }, 1000);
    }
  };

  return (
    <Modal visible={showModal} animationType='fade' transparent={true} onRequestClose={() => setShowModal(false)}>
      <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(10, 16, 69, 0.5)',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <View
            style={[
              {
                padding: spacing[4],
                backgroundColor: palette.white,
                width: '100%',
              },
              keyboardOpen && Platform.OS === 'android' ? { height: '90%' } : { height: '60%' },
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: spacing[1],
                paddingHorizontal: spacing[2],
                height: '5%',
              }}
            >
              <Text
                tx={'paymentListScreen.tabs.invoices'}
                style={{
                  color: color.palette.lightGrey,
                  fontFamily: 'Geometria',
                  fontSize: 15,
                }}
              />
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <RNVIcon name='close' color={color.palette.lightGrey} size={14} />
              </TouchableOpacity>
            </View>
            <Searchbar
              placeholder={translate('common.search')}
              onChangeText={handleInputChange}
              value={searchQuery}
              onClearIconPress={() => {
                setIsSearching(false);
              }}
              style={{
                backgroundColor: palette.solidGrey,
                height: 40,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              iconColor={palette.lightGrey}
              clearIcon='close-circle'
              inputStyle={{ color: palette.black, alignSelf: 'center' }}
              placeholderTextColor={palette.lightGrey}
            />
            {loading || loadingSearch ? (
              <View style={{ height: '75%', paddingTop: spacing[4] }}>
                <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true} />
              </View>
            ) : (
              <View style={{ paddingVertical: spacing[2], height: '75%' }}>
                <FlatList
                  data={isSearching ? filteredInvoices : displayedInvoices}
                  keyExtractor={item => item.id}
                  renderItem={({ item: current }) => {
                    return <InvoiceRow invoice={current} isSelected={current.id === selectedInvoice?.id} onSelect={() => setSelectedInvoice(current)} />;
                  }}
                  ItemSeparatorComponent={() => <Separator style={{ borderColor: palette.lighterGrey }} />}
                />
              </View>
            )}
            <View style={{ flexDirection: 'row', marginTop: spacing[1], height: 50 }}>
              <BpPagination maxPage={isSearching ? filteredPage : maxPage} page={currentPage} setPage={setCurrentPage} />
              <View style={{ width: '75%', justifyContent: 'center' }}>
                {loadingCreation ? (
                  <Loader size={'large'} animating={true} />
                ) : selectedInvoice ? (
                  <Button
                    tx='invoiceFormScreen.customerSelectionForm.validate'
                    style={BUTTON_INVOICE_STYLE}
                    textStyle={BUTTON_TEXT_STYLE}
                    onPress={associate}
                  />
                ) : (
                  <View
                    style={{
                      backgroundColor: palette.solidGrey,
                      marginVertical: spacing[1],
                      marginHorizontal: spacing[1],
                      borderRadius: 40,
                      paddingVertical: spacing[3],
                      paddingHorizontal: spacing[2],
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text tx={'invoiceFormScreen.customerSelectionForm.validate'} style={{ fontSize: 14, color: palette.greyDarker }} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </KeyboardLayout>
    </Modal>
  );
};
