import { DrawerScreenProps } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import { Header, Screen, Text } from '../../components';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { CompanyScreen } from './screens/company-screen';
import { SubscriptionScreen } from './screens/subscription-screen';
import { profileStyles as styles } from './utils/styles';

const NO_SHADOW: ViewStyle = { elevation: 0, shadowRadius: 0, shadowOpacity: 0, shadowOffset: { width: 0, height: 0 } };
const TAB_BAR_STYLE: ViewStyle = { backgroundColor: palette.white, ...NO_SHADOW };

type TabNameProps = {
  company: string;
  subscription: string;
};

export const ProfileScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function ProfileScreen({ navigation }) {
  const Tab = createMaterialTopTabNavigator();

  const TabName: TabNameProps = {
    company: translate('profileScreen.tabs.company'),
    subscription: translate('profileScreen.tabs.subscription'),
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='profileScreen.title' titleStyle={styles.headerTitle} leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
      <Screen>
        <Tab.Navigator
          initialRouteName='company'
          style={TAB_BAR_STYLE}
          screenOptions={({ route: tabRoute }) => ({
            tabBarIndicatorStyle: { backgroundColor: color.primary },
            tabBarActiveTintColor: color.primary,
            tabBarStyle: { backgroundColor: 'white' },
            tabBarLabel: ({ focused }) => {
              const activeLabelStyle: TextStyle = { width: 150, color: color.primary, fontWeight: '900' };

              let labelStyle: TextStyle = { color: palette.textClassicColor, backgroundColor: 'white' };
              labelStyle = focused ? { ...labelStyle, ...activeLabelStyle } : { ...labelStyle };

              return <Text text={TabName[tabRoute.name]} style={labelStyle} />;
            },
          })}
        >
          <Tab.Screen
            name={'company'}
            component={CompanyScreen}
            navigationKey='company'
            listeners={{
              tabPress: () => {
                // invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={'subscription'}
            component={SubscriptionScreen}
            navigationKey='subscription'
            listeners={{
              tabPress: () => {
                // invoiceStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 30 });
              },
            }}
          />
        </Tab.Navigator>
      </Screen>
    </ErrorBoundary>
  );
});
