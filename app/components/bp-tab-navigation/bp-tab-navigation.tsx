import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {ImageStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

import { AutoImage } from '../auto-image/auto-image';
import {palette} from "../../theme/palette";

const TAB_VIEW_STYLE: ViewStyle = { backgroundColor: palette.white, height: 100, width: '100%', flexDirection: 'row' };
const WAVE_STYLE: ImageStyle = { width: '100%', height: '95%', position: 'absolute', bottom: 0 };
const NAVIGATION_STYLE: ViewStyle = { width: 45, height: 45, margin: 10, backgroundColor: palette.white};
const ICON_STYLE: ImageStyle = { width: '100%', height: '100%', position: 'absolute', bottom: 0 };

type IconType = {
    id: number ;
    name: string ;
}

const Icon: IconType[] = [
    {
        id: 1,
        name: "wallet",
    },
    {
        id: 2,
        name: "activity",
    },
    {
        id: 3,
        name: "paiment",
    },
    {
        id: 4,
        name: "facturation",
    },
    {
        id: 5,
        name: "service",
    },
];

type IconProps = {
    wallet: string ,
    activity: string ,
    paiment: string ,
    facturation: string ,
    service: string ,
};

export const BpTabNavigation: React.FC<BottomTabBarProps> = props => {
    const IconImage: IconProps = {
        wallet: require('./tab-navigation.png') ,
        activity: require('./wallet.png') ,
        paiment: require('./paiment.png') ,
        facturation: require('./facturation.png') ,
        service: require('./service.png') ,
    };

    const IconRoute: IconProps = {
        wallet: 'home' ,
        activity: 'supportContact' ,
        paiment: 'supportContact' ,
        facturation: 'supportContact' ,
        service: 'supportContact' ,
    };

  return (
    <View style={TAB_VIEW_STYLE} {...props}>
      <AutoImage source={require('./tab-navigation.png')} style={WAVE_STYLE} resizeMethod='resize' />
        {Icon.map((item: IconType) => {
            return (
                <TouchableOpacity key={item.id} onPress={() => props.navigation.navigate(IconRoute[item.name])} style={NAVIGATION_STYLE} >
                    <AutoImage source={IconImage[item.name]} style={ICON_STYLE} resizeMethod='resize' />
                </TouchableOpacity>
            );
        })}
    </View>
  );
};
