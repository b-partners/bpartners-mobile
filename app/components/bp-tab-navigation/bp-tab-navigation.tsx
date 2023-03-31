import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useCallback } from 'react';
import { ImageStyle, View, ViewStyle } from 'react-native';

import { translate } from '../../i18n';
import { useStores } from '../../models';
import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { BottomTab } from './bottom-tab';
import { BOTTOM_TAB_ROUTES } from './constants';

const TAB_VIEW_STYLE: ViewStyle = {
  position: 'relative',
  height: 110,
  width: '100%',
  flexDirection: 'row',
  backgroundColor: palette.white,
};

const WAVE_STYLE: ImageStyle = {
  width: '100%',
  height: '95%',
  position: 'absolute',
  bottom: 0,
};

const NAVIGATION_CONTAINER_STYLE: ViewStyle = {
  zIndex: 10000000,
  width: '20%',
  height: '100%',
  position: 'relative',
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

type IconRouteProps = {
  account: () => void;
  activity: () => void;
  payment: () => void;
  facturation: () => void;
  service: () => void;
};

export const BpTabNavigation: React.FC<BottomTabBarProps> = props => {
  const {
    state: { routeNames, index },
    navigation: { navigate },
  } = props;
  const currentTab = routeNames[index];
  const { marketplaceStore } = useStores();

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
    payment: require('./icons/paiment.png'),
    facturation: require('./icons/facturation.png'),
    service: require('./icons/help-free-bg.png'),
  };

  const BOTTOM_NAVBAR_NAVIGATION_HANDLERS: IconRouteProps = {
    account: () => handleNavigation('home'),
    activity: () => handleNavigationMarketplace('marketplace'),
    payment: () => handleNavigation('paymentInitiation'),
    facturation: () => handleNavigation('paymentList'),
    service: () => {
      null;
    },
  };

  const RouteName: IconProps = {
    account: 'home',
    activity: 'marketplace',
    payment: 'paymentInitiation',
    facturation: 'paymentList',
    service: 'supportContact',
  };

  const ROUTE: IconProps = {
    account: translate('bottomTab.account'),
    activity: translate('bottomTab.activity'),
    payment: translate('bottomTab.payment'),
    facturation: translate('bottomTab.facturation'),
    service: translate('bottomTab.service'),
  };

  return (
    <>
      <View style={TAB_VIEW_STYLE} {...props} testID='bottom-tab'>
        <AutoImage source={require('./icons/tab-navigation.png')} style={WAVE_STYLE} resizeMethod='auto' resizeMode='stretch' />
        {BOTTOM_TAB_ROUTES.map((bottomTavNavItem: string, i) => {
          return (
            <View key={`bottom-navigation-item-${i}`} style={NAVIGATION_CONTAINER_STYLE}>
              <BottomTab
                onPress={BOTTOM_NAVBAR_NAVIGATION_HANDLERS[bottomTavNavItem]}
                testID={`${RouteName[bottomTavNavItem]}Tab`}
                source={BOTTOM_NAVBAR_ICONS[bottomTavNavItem]}
                tabStyle={{ width: '100%', height: 50, marginTop: 18, alignItems: 'center' }}
                imageStyle={{ width: 65, height: 55 }}
                text={ROUTE[bottomTavNavItem]}
                bottomNavItem={bottomTavNavItem}
              />
              {currentTab === RouteName[bottomTavNavItem] && (
                <AutoImage source={require('./icons/tab.png')} style={TAB_STYLE} resizeMethod='auto' resizeMode='stretch' />
              )}
            </View>
          );
        })}
      </View>
    </>
  );
};
