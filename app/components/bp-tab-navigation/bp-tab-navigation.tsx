import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { FC, ReactNode, useCallback, useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useStores } from '../../models';
import { palette } from '../../theme/palette';
import { KeyboardLayout } from '../keyboard-layout/KeyboardLayout';
import { BOTTOM_TAB_ROUTES, IconProps, IconRouteProps } from './utils/utils';

const BP_TAB_CONTAINER_STYLE: ViewStyle = {
  width: '98%',
  bottom: '1%',
  overflow: 'visible',
  paddingHorizontal: 20,
  borderRadius: 30,
  position: 'absolute',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: '1%',
  alignItems: 'center',
  backgroundColor: palette.neon_orange,
};

const TabNavigationItem: FC<TouchableOpacityProps & { icon: ReactNode; testID: string }> = ({ onPress, testID, icon }) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} testID={testID}>
        {icon}
      </TouchableOpacity>
    </>
  );
};

const BOTTOM_NAVBAR_ICONS = {
  account: (isSelected: boolean) => <Ionicons name='wallet' size={28} color={isSelected ? palette.peach : palette.cream} />,
  activity: (isSelected: boolean) => <FontAwesome6 name='people-roof' size={28} color={isSelected ? palette.peach : palette.cream} />,
  payment: (isSelected: boolean) => <Ionicons name='logo-euro' size={28} color={isSelected ? palette.peach : palette.cream} />,
  facturation: (isSelected: boolean) => <Ionicons name='receipt' size={28} color={isSelected ? palette.peach : palette.cream} />,
  home: (isSelected: boolean) => (
    <Ionicons
      name='home'
      size={28}
      color={isSelected ? palette.white : palette.neon_orange}
      style={{ backgroundColor: isSelected ? palette.peach : palette.cream, borderRadius: 50, padding: 15, transform: 'translateY(-12%)' }}
    />
  ),
} as const;

export const BpTabNavigation: FC<BottomTabBarProps> = props => {
  const {
    state: { routeNames, index },
    navigation: { navigate },
  } = props;
  const currentTab = routeNames[index];
  const { marketplaceStore } = useStores();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const handleNavigationMarketplace = useCallback((routeName: string) => {
    navigate(routeName);
    const takeMarketplace = async () => {
      await Promise.all([
        marketplaceStore.getMarketplaces({
          page: 1,
          pageSize: 15,
        }),
      ]);
    };
    takeMarketplace().then();
  }, []);

  const handleNavigation = useCallback((routeName: string) => {
    navigate(routeName);
  }, []);

  const NAGIGATION_HANDLER: IconRouteProps = {
    account: () => handleNavigation('bp_home'),
    activity: () => handleNavigationMarketplace('prospect'),
    payment: () => handleNavigation('paymentInitiation'),
    facturation: () => handleNavigation('paymentList'),
    service: () => handleNavigation('supportContact'),
    home: () => handleNavigation('home'),
  };

  const RouteName: IconProps = {
    account: 'bp_home',
    activity: 'prospect',
    payment: 'paymentInitiation',
    facturation: 'paymentList',
    home: 'home',
  };

  return (
    <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
      <View style={[BP_TAB_CONTAINER_STYLE, { height: keyboardOpen ? 0 : 55 }]} {...props} testID='bottom-tab'>
        {BOTTOM_TAB_ROUTES.map((bottomTavNavItem: string, i) => {
          const isSelected = currentTab === RouteName[bottomTavNavItem];
          return (
            <View key={`bottom-navigation-item-${i}-${bottomTavNavItem}`}>
              <TabNavigationItem
                onPress={NAGIGATION_HANDLER[bottomTavNavItem]}
                testID={`${RouteName[bottomTavNavItem]}Tab`}
                icon={BOTTOM_NAVBAR_ICONS[bottomTavNavItem](isSelected)}
              />
            </View>
          );
        })}
      </View>
    </KeyboardLayout>
  );
};
