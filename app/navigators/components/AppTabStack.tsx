import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { BpTabNavigation } from '../../components';
import { translate } from '../../i18n';
import {
  InvoicesScreen,
  MarketPlaceScreen,
  PaymentInitiationScreen,
  PaymentListScreen,
  ProspectConfigurationScreen,
  ProspectScreen,
  TransactionScreen,
} from '../../screens';
import { HomeScreen } from '../../screens/home/home-screen';
import { TabNavigatorParamList } from '../utils';

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

export const AppTabStack = observer(function () {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        tabBarStyle: { backgroundColor: 'white' },
        headerShown: false,
      }}
      initialRouteName={'bp_home'}
      tabBar={props => <BpTabNavigation {...props} />}
    >
      <Tab.Screen name='bp_home' component={TransactionScreen} options={{ title: translate('homeScreen.title') }} />
      <Tab.Screen name='home' component={HomeScreen} options={{ title: translate('homeScreen.title') }} />
      <Tab.Screen name='marketplace' component={MarketPlaceScreen} options={{ title: translate('marketPlaceScreen.title') }} />
      <Tab.Screen name='paymentInitiation' component={PaymentInitiationScreen} options={{ title: translate('paymentInitiationScreen.label') }} />
      <Tab.Screen name='prospect' component={ProspectScreen} options={{ title: translate('homeScreen.title') }} />
      <Tab.Screen name='prospectConfiguration' component={ProspectConfigurationScreen} options={{ title: translate('homeScreen.title') }} />
      <Tab.Screen name='paymentList' component={PaymentListScreen} />
      <Tab.Screen name='invoices' component={InvoicesScreen} />
    </Tab.Navigator>
  );
});
