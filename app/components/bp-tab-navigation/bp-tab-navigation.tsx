import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import { translate } from '../../i18n';
import { useStores } from '../../models';
import { AutoImage } from '../auto-image/auto-image';
import { KeyboardLayout } from '../keyboard-layout/KeyboardLayout';
import { BottomTab } from './components/bottom-tab';
import { tabNavigationStyles as styles } from './utils/styles';
import { BOTTOM_TAB_ROUTES, IconProps, IconRouteProps, hasBusinessActivities, hasCarreleur } from './utils/utils';

export const BpTabNavigation: React.FC<BottomTabBarProps> = props => {
  const {
    state: { routeNames, index },
    navigation: { navigate },
  } = props;
  const currentTab = routeNames[index];
  const { marketplaceStore, currentAccountHolder } = useStores();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const shouldShowProspects = hasBusinessActivities(currentAccountHolder) && hasCarreleur(currentAccountHolder.businessActivities);

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
    activity: () => handleNavigationMarketplace(shouldShowProspects ? 'prospect' : 'marketplace'),
    payment: () => handleNavigation('paymentInitiation'),
    facturation: () => handleNavigation('paymentList'),
    service: () => handleNavigation('supportContact'),
  };

  const RouteName: IconProps = {
    account: 'home',
    activity: shouldShowProspects ? 'prospect' : 'marketplace',
    payment: 'paymentInitiation',
    facturation: 'paymentList',
    service: 'supportContact',
  };

  const ROUTE: IconProps = {
    account: translate('bottomTab.account'),
    activity: shouldShowProspects ? translate('prospectScreen.title') : translate('bottomTab.activity'),
    payment: translate('bottomTab.payment'),
    facturation: translate('bottomTab.facturation'),
    service: translate('bottomTab.service'),
  };

  return (
    <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
      <View style={{ ...styles.container, height: keyboardOpen ? 0 : 110 }} {...props} testID='bottom-tab'>
        <AutoImage source={require('./icons/tab-navigation.png')} style={styles.background} resizeMethod='auto' resizeMode='stretch' />
        {BOTTOM_TAB_ROUTES.map((bottomTavNavItem: string, i) => {
          return (
            <View key={`bottom-navigation-item-${i}`} style={styles.tabContainer}>
              <BottomTab
                onPress={BOTTOM_NAVBAR_NAVIGATION_HANDLERS[bottomTavNavItem]}
                testID={`${RouteName[bottomTavNavItem]}Tab`}
                source={BOTTOM_NAVBAR_ICONS[bottomTavNavItem]}
                tabStyle={styles.tab}
                imageStyle={{ width: 65, height: 55 }}
                text={ROUTE[bottomTavNavItem]}
                bottomNavItem={bottomTavNavItem}
              />
              {currentTab === RouteName[bottomTavNavItem] && (
                <AutoImage source={require('./icons/tab.png')} style={styles.icon} resizeMethod='auto' resizeMode='stretch' />
              )}
            </View>
          );
        })}
      </View>
    </KeyboardLayout>
  );
};
