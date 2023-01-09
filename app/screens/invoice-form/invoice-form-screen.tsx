import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { ErrorBoundary } from '..';
import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { Invoice } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';
import { InvoiceForm } from './components/invoice-form';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};

export const InvoiceFormScreen: FC<StackScreenProps<NavigatorParamList, 'invoiceForm'>> = observer(function InvoiceFormScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { products, customers, invoice } = invoiceStore;

  const saveInvoice = async (values: Invoice) => {
    try {
      await invoiceStore.saveInvoice(values);
      navigation.navigate('paymentList');
    } catch (e) {
      __DEV__ && console.tron.log(e);
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      {' '}
      <View testID='PaymentInitiationScreen' style={FULL}>
        <Header
          headerTx='invoiceScreen.title'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          leftIcon={'back'}
          rightIcon={'info'}
          onLeftPress={async () => {
            navigation.navigate('paymentList');
          }}
        />
        <Screen style={CONTAINER} preset='auto' backgroundColor={palette.white}>
          <InvoiceForm invoice={invoice} customers={customers} products={products} onSaveInvoice={saveInvoice} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
