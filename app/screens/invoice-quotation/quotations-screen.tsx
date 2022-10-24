import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Screen, Separator } from '../../components';
import { color } from '../../theme';
import { useStores } from '../../models';
import { ACTIVITY_INDICATOR_CONTAINER_STYLE, CONTAINER, FULL, INVOICES_STYLE } from './styles';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { Invoice } from './components/invoice';
import { showMessage } from '../../utils/snackbar';
import { translate } from '../../i18n';
import { MenuItem } from '../../components/menu/menu';

export const QuotationsScreen: FC<StackScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { quotations, loading } = invoiceStore;

  const editInvoice = async (item: IInvoice) => {
    console.tron.log({ item });
    if (item.status !== InvoiceStatus.DRAFT) {
      return;
    }
    try {
      await invoiceStore.getInvoice(item.id);
      navigation.navigate('invoiceForm');
    } catch (e) {
      console.tron.log(`Failed to edit invoice, ${e}`);
    }
  };

  const items: MenuItem[] = [{ id: 'markAsProposal', title: translate('invoiceScreen.menu.markAsProposal') }];

  const markAsProposal = async (item: IInvoice) => {
    if (item.status === InvoiceStatus.PROPOSAL || item.status === InvoiceStatus.CONFIRMED) {
      return;
    }
    try {
      const editedItem = {
        ...item,
        ref: item.ref.replace('-TMP', ''),
        title: item.title.replace('-TMP', ''),
        status: InvoiceStatus.PROPOSAL,
      };
      await invoiceStore.saveInvoice(editedItem);
      await invoiceStore.getQuotations({ page: 1, pageSize: 15 });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsProposal'));
    } catch (e) {
      console.tron.log(`Failed to convert invoice, ${e}`);
    }
  };

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        {!loading ? (
          <FlatList<IInvoice>
            contentContainerStyle={INVOICES_STYLE}
            data={[...quotations]}
            renderItem={({ item }) => {
              return (
                <Invoice item={item} editInvoice={() => editInvoice(item)} menuItems={items} menuAction={{ markAsProposal: () => markAsProposal(item) }} />
              );
            }}
            ItemSeparatorComponent={() => <Separator />}
          />
        ) : (
          <View style={ACTIVITY_INDICATOR_CONTAINER_STYLE}>
            <ActivityIndicator size='large' />
          </View>
        )}
      </Screen>
    </View>
  );
});
