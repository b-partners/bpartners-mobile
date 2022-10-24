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
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

export const InvoicesScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { invoices, loading } = invoiceStore;

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: 30 });
    });
    return unsubscribe;
  }, [navigation]);

  const items: MenuItem[] = [{ id: 'downloadInvoice', title: translate('invoiceScreen.menu.downloadInvoice') }];

  const downloadInvoice = () => console.tron.log('Downloading invoice');

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        {!loading ? (
          <FlatList<IInvoice>
            contentContainerStyle={INVOICES_STYLE}
            data={[...invoices]}
            renderItem={({ item }) => {
              return <Invoice item={item} menuItems={items} menuAction={{ downloadInvoice }} />;
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
