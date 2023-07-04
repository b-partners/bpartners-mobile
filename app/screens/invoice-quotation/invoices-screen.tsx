import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { SectionList, TouchableOpacity, View } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Button, Loader, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
// import env from '../../config/env';
import { translate } from '../../i18n';
import { useStores } from '../../models';
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
  const { invoices, loadingInvoice } = invoiceStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(invoices.length / itemsPerPage));
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = invoices.slice(startItemIndex, endItemIndex);

  const handleRefresh = async () => {
    await invoiceStore.getInvoices({ page: 1, pageSize: invoicePageSize, status: InvoiceStatus.CONFIRMED });
    setMaxPage(Math.ceil(invoices.length / itemsPerPage));
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= -5) {
      handleRefresh();
    }
  };

  const items: MenuItem[] = [
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

  const sendInvoice = (item: IInvoice) => {
    sendEmail(authStore, item);
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
                    menuAction={{
                      downloadInvoice: () => downloadInvoice(item),
                      sendInvoice: () => sendInvoice(item),
                    }}
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
          <View
            style={{
              width: '25%',
              alignItems: 'center',
              flexDirection: 'row',
              height: '100%',
              justifyContent: 'space-evenly',
            }}
          >
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
            <Button
              tx='quotationScreen.createInvoice'
              style={BUTTON_INVOICE_STYLE}
              textStyle={BUTTON_TEXT_STYLE}
              onPress={() => {
                navigation.navigate('invoiceForm', { status: InvoiceStatus.CONFIRMED });
              }}
            />
          </View>
        </View>
      </View>
    </ErrorBoundary>
  );
});
