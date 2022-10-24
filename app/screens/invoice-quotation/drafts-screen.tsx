import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Screen, Separator } from '../../components';
import { color } from '../../theme';
import { useStores } from '../../models';
import { ACTIVITY_INDICATOR_CONTAINER_STYLE, CONTAINER, FULL, INVOICES_STYLE } from './styles';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { Invoice } from './components/invoice';
import { translate } from '../../i18n';
import { MenuItem } from '../../components/menu/menu';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { showMessage } from '../../utils/snackbar';

export const DraftsScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { drafts, loading } = invoiceStore;

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 30 });
    });
    return unsubscribe;
  }, [navigation]);

  const editInvoice = async (item: IInvoice) => {
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
      await invoiceStore.getQuotations({ page: 1, pageSize: 15, status: InvoiceStatus.DRAFT });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsProposal'));
    } catch (e) {
      console.tron.log(`Failed to convert invoice, ${e}`);
    }
  };

  const items: MenuItem[] = [
    { id: 'editInvoice', title: translate('invoiceScreen.menu.editInvoice') },
    { id: 'markAsProposal', title: translate('invoiceScreen.menu.markAsProposal') },
  ];

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        {!loading ? (
          <FlatList<IInvoice>
            contentContainerStyle={INVOICES_STYLE}
            data={[...drafts]}
            renderItem={({ item }) => {
              return (
                <Invoice
                  item={item}
                  menuItems={items}
                  menuAction={{
                    editInvoice: () => editInvoice(item),
                    markAsProposal: () => markAsProposal(item),
                  }}
                />
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
