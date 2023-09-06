import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { ViewStyle } from 'react-native';

import { Header, Screen } from '../../components';
import { TabNavigatorParamList } from '../../navigators';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';
import { TabBar } from './components/tab-bar';
import { ActivityForm } from './screen/activity-form';
import { CompanyInfoForm } from './screen/company-info-form';
import { FeedbackForm } from './screen/feedback-form';
import { GlobalInfoForm } from './screen/global-info-form';
import { RevenueTargetsForm } from './screen/revenue-targets-form';

const NO_SHADOW: ViewStyle = { elevation: 0, shadowRadius: 0, shadowOpacity: 0, shadowOffset: { width: 0, height: 0 } };
const TAB_BAR_STYLE: ViewStyle = { backgroundColor: palette.white, ...NO_SHADOW };

export const ProfileEditionScreen: FC<StackScreenProps<TabNavigatorParamList, 'paymentList'>> = observer(function ProfileEditionScreen({ navigation }) {
  const Tab = createMaterialTopTabNavigator();

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='profileEditionScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
      <Screen>
        <Tab.Navigator
          initialRouteName={'globalInfo'}
          style={TAB_BAR_STYLE}
          tabBar={props => <TabBar {...props} />}
          // @ts-ignore
          tabBarOptions={{
            style: {
              backgroundColor: palette.white,
            },
          }}
        >
          <Tab.Screen
            name={'globalInfo'}
            component={GlobalInfoForm}
            navigationKey='globalInfo'
            listeners={{
              tabPress: () => {
                // invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={'feedback'}
            component={FeedbackForm}
            navigationKey='feedback'
            listeners={{
              tabPress: () => {
                // invoiceStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={'activity'}
            component={ActivityForm}
            navigationKey='activity'
            listeners={{
              tabPress: () => {
                // invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={'companyInfo'}
            component={CompanyInfoForm}
            navigationKey='companyInfo'
            listeners={{
              tabPress: () => {
                // invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={'revenueTargets'}
            component={RevenueTargetsForm}
            navigationKey='revenueTargets'
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
