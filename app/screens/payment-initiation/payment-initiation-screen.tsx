import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { ScrollView, ViewStyle } from 'react-native';

import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { IbanModal } from './components/iban-modal';
import { PaymentInitiationForm } from './components/payment-initiation-form';
import { HEADER, HEADER_TITLE } from './utils/style';

const FORM_FIELD_CONTAINER: ViewStyle = { paddingHorizontal: spacing[3] };

export const PaymentInitiationScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'paymentInitiation'>> = observer(function PaymentInitiationScreen({
  navigation,
}) {
  const { paymentInitiationStore, authStore } = useStores();
  const { paymentUrl, initiatingPayment: loading } = paymentInitiationStore;
  const { currentAccount } = authStore;

  const [ibanModal, setIbanModal] = useState(false);

  return (
    <ErrorBoundary catchErrors='always'>
      <Header
        headerTx='paymentInitiationScreen.title'
        style={HEADER}
        titleStyle={HEADER_TITLE}
        leftIcon={'back'}
        onLeftPress={() => navigation.navigate('bp_home')}
      />
      <Screen backgroundColor={palette.white} style={{ height: '100%', width: '100%' }}>
        <ScrollView style={FORM_FIELD_CONTAINER}>
          <PaymentInitiationForm
            init={paymentInitiationStore.init}
            paymentUrl={paymentUrl}
            loading={loading}
            currentAccount={currentAccount}
            setIbanModal={setIbanModal}
          />
        </ScrollView>
        <IbanModal ibanModal={ibanModal} setIbanModal={setIbanModal} />
      </Screen>
    </ErrorBoundary>
  );
});
