import { DrawerScreenProps } from '@react-navigation/drawer';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { Linking, SafeAreaView, TextStyle, View, ViewStyle } from 'react-native';

import { Button, GradientBackground, Screen, Text } from '../../components';
import env from '../../config/env';
import { NavigatorParamList } from '../../navigators';
import { color, spacing, typography } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';

const FULL: ViewStyle = { flex: 1 };
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[2],
};
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
};
const BOLD: TextStyle = { fontWeight: 'bold' };
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: 'center',
};
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: 'center',
};
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: 'italic',
};
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.deepPurple,
  flex: 1,
  marginHorizontal: spacing[2],
};
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
};
const FOOTER: ViewStyle = { backgroundColor: '#20162D' };
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  flexDirection: 'row',
  justifyContent: 'space-between',
};

WebBrowser.maybeCompleteAuthSession();

export const WelcomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({ navigation }) => {
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: env.clientId,
      clientSecret: env.clientSecret,
      redirectUri: env.successUrl,
    },
    {
      authorizationEndpoint: env.authorizationEndpoint,
      tokenEndpoint: env.tokenEndpoint,
    }
  );

  const signIn = async () => {
    try {
      await promptAsync();
    } catch (e) {
      __DEV__ && console.tron.log(e);
      throw new Error(e);
    }
  };

  useEffect(() => {
    console.tron.log({ request });
  }, [request]);

  useEffect(() => {
    __DEV__ && console.tron.log({ result });
    if (!result || !(result as any).url) {
      return;
    }
    Linking.openURL((result as any).url).then(() => {});
  }, [result]);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='WelcomeScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen style={CONTAINER} preset='scroll' backgroundColor={color.transparent}>
          <Text style={TITLE_WRAPPER}>
            <Text style={TITLE} text='Your new app, ' />
            <Text style={ALMOST} text='BPartners' />
            <Text style={TITLE} text='!' />
          </Text>
          <Text style={TITLE} preset='header' tx='welcomeScreen.readyForLaunch' />
        </Screen>
        <SafeAreaView style={[FOOTER, FOOTER_CONTENT]}>
          <Button testID='sign-in-button' style={CONTINUE} textStyle={CONTINUE_TEXT} tx='welcomeScreen.login' onPress={signIn} disabled={!request} />
        </SafeAreaView>
      </View>
    </ErrorBoundary>
  );
});
