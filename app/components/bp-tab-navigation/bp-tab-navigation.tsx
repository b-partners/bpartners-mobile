import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, {useCallback, useState} from 'react';
import { ImageStyle, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { Icon, IconType } from './type';
import {useRoute} from "@react-navigation/native";

const TEXT_CONTAINER_STYLE: ViewStyle = {
  width: '100%',
  alignItems: 'center',
}
const TEXT_STYLE: TextStyle = {
  color: palette.white,
  fontSize: 10,
};

const TAB_VIEW_STYLE: ViewStyle = {
  position: 'relative',
  backgroundColor: palette.white,
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
}

const NAVIGATION_STYLE: ViewStyle = {
  width: '100%',
  height: 50,
  marginTop: 20,
};

const ICON_STYLE: ImageStyle = {
  width: '100%',
  height: '100%',
};

const TAB_STYLE: ImageStyle = {
  marginHorizontal: '1%',
  width: '100%',
  height: 10,
  position: 'absolute',
  bottom: 0,
}

type IconProps = {
  wallet: string;
  activity: string;
  paiment: string;
  facturation: string;
  service: string;
};

type IconRouteProps = {
  wallet: () => void;
  activity: () => void;
  paiment: () => void;
  facturation: () => void;
  service: () => void;
};

export const BpTabNavigation: React.FC<BottomTabBarProps> = props => {
  const route = useRoute();
  const [activeRouteName, setActiveRouteName] = useState(route.name);

  const handleNavigation = useCallback((routeName: string) => {
    props.navigation.navigate(routeName);
    setActiveRouteName(routeName);
  }, []);

  const IconImage: IconProps = {
    wallet: require('./wallet.png'),
    activity: require('./activity.png'),
    paiment: require('./paiment.png'),
    facturation: require('./facturation.png'),
    service: require('./service.png'),
  };

  const IconRoute: IconRouteProps = {
    wallet: () => handleNavigation('home'),
    activity: () => handleNavigation('marketplace'),
    paiment: () => handleNavigation('paymentInitiation'),
    facturation: () => handleNavigation('paymentList'),
    service: () => handleNavigation('supportContact'),
  };

  const RouteName: IconProps = {
    wallet: 'home',
    activity: 'marketplace',
    paiment: 'paymentInitiation',
    facturation: 'paymentList',
    service: 'supportContact',
  }

  const IconTexte: IconProps = {
    wallet: 'Comptes',
    activity: 'Activité',
    paiment: 'Collecter un paiement',
    facturation: 'Facturation',
    service: 'Autres services',
  };

  return (
    <View style={TAB_VIEW_STYLE} {...props}>
      <AutoImage source={require('./tab-navigation.png')} style={WAVE_STYLE} resizeMethod='resize' />
      {Icon.map((item: IconType) => {
        return (
            <View key={item.id} style={NAVIGATION_CONTAINER_STYLE}>
              <TouchableOpacity onPress={IconRoute[item.name]} style={NAVIGATION_STYLE}>
                <AutoImage source={IconImage[item.name]} style={ICON_STYLE} resizeMethod='resize' />
                <View style={TEXT_CONTAINER_STYLE}>
                  <Text style={TEXT_STYLE}>{IconTexte[item.name]}</Text>
                </View>
              </TouchableOpacity>
              {activeRouteName === RouteName[item.name] && <AutoImage source={require('./tab.png')} style={TAB_STYLE} resizeMethod='resize' />}
            </View>
        );
      })}
    </View>
  );
};
