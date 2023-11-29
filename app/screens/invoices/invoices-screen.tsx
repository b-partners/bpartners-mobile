import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { SectionList, View } from 'react-native';

import { BpPagination, Button, Loader, MenuItem, NoDataProvided, Screen, Separator, Text } from '../../components';
// import env from '../../config/env';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice as IInvoice, InvoiceStatus, PaymentMethod } from '../../models/entities/invoice/invoice';
import { PaymentRegulation } from '../../models/entities/payment-regulation/payment-regulation';
import { navigate } from '../../navigators/navigation-utilities';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { sendEmail } from '../../utils/core/invoicing-utils';
import { getThreshold } from '../../utils/get-threshold';
import { RTLog } from '../../utils/reactotron-log';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize, itemsPerPage } from '../invoice-form/components/utils';
import { Invoice } from './components/invoice';
import { PartialPaymentModal } from './components/partial-payment-modal';
import { PaymentMethodSelectionModal } from './components/payment-method-selection';
import { SendingConfirmationModal } from './components/sending-confirmation-modal';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';
import {
  BUTTON_CONTAINER_STYLE,
  BUTTON_INVOICE_STYLE,
  BUTTON_TEXT_STYLE,
  CONTAINER_STYLE,
  FOOTER_COMPONENT_STYLE,
  LOADER_STYLE,
  SCREEN_STYLE,
  SECTION_HEADER_TEXT_STYLE,
  SECTION_LIST_CONTAINER_STYLE,
  SEPARATOR_STYLE,
} from './utils/styles';

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
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
  const [openPartialPaymentModal, setOpenPartialPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<IInvoice | null>(null);
  const { currentAccountHolder, currentUser } = authStore;

  const handleRefresh = async () => {
    await invoiceStore.getInvoices({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.CONFIRMED });
    await invoiceStore.getPaidInvoices({ status: InvoiceStatus.PAID, page: 1, pageSize: invoicePageSize });
    setMaxPage(Math.ceil(combinedInvoices.length / itemsPerPage));
  };

  const handleScroll = async event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= getThreshold()) {
      try {
        await handleRefresh();
      } catch (error) {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    }
  };

  const items: MenuItem[] = [
    { id: 'markAsPaid', title: translate('invoiceScreen.menu.markAsPaid') },
    { id: 'downloadInvoice', title: translate('invoiceScreen.menu.downloadInvoice') },
    { id: 'sendInvoice', title: translate('invoicePreviewScreen.send') },
  ];

  const simpleItems: MenuItem[] = [
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
    await sendEmail(authStore, invoiceStore, item, true);
  };

  const openMethodSelection = (item: IInvoice) => {
    setCurrentInvoice(item);
    if (item.paymentRegulations.length > 0) {
      setOpenPartialPaymentModal(true);
    } else {
      setOpenPaymentMethodModal(true);
    }
  };

  const updateStatus = async (invoiceId: string, paymentId: string, currentMethod: PaymentMethod) => {
    setIsStatusUpdating(true);
    setCurrentCustomer(currentInvoice.customer);
    try {
      const method = {
        method: currentMethod,
      };
      const updatedInvoice = await invoiceStore.updatePaymentRegulationStatus(invoiceId, paymentId, method);
      await invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: invoicePageSize });
      setCurrentInvoice(updatedInvoice);
      RTLog(updatedInvoice);
      let paid = 0;
      updatedInvoice.paymentRegulations.map((paymentRegulation: PaymentRegulation) => {
        if (paymentRegulation.status.paymentStatus === 'PAID') {
          paid += 1;
        }
      });
      if (paid === updatedInvoice.paymentRegulations.length) {
        setOpenPartialPaymentModal(false);
        setOpenModal(true);
      }
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const markAsPaid = async (method: PaymentMethod) => {
    setIsLoading(true);
    setCurrentCustomer(currentInvoice.customer);
    const editPayment = [];
    currentInvoice.paymentRegulations.forEach(paymentItem => {
      const newItem = {
        maturityDate: paymentItem.maturityDate,
        percent: paymentItem.paymentRequest.percentValue,
        comment: paymentItem.paymentRequest.comment,
        amount: paymentItem.amount,
      };
      editPayment.push(newItem);
    });
    const editedItem = {
      ...currentInvoice,
      status: InvoiceStatus.PAID,
      paymentRegulations: editPayment,
      paymentMethod: method,
    };
    try {
      await invoiceStore.saveInvoice(editedItem);
      setIsLoading(false);
      setOpenPaymentMethodModal(false);
      setOpenModal(true);
      await handleRefresh();
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={CONTAINER_STYLE}>
        {loadingInvoice ? (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        ) : displayedItems.length > 0 ? (
          <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
            <View>
              <SectionList<IInvoice>
                style={SECTION_LIST_CONTAINER_STYLE}
                sections={[...sectionInvoicesByMonth(displayedItems)]}
                renderItem={({ item }) =>
                  item.status === InvoiceStatus.CONFIRMED ? (
                    <Invoice
                      item={item}
                      menuItems={items}
                      menuAction={{
                        markAsPaid: () => openMethodSelection(item),
                        downloadInvoice: () => downloadInvoice(item),
                        sendInvoice: () => sendInvoice(item),
                      }}
                    />
                  ) : (
                    <Invoice
                      item={item}
                      menuItems={simpleItems}
                      menuAction={{
                        downloadInvoice: () => downloadInvoice(item),
                        sendInvoice: () => sendInvoice(item),
                      }}
                    />
                  )
                }
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
          <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
            <NoDataProvided />
          </Screen>
        )}
        <View style={BUTTON_CONTAINER_STYLE}>
          <BpPagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
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
          {currentInvoice && (
            <PartialPaymentModal
              item={currentInvoice}
              isOpen={openPartialPaymentModal}
              setOpen={setOpenPartialPaymentModal}
              updateStatus={updateStatus}
              isLoading={isStatusUpdating}
            />
          )}
          <PaymentMethodSelectionModal isOpen={openPaymentMethodModal} setOpen={setOpenPaymentMethodModal} markAsPaid={markAsPaid} isLoading={isLoading} />
        </View>
        {currentCustomer && (
          <SendingConfirmationModal
            confirmationModal={openModal}
            setConfirmationModal={setOpenModal}
            customer={currentCustomer}
            accountHolder={currentAccountHolder}
            user={currentUser}
          />
        )}
      </View>
    </ErrorBoundary>
  );
});
