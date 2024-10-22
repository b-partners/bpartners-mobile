import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { SectionList, View } from 'react-native';

import { Loader, MenuItem, NoDataProvided, Screen, Separator, Text } from '../../components';
import { Pagination } from '../../components/bp-pagination';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { useQueryInvoice } from '../../queries';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { getThreshold } from '../../utils/get-threshold';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/utils/utils';
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
  const { invoiceStore, quotationStore } = useStores();

  const {
    data: invoices,
    isLoading,
    page,
    hasNext,
    setPage,
    invalidateInvoices,
    query: { refetch: handleRefresh },
  } = useQueryInvoice({ status: [InvoiceStatus.DRAFT] });

  const { invoicesSummary } = invoiceStore;
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [navigationState, setNavigationState] = useState(false);
  const messageOption = { backgroundColor: palette.green };

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
      await invoiceStore.saveInvoice(editedItem as any);
      await quotationStore.getQuotations({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.PROPOSAL });
      setNavigationState(false);
      invalidateInvoices();
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

        {isLoading && <Loader size='large' containerStyle={LOADER_STYLE} />}

        {!isLoading && invoices.length === 0 && (
          <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
            <NoDataProvided reload={handleRefresh} />
          </Screen>
        )}

        {!isLoading && invoices.length > 0 && (
          <Screen style={SCREEN_STYLE} preset='scroll' backgroundColor={palette.white}>
            <View>
              <SectionList<IInvoice>
                style={SECTION_LIST_CONTAINER_STYLE}
                sections={[...sectionInvoicesByMonth(invoices)]}
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
                refreshing={isLoading}
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
        <View style={BUTTON_CONTAINER_STYLE}>
          <Pagination
            page={page}
            changePage={setPage}
            hasNext={hasNext}
            actions={<InvoiceCreationButton navigation={navigation} navigationState={navigationState} setNavigationState={setNavigationState} />}
          />
        </View>
      </View>
    </ErrorBoundary>
  );
});
