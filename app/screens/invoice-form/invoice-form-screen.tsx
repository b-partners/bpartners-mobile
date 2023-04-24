import { useLinkTo } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { View, ViewStyle } from 'react-native';

import { ErrorBoundary } from '..';
import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { Invoice } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';
import { InvoiceForm } from './invoice-form';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};

export const InvoiceFormScreen: FC<StackScreenProps<NavigatorParamList, 'invoiceForm'>> = observer(function InvoiceFormScreen({ navigation, route }) {
  const invoiceId = route.params?.invoiceID;
  const { invoiceStore, customerStore, productStore } = useStores();
  const { products } = productStore;
  const [toEdit, setToEdit] = useState<Invoice>();

  useEffect(() => {
    const getInvoiceById = async () => {
      await invoiceStore
        .getInvoice(invoiceId)
        .then(response => setToEdit(response))
        .catch(error => __DEV__ && console.tron.log(error));
    };

    getInvoiceById();

    /*(async function () {
      const response = (await getInvoiceById()).ref;
      __DEV__&&console.tron.log('response: ' + response);
//      setToEdit(response)
    })()*/
  }, [invoiceId]);

  useEffect(() => {
    __DEV__ && console.tron.log('toEdit: ' + toEdit);
  }, [toEdit]);

  const linkTo = useLinkTo();

  navigation.addListener('state', () => {
    customerStore.getCustomers();
    productStore.getProducts();
  });

  const saveInvoice = async (values: Invoice) => {
    try {
      await invoiceStore.saveInvoice(values);
      linkTo('/paymentList');
    } catch (e) {
      __DEV__ && console.tron.log(e);
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={FULL}>
        <Header
          headerTx='invoiceScreen.title'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          leftIcon={'back'}
          // rightIcon={'info'}
          onLeftPress={async () => {
            linkTo('/paymentList');
          }}
        />
        <Screen style={CONTAINER} preset='scroll' backgroundColor={palette.white}>
          <InvoiceForm invoice={toEdit} products={products} onSaveInvoice={saveInvoice} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
