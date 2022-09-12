import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { TextStyle, View, ViewStyle } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header, Screen, Text } from '../../components';
import { color, spacing } from '../../theme';
import { useStores } from '../../models';
import QRCode from 'react-native-qrcode-svg';
import { PaymentInitiationForm } from './payment-initiation-form';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};
const FORM_FIELD_CONTAINER: ViewStyle = { paddingHorizontal: spacing[3] };
const QRCODE_CONTAINER_STYLE: ViewStyle = { display: 'flex', alignItems: 'center', marginTop: 25 };
const PAYMENT_LINK_STYLE: TextStyle = {
  marginBottom: spacing[3],
  textAlign: 'center',
  textDecorationLine: 'underline',
};

export const PaymentInitiationScreen: FC<DrawerScreenProps<NavigatorParamList, 'paymentInitiation'>> = observer(function PaymentInitiationScreen({}) {
  const { paymentInitiationStore } = useStores();
  const { paymentUrl } = paymentInitiationStore;

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
        <Header headerTx='paymentInitiationScreen.title' style={HEADER} titleStyle={HEADER_TITLE} />
        <View style={FORM_FIELD_CONTAINER}>
          <PaymentInitiationForm />
          {paymentUrl && (
            <View style={QRCODE_CONTAINER_STYLE}>
              <Text text={paymentUrl} style={PAYMENT_LINK_STYLE} />
              <QRCode value={paymentUrl} size={100} />
            </View>
          )}
        </View>
      </Screen>
    </View>
  );
});
