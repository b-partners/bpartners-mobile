import { DrawerScreenProps } from '@react-navigation/drawer';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

import { AutoImage, Button, Icon, Screen, Text } from '../../components';
import env from '../../config/env';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';

WebBrowser.maybeCompleteAuthSession();

export const WelcomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({ navigation }) => {
  if (env.isCi) {
    navigation.navigate('oauth');
    return null;
  }

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      usePKCE: false,
      clientId: env.clientId,
      clientSecret: env.clientSecret,
      redirectUri: env.successUrl,
      scopes: ['openid', 'offline', 'idverified'],
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
      <Screen backgroundColor='#fff'>
        <AutoImage
          source={require('./welcome.background.png')}
          resizeMode='stretch'
          resizeMethod='auto'
          style={{ position: 'absolute', height: '100%', width: '100%' }}
        />
        <View style={{ paddingHorizontal: spacing[8], height: '100%' }}>
          <AutoImage source={require('./welcome.logo.png')} resizeMode='contain' resizeMethod='auto' style={{ width: '100%', marginTop: spacing[8] }} />
          <Button
            onPress={signIn}
            style={{
              borderRadius: 50,
              paddingVertical: spacing[3],
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'row',
              marginTop: spacing[8] + spacing[8] + spacing[0],
            }}
          >
            <Text
              tx='welcomeScreen.login'
              style={{
                color: color.palette.secondaryColor,
                fontFamily: 'Geometria-Bold',
                marginRight: spacing[2],
              }}
            />
            <Icon icon='user' />
          </Button>
          <View
            style={{
              marginTop: spacing[8] + spacing[3],
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
            }}
          >
            <Text tx='welcomeScreen.noAccount' style={{ fontFamily: 'Geometria', marginRight: spacing[2] }} />
            <TouchableOpacity>
              <Text tx='welcomeScreen.itsThisWay' style={{ fontFamily: 'Geometria-Bold', textDecorationLine: 'underline' }} />
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
