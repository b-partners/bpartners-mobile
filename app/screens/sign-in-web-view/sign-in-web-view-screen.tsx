import React, { FC } from 'react';
import { SafeAreaView, TextStyle, View, ViewStyle } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import WebView from 'react-native-webview';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header } from '../../components';
import { color, spacing, typography } from '../../theme';
import env from '../../config/env';
import getQueryParams from '../../utils/get-query-params';
import { useStores } from '../../models';

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

export const SignInWebViewScreen: FC<StackScreenProps<NavigatorParamList, 'welcome'>> = observer(({ route, navigation }) => {
  const { url } = route.params;
  const { authStore } = useStores();

  const onNavigationStateChange = async webViewState => {
    const { url: currentUrl } = webViewState;
    if (!currentUrl.includes(env.successUrl)) {
      return;
    }
    const code = getQueryParams(currentUrl)['code'];
    if (!code) {
      return;
    }
    await authStore.getToken(code);
    navigation.navigate('transactionList');
  };

  return (
    <View testID='SignInWebViewScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <SafeAreaView />
      <Header headerTx='signInScreen.title' leftIcon='back' onLeftPress={() => navigation.goBack()} style={HEADER} titleStyle={HEADER_TITLE} />
      <WebView source={{ uri: url }} onNavigationStateChange={onNavigationStateChange} />
    </View>
  );
});
