import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ImageStyle, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { Icon, IconType } from './type';

const TEXT_STYLE: TextStyle = {
  color: palette.white,
  fontSize: 10,
  width: '100%',
  alignSelf: 'center',
  backgroundColor: palette.black,
};

const TAB_VIEW_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  height: 110,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
};

const WAVE_STYLE: ImageStyle = {
  width: '100%',
  height: '95%',
  position: 'absolute',
  bottom: 0,
};

const NAVIGATION_STYLE: ViewStyle = {
  width: '18%',
  height: 50,
  marginHorizontal: '1%',
  flexDirection: 'column',
};

const ICON_STYLE: ImageStyle = {
  width: '100%',
  height: '100%',
};

type IconProps = {
  wallet: string;
  activity: string;
  paiment: string;
  facturation: string;
  service: string;
};

export const BpTabNavigation: React.FC<BottomTabBarProps> = props => {
  const IconImage: IconProps = {
    wallet: require('./wallet.png'),
    activity: require('./activity.png'),
    paiment: require('./paiment.png'),
    facturation: require('./facturation.png'),
    service: require('./service.png'),
  };

  const IconRoute: IconProps = {
    wallet: 'home',
    activity: 'supportContact',
    paiment: 'supportContact',
    facturation: 'supportContact',
    service: 'supportContact',
  };

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
          <TouchableOpacity key={item.id} onPress={() => props.navigation.navigate(IconRoute[item.name])} style={NAVIGATION_STYLE}>
            <AutoImage source={IconImage[item.name]} style={ICON_STYLE} resizeMethod='resize' />
            <Text style={TEXT_STYLE}>{IconTexte[item.name]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
