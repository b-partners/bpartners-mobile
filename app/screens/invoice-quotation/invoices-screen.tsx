import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { SectionList, View } from 'react-native';

import { Button, Loader, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
// import env from '../../config/env';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { navigate } from '../../navigators';
import { TabNavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { sendEmail } from '../../utils/core/invoicing-utils';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize, itemsPerPage } from '../invoice-form/components/utils';
import { Invoice } from './components/invoice';
import { InvoicePagination } from './components/invoice-pagination';
import { SendingConfirmationModal } from './components/sending-confirmation-modal';
import {
  BUTTON_INVOICE_STYLE,
  BUTTON_TEXT_STYLE,
  CONTAINER,
  FOOTER_COMPONENT_STYLE,
  FULL,
  LOADER_STYLE,
  SECTION_HEADER_TEXT_STYLE,
  SECTION_LIST_CONTAINER_STYLE,
  SEPARATOR_STYLE,
} from './styles';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';

export const InvoicesScreen: FC<MaterialTopTabScreenProps<TabNavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore, authStore } = useStores();
  const { invoices, loadingInvoice, paidInvoices } = invoiceStore;
  const combinedInvoices = invoices.concat(paidInvoices);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(combinedInvoices.length / itemsPerPage));
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = combinedInvoices.slice(startItemIndex, endItemIndex);
  const [openModal, setOpenModal] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const { currentAccountHolder, currentUser } = authStore;

  const handleRefresh = async () => {
    await invoiceStore.getInvoices({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.CONFIRMED });
    await invoiceStore.getPaidInvoices({ status: InvoiceStatus.PAID, page: 1, pageSize: invoicePageSize });
    setMaxPage(Math.ceil(combinedInvoices.length / itemsPerPage));
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= -5) {
      handleRefresh();
    }
  };

  const items: MenuItem[] = [
    { id: 'markAsPaid', title: translate('invoiceScreen.menu.markAsPaid') },
    { id: 'downloadInvoice', title: translate('invoiceScreen.menu.downloadInvoice') },
    { id: 'sendInvoice', title: translate('invoicePreviewScreen.sendInvoice') },
  ];

  const downloadInvoice = (item: IInvoice) => {
    navigate('invoicePreview', {
      fileId: item.fileId,
      invoiceTitle: item.title,
      invoice: item,
      situation: false,
    });
  };

  const sendInvoice = async (item: IInvoice) => {
    await sendEmail(authStore, item);
  };

  const markAsPaid = async (item: IInvoice) => {
    setCurrentCustomer(item.customer);
    setSendingRequest(true);
    const editPayment = [];
    item.paymentRegulations.forEach(paymentItem => {
      const newItem = {
        maturityDate: paymentItem.maturityDate,
        percent: paymentItem.paymentRequest.percentValue,
        comment: paymentItem.comment,
        amount: paymentItem.amount,
      };
      editPayment.push(newItem);
    });
    const editedItem = {
      ...item,
      status: InvoiceStatus.PAID,
      paymentRegulations: editPayment,
    };
    await invoiceStore.saveInvoice(editedItem);
    setOpenModal(true);
    await handleRefresh();
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View
        testID='PaymentInitiationScreen'
        style={{
          ...FULL,
          backgroundColor: color.palette.white,
          borderColor: color.transparent,
          borderWidth: 0,
        }}
      >
        {!loadingInvoice ? (
          <Screen style={CONTAINER} preset='scroll' backgroundColor={palette.white}>
            <View>
              <SectionList<IInvoice>
                style={SECTION_LIST_CONTAINER_STYLE}
                sections={[...sectionInvoicesByMonth(displayedItems)]}
                renderItem={({ item }) => (
                  <Invoice
                    item={item}
                    menuItems={items}
                    menuAction={
                      item.status === InvoiceStatus.CONFIRMED
                        ? {
                            markAsPaid: () => markAsPaid(item),
                            downloadInvoice: () => downloadInvoice(item),
                            sendInvoice: () => sendInvoice(item),
                          }
                        : {
                            downloadInvoice: () => downloadInvoice(item),
                            sendInvoice: () => sendInvoice(item),
                          }
                    }
                  />
                )}
                keyExtractor={item => item.id}
                renderSectionHeader={({ section: { title } }) => <Text style={SECTION_HEADER_TEXT_STYLE}>{capitalizeFirstLetter(title)}</Text>}
                refreshing={loadingInvoice}
                onRefresh={handleRefresh}
                progressViewOffset={100}
                stickySectionHeadersEnabled={true}
                ItemSeparatorComponent={() => <Separator style={SEPARATOR_STYLE} />}
                renderSectionFooter={() => <View style={FOOTER_COMPONENT_STYLE} />}
                onScrollEndDrag={handleScroll}
              />
            </View>
          </Screen>
        ) : (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        )}
        <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
          <InvoicePagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
          <View style={{ width: '75%', justifyContent: 'center' }}>
            <Button
              tx='quotationScreen.createInvoice'
              style={BUTTON_INVOICE_STYLE}
              textStyle={BUTTON_TEXT_STYLE}
              onPress={() => {
                navigation.navigate('invoiceForm', { initialStatus: InvoiceStatus.CONFIRMED });
              }}
            />
          </View>
        </View>
        {sendingRequest && (
          <SendingConfirmationModal
            confirmationModal={openModal}
            setConfirmationModal={setOpenModal}
            customer={currentCustomer}
            accountHolder={currentAccountHolder}
            user={currentUser}
            setSendingRequest={setSendingRequest}
          />
        )}
      </View>
    </ErrorBoundary>
  );
});
