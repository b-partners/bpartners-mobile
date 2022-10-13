import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { View, ViewStyle } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header, Screen } from '../../components';
import { color } from '../../theme';
import { HEADER, HEADER_TITLE } from '../index';
import { InvoiceForm } from './components/invoice-form';
import { useStores } from '../../models';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};

export const CreateInvoiceScreen: FC<StackScreenProps<NavigatorParamList, 'createInvoice'>> = observer(function CreateInvoiceScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { products, customers } = invoiceStore;

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        <Header headerTx='invoiceScreen.title' style={HEADER} titleStyle={HEADER_TITLE} leftIcon={'back'} onLeftPress={() => navigation.navigate('invoices')} />
        <InvoiceForm customers={customers} products={products} />
      </Screen>
    </View>
  );
});
