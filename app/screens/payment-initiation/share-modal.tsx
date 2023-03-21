import React from 'react';
import { Clipboard, Linking, Modal, View } from 'react-native';
import RNAntDesign from 'react-native-vector-icons/AntDesign';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import RNFontAwesome from 'react-native-vector-icons/FontAwesome';
import CopyContentIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Button, Text } from '../../components';
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
          position: 'relative',
        }}
      >
        <View style={{ backgroundColor: palette.white, height: '35.5%', width: '100%', position: 'absolute', bottom: 0 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 25,
              position: 'relative',
              height: 30,
            }}
          >
            <Text
              tx='paymentInitiationScreen.share'
              style={{
                color: 'black',
                fontSize: 18,
                marginLeft: 10,
                position: 'absolute',
                left: 10,
              }}
            />
            <Button
              onPress={() => {
                setShareModal(false);
              }}
              style={{
                backgroundColor: palette.white,
                position: 'absolute',
                right: 26,
              }}
              textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
            >
              <CloseIcon name='close' size={25} color={palette.black} />
            </Button>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 25,
              paddingBottom: 32,
              borderColor: palette.greyDarker,
              borderBottomWidth: 1,
            }}
          >
            <Text
              text={paymentUrl}
              style={{
                color: 'black',
                fontSize: 12,
                width: '75%',
                paddingLeft: 20,
              }}
            />
            <Button
              onPress={() => {
                copyToClipboard(paymentUrl);
              }}
              style={{
                flexDirection: 'column',
                backgroundColor: palette.white,
                height: 50,
                width: '25%',
                borderRadius: 25,
              }}
              textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
            >
              <CopyContentIcon name='content-copy' size={25} color={palette.black} />
              <Text text={'Copier'} style={{ color: 'black' }} />
            </Button>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 1, justifyContent: 'space-around' }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Button
                testID='submit'
                tx='paymentInitiationScreen.fields.submit'
                onPress={() => {
                  Linking.openURL(`sms:?body=${paymentUrl}`);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: palette.white,
                  height: 100,
                  width: '28%',
                }}
                textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
              >
                <RNFontAwesome name='whatsapp' size={33} color={palette.green} />
                <Text
                  tx='paymentInitiationScreen.whatsapp'
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    color: palette.black,
                    fontFamily: 'Geometria',
                    fontSize: 12,
                  }}
                />
              </Button>
            </View>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Button
                testID='submit'
                tx='paymentInitiationScreen.fields.submit'
                onPress={() => {
                  Linking.openURL(`whatsapp://send?text=${paymentUrl}`);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: palette.white,
                  height: 100,
                  width: '28%',
                }}
                textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
              >
                <RNAntDesign name='message1' size={33} color={palette.oceanBoatBlue} />
                <Text
                  tx='paymentInitiationScreen.sms'
                  style={{
                    marginTop: 10,
                    color: palette.black,
                    fontFamily: 'Geometria',
                    fontSize: 12,
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
