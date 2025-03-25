import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useCallback, useState } from 'react';
import { View, ViewStyle } from 'react-native';

import { translate } from '../../i18n';
import { useStores } from '../../models';
import { AutoImage } from '../auto-image/auto-image';
import { KeyboardLayout } from '../keyboard-layout/KeyboardLayout';
import { BottomTab } from './components/bottom-tab';
import { tabNavigationStyles as styles } from './utils/styles';
import { BOTTOM_TAB_ROUTES, IconProps, IconRouteProps } from './utils/utils';

export const BpTabNavigation: React.FC<BottomTabBarProps> = props => {
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

  const BOTTOM_NAVBAR_ICONS: IconProps = {
    account: require('./icons/wallet.png'),
    activity: require('./icons/activity.png'),
    payment: require('./icons/paiment.bg.png'),
    facturation: require('./icons/facturation.bg.png'),
    home: require('./icons/home.png'),
  };

  const BOTTOM_NAVBAR_NAVIGATION_HANDLERS: IconRouteProps = {
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

  const ROUTE: IconProps = {
    account: translate('bottomTab.account'),
    activity: translate('prospectScreen.title'),
    payment: translate('bottomTab.payment'),
    facturation: translate('bottomTab.facturation'),
    home: translate('bottomTab.home'),
  };

  const STYLE: Record<keyof IconProps, ViewStyle> = {
    home: {
      opacity: 0.8,
      transform: [{ scale: 0.9 }],
    },
    account: {},
    activity: {},
    facturation: {},
    payment: {},
  };

  return (
    <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
      <View style={{ ...styles.container, backgroundColor: 'rgba(0,0,0,0)', height: keyboardOpen ? 0 : 100 }} {...props} testID='bottom-tab'>
        {!keyboardOpen && <AutoImage source={require('./icons/tab-navigation.png')} style={styles.background} resizeMethod='auto' resizeMode='stretch' />}
        {BOTTOM_TAB_ROUTES.map((bottomTavNavItem: string, i) => {
          const isSelected = currentTab === RouteName[bottomTavNavItem];
          return (
            <View key={`bottom-navigation-item-${i}-${bottomTavNavItem}`} style={styles.tabContainer}>
              <BottomTab
                onPress={BOTTOM_NAVBAR_NAVIGATION_HANDLERS[bottomTavNavItem]}
                testID={`${RouteName[bottomTavNavItem]}Tab`}
                source={BOTTOM_NAVBAR_ICONS[bottomTavNavItem]}
                tabStyle={styles.tab}
                imageStyle={{ width: 55, height: 45, ...STYLE[bottomTavNavItem] }}
                text={ROUTE[bottomTavNavItem]}
                bottomNavItem={bottomTavNavItem}
              />
              {isSelected && <AutoImage source={require('./icons/tab.png')} style={styles.icon} resizeMethod='auto' resizeMode='stretch' />}
            </View>
          );
        })}
      </View>
    </KeyboardLayout>
  );
};
