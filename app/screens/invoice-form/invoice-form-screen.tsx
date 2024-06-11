import { useLinkTo } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';

import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { Invoice } from '../../models/entities/invoice/invoice';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { InvoiceForm } from './components/invoice/invoice-form';
import { CONTAINER, FULL } from './utils/styles';

export const InvoiceFormScreen: FC<StackScreenProps<TabNavigatorParamList, 'invoiceForm'>> = observer(function InvoiceFormScreen({ navigation, route }) {
  const invoiceId = route.params?.invoiceID;
  const initialStatus = route.params?.initialStatus;
  const areaPictureId = route.params?.areaPictureId;
  const { invoiceStore, productStore } = useStores();
  const { products } = productStore;
  const [toEdit, setToEdit] = useState<Invoice>(null);

  useEffect(() => {
    const getInvoiceById = async invoiceID => {
      await invoiceStore
        .getInvoice(invoiceID)
        .then(response => setToEdit(response))
        .catch(error => __DEV__ && console.tron.log(error));
    };

    invoiceId && getInvoiceById(invoiceId);
  }, [invoiceId]);

  const linkTo = useLinkTo();

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
          <InvoiceForm
            invoice={toEdit}
            products={products}
            onSaveInvoice={saveInvoice}
            initialStatus={initialStatus}
            navigation={navigation}
            areaPictureId={areaPictureId}
          />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
