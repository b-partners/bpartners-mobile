import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { FlatList, View } from 'react-native';

import { GradientBackground, Screen, Separator } from '../../components';
import { Loader } from '../../components/loader/loader';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color } from '../../theme';
import { showMessage } from '../../utils/snackbar';
import { Invoice } from './components/invoice';
import { CONTAINER, FULL, INVOICES_STYLE, LOADER_STYLE } from './styles';

export const QuotationsScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { quotations, loading } = invoiceStore;

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      invoiceStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 30 });
    });
    return unsubscribe;
  }, [navigation]);

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
      console.tron.log(`Failed to convert invoice, ${e}`);
    }
  };

  const items: MenuItem[] = [{ id: 'markAsInvoice', title: translate('invoiceScreen.menu.markAsInvoice') }];

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        {!loading ? (
          <FlatList<IInvoice>
            contentContainerStyle={INVOICES_STYLE}
            data={[...quotations]}
            renderItem={({ item }) => {
              return <Invoice item={item} menuItems={items} menuAction={{ markAsInvoice: () => markAsInvoice(item) }} />;
            }}
            ItemSeparatorComponent={() => <Separator />}
          />
        ) : (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        )}
      </Screen>
    </View>
  );
});
