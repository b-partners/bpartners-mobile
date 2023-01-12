import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { SectionList, View, ViewStyle } from 'react-native';

import { ErrorBoundary } from '..';
import { Button, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { showMessage } from '../../utils/snackbar';
import { Invoice } from './components/invoice';
import { CONTAINER, FOOTER_COMPONENT_STYLE, FULL, SECTION_HEADER_TEXT_STYLE, SEPARATOR_STYLE } from './styles';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';

const SHADOW_STYLE: ViewStyle = {
  shadowOffset: { height: 10, width: 0 },
  shadowOpacity: 10,
  shadowRadius: 2,
  shadowColor: 'rgba(156, 37, 90, 0.2)',
  elevation: 2,
};
const BUTTON_STYLE: ViewStyle = {
  ...SHADOW_STYLE,
  backgroundColor: color.primary,
  marginHorizontal: '5%',
  borderRadius: 40,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
};

const BUTTON_TEXT_STYLE = { fontSize: 14 };
export const QuotationsScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { loading, quotations } = invoiceStore;

  const handleRefresh = async () => {
    await invoiceStore.getQuotations({ page: 1, pageSize: 15, status: InvoiceStatus.PROPOSAL });
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

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={FULL}>
        <Screen style={CONTAINER} preset='fixed' backgroundColor={palette.white}>
          <SectionList<IInvoice>
            style={{ marginHorizontal: spacing[4] }}
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

          <Button tx='quotationScreen.createQuotation' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} onPress={() => navigation.navigate('invoiceForm')} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
