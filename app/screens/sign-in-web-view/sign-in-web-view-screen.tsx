import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { SafeAreaView, TextStyle, View, ViewStyle } from 'react-native';
import WebView from 'react-native-webview';

import { GradientBackground, Header } from '../../components';
import env from '../../config/env';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing, typography } from '../../theme';
import getQueryParams from '../../utils/get-query-params';
import { save } from '../../utils/storage';
import { ErrorBoundary } from '../error/error-boundary';

const FULL: ViewStyle = { flex: 1 };

const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
};

const BOLD: TextStyle = { fontWeight: 'bold' };

const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: spacing[4],
};

const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: 'center',
  letterSpacing: 1.5,
};

export const SignInWebViewScreen: FC<DrawerScreenProps<NavigatorParamList, 'welcome'>> = observer(({ route, navigation }) => {
  const { url } = route.params;
  const { authStore } = useStores();
  let webview: WebView;

  const onNavigationStateChange = async webViewState => {
    const { url: currentUrl } = webViewState;
    console.tron.log(`Navigating to ${currentUrl}`);
    if (!currentUrl.includes(env.successUrl)) {
      return;
    }
    const { code } = getQueryParams(currentUrl);
    const cachedCode = await AsyncStorage.getItem('code');
    if (!code || cachedCode === code) {
      return;
    }
    await webview.stopLoading();
    try {
      await save('code', code);
      await authStore.getToken(code);
      await authStore.whoami();
    } catch (e) {
      navigation.navigate('signIn');
      console.tron.log(`Sign in error`);
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='SignInWebViewScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <SafeAreaView />
        <Header headerTx='signInScreen.title' leftIcon='back' onLeftPress={() => navigation.navigate('signIn')} style={HEADER} titleStyle={HEADER_TITLE} />
        <WebView
          source={{ uri: url }}
          onNavigationStateChange={onNavigationStateChange}
          ref={ref => {
            webview = ref;
          }}
        />
      </View>
    </ErrorBoundary>
  );
});
