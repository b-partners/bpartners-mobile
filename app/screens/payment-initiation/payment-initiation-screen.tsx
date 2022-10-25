import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { GradientBackground, Header, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { CONTAINER, FULL, HEADER, HEADER_TITLE } from '../index';
import { PaymentInitiationForm } from './payment-initiation-form';

const FORM_FIELD_CONTAINER: ViewStyle = { paddingHorizontal: spacing[3] };
const QRCODE_CONTAINER_STYLE: ViewStyle = { display: 'flex', alignItems: 'center', marginTop: 25 };
const PAYMENT_LINK_STYLE: TextStyle = {
  marginBottom: spacing[3],
  textAlign: 'center',
  textDecorationLine: 'underline',
};

export const PaymentInitiationScreen: FC<DrawerScreenProps<NavigatorParamList, 'paymentInitiation'>> = observer(function PaymentInitiationScreen({
  navigation,
}) {
  const { paymentInitiationStore } = useStores();
  const { paymentUrl, products, customers } = paymentInitiationStore;

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
        <Header
          headerTx='paymentInitiationScreen.title'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          leftIcon={'back'}
          onLeftPress={() => navigation.navigate('home')}
        />
        <ScrollView style={FORM_FIELD_CONTAINER}>
          <PaymentInitiationForm
            init={paymentInitiationStore.init}
            getCustomers={paymentInitiationStore.getCustomers}
            getProducts={paymentInitiationStore.getProducts}
            products={products}
            customers={customers}
          />
          {paymentUrl && (
            <View style={QRCODE_CONTAINER_STYLE}>
              <Text text={paymentUrl} style={PAYMENT_LINK_STYLE} />
              <QRCode value={paymentUrl} size={100} />
            </View>
          )}
        </ScrollView>
      </Screen>
    </View>
  );
});
