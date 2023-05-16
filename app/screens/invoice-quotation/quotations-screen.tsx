import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { SectionList, TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { ErrorBoundary } from '..';
import { Button, Loader, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { navigate } from '../../navigators';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { sendEmail } from '../../utils/core/invoicing-utils';
import { showMessage } from '../../utils/snackbar';
import { Invoice } from './components/invoice';
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

export const QuotationsScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore, authStore } = useStores();
  const { loadingQuotation, quotations, allQuotations } = invoiceStore;
  const [navigationState, setNavigationState] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(allQuotations.length / 10));

  const handleRefresh = async () => {
    await invoiceStore.getQuotations({ page: 1, pageSize: 10, status: InvoiceStatus.PROPOSAL });
    __DEV__ && console.tron.log(quotations);
  };

  useEffect(() => {
    setPage(1);
    setMaxPage(Math.ceil(allQuotations.length / 10));
  }, [allQuotations]);

  useEffect(() => {
    invoiceStore.getQuotations({ page: page, pageSize: 10, status: InvoiceStatus.PROPOSAL });
  }, [page]);

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
      await invoiceStore.saveInvoice(editedItem);
      await invoiceStore.getInvoices({ page: 1, pageSize: 10, status: InvoiceStatus.CONFIRMED });
      setNavigationState(false);
      await invoiceStore.getQuotations({ page: 1, pageSize: 10, status: InvoiceStatus.PROPOSAL });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsInvoice'));
    } catch (e) {
      __DEV__ && console.tron.log(`Failed to convert invoice, ${e}`);
    } finally {
      await invoiceStore.getAllInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: 500 });
      await invoiceStore.getAllInvoices({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 500 });
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

  const sectionedQuotations = sectionInvoicesByMonth(quotations);
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
                sections={[...sectionedQuotations]}
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
              />
            </View>
          </Screen>
        ) : (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        )}
        <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
          <View style={{ width: '25%', alignItems: 'center', flexDirection: 'row', height: '100%', justifyContent: 'space-evenly' }}>
            {page === 1 ? (
              <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                <EntypoIcon name='chevron-thin-left' size={27} color={palette.lighterGrey} />
              </View>
            ) : (
              <TouchableOpacity
                style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setPage(page - 1);
                }}
              >
                <EntypoIcon name='chevron-thin-left' size={25} color='#000' />
              </TouchableOpacity>
            )}
            <View style={{ width: '30%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
              <Text text={page.toString()} style={{ fontSize: 20, fontWeight: '600', color: palette.textClassicColor }} />
            </View>
            {page === maxPage ? (
              <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                <EntypoIcon name='chevron-thin-right' size={27} color={palette.lighterGrey} />
              </View>
            ) : (
              <TouchableOpacity
                style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setPage(page + 1);
                }}
              >
                <EntypoIcon name='chevron-thin-right' size={25} color='#000' />
              </TouchableOpacity>
            )}
          </View>
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
