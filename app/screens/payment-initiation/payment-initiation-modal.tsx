import React, { useState } from 'react';
import { Linking, Modal, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNEntypo from 'react-native-vector-icons/Entypo';

import { Button, Header, Text } from '../../components';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { printCurrency } from '../../utils/money';
import { ShareModal } from './share-modal';

type PaymentModalProps = {
  paymentUrl: string;
  amount: number;
  label: string;
  reference: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PaymentModal: React.FC<PaymentModalProps> = props => {
  const { paymentUrl, amount, label, reference, showModal, setShowModal } = props;
  const [shareModal, setShareModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Modal testID='payment-url-modal' animationType='slide' transparent={true} visible={showModal} onRequestClose={closeModal}>
      <View style={{ flex: 1, backgroundColor: 'rgba(16,16,19,0.9)' }} />
      <View
        style={{
          display: 'flex',
          backgroundColor: color.palette.white,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          width: '100%',
          height: '100%',
        }}
        testID='payment-url-modal-container'
      >
        <View testID='payment-url-modal-title-container'>
          <Header rightIcon='cross' onRightPress={closeModal} style={{ borderTopLeftRadius: 50 }} headerTx='paymentInitiationScreen.fields.paymentUrl' />
        </View>
        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: spacing[6],
            marginTop: spacing[6],
            marginHorizontal: spacing[2],
            borderRadius: 20,
            shadowColor: palette.black,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
          }}
          testID='payment-url-modal-content'
        >
          {paymentUrl ? (
            <>
              <TouchableOpacity
                onPress={async () => {
                  const supported = await Linking.canOpenURL(paymentUrl);
                  if (!supported) {
                    return;
                  }
                  await Linking.openURL(paymentUrl);
                }}
              >
                <View style={{ height: 20, alignItems: 'center' }}>
                  <Text
                    text={`label:  ${label}`}
                    style={{
                      height: '100%',
                      color: color.palette.textClassicColor,
                      fontFamily: 'Geometria',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      marginBottom: spacing[4],
                    }}
                    testID='payment-url'
                  />
                </View>
                <View style={{ height: 20, alignItems: 'center' }}>
                  <Text
                    text={`reference:  ${reference}`}
                    style={{
                      height: '100%',
                      color: color.palette.textClassicColor,
                      fontFamily: 'Geometria',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      marginBottom: spacing[4],
                    }}
                    testID='payment-url'
                  />
                </View>
                <View style={{ height: 70, alignItems: 'center', marginBottom: 10, width: '100%' }}>
                  <Text
                    text={printCurrency(amount)}
                    style={{
                      width: '100%',
                      height: '100%',
                      fontSize: 45,
                      color: color.palette.textClassicColor,
                      fontFamily: 'Geometria',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                    }}
                    testID='payment-amount'
                  />
                </View>
              </TouchableOpacity>
              <QRCode value={paymentUrl} size={250} />
              <Text
                tx={'paymentInitiationScreen.instruction'}
                style={{
                  height: '15%',
                  color: color.palette.textClassicColor,
                  fontFamily: 'Geometria',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 20,
                }}
                testID='payment-url'
              />
              <View style={{ marginTop: spacing[4], width: '100%', alignItems: 'center' }}>
                <Button
                  testID='submit'
                  tx='paymentInitiationScreen.fields.submit'
                  onPress={() => {
                    setShareModal(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: palette.white,
                    borderWidth: 2,
                    borderColor: palette.lighterGrey,
                    height: 50,
                    width: '50%',
                    borderRadius: 25,
                  }}
                  textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                >
                  <RNEntypo name='share' size={25} color={palette.black} />
                  <Text tx='paymentInitiationScreen.share' style={{ marginLeft: 10, color: 'black', fontFamily: 'Geometria', fontSize: 20 }} />
                </Button>
              </View>
              <ShareModal paymentUrl={paymentUrl} shareModal={shareModal} setShareModal={setShareModal} />
            </>
          ) : (
            <Text tx='errors.somethingWentWrong' />
          )}
        </View>
      </View>
    </Modal>
  );
};
