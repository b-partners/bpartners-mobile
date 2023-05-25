import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { Modal } from 'react-native-paper';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Button, Header, Screen, Text } from '../../components';
import { translate } from '../../i18n';
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
  const { paymentInitiationStore, authStore } = useStores();
  const { paymentUrl, initiatingPayment: loading, checkInit } = paymentInitiationStore;
  const { currentAccount } = authStore;

  const [ibanModal, setIbanModal] = useState(false);

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
            <PaymentInitiationForm
              init={paymentInitiationStore.init}
              paymentUrl={paymentUrl}
              loading={loading}
              check={checkInit}
              currentAccount={currentAccount}
              setIbanModal={setIbanModal}
            />
          </ScrollView>
          <Modal
            visible={ibanModal}
            onDismiss={() => setIbanModal(false)}
            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}
          >
            <View style={{ width: '90%', backgroundColor: 'white', paddingBottom: 30, marginHorizontal: '5%', borderRadius: 20 }}>
              <View
                style={{
                  width: '100%',
                  height: 60,
                  backgroundColor: palette.pastelRed,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <Button
                  onPress={() => {
                    setIbanModal(false);
                  }}
                  style={{
                    backgroundColor: palette.white,
                    position: 'absolute',
                    right: 10,
                  }}
                  textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                >
                  <CloseIcon name='close' size={25} color={palette.black} />
                </Button>
              </View>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: spacing[5],
                  flexDirection: 'row',
                }}
              >
                <View style={{ width: '15%', justifyContent: 'center', alignContent: 'center' }}>
                  <MaterialIcon name='error' size={50} color={palette.pastelRed} />
                </View>
                <View style={{ width: '85%' }}>
                  <Text style={{ alignSelf: 'center', color: palette.pastelRed }}>{translate('errors.paymentInitiation')}</Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 60,
                  marginTop: spacing[1],
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginVertical: spacing[2],
                  paddingLeft: 30,
                }}
              >
                <Text style={{ color: 'black' }}>{translate('errors.paymentInitM1')}</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 60,
                  marginTop: spacing[1],
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: spacing[2],
                }}
              >
                <Text style={{ alignSelf: 'center', color: 'black' }}>{translate('errors.paymentInitM2')}</Text>
                <Text style={{ alignSelf: 'center', color: 'black' }}>{translate('errors.phoneNumber')}</Text>
              </View>
            </View>
          </Modal>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
