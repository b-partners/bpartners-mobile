import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { SectionList, View } from 'react-native';

import { BpPagination, Loader, MenuItem, NoDataProvided, Screen, Separator, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { getThreshold } from '../../utils/get-threshold';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize, itemsPerPage } from '../invoice-form/utils/utils';
import { Invoice } from './components/invoice';
import { InvoiceCreationButton } from './components/invoice-creation-button';
import { InvoiceSummary } from './components/invoice-summary';
import { navigateToTab } from './utils/reset-tab-navigation';
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

export const DraftsScreen: FC<MaterialTopTabScreenProps<TabNavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore, draftStore, quotationStore } = useStores();
  const { invoicesSummary } = invoiceStore;
  const [loadingSummary, setLoadingSummary] = useState(false);
  const { drafts, loadingDraft } = draftStore;
  const [navigationState, setNavigationState] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(drafts.length / itemsPerPage));
  const messageOption = { backgroundColor: palette.green };
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = drafts.slice(startItemIndex, endItemIndex);

  const handleRefresh = async () => {
    await draftStore.getDrafts({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.DRAFT });
    setMaxPage(Math.ceil(drafts.length / itemsPerPage));
  };

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

  useEffect(() => {
    (async () => {
      setLoadingSummary(true);
      await invoiceStore.getInvoicesSummary();
      setLoadingSummary(false);
    })();
  }, []);

  const editInvoice = async (item: IInvoice) => {
    setNavigationState(true);
    if (item.status !== InvoiceStatus.DRAFT) {
      return;
    }
    try {
      const currentInvoice = await invoiceStore.getInvoice(item.id);
      __DEV__ && console.tron.log(currentInvoice);
      invoiceStore.saveInvoiceInit();
      navigation.navigate('invoiceForm', { invoiceID: item.id, initialStatus: InvoiceStatus.DRAFT });
    } catch (e) {
      __DEV__ && console.tron.log(`Failed to edit invoice, ${e}`);
    } finally {
      setNavigationState(false);
    }
  };

  const markAsProposal = async (item: IInvoice) => {
    if (item.status === InvoiceStatus.PROPOSAL || item.status === InvoiceStatus.CONFIRMED) {
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
        status: InvoiceStatus.PROPOSAL,
        paymentRegulations: editPayment,
      };
      navigateToTab(navigation, 'quotations');
      await invoiceStore.saveInvoice(editedItem);
      await quotationStore.getQuotations({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.PROPOSAL });
      setNavigationState(false);
      await draftStore.getDrafts({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.DRAFT });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsProposal'), messageOption);
    } catch (e) {
      __DEV__ && console.tron.log(`Failed to convert invoice, ${e}`);
    }
  };
  const items: MenuItem[] = [
    { id: 'editInvoice', title: translate('invoiceScreen.menu.editDraft') },
    { id: 'markAsProposal', title: translate('invoiceScreen.menu.markAsProposal') },
  ];

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={CONTAINER_STYLE}>
        <InvoiceSummary
          quotation={invoicesSummary.proposal?.amount}
          paid={invoicesSummary.paid?.amount}
          unpaid={invoicesSummary.unpaid?.amount}
          loading={loadingSummary}
        />
        {loadingDraft ? (
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
                      editInvoice: () => editInvoice(item),
                      markAsProposal: () => markAsProposal(item),
                    }}
                    invoiceAction={editInvoice}
                  />
                )}
                keyExtractor={item => item.id}
                renderSectionHeader={({ section: { title } }) => <Text style={SECTION_HEADER_TEXT_STYLE}>{capitalizeFirstLetter(title)}</Text>}
                refreshing={loadingDraft}
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
            <NoDataProvided reload={handleRefresh} />
          </Screen>
        )}
        <View style={BUTTON_CONTAINER_STYLE}>
          <BpPagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
          <InvoiceCreationButton navigation={navigation} navigationState={navigationState} setNavigationState={setNavigationState} />
        </View>
      </View>
    </ErrorBoundary>
  );
});
