import React from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { translate } from '../../i18n';
import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { MODAL_SERVICES_ROUTES } from './constants';
import Snackbar from 'react-native-snackbar';

interface NavigationModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

type ModalProps = {
  transfer: string;
  card: string;
  help: string;
};

type ModalRouteProps = {
  transfer: () => void | null | string;
  card: () => void | null | string;
  help: () => void | null | string;
};

const modalHeight = Dimensions.get('window').height - 130;

export const NavigationModal: React.FC<NavigationModalProps> = props => {
  const { modalVisible, setModalVisible } = props;

    const handleSnackbar = () => {
        Snackbar.show({
            text: "Cette fonctionnalité n'a pas encore été implementé !",
            backgroundColor: 'white',
            textColor: 'red',
            duration: Snackbar.LENGTH_LONG,
            action: {
                text: 'X',
                textColor: 'red',
                onPress: () => {
                    Snackbar.dismiss();
                }
            },
        });
    };

  const MODAL_NAVIGATION_HANDLERS: ModalRouteProps = {
    transfer: () => handleSnackbar(),
    card: () => handleSnackbar(),
    help: () => handleSnackbar(),
  };

  const SERVICES_MODAL_ICONS: ModalProps = {
    transfer: require('./icons/transfer.png'),
    card: require('./icons/card.png'),
    help: require('./icons/help.png'),
  };

  const ModalText: ModalProps = {
    transfer: translate('bottomTab.transfer'),
    card: translate('bottomTab.card'),
    help: translate('bottomTab.help'),
  };

  return (
      <View>
    <Modal
      animationType='fade'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
        <View style={{ width: '100%', height: modalHeight, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <View
            style={{
              width: '18%',
              height: 200,
              backgroundColor: palette.purple,
              position: 'absolute',
              bottom: 10,
              right: 5,
              borderRadius: 50,
              justifyContent: 'space-around',
            }}
          >
            {MODAL_SERVICES_ROUTES.map((serviceModalRoute: string, j) => {
              return (
                <TouchableOpacity
                  key={`modal-service-route-${j}`}
                  style={{
                    width: '100%',
                    height: '30%',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  onPress={MODAL_NAVIGATION_HANDLERS[serviceModalRoute]}
                >
                  <AutoImage
                    source={SERVICES_MODAL_ICONS[serviceModalRoute]}
                    style={{ width: 40, height: 40, borderRadius: 50 }}
                    resizeMethod='auto'
                    resizeMode='stretch'
                  />
                  <View style={{ width: '100%', height: 50 }}>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                      <Text
                        style={{
                          color: palette.white,
                          fontSize: 10,
                        }}
                      >
                        {ModalText[serviceModalRoute]}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
    </Modal>
      </View>
  );
};
