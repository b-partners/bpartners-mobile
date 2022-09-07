import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { TextStyle, View, ViewStyle } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header, Screen } from '../../components';
import { color, spacing } from '../../theme';

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

export const PaymentInitiationScreen: FC<DrawerScreenProps<NavigatorParamList, 'paymentInitiation'>> = observer(function PaymentInitiationScreen() {
  return (
    <View testID='TransactionListScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
        <Header headerTx='paymentInitiation.title' style={HEADER} titleStyle={HEADER_TITLE} />
      </Screen>
    </View>
  );
});
