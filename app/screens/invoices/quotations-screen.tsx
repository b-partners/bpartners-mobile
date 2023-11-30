import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { SectionList, View } from 'react-native';

import { BpPagination, Loader, MenuItem, NoDataProvided, Screen, Separator, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceRelaunch, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { navigate } from '../../navigators/navigation-utilities';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { sendEmail } from '../../utils/core/invoicing-utils';
import { getThreshold } from '../../utils/get-threshold';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize, itemsPerPage } from '../invoice-form/components/utils';
import { Invoice } from './components/invoice';
import { InvoiceCreationButton } from './components/invoice-creation-button';
import { RelaunchHistoryModal } from './components/relaunch-history-modal';
import { RelaunchMessageModal } from './components/relaunch-message-modal';
import { navigateToTab } from './utils/reset-tab-navigation';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';
import {
  BUTTON_CONTAINER_STYLE,
  FOOTER_COMPONENT_STYLE,
  FULL,
  LOADER_STYLE,
  SCREEN_STYLE,
  SECTION_HEADER_TEXT_STYLE,
  SECTION_LIST_CONTAINER_STYLE,
  SEPARATOR_STYLE,
} from './utils/styles';

export const QuotationsScreen: FC<MaterialTopTabScreenProps<TabNavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore, authStore, quotationStore } = useStores();
  const { loadingQuotation, quotations } = quotationStore;
  const [navigationState, setNavigationState] = useState(false);
  const [relaunchHistory, setRelaunchHistory] = useState(false);
  const [relaunchMessage, setRelaunchMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRelaunch, setCurrentRelaunch] = useState<InvoiceRelaunch>();
  const [maxPage, setMaxPage] = useState(Math.ceil(quotations.length / itemsPerPage));
  const [currentQuotation, setCurrentQuotation] = useState<IInvoice>();
  const messageOption = { backgroundColor: palette.green };
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = quotations.slice(startItemIndex, endItemIndex);

  const handleRefresh = async () => {
    await quotationStore.getQuotations({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.PROPOSAL });
    setMaxPage(Math.ceil(quotations.length / itemsPerPage));
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

  const markAsInvoice = async (item: IInvoice) => {
    if (item.status === InvoiceStatus.DRAFT || item.status === InvoiceStatus.CONFIRMED) {
      return;
    }
    try {
      setNavigationState(true);
      const editPayment = [];
      item.paymentRegulations.forEach(paymentItem => {
        const newItem = {
          maturityDate: paymentItem.maturityDate,
          percent: paymentItem.paymentRequest.percentValue,
          comment: paymentItem.paymentRequest.comment,
          amount: paymentItem.amount,
        };
        editPayment.push(newItem);
      });
      const editedItem = {
        ...item,
        ref: item.ref.replace('-TMP', ''),
        title: item.title?.replace('-TMP', ''),
        status: InvoiceStatus.CONFIRMED,
        paymentRegulations: editPayment,
      };
      navigateToTab(navigation, 'invoices');
      await invoiceStore.saveInvoice(editedItem);
      await invoiceStore.getInvoices({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.CONFIRMED });
      setNavigationState(false);
      await quotationStore.getQuotations({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.PROPOSAL });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsInvoice'), messageOption);
    } catch (e) {
      __DEV__ && console.tron.log(`Failed to convert invoice, ${e}`);
    }
  };
  const previewQuotation = (item: IInvoice) => {
    navigate('invoicePreview', {
      fileId: item.fileId,
      invoiceTitle: item.title,
      invoice: item,
      situation: false,
    });
  };

  const showRelaunchHistory = async (item: IInvoice) => {
    setCurrentQuotation(item);
    setRelaunchHistory(false);
    setRelaunchHistory(true);
  };

  const items: MenuItem[] = [
    { id: 'markAsInvoice', title: translate('invoiceScreen.menu.markAsInvoice') },
    { id: 'senByEmail', title: translate('invoicePreviewScreen.send') },
    { id: 'previewQuotation', title: translate('invoicePreviewScreen.previewQuotation') },
    { id: 'showRelaunchHistory', title: translate('invoiceScreen.menu.showRelaunchHistory') },
  ];

  useEffect(() => {
    if (currentRelaunch) {
      setRelaunchMessage(true);
    }
  }, [currentRelaunch]);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        {loadingQuotation ? (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        ) : displayedItems.length > 0 ? (
          <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
            <View>
              <SectionList<IInvoice>
                style={SECTION_LIST_CONTAINER_STYLE}
                sections={[...sectionInvoicesByMonth(displayedItems)]}
                renderItem={({ item }) => (
                  <Invoice
                    item={item}
                    menuItems={items}
                    menuAction={{
                      markAsInvoice: () => markAsInvoice(item),
                      senByEmail: () => sendEmail(authStore, invoiceStore, item),
                      previewQuotation: () => previewQuotation(item),
                      showRelaunchHistory: () => showRelaunchHistory(item),
                    }}
                  />
                )}
                keyExtractor={item => item.id}
                renderSectionHeader={({ section: { title } }) => <Text style={SECTION_HEADER_TEXT_STYLE}>{capitalizeFirstLetter(title)}</Text>}
                refreshing={loadingQuotation}
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
          <InvoiceCreationButton
            navigation={navigation}
            navigationState={navigationState}
            setNavigationState={setNavigationState}
            invoiceStatus={InvoiceStatus.PROPOSAL}
          />
        </View>
        {currentQuotation && (
          <RelaunchHistoryModal isOpen={relaunchHistory} setOpen={setRelaunchHistory} item={currentQuotation} setCurrentRelaunch={setCurrentRelaunch} />
        )}
        {currentRelaunch && <RelaunchMessageModal isOpen={relaunchMessage} setOpen={setRelaunchMessage} invoice={currentQuotation} item={currentRelaunch} />}
      </View>
    </ErrorBoundary>
  );
});
