import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { SectionList, TextStyle, View, ViewStyle } from 'react-native';

import { ErrorBoundary, HEADER_STYLE } from '..';
import { Button, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceSnapshotOut, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { showMessage } from '../../utils/snackbar';
import { Invoice } from './components/invoice';
import { CONTAINER, FULL } from './styles';

const SECTION_HEADER_TEXT_STYLE: TextStyle = {
  ...HEADER_STYLE,
  fontWeight: '700',
  color: palette.greyDarker,
  backgroundColor: palette.white,
};
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
  marginHorizontal: '10%',
  padding: spacing[7],
  borderRadius: 40,
};

const BUTTON_TEXT_STYLE = { fontSize: 14 };
export const QuotationsScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen() {
  const { invoiceStore } = useStores();
  const { loading, quotationByMonth } = invoiceStore;

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

  function sectionsQuotation() {
    const sectionedQuotation = [];
    for (const quotationByMonthKey in quotationByMonth) {
      if (quotationByMonth.hasOwnProperty(quotationByMonthKey)) {
        const quotationByMonthElement: InvoiceSnapshotOut[] = quotationByMonth[quotationByMonthKey];
        sectionedQuotation.push({
          title: new Intl.DateTimeFormat('default', { month: 'long' }).format(new Date(quotationByMonthElement[0].sendingDate)),
          data: quotationByMonthElement,
        });
      }
    }
    return sectionedQuotation;
  }

  const sectionedQuotations = sectionsQuotation();
  const items: MenuItem[] = [{ id: 'markAsInvoice', title: translate('invoiceScreen.menu.markAsInvoice') }];

  const onRefresh = async () => {
    await invoiceStore.getQuotations({ page: 1, pageSize: 15 });
  };

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
            progressViewOffset={100}
            stickySectionHeadersEnabled={true}
            onRefresh={onRefresh}
            ItemSeparatorComponent={() => <Separator style={{ borderColor: palette.lighterGrey }} />}
            renderSectionFooter={() => <View style={{ marginBottom: spacing[5] }} />}
          />
          <Button tx='quotationScreen.createQuotation' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
