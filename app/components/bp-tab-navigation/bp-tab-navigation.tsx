import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ImageStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Modal,
  BackHandler,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { Icon, IconType, ModalRoute } from './type';
import {color} from "../../theme";

const TEXT_CONTAINER_STYLE: ViewStyle = {
  width: '100%',
  alignItems: 'center',
};

const TEXT_STYLE: TextStyle = {
  color: palette.white,
  fontSize: 10,
};

const TAB_VIEW_STYLE: ViewStyle = {
  position: 'relative',
  backgroundColor: color.transparent,
  height: 110,
  width: '100%',
  flexDirection: 'row',
};

const WAVE_STYLE: ImageStyle = {
  width: '100%',
  height: '95%',
  position: 'absolute',
  bottom: 0,
};

const NAVIGATION_CONTAINER_STYLE: ViewStyle = {
  width: '20%',
  height: '100%',
  position: 'relative',
};

const NAVIGATION_STYLE: ViewStyle = {
  width: '100%',
  height: 50,
  marginTop: 18,
  alignItems: 'center',
};

const ICON_STYLE: ImageStyle = {
  width: 65,
  height: 55,
};

const TAB_STYLE: ImageStyle = {
  marginHorizontal: '1%',
  width: '100%',
  height: 10,
  position: 'absolute',
  bottom: 0,
};

type IconProps = {
  account: string;
  activity: string;
  payment: string;
  facturation: string;
  service: string;
};

type ModalProps = {
  transfer: string;
  card: string;
  help: string;
}

type IconRouteProps = {
  account: () => void;
  activity: () => void;
  payment: () => void;
  facturation: () => void;
  service: () => void;
};

const modalHeight = Dimensions.get('window').height - 130;

export const BpTabNavigation: React.FC<BottomTabBarProps> = props => {
  const route = useRoute();
  const [activeRouteName, setActiveRouteName] = useState(route.name);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigation = useCallback((routeName: string) => {
    props.navigation.navigate(routeName);
    setActiveRouteName(routeName);
  }, []);

  const openModal = useCallback((routeName: string) => {
    setModalVisible(true)
    setActiveRouteName(routeName);
  }, []);

  const IconImage: IconProps = {
    account: require('./wallet.png'),
    activity: require('./activity.png'),
    payment: require('./paiment.png'),
    facturation: require('./facturation.png'),
    service: require('./service.png'),
  };

  const ModalImage: ModalProps = {
    transfer: require('./transfer.png'),
    card: require('./card.png'),
    help: require('./help.png'),
  }

  const IconRoute: IconRouteProps = {
    account: () => handleNavigation('home'),
    activity: () => handleNavigation('marketplace'),
    payment: () => handleNavigation('paymentInitiation'),
    facturation: () => handleNavigation('paymentList'),
    service: () => openModal('supportContact'),
  };

  const RouteName: IconProps = {
    account: 'home',
    activity: 'marketplace',
    payment: 'paymentInitiation',
    facturation: 'paymentList',
    service: 'supportContact',
  };

  const IconText: IconProps = {
    account: 'Comptes',
    activity: 'Activité',
    payment: 'Collecter un paiement',
    facturation: 'Facturation',
    service: 'Autres services',
  };

  const ModalText: ModalProps = {
    transfer: 'Virement',
    card: 'Cartes',
    help: 'Aide',
  }

  useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          setActiveRouteName('home');
          return false;
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [])
  );

  return (
    <View style={TAB_VIEW_STYLE} {...props}>
      <AutoImage source={require('./tab-navigation.png')} style={WAVE_STYLE} resizeMethod='resize' />
      {Icon.map((item: IconType) => {
        return (
          <View key={item.id} style={NAVIGATION_CONTAINER_STYLE}>
            <TouchableOpacity onPress={IconRoute[item.name]} style={NAVIGATION_STYLE}>
              <AutoImage source={IconImage[item.name]} style={ICON_STYLE} resizeMethod='auto' resizeMode='stretch' />
              <View style={TEXT_CONTAINER_STYLE}>
                <Text style={TEXT_STYLE}>{IconText[item.name]}</Text>
              </View>
            </TouchableOpacity>
            {activeRouteName === RouteName[item.name] && <AutoImage source={require('./tab.png')} style={TAB_STYLE} resizeMethod='auto' resizeMode='stretch' />}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}>
              <TouchableWithoutFeedback onPress={ () => setModalVisible(false) }>
                <View style={ { width: "100%", height: modalHeight } }>
                  <View style={{ width: '18%', height: 200, backgroundColor: palette.purple, position: 'absolute', bottom: 10, right: 5, borderRadius: 50, justifyContent: 'space-around'  }}>

                    {ModalRoute.map((item: IconType) => {
                      return (
                          <View key={item.id} style={ {width: '100%', height: '30%', flexDirection: 'column', alignItems: 'center' } } >
                            <AutoImage source={ModalImage[item.name]} style={{width: 40, height: 40, borderRadius: 50 }} resizeMethod='auto' resizeMode='stretch' />
                            <TouchableOpacity style={{ width: '100%', height: 50, }}>
                              <View style={{ width: '100%', alignItems: 'center',}}>
                                <Text style={{ color: palette.white, fontSize: 10,}}>{ModalText[item.name]}</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                      );
                    })}

                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>


          </View>
        );
      })}
    </View>
  );
};
