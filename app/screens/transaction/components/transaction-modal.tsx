import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { AutoImage, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { TransactionType } from '../../../models/entities/transaction-category/transaction-category';
import { navigate } from '../../../navigators/navigation-utilities';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors } from '../../../utils/money';
import { showMessage } from '../../../utils/snackbar';
import { invoicePageSize } from '../../invoice-form/utils/utils';
import { transactionModalStyles as styles } from '../utils/styles';
import { PaymentModalProps } from '../utils/utils';
import { InvoiceSelectionModal } from './invoice-selection-modal';
import { TransactionField } from './transaction-field';

export const TransactionModal: React.FC<PaymentModalProps> = props => {
  const { currentTransaction, showModal, setShowModal, invoice, loading, invoices, loadingInvoice } = props;

  const closeModal = () => {
    setShowModal(false);
  };
  const dateStr = currentTransaction.paymentDatetime;
  const dateObj = new Date(dateStr);
  const dateFormat = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const [isVisible, setVisible] = useState(false);
  const { invoiceStore } = useStores();

  const openInvoiceSelection = async () => {
    try {
      setVisible(true);
      await invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: invoicePageSize });
      await invoiceStore.getPaidInvoices({ status: InvoiceStatus.PAID, page: 1, pageSize: invoicePageSize });
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      setVisible(false);
    }
  };

  return (
    <Modal animationType='slide' transparent={true} visible={showModal} onRequestClose={closeModal} style={styles.modal}>
      <View style={styles.container} testID='payment-url-modal-container'>
        <View style={{ width: '100%', flexDirection: 'column' }}>
          <AutoImage source={require('../utils/transaction.png')} style={styles.imageBackground} resizeMethod='auto' resizeMode='stretch' />
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.icon} onPress={() => setShowModal(false)}>
              <CloseIcon name='close' size={30} color={palette.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.header}>
            <View style={styles.headerLabelContainer}>
              <Text text={currentTransaction.label} numberOfLines={3} style={styles.headerLabel} />
            </View>
            <View style={styles.headerRowContainer}>
              <View style={styles.headerDateContainer}>
                <Text text={`Le ${dateFormat}`} numberOfLines={1} style={styles.headerDate} />
              </View>
              <View style={styles.headerOutcomeContainer}>
                <Text
                  text={`${currentTransaction.type === TransactionType.OUTCOME ? '-' : '+'}${printCurrencyToMajors(currentTransaction.amount)}`}
                  numberOfLines={1}
                  style={styles.headerOutcome}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.referenceContainer}>
            <Text tx={'transactionListScreen.reference'} style={styles.referenceLabel} />
            <Text text={currentTransaction.reference ?? translate('common.noInformation')} style={styles.reference} />
          </View>
          <View style={styles.associatedContainer}>
            <TouchableOpacity style={styles.navigation} onPress={openInvoiceSelection}>
              <View style={styles.transactionIcon}>
                <SimpleLineIcons name='paper-clip' size={18} color={palette.secondaryColor} />
              </View>
              <View style={styles.textContainer}>
                <Text tx={'transactionListScreen.associate'} style={styles.text} />
              </View>
              <View style={styles.transactionIcon}>
                <EntypoIcon name='chevron-thin-right' size={18} color='#000' />
              </View>
            </TouchableOpacity>
            {loading && <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true} />}
            {invoice.title && (
              <TouchableOpacity
                style={styles.fieldContainer}
                onPress={() => {
                  navigate('invoicePreview', {
                    fileId: invoice.fileId,
                    invoiceTitle: invoice.title,
                    invoice: invoice,
                    situation: false,
                  });
                  closeModal();
                }}
              >
                <Text tx={'transactionListScreen.associatedLabel'} style={styles.associatedLabel} />
                <TransactionField label='transactionListScreen.reference' text={invoice.ref} />
                <TransactionField label='transactionListScreen.titleLabel' text={invoice.title} />
                <TransactionField label='transactionListScreen.total' text={printCurrencyToMajors(invoice.totalPriceWithVat)} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <InvoiceSelectionModal
        showModal={isVisible}
        setShowModal={setVisible}
        setTransactionModal={setShowModal}
        invoices={invoices}
        loading={loadingInvoice}
        transaction={currentTransaction}
      />
    </Modal>
  );
};
