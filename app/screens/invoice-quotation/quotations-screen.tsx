import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { FlatList, View } from 'react-native';

import { GradientBackground, Screen, Separator } from '../../components';
import { Loader } from '../../components/loader/loader';
import { useStores } from '../../models';
import { Invoice as IInvoice } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color } from '../../theme';
import { Invoice } from './components/invoice';
import { CONTAINER, FULL, INVOICES_STYLE, LOADER_STYLE } from './styles';

export const QuotationsScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen() {
  const { invoiceStore } = useStores();
  const { quotations, loading } = invoiceStore;

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        {!loading ? (
          <FlatList<IInvoice>
            contentContainerStyle={INVOICES_STYLE}
            data={[...quotations]}
            renderItem={({ item }) => {
              return <Invoice item={item} menuItems={[]} menuAction={{}} />;
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
