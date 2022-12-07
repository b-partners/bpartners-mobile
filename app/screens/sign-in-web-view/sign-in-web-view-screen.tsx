import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { SafeAreaView, View, ViewStyle } from 'react-native';

import { GradientBackground, Loader } from '../../components';
import { NavigatorParamList } from '../../navigators';
import { ErrorBoundary } from '../error/error-boundary';

const FULL: ViewStyle = { flex: 1 };

export const SignInWebViewScreen: FC<DrawerScreenProps<NavigatorParamList, 'welcome'>> = observer(({ route, navigation }) => {
  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='SignInWebViewScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <SafeAreaView />
        <Loader />
      </View>
    </ErrorBoundary>
  );
});
