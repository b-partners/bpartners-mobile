import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Screen, Separator } from '../../components';
import { color } from '../../theme';
import { useStores } from '../../models';
import { ACTIVITY_INDICATOR_CONTAINER_STYLE, CONTAINER, FULL, INVOICES_STYLE } from './styles';
import { Invoice as IInvoice } from '../../models/entities/invoice/invoice';
import { Invoice } from './components/invoice';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';

export const InvoicesScreen: FC<StackScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen() {
  const { invoiceStore } = useStores();
  const { invoices, loading } = invoiceStore;

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
