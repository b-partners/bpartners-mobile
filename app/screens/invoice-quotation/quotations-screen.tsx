import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { SectionList, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { ErrorBoundary } from '..';
import { Button, Loader, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { navigate } from '../../navigators';
import { TabNavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { sendEmail } from '../../utils/core/invoicing-utils';
import { showMessage } from '../../utils/snackbar';
import { invoicePageSize, itemsPerPage } from '../invoice-form/components/utils';
import { Invoice } from './components/invoice';
import { InvoicePagination } from './components/invoice-pagination';
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
import { navigateToTab } from './utils/reset-tab-navigation';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';

export const QuotationsScreen: FC<MaterialTopTabScreenProps<TabNavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore, authStore, quotationStore } = useStores();
  const { loadingQuotation, quotations } = quotationStore;
  const [navigationState, setNavigationState] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(quotations.length / itemsPerPage));
  const messageOption = { backgroundColor: palette.green };
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = quotations.slice(startItemIndex, endItemIndex);

  const handleRefresh = async () => {
    await quotationStore.getQuotations({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.PROPOSAL });
    setMaxPage(Math.ceil(quotations.length / itemsPerPage));
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= -5) {
      handleRefresh();
    }
  };

  const markAsInvoice = async (item: IInvoice) => {
    if (item.status === InvoiceStatus.DRAFT || item.status === InvoiceStatus.CONFIRMED) {
      return;
    }
    try {
      setNavigationState(true);
      const editedItem = {
        ...item,
        ref: item.ref.replace('-TMP', ''),
        title: item.title?.replace('-TMP', ''),
        status: InvoiceStatus.CONFIRMED,
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
  const previewQuotation = item => {
    navigate('invoicePreview', {
      fileId: item.fileId,
      invoiceTitle: item.title,
      invoice: item,
      situation: false,
    });
  };

  const items: MenuItem[] = [
    { id: 'markAsInvoice', title: translate('invoiceScreen.menu.markAsInvoice') },
    { id: 'senByEmail', title: translate('invoicePreviewScreen.send') },
    { id: 'previewQuotation', title: translate('invoicePreviewScreen.previewQuotation') },
  ];

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        {!loadingQuotation ? (
          <Screen style={CONTAINER} preset='scroll' backgroundColor={palette.white}>
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
                      senByEmail: () => sendEmail(authStore, item),
                      previewQuotation: () => previewQuotation(item),
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
          <Loader size='large' containerStyle={LOADER_STYLE} />
        )}
        <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
          <InvoicePagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
          <View style={{ width: '75%', justifyContent: 'center' }}>
            {navigationState ? (
              <Snackbar
                visible={navigationState}
                elevation={5}
                style={{
                  backgroundColor: palette.yellow,
                  marginVertical: spacing[5],
                  marginHorizontal: spacing[4],
                  borderRadius: 40,
                  paddingHorizontal: spacing[2],
                }}
                onDismiss={() => setNavigationState(false)}
              >
                {translate('common.loading')}
              </Snackbar>
            ) : (
              <Button
                tx='quotationScreen.createQuotation'
                style={BUTTON_INVOICE_STYLE}
                textStyle={BUTTON_TEXT_STYLE}
                onPress={() => {
                  invoiceStore.saveInvoiceInit();
                  navigation.navigate('invoiceForm');
                }}
              />
            )}
          </View>
        </View>
      </View>
    </ErrorBoundary>
  );
});
