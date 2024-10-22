import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { SectionList, View } from 'react-native';

import { Loader, MenuItem, NoDataProvided, Screen, Separator, Text } from '../../components';
import { Pagination } from '../../components/bp-pagination';
import { ReloadModal } from '../../components/reload-modal/reload-modal';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice as IInvoice, InvoiceRelaunch, InvoiceStatus, PaymentMethod } from '../../models/entities/invoice/invoice';
import { PaymentRegulation } from '../../models/entities/payment-regulation/payment-regulation';
import { navigate } from '../../navigators/navigation-utilities';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { useQueryInvoice } from '../../queries';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { sendEmail } from '../../utils/core/invoicing-utils';
import { formatDate } from '../../utils/format-date';
import { getThreshold } from '../../utils/get-threshold';
import { RTLog } from '../../utils/reactotron-log';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { Invoice } from './components/invoice';
import { InvoiceCreationButton } from './components/invoice-creation-button';
import { InvoiceSummary } from './components/invoice-summary';
import { PartialPaymentModal } from './components/partial-payment-modal';
import { PaymentMethodSelectionModal } from './components/payment-method-selection';
import { RelaunchHistoryModal } from './components/relaunch-history-modal';
import { RelaunchMessageModal } from './components/relaunch-message-modal';
import { SendingConfirmationModal } from './components/sending-confirmation-modal';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';
import {
  BUTTON_CONTAINER_STYLE,
  CONTAINER_STYLE,
  FOOTER_COMPONENT_STYLE,
  LOADER_STYLE,
  SCREEN_STYLE,
  SECTION_HEADER_TEXT_STYLE,
  SECTION_LIST_CONTAINER_STYLE,
  SEPARATOR_STYLE,
} from './utils/styles';

