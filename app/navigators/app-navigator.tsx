/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { Auth } from '@aws-amplify/auth';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import * as Keychain from 'react-native-keychain';

import { Text } from '../components';
import { useAxiosConfigurer } from '../hook';
import { useStores } from '../models';
import { palette } from '../theme/palette';
import { AppStack } from './components';
import { navigationRef, useBackButtonHandler } from './navigation-utilities';
import { NavigationProps } from './utils/types';

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */

const navigationContainerConfigLinking = {
  prefixes: ['bpartners://'],
  config: {
    screens: {
      initialRouteName: 'welcome',
      oauth: 'auth',
      paymentList: 'paymentList',
    },
  },
};

export function AppNavigator(props: Readonly<NavigationProps>) {
  const { authStore } = useStores();
  useBackButtonHandler(canExit);
  useAxiosConfigurer({
    onAuthError: async () => {
      await Auth.signOut();
      await authStore.logout();
      await Keychain.resetGenericPassword();
    },
  });

  return (
    <NavigationContainer
      linking={navigationContainerConfigLinking}
      fallback={<Text text={'Loading...'} />}
      ref={navigationRef as any}
      theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: palette.white } }}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  );
}

AppNavigator.displayName = 'AppNavigator';

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ['welcome', 'home'];
export const canExit = (routeName: string) => exitRoutes.includes(routeName);
