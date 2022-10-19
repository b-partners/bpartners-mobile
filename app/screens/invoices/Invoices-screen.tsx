import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { FlatList, View, ViewStyle } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header, Screen, Separator } from '../../components';
import { color } from '../../theme';
import { HEADER, HEADER_TITLE } from '../index';
import { useStores } from '../../models';
import { INVOICES_STYLE } from './styles';
import { Invoice as IInvoice } from '../../models/entities/invoice/invoice';
import { currencyPipe } from '../../utils/pipes';
import { translate } from '../../i18n';
import { Invoice } from './components/invoice';

const FULL: ViewStyle = {
  flex: 1,
};

const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};

export const InvoicesScreen: FC<StackScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { invoices } = invoiceStore;
  const { format } = currencyPipe(translate('currency'));

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        <Header
          headerTx='invoiceScreen.title'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          leftIcon={'back'}
          onLeftPress={() => navigation.navigate('home')}
          rightIcon={'plus'}
          onRightPress={async () => {
            try {
              await invoiceStore.createInvoice();
              navigation.navigate('invoiceForm');
            } catch (e) {
              console.tron.log(e);
            }
          }}
        />
        <FlatList<IInvoice>
          contentContainerStyle={INVOICES_STYLE}
          data={[...invoices]}
          renderItem={({ item }) => {
            return (
              <Invoice
                item={item}
                text={format(item.totalPriceWithVat)}
                editInvoice={async () => {
                  try {
                    await invoiceStore.getInvoice(item.id);
                    navigation.navigate('invoiceForm');
                  } catch (e) {
                    console.tron.log(e);
                  }
                }}
              />
            );
          }}
          ItemSeparatorComponent={() => <Separator />}
        />
      </Screen>
    </View>
  );
});