export const InvoicesScreen: FC<MaterialTopTabScreenProps<TabNavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const {
    data: invoices,
    isLoading: isInvoicesLoading,
    setPage,
    hasNext,
    page,
    query: { refetch: handleRefresh },
  } = useQueryInvoice({ status: [InvoiceStatus.CONFIRMED, InvoiceStatus.PAID] });

  const { invoiceStore, authStore } = useStores();
  const [navigationState, setNavigationState] = useState(false);
  const { invoicesSummary } = invoiceStore;
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
  const [openPartialPaymentModal, setOpenPartialPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<IInvoice | null>(null);
  const [currentRelaunch, setCurrentRelaunch] = useState<InvoiceRelaunch | null>();
  const [relaunchHistory, setRelaunchHistory] = useState(false);
  const [relaunchMessage, setRelaunchMessage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const { currentAccountHolder, currentUser } = authStore;

  useEffect(() => {
    if (modalVisible) {
      const intervalId = setInterval(() => {
        setRotation(rot => rot + 50);
      }, 100);

      return () => {
        clearInterval(intervalId);
      };
    }
    return () => {};
  }, [modalVisible]);

  useEffect(() => {
    (async () => {
      setLoadingSummary(true);
      await invoiceStore.getInvoicesSummary();
      setLoadingSummary(false);
    })();
  }, []);

  const handleScroll = async event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= getThreshold()) {
      try {
        await handleRefresh();
      } catch {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    }
  };

  const items: MenuItem[] = [
    { id: 'markAsPaid', title: translate('invoiceScreen.menu.markAsPaid') },
    { id: 'downloadInvoice', title: translate('invoiceScreen.menu.downloadInvoice') },
    { id: 'sendInvoice', title: translate('invoicePreviewScreen.send') },
    { id: 'showRelaunchHistory', title: translate('invoiceScreen.menu.showRelaunchHistory') },
  ];

  const simpleItems: MenuItem[] = [
    { id: 'downloadInvoice', title: translate('invoiceScreen.menu.downloadInvoice') },
    { id: 'sendInvoice', title: translate('invoicePreviewScreen.send') },
    { id: 'showRelaunchHistory', title: translate('invoiceScreen.menu.showRelaunchHistory') },
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
    setModalVisible(true);
    const invoiceRelaunches = await invoiceStore.getInvoiceRelaunches(item.id, { page: 1, pageSize: 500 });
    if (invoiceRelaunches.length > 0) {
      const lastRelaunch: InvoiceRelaunch = invoiceRelaunches[invoiceRelaunches.length - 1];
      const date = formatDate(lastRelaunch.creationDatetime);
      setModalVisible(false);
      await sendEmail(authStore, invoiceStore, item, true, true, date);
    } else {
      setModalVisible(false);
      await sendEmail(authStore, invoiceStore, item, true, false);
    }
  };

  const showRelaunchHistory = async (item: IInvoice) => {
    setCurrentInvoice(item);
    setRelaunchHistory(false);
    setRelaunchHistory(true);
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
      handleRefresh();
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
      await invoiceStore.saveInvoice(editedItem as any);
      setIsLoading(false);
      setOpenPaymentMethodModal(false);
      setOpenModal(true);
      await handleRefresh();
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    }
  };

  useEffect(() => {
    if (currentRelaunch) {
      setRelaunchMessage(true);
    }
  }, [currentRelaunch]);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={CONTAINER_STYLE}>
        <InvoiceSummary
          quotation={invoicesSummary.proposal?.amount}
          paid={invoicesSummary.paid?.amount}
          unpaid={invoicesSummary.unpaid?.amount}
          loading={loadingSummary}
        />

        {isInvoicesLoading && <Loader size='large' containerStyle={LOADER_STYLE} />}

        {!isInvoicesLoading && invoices.length > 0 && (
          <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
            <View>
              <SectionList<IInvoice>
                style={SECTION_LIST_CONTAINER_STYLE}
                sections={[...sectionInvoicesByMonth(invoices as any)]}
                renderItem={({ item }) =>
                  item.status === InvoiceStatus.CONFIRMED ? (
                    <Invoice
                      item={item}
                      menuItems={items}
                      menuAction={{
                        markAsPaid: () => openMethodSelection(item),
                        downloadInvoice: () => downloadInvoice(item),
                        sendInvoice: () => sendInvoice(item),
                        showRelaunchHistory: () => showRelaunchHistory(item),
                      }}
                    />
                  ) : (
                    <Invoice
                      item={item}
                      menuItems={simpleItems}
                      menuAction={{
                        downloadInvoice: () => downloadInvoice(item),
                        sendInvoice: () => sendInvoice(item),
                        showRelaunchHistory: () => showRelaunchHistory(item),
                      }}
                    />
                  )
                }
                keyExtractor={item => item.id}
                renderSectionHeader={({ section: { title } }) => <Text style={SECTION_HEADER_TEXT_STYLE}>{capitalizeFirstLetter(title)}</Text>}
                refreshing={isInvoicesLoading}
                onRefresh={handleRefresh}
                progressViewOffset={100}
                stickySectionHeadersEnabled={true}
                ItemSeparatorComponent={() => <Separator style={SEPARATOR_STYLE} />}
                renderSectionFooter={() => <View style={FOOTER_COMPONENT_STYLE} />}
                onScrollEndDrag={handleScroll}
              />
            </View>
          </Screen>
        )}

        {!isInvoicesLoading && invoices.length === 0 && (
          <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
            <NoDataProvided reload={handleRefresh} />
          </Screen>
        )}

        <View style={BUTTON_CONTAINER_STYLE}>
          <Pagination
            changePage={setPage}
            page={page}
            hasNext={hasNext}
            actions={
              <InvoiceCreationButton
                navigation={navigation}
                navigationState={navigationState}
                setNavigationState={setNavigationState}
                invoiceStatus={InvoiceStatus.CONFIRMED}
              />
            }
          />
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
        {currentInvoice && (
          <RelaunchHistoryModal isOpen={relaunchHistory} setOpen={setRelaunchHistory} item={currentInvoice} setCurrentRelaunch={setCurrentRelaunch} />
        )}
        {currentRelaunch && (
          <RelaunchMessageModal
            isOpen={relaunchMessage}
            setOpen={setRelaunchMessage}
            invoice={currentInvoice}
            item={currentRelaunch}
            setCurrentRelaunch={setCurrentRelaunch}
          />
        )}
        <ReloadModal isOpen={modalVisible} setOpen={setModalVisible} rotation={rotation} />
      </View>
    </ErrorBoundary>
  );
});
