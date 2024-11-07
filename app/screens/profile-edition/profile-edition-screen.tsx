import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { ViewStyle } from 'react-native';

import { Header } from '../../components';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { TabBar } from './components/tab-bar';
import { ActivityForm } from './screen/activity-form';
import { CompanyInfoForm } from './screen/company-info-form';
import { FeedbackForm } from './screen/feedback-form';
import { GlobalInfoForm } from './screen/global-info-form';
import { RevenueTargetsForm } from './screen/revenue-targets-form';

const NO_SHADOW: ViewStyle = { elevation: 0, shadowRadius: 0, shadowOpacity: 0, shadowOffset: { width: 0, height: 0 } };
const TAB_BAR_STYLE: ViewStyle = { backgroundColor: palette.white, ...NO_SHADOW };

export const ProfileEditionScreen: FC<StackScreenProps<NavigatorParamList, 'profileEdition'>> = observer(function ProfileEditionScreen({ navigation }) {
  const Tab = createMaterialTopTabNavigator();

  return (
    <ErrorBoundary catchErrors='always'>
      <Header
        headerTx='profileEditionScreen.title'
        onLeftPress={() => navigation.navigate('profile')}
        leftIcon='back'
        style={HEADER}
        titleStyle={HEADER_TITLE}
      />
      <Tab.Navigator initialRouteName={'globalInfo'} style={TAB_BAR_STYLE} tabBar={props => <TabBar {...props} />}>
        <Tab.Screen name={'globalInfo'} component={GlobalInfoForm} navigationKey='globalInfo' />
        <Tab.Screen name={'feedback'} component={FeedbackForm} navigationKey='feedback' />
        <Tab.Screen name={'activity'} component={ActivityForm} navigationKey='activity' />
        <Tab.Screen name={'companyInfo'} component={CompanyInfoForm} navigationKey='companyInfo' />
        <Tab.Screen name={'revenueTargets'} component={RevenueTargetsForm} navigationKey='revenueTargets' />
      </Tab.Navigator>
    </ErrorBoundary>
  );
});
