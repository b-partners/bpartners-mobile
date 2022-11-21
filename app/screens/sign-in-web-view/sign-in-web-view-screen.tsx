import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, TextStyle, View, ViewStyle } from 'react-native';
import WebView from 'react-native-webview';

import { GradientBackground, Header } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing, typography } from '../../theme';
import getQueryParams from '../../utils/get-query-params';
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
  const [code, setCode] = useState<string>();

  useEffect(() => {
    async function resumeAuth() {
      try {
        await authStore.getToken(code);
        await authStore.whoami();
      } catch (e) {
        navigation.navigate('signIn');
      }
    }

    resumeAuth();
  }, [code]);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='SignInWebViewScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <SafeAreaView />
        <Header headerTx='signInScreen.title' leftIcon='back' onLeftPress={() => navigation.navigate('signIn')} style={HEADER} titleStyle={HEADER_TITLE} />
        <WebView
          source={{ uri: url }}
          onNavigationStateChange={async event => {
            const { url: webViewCurrentUrl } = event;
            const { code: value } = getQueryParams(webViewCurrentUrl);
            if (value) {
              await webview.stopLoading();
              setCode(value);
            }
          }}
          ref={ref => {
            webview = ref;
          }}
        />
      </View>
    </ErrorBoundary>
  );
});
