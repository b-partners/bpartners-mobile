import React from 'react';
import { Clipboard, Linking, Modal, View } from 'react-native';
import RNAntDesign from 'react-native-vector-icons/AntDesign';
import RNFontAwesome from 'react-native-vector-icons/FontAwesome';
import CopyContentIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Button, Header, Text } from '../../components';
import { palette } from '../../theme/palette';

type ShareModalProps = {
  paymentUrl: string;
  shareModal: boolean;
  setShareModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ShareModal: React.FC<ShareModalProps> = props => {
  const { paymentUrl, shareModal, setShareModal } = props;

  const closeShareModal = () => {
    setShareModal(false);
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  return (
    <Modal animationType='slide' transparent={true} visible={shareModal} onRequestClose={closeShareModal}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(16,16,19,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ backgroundColor: palette.white, height: '50%', width: '90%', borderRadius: 20 }}>
          <View>
            <Header rightIcon='cross' onRightPress={closeShareModal} style={{ borderTopLeftRadius: 50 }} headerTx='paymentInitiationScreen.share' />
          </View>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Button
                testID='submit'
                tx='paymentInitiationScreen.fields.submit'
                onPress={() => {
                  Linking.openURL(`whatsapp://send?text=${paymentUrl}`);
                }}
                style={{
                  flexDirection: 'row',
                  backgroundColor: palette.white,
                  borderWidth: 2,
                  borderColor: palette.green,
                  height: 50,
                  width: '50%',
                  borderRadius: 25,
                }}
                textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
              >
                <RNFontAwesome name='whatsapp' size={30} color={palette.green} />
                <Text
                  tx='paymentInitiationScreen.whatsapp'
                  style={{
                    marginLeft: 10,
                    color: palette.green,
                    fontFamily: 'Geometria',
                    fontSize: 20,
                  }}
                />
              </Button>
            </View>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Button
                onPress={() => {
                  copyToClipboard(paymentUrl);
                }}
                style={{
                  flexDirection: 'row',
                  backgroundColor: palette.white,
                  borderColor: palette.oceanBoatBlue,
                  height: 50,
                  width: '50%',
                  borderRadius: 25,
                }}
                textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
              >
                <CopyContentIcon name='content-copy' size={30} color={palette.oceanBoatBlue} />
              </Button>
            </View>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Button
                testID='submit'
                tx='paymentInitiationScreen.fields.submit'
                onPress={() => {
                  Linking.openURL(`sms:?body=${paymentUrl}`);
                }}
                style={{
                  flexDirection: 'row',
                  backgroundColor: palette.white,
                  borderWidth: 2,
                  borderColor: palette.lightYellow,
                  height: 50,
                  width: '50%',
                  borderRadius: 25,
                }}
                textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
              >
                <RNAntDesign name='message1' size={30} color={palette.lightYellow} />
                <Text
                  tx='paymentInitiationScreen.sms'
                  style={{
                    marginLeft: 10,
                    color: palette.yellow,
                    fontFamily: 'Geometria',
                    fontSize: 20,
                  }}
                />
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
