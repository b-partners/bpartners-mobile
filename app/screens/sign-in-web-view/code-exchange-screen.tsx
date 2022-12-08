import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { SafeAreaView, View, ViewStyle } from 'react-native';

import { GradientBackground, Loader } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { ErrorBoundary } from '../error/error-boundary';

const FULL: ViewStyle = { flex: 1 };

export const CodeExchangeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({ navigation, route }) => {
  const { authStore } = useStores();

  useEffect(() => {
    async function exchangeCode() {
      const { code } = route.params;
      if (!code) {
        return;
      }
      try {
        await authStore.getToken(code);
        await authStore.whoami();
      } catch (error) {
        navigation.navigate('welcome');
        throw error;
      }
    }

    exchangeCode().then(result => console.tron.log(result));
  }, [route]);

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
