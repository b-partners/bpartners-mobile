import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';

import { AutoImage, Loader, Screen } from '../../components';
import env from '../../config/env';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';

export const CodeExchangeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({ navigation, route }) => {
  const { authStore } = useStores();

  useEffect(() => {
    async function exchangeCode() {
      const code = env.isCi ? 'dummy code' : route.params.code;
      if (!code) {
        navigation.navigate('welcome');
        return;
      }
      try {
        await authStore.getToken(code);
        await authStore.whoami();
      } catch (error) {
        navigation.navigate('welcome');
        __DEV__ && console.tron.log(error);
        throw error;
      }
    }

    exchangeCode();
  }, [route]);

  return (
    <ErrorBoundary catchErrors='always'>
      <Screen backgroundColor='#fff'>
        <AutoImage
          source={require('./code-exchange.background.png')}
          resizeMode='stretch'
          resizeMethod='auto'
          style={{ position: 'absolute', height: '100%', width: '100%' }}
        />
        <View testID='SignInWebViewScreen' style={{ paddingHorizontal: spacing[7], height: '100%', justifyContent: 'center' }}>
          <AutoImage source={require('./bp-logo.png')} resizeMode='contain' resizeMethod='auto' style={{ width: '100%', height: '40%' }} />
          <SafeAreaView />
          <Loader size='large' color={palette.white} containerStyle={{ flex: 0 }} />
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
