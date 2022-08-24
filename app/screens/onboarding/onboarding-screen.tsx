import React, { FC } from 'react';
import { SafeAreaView, View, ViewStyle } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import { NavigatorParamList } from '../../navigators';
import WebView from 'react-native-webview';

const FULL: ViewStyle = { flex: 1 };

export const OnboardingScreen: FC<StackScreenProps<NavigatorParamList, 'welcome'>> = observer(() => {
  return (
    <View testID='TransactionListScreen' style={FULL}>
      <SafeAreaView />
      <WebView source={{ uri: 'https://www.google.com' }} />
    </View>
  );
});
