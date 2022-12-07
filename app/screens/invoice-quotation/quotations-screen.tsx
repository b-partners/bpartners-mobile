import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { SectionList, View } from 'react-native';

import { ErrorBoundary } from '..';
import { Button, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { showMessage } from '../../utils/snackbar';
import { Invoice } from './components/invoice';
import {
  BUTTON_STYLE,
  BUTTON_TEXT_STYLE,
  CONTAINER,
  FOOTER_COMPONENT_STYLE,
  FULL,
  SECTION_HEADER_TEXT_STYLE,
  SECTION_LIST_CONTAINER_STYLE,
  SEPARATOR_STYLE,
} from './styles';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';

export const QuotationsScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { loading, quotations } = invoiceStore;

  const handleRefresh = async () => {
    await invoiceStore.getQuotations({ page: 1, pageSize: 15, status: InvoiceStatus.PROPOSAL });
    __DEV__ && console.tron.log(quotations);
  };

  const markAsInvoice = async (item: IInvoice) => {
    if (item.status === InvoiceStatus.DRAFT || item.status === InvoiceStatus.CONFIRMED) {
      return;
    }
    try {
      const editedItem = {
        ...item,
        ref: item.ref.replace('-TMP', ''),
        title: item.title.replace('-TMP', ''),
        status: InvoiceStatus.CONFIRMED,
      };
      await invoiceStore.saveInvoice(editedItem);
      await invoiceStore.getQuotations({ page: 1, pageSize: 15, status: InvoiceStatus.PROPOSAL });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsInvoice'));
    } catch (e) {
      __DEV__ && console.tron.log(`Failed to convert invoice, ${e}`);
    }
  };

  const sectionedQuotations = sectionInvoicesByMonth(quotations);
  const items: MenuItem[] = [{ id: 'markAsInvoice', title: translate('invoiceScreen.menu.markAsInvoice') }];

  const onRefresh = async () => {
    await invoiceStore.getQuotations({ page: 1, pageSize: 15 });
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={FULL}>
        <Screen style={CONTAINER} preset='auto' backgroundColor={palette.white}>
          <View>
            <SectionList<IInvoice>
              style={SECTION_LIST_CONTAINER_STYLE}
              sections={[...sectionedQuotations]}
              renderItem={({ item }) => <Invoice item={item} menuItems={items} menuAction={{ markAsInvoice: () => markAsInvoice(item) }} />}
              keyExtractor={item => item.id}
              renderSectionHeader={({ section: { title } }) => <Text style={SECTION_HEADER_TEXT_STYLE}>{capitalizeFirstLetter(title)}</Text>}
              refreshing={loading}
              onRefresh={handleRefresh}
              progressViewOffset={100}
              stickySectionHeadersEnabled={true}
              ItemSeparatorComponent={() => <Separator style={SEPARATOR_STYLE} />}
              renderSectionFooter={() => <View style={FOOTER_COMPONENT_STYLE} />}
            />
          </View>
          <Button tx='quotationScreen.createQuotation' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} onPress={() => navigation.navigate('invoiceForm')} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
