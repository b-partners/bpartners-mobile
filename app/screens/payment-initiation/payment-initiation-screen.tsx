import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';

import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { TabNavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { PaymentInitiationForm } from './payment-initiation-form';
import { CONTAINER, FULL, HEADER, HEADER_TITLE } from './style';

const FORM_FIELD_CONTAINER: ViewStyle = { paddingHorizontal: spacing[3] };

export const PaymentInitiationScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'paymentInitiation'>> = observer(function PaymentInitiationScreen({
  navigation,
}) {
  const { paymentInitiationStore } = useStores();
  const { paymentUrl, initiatingPayment: loading, checkInit } = paymentInitiationStore;

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={FULL}>
        <Screen style={CONTAINER} preset='fixed' backgroundColor={palette.white}>
          <Header
            headerTx='paymentInitiationScreen.title'
            style={HEADER}
            titleStyle={HEADER_TITLE}
            leftIcon={'back'}
            onLeftPress={() => navigation.navigate('home')}
          />
          <ScrollView style={FORM_FIELD_CONTAINER}>
            <PaymentInitiationForm init={paymentInitiationStore.init} paymentUrl={paymentUrl} loading={loading} check={checkInit} />
          </ScrollView>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
