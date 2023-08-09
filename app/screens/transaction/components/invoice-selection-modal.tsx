import React, { useState } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Button, Loader, Separator, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Invoice } from '../../../models/entities/invoice/invoice';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../../invoice-quotation/styles';
import { Error } from '../../welcome/utils/utils';
import { InvoiceSelectionModalProps } from '../utils/utils';
import { InvoiceRow } from './invoice-row';

export const InvoiceSelectionModal: React.FC<InvoiceSelectionModalProps> = props => {
  const { showModal, setShowModal, invoices, loading, transaction, setTransactionModal } = props;

  const { transactionStore } = useStores();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedInvoices = invoices.slice(startItemIndex, endItemIndex);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>();
  const maxPage = Math.ceil(invoices.length / itemsPerPage);
  const [loadingCreation, setLoadingCreation] = useState(false);
  const associate = async () => {
    setLoadingCreation(true);
    try {
      await transactionStore.associateTransaction(transaction.id, selectedInvoice.id);
      setShowModal(false);
      setTransactionModal(false);
      await transactionStore.getTransactions();
    } catch (error) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      Error(translate('errors.somethingWentWrong'), error);
    } finally {
      setLoadingCreation(false);
    }
  };
  return (
    <Modal visible={showModal} animationType='fade' transparent={true} onRequestClose={() => setShowModal(false)}>
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
              height: '60%',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacing[1], paddingHorizontal: spacing[2], height: '5%' }}>
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
          {loading ? (
            <View style={{ height: '80%', paddingTop: spacing[4] }}>
              <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true} />
            </View>
          ) : (
            <View style={{ paddingVertical: spacing[2], height: '80%' }}>
              <FlatList
                data={displayedInvoices}
                keyExtractor={item => item.id}
                renderItem={({ item: current }) => {
                  return <InvoiceRow invoice={current} isSelected={current.id === selectedInvoice?.id} onSelect={() => setSelectedInvoice(current)} />;
                }}
                ItemSeparatorComponent={() => <Separator style={{ borderColor: palette.lighterGrey }} />}
              />
            </View>
          )}
          <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
            <View style={{ width: '25%', alignItems: 'center', flexDirection: 'row', height: '100%', justifyContent: 'space-evenly' }}>
              {currentPage === 1 ? (
                <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                  <EntypoIcon name='chevron-thin-left' size={27} color={palette.lighterGrey} />
                </View>
              ) : (
                <TouchableOpacity
                  style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  <EntypoIcon name='chevron-thin-left' size={25} color='#000' />
                </TouchableOpacity>
              )}
              <View style={{ width: '30%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                <Text text={currentPage.toString()} style={{ fontSize: 20, fontWeight: '600', color: palette.textClassicColor }} />
              </View>
              {currentPage === maxPage ? (
                <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                  <EntypoIcon name='chevron-thin-right' size={27} color={palette.lighterGrey} />
                </View>
              ) : (
                <TouchableOpacity
                  style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  <EntypoIcon name='chevron-thin-right' size={25} color='#000' />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ width: '75%', justifyContent: 'center' }}>
              {loadingCreation ? (
                <Loader size={'large'} animating={true} />
              ) : selectedInvoice ? (
                <Button tx='invoiceFormScreen.customerSelectionForm.validate' style={BUTTON_INVOICE_STYLE} textStyle={BUTTON_TEXT_STYLE} onPress={associate} />
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
    </Modal>
  );
};
