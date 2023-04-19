import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { SectionList, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { Button, Loader, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { Invoice } from './components/invoice';
import {
  BUTTON_STYLE,
  BUTTON_TEXT_STYLE,
  FOOTER_COMPONENT_STYLE,
  FULL,
  LOADER_STYLE,
  SECTION_HEADER_TEXT_STYLE,
  SECTION_LIST_CONTAINER_STYLE,
  SEPARATOR_STYLE,
} from './styles';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';

export const DraftsScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { drafts, loadingDraft } = invoiceStore;
  const [navigationState, setNavigationState] = useState(false);

  __DEV__ && console.tron.log('Voici les brouillons: ', drafts);
  const handleRefresh = async () => {
    await invoiceStore.getDrafts({ page: 1, pageSize: 30, status: InvoiceStatus.DRAFT });
  };

  const editInvoice = async (item: IInvoice) => {
    setNavigationState(true);
    if (item.status !== InvoiceStatus.DRAFT) {
      return;
    }
    try {
      await invoiceStore.getInvoice(item.id);
      invoiceStore.saveInvoiceInit();
      navigation.navigate('invoiceForm', { invoiceType: InvoiceStatus.DRAFT, invoiceID: item.id });
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
      const editedItem = {
        ...item,
        ref: item.ref.replace('-TMP', ''),
        title: item.title?.replace('-TMP', ''),
        status: InvoiceStatus.PROPOSAL,
      };
      await invoiceStore.saveInvoice(editedItem);
      await invoiceStore.getQuotations({ page: 1, pageSize: 30, status: InvoiceStatus.PROPOSAL });
      await invoiceStore.getDrafts({ page: 1, pageSize: 30, status: InvoiceStatus.DRAFT });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsProposal'));
    } catch (e) {
      __DEV__ && console.tron.log(`Failed to convert invoice, ${e}`);
    }
  };
  const sectionedQuotations = sectionInvoicesByMonth(drafts);
  const items: MenuItem[] = [
    { id: 'editInvoice', title: translate('invoiceScreen.menu.editDraft') },
    { id: 'markAsProposal', title: translate('invoiceScreen.menu.markAsProposal') },
  ];

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        {!loadingDraft ? (
          <Screen
            style={{ backgroundColor: color.transparent, display: 'flex', flexDirection: 'column', paddingBottom: spacing[6] }}
            preset='scroll'
            backgroundColor={palette.white}
          >
            <View>
              <SectionList<IInvoice>
                style={SECTION_LIST_CONTAINER_STYLE}
                sections={[...sectionedQuotations]}
                renderItem={({ item }) => (
                  <Invoice
                    item={item}
                    menuItems={items}
                    menuAction={{
                      editInvoice: () => editInvoice(item),
                      markAsProposal: () => markAsProposal(item),
                    }}
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
              />
            </View>
          </Screen>
        ) : (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        )}
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
            style={BUTTON_STYLE}
            textStyle={BUTTON_TEXT_STYLE}
            onPress={() => {
              invoiceStore.saveInvoiceInit();
              navigation.navigate('invoiceForm', { invoiceType: InvoiceStatus.DRAFT });
            }}
          />
        )}
      </View>
    </ErrorBoundary>
  );
});
